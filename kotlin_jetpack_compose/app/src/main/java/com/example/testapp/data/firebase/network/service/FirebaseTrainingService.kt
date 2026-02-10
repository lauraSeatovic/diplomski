package com.example.testapp.data.firebase.network.service

import com.example.testapp.data.firebase.model.dto.DvoranaDto
import com.example.testapp.data.firebase.model.dto.PrijavljenTreningDto
import com.example.testapp.data.firebase.model.dto.TeretanaDto
import com.example.testapp.data.firebase.model.dto.TreningOptionDto
import com.example.testapp.data.firebase.model.dto.VrstaTreningaDto
import com.example.testapp.domain.model.AttendanceUpdate
import com.example.testapp.domain.model.AttendanceUpdateResult
import com.example.testapp.domain.model.DeleteResult
import com.example.testapp.domain.model.PrijavljeniSudionik
import com.example.testapp.domain.model.Raspored
import com.example.testapp.domain.model.CreateTreningRequest
import com.example.testapp.domain.model.CreateTreningResult
import com.example.testapp.domain.model.CreateRasporedRequest
import com.example.testapp.domain.model.PrijavljenTrening
import com.example.testapp.domain.model.TreningOption
import com.google.firebase.Timestamp
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.functions.FirebaseFunctions
import kotlinx.coroutines.async
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.tasks.await
import kotlinx.datetime.toLocalDate
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId

class FirebaseTrainingService(
    private val functions: FirebaseFunctions,
    private val firestore: FirebaseFirestore
) {




    private fun Timestamp.toLocalDateTime(): LocalDateTime =
        toDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime()




    private fun asMap(data: Any?): Map<*, *> =
        data as? Map<*, *> ?: throw IllegalStateException("Neispravan response format (očekivan Map).")

    
    private fun unwrapApiData(callResultData: Any?): Any? {
        val root = asMap(callResultData)
        val ok = root["ok"] as? Boolean
            ?: throw IllegalStateException("Neispravan response format (nema 'ok').")

        if (ok) {
            return root["data"]
        }

        val code = root["code"] as? String ?: "ERROR"
        val message = root["message"] as? String
        throw IllegalStateException(message ?: "Greška ($code).")
    }

    private fun dvoranaRef(teretanaId: String, dvoranaId: String) =
        firestore.collection("teretane")
            .document(teretanaId)
            .collection("dvorane")
            .document(dvoranaId)

    private fun prijaveCol(rasporedId: String) =
        firestore.collection("rasporedi")
            .document(rasporedId)
            .collection("prijave")


    suspend fun getTrainingsForUser(
        sportasId: String
    ): List<PrijavljenTreningDto> {

        val rasporedi = firestore.collection("rasporedi")
            .get()
            .await()
            .documents

        val items = rasporedi.mapNotNull { raspDoc ->
            val rasporedId = raspDoc.id

            val directId = "${sportasId}_${rasporedId}"
            val prijavaDirect = prijaveCol(rasporedId).document(directId).get().await()

            val prijavaExists = if (prijavaDirect.exists()) {
                true
            } else {
                val q = prijaveCol(rasporedId)
                    .whereEqualTo("sportasId", sportasId)
                    .limit(1)
                    .get()
                    .await()
                q.documents.isNotEmpty()
            }

            if (!prijavaExists) return@mapNotNull null

            val treningId = raspDoc.getString("treningId") ?: return@mapNotNull null
            val treningDoc = firestore.collection("treninzi").document(treningId).get().await()
            if (!treningDoc.exists()) return@mapNotNull null

            val vrstaId = treningDoc.getString("vrstaTreningaId") ?: return@mapNotNull null
            val dvoranaId = treningDoc.getString("dvoranaId") ?: return@mapNotNull null

            val teretanaId = raspDoc.getString("teretanaId")
                ?: treningDoc.getString("teretanaId")
                ?: return@mapNotNull null

            val vrstaDoc = firestore.collection("vrsteTreninga").document(vrstaId).get().await()
            val dvoranaDoc = dvoranaRef(teretanaId, dvoranaId).get().await()
            val teretanaDoc = firestore.collection("teretane").document(teretanaId).get().await()

            val pocetakTs = raspDoc.getTimestamp("pocetakVrijeme") ?: return@mapNotNull null
            val zavrsetakTs = raspDoc.getTimestamp("zavrsetakVrijeme") ?: return@mapNotNull null

            PrijavljenTreningDto(
                id = rasporedId,
                naziv = vrstaDoc.getString("nazivVrTreninga").orEmpty(),
                pocetak = pocetakTs.toLocalDateTime(),
                kraj = zavrsetakTs.toLocalDateTime(),
                dvorana = dvoranaDoc.getString("nazivDvorane").orEmpty(),
                teretana = teretanaDoc.getString("nazivTeretane").orEmpty()
            )
        }

        return items.sortedByDescending { it.pocetak }
    }

    suspend fun getTeretane(): List<TeretanaDto> {
        val snaps = firestore.collection("teretane").get().await()
        return snaps.documents.map { d ->
            TeretanaDto(
                id = d.id,
                naziv = d.getString("nazivTeretane").orEmpty(),
                adresa = d.getString("adresa").orEmpty(),
                mjesto = d.getString("mjesto").orEmpty()
            )
        }
    }

    suspend fun getDvorane(): List<DvoranaDto> {
        val snaps = firestore.collectionGroup("dvorane").get().await()
        return snaps.documents.map { d ->
            val teretanaId = d.reference.parent.parent?.id
            DvoranaDto(
                id = d.id,
                naziv = d.getString("nazivDvorane").orEmpty(),
                teretanaId = teretanaId
            )
        }
    }

    suspend fun getVrsteTreninga(): List<VrstaTreningaDto> {
        val snaps = firestore.collection("vrsteTreninga").get().await()
        return snaps.documents.map { d ->
            VrstaTreningaDto(
                id = d.id,
                naziv = d.getString("nazivVrTreninga").orEmpty(),
                tezina = (d.getLong("tezina") ?: 0L).toInt()
            )
        }
    }

    suspend fun getTrainingsByDateAndTeretana(
        teretanaId: String,
        date: LocalDate
    ): List<com.example.testapp.domain.model.DostupniTrening> {
        val dateStr = date.toString()
        val rasporedi = firestore.collection("rasporedi")
            .whereEqualTo("teretanaId", teretanaId)
            .whereEqualTo("datum", dateStr)
            .get().await()
            .documents

        return rasporedi.map { r ->
            val rasporedId = r.id
            val treningId = r.getString("treningId").orEmpty()
            val trenerId = r.getString("trenerId").orEmpty()

            val pocetakTs = r.getTimestamp("pocetakVrijeme")!!
            val zavrsetakTs = r.getTimestamp("zavrsetakVrijeme")!!

            val max = (r.getLong("maksBrojSportasa") ?: 0L).toInt()
            val broj = (r.getLong("brojPrijava") ?: 0L).toInt()

            val treningDoc = firestore.collection("treninzi").document(treningId).get().await()
            val dvoranaId = treningDoc.getString("dvoranaId").orEmpty()
            val vrstaId = treningDoc.getString("vrstaTreningaId").orEmpty()

            val vrstaDoc = firestore.collection("vrsteTreninga").document(vrstaId).get().await()
            val nazivVrste = vrstaDoc.getString("nazivVrTreninga").orEmpty()

            val dvoranaDoc = dvoranaRef(teretanaId, dvoranaId).get().await()
            val dvoranaNaziv = dvoranaDoc.getString("nazivDvorane").orEmpty()

            val teretanaDoc = firestore.collection("teretane").document(teretanaId).get().await()
            val teretanaNaziv = teretanaDoc.getString("nazivTeretane").orEmpty()

            val trenerDoc = firestore.collection("korisnici").document(trenerId).get().await()
            val trenerIme = trenerDoc.getString("ime")
            val trenerPrezime = trenerDoc.getString("prezime")

            com.example.testapp.domain.model.DostupniTrening(
                rasporedId = rasporedId,
                treningId = treningId,
                nazivVrsteTreninga = nazivVrste,
                pocetak = pocetakTs.toLocalDateTime(),
                kraj = zavrsetakTs.toLocalDateTime(),
                dvoranaId = dvoranaId,
                dvoranaNaziv = dvoranaNaziv,
                trenerId = trenerId,
                trenerIme = trenerIme,
                trenerPrezime = trenerPrezime,
                maxBrojSportasa = max,
                trenutnoPrijavljenih = broj,
                isFull = broj >= max
            )
        }
    }

    suspend fun getTrainingDetails(treningId: String): com.example.testapp.domain.model.TrainingDetails {
        val trening = firestore.collection("treninzi").document(treningId).get().await()
        val vrstaId = trening.getString("vrstaTreningaId").orEmpty()

        val vrsta = firestore.collection("vrsteTreninga").document(vrstaId).get().await()
        val naziv = vrsta.getString("nazivVrTreninga").orEmpty()
        val tezina = (vrsta.getLong("tezina") ?: 0L).toInt()

        return com.example.testapp.domain.model.TrainingDetails(
            treningId = treningId,
            nazivVrste = naziv,
            tezina = tezina
        )
    }

    suspend fun getTrainingsForTrainer(trenerId: String): List<com.example.testapp.domain.model.TrenerTrening> {
        val rasporedi = firestore.collection("rasporedi")
            .whereEqualTo("trenerId", trenerId)
            .get().await()
            .documents

        return rasporedi.map { r ->
            val treningId = r.getString("treningId").orEmpty()
            val teretanaId = r.getString("teretanaId").orEmpty()

            val treningDoc = firestore.collection("treninzi").document(treningId).get().await()
            val dvoranaId = treningDoc.getString("dvoranaId").orEmpty()
            val vrstaId = treningDoc.getString("vrstaTreningaId").orEmpty()

            val vrstaDoc = firestore.collection("vrsteTreninga").document(vrstaId).get().await()
            val nazivVrste = vrstaDoc.getString("nazivVrTreninga").orEmpty()

            val dvoranaDoc = dvoranaRef(teretanaId, dvoranaId).get().await()
            val dvoranaNaziv = dvoranaDoc.getString("nazivDvorane").orEmpty()

            val teretanaDoc = firestore.collection("teretane").document(teretanaId).get().await()
            val teretanaNaziv = teretanaDoc.getString("nazivTeretane").orEmpty()

            val pocetak = r.getTimestamp("pocetakVrijeme")!!.toLocalDateTime()
            val zavrsetak = r.getTimestamp("zavrsetakVrijeme")!!.toLocalDateTime()
            val max = (r.getLong("maksBrojSportasa") ?: 0L).toInt()

            com.example.testapp.domain.model.TrenerTrening(
                rasporedId = r.id,
                treningId = treningId,
                pocetak = pocetak,
                zavrsetak = zavrsetak,
                nazivVrsteTreninga = nazivVrste,
                nazivDvorane = dvoranaNaziv,
                nazivTeretane = teretanaNaziv,
                maxBrojSportasa = max
            )
        }
    }



    
    suspend fun signupForTraining(korisnikId: String, rasporedId: String): String {

        val data = mapOf("rasporedId" to rasporedId)

        val result = functions
            .getHttpsCallable("signup_for_training")
            .call(data)
            .await()

        val apiData = unwrapApiData(result.data)
        val m = asMap(apiData)


        val resultMsg = m["result"] as? String
            ?: throw IllegalStateException("Neispravan response (nema 'result').")

        if (resultMsg != "SUCCESS") {
            val msg = m["message"] as? String
                ?: m["msg"] as? String
                ?: result

            throw Exception("Prijava nije uspjela: $resultMsg")
        }

        return resultMsg
    }

    
    suspend fun deleteRaspored(rasporedId: String): DeleteResult {
        val data = mapOf("rasporedId" to rasporedId)

        val result = functions
            .getHttpsCallable("delete_raspored_with_prijave")
            .call(data)
            .await()

        val apiData = unwrapApiData(result.data)
        val m = asMap(apiData)

        val deleted = (m["deleted"] as? Boolean) == true



        return DeleteResult(success = deleted)
    }

    
    suspend fun getAttendeesByRaspored(rasporedId: String): List<PrijavljeniSudionik> {
        val data = mapOf("rasporedId" to rasporedId)

        val result = functions
            .getHttpsCallable("attendees_by_raspored")
            .call(data)
            .await()

        val apiData = unwrapApiData(result.data)
        val m = asMap(apiData)

        val items = m["items"] as? List<*> ?: emptyList<Any>()
        return items.map { row ->
            val r = asMap(row)

            PrijavljeniSudionik(
                prijavaId = r["prijavaDocId"] as String,
                sportasId = r["sportasId"] as String,
                ime = r["ime"] as? String,
                prezime = r["prezime"] as? String,
                dolazakNaTrening = (r["dolazakNaTrening"] as? Boolean) ?: false,
                ocjenaTreninga = null
            )
        }
    }

    
    suspend fun setAttendanceForRaspored(
        rasporedId: String,
        updates: List<AttendanceUpdate>
    ): AttendanceUpdateResult {
        val data = mapOf(
            "rasporedId" to rasporedId,
            "attendance" to updates.map {
                mapOf(
                    "sportasId" to it.sportasId,
                    "present" to it.dolazak
                )
            }
        )

        val result = functions
            .getHttpsCallable("set_attendance_for_raspored")
            .call(data)
            .await()

        val apiData = unwrapApiData(result.data)
        val m = asMap(apiData)

        val updated = (m["updated"] as? Boolean) == true
        val count = (m["count"] as? Number)?.toInt() ?: 0

        return AttendanceUpdateResult(
            success = updated,
            updated = count
        )
    }

    
    suspend fun createTrening(request: CreateTreningRequest): CreateTreningResult {

        val dvoranaId = request.trening.idDvOdr
        val maks = request.trening.maksBrojSportasa

        val useExisting = request.vrsta == null
        val data = if (useExisting) {
            mapOf(
                "dvoranaId" to dvoranaId,
                "useExistingVrsta" to true,
                "vrstaId" to request.trening.idVrTreninga,
                "maksBrojSportasa" to maks
            )
        } else {
            mapOf(
                "dvoranaId" to dvoranaId,
                "useExistingVrsta" to false,
                "novaVrstaNaziv" to request.vrsta.naziv,
                "novaVrstaTezina" to request.vrsta.tezina,
                "maksBrojSportasa" to maks
            )
        }

        val result = functions
            .getHttpsCallable("create_training")
            .call(data)
            .await()

        val apiData = unwrapApiData(result.data)
        val m = asMap(apiData)

        return CreateTreningResult(
            treningId = m["treningId"] as String,
            vrstaTreningaId = m["vrstaTreningaId"] as String,
            createdVrsta = !useExisting
        )
    }

    
    suspend fun createRaspored(request: CreateRasporedRequest): Raspored {
        val data = mapOf(
            "treningId" to request.treningId,
            "pocetak" to request.pocetak.toString(),
            "zavrsetak" to request.zavrsetak.toString()
        )

        val result = functions
            .getHttpsCallable("create_raspored")
            .call(data)
            .await()

        val apiData = unwrapApiData(result.data)
        val m = asMap(apiData)

        val rasporedId = m["rasporedId"] as String



        return Raspored(
            idRasporeda = rasporedId,
            treningId = request.treningId,
            trenerId = request.trenerId.toString(),
            pocetak = request.pocetak.toLocalDateTime(),
            zavrsetak = request.zavrsetak.toLocalDateTime()
        )
    }


    suspend fun getTreningOptionsDto(): List<TreningOptionDto> = coroutineScope {

        val treninziDef = async { firestore.collection("treninzi").get().await().documents }
        val dvoraneDef  = async { firestore.collectionGroup("dvorane").get().await().documents }
        val teretaneDef = async { firestore.collection("teretane").get().await().documents }
        val vrsteDef    = async { firestore.collection("vrsteTreninga").get().await().documents }

        val treninziDocs = treninziDef.await()
        val dvoraneDocs  = dvoraneDef.await()
        val teretaneDocs = teretaneDef.await()
        val vrsteDocs    = vrsteDef.await()

        data class DvoranaRow(
            val id: String,
            val naziv: String,
            val teretanaId: String?
        )

        data class TeretanaRow(
            val id: String,
            val naziv: String
        )

        data class VrstaRow(
            val id: String,
            val naziv: String,
            val tezina: Int
        )

        val dvoraneByKey = dvoraneDocs.associate { d ->
            val teretanaId = d.reference.parent.parent?.id
            val key = "${teretanaId.orEmpty()}|${d.id}"
            key to DvoranaRow(
                id = d.id,
                naziv = d.getString("nazivDvorane").orEmpty(),
                teretanaId = teretanaId
            )
        }

        val teretaneById = teretaneDocs.associate {
            it.id to TeretanaRow(
                id = it.id,
                naziv = it.getString("nazivTeretane").orEmpty()
            )
        }

        val vrsteById = vrsteDocs.associate {
            it.id to VrstaRow(
                id = it.id,
                naziv = it.getString("nazivVrTreninga").orEmpty(),
                tezina = (it.getLong("tezina") ?: 0L).toInt()
            )
        }

        val result = mutableListOf<TreningOptionDto>()

        for (tr in treninziDocs) {
            val teretanaId = tr.getString("teretanaId") ?: continue
            val dvoranaId = tr.getString("dvoranaId") ?: continue
            val vrstaId = tr.getString("vrstaTreningaId") ?: continue

            val vrsta = vrsteById[vrstaId] ?: continue
            val teretana = teretaneById[teretanaId] ?: continue
            val dvorana = dvoraneByKey["$teretanaId|$dvoranaId"] ?: continue

            result.add(
                TreningOptionDto(
                    treningId = tr.id,
                    maksBrojSportasa = (tr.getLong("maksBrojSportasa") ?: 0L).toInt(),
                    vrstaNaziv = vrsta.naziv,
                    tezina = vrsta.tezina,
                    dvoranaNaziv = dvorana.naziv,
                    teretanaNaziv = teretana.naziv
                )
            )
        }

        return@coroutineScope result
    }
    suspend fun getTreningOptions(): List<TreningOption> = coroutineScope {

        val treninziDef = async { firestore.collection("treninzi").get().await().documents }

        val dvoraneDef  = async { firestore.collectionGroup("dvorane").get().await().documents }

        val teretaneDef = async { firestore.collection("teretane").get().await().documents }
        val vrsteDef    = async { firestore.collection("vrsteTreninga").get().await().documents }

        val treninziDocs = treninziDef.await()
        val dvoraneDocs  = dvoraneDef.await()
        val teretaneDocs = teretaneDef.await()
        val vrsteDocs    = vrsteDef.await()

        data class DvoranaRow(
            val id: String,
            val naziv: String,
            val teretanaId: String?
        )

        data class TeretanaRow(
            val id: String,
            val naziv: String,
            val adresa: String,
            val mjesto: String
        )

        data class VrstaRow(
            val id: String,
            val naziv: String,
            val tezina: Int
        )

        val dvoraneByCompositeKey: Map<String, DvoranaRow> = dvoraneDocs.associate { d ->
            val dvoranaId = d.id
            val teretanaId = d.reference.parent.parent?.id
            val key = "${teretanaId.orEmpty()}|$dvoranaId"
            key to DvoranaRow(
                id = dvoranaId,
                naziv = d.getString("nazivDvorane").orEmpty(),
                teretanaId = teretanaId
            )
        }

        val teretaneById: Map<String, TeretanaRow> = teretaneDocs.associate { t ->
            val id = t.id
            id to TeretanaRow(
                id = id,
                naziv = t.getString("nazivTeretane").orEmpty(),
                adresa = t.getString("adresa").orEmpty(),
                mjesto = t.getString("mjesto").orEmpty()
            )
        }

        val vrsteById: Map<String, VrstaRow> = vrsteDocs.associate { v ->
            val id = v.id
            id to VrstaRow(
                id = id,
                naziv = v.getString("nazivVrTreninga").orEmpty(),
                tezina = (v.getLong("tezina") ?: 0L).toInt()
            )
        }

        val result = mutableListOf<TreningOption>()

        for (tr in treninziDocs) {
            val treningId = tr.id

            val teretanaId = tr.getString("teretanaId") ?: continue
            val dvoranaId = tr.getString("dvoranaId") ?: continue
            val vrstaId = tr.getString("vrstaTreningaId") ?: continue
            val maks = (tr.getLong("maksBrojSportasa") ?: 0L).toInt()

            val vrsta = vrsteById[vrstaId] ?: continue
            val teretana = teretaneById[teretanaId] ?: continue

            val dvoranaKey = "$teretanaId|$dvoranaId"
            val dvorana = dvoraneByCompositeKey[dvoranaKey] ?: continue

            result.add(
                TreningOption(
                    treningId = treningId,
                    maksBrojSportasa = maks,
                    vrstaNaziv = vrsta.naziv,
                    tezina = vrsta.tezina,
                    dvoranaNaziv = dvorana.naziv,
                    teretanaNaziv = teretana.naziv
                )
            )
        }

        return@coroutineScope result
    }
}
