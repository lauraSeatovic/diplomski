package com.example.testapp.data.firebase.model.mapper

import com.example.testapp.data.firebase.model.DTOs.AvailableTrainingDto
import com.example.testapp.data.firebase.model.DTOs.FirestoreKorisnik
import com.example.testapp.data.firebase.model.DTOs.GetTreningInfoResponseDto
import com.example.testapp.data.firebase.model.DTOs.VrstaDto
import com.example.testapp.data.supabase.model.DTOs.AvailableTrainingEdgeDto
import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.model.Dvorana
import com.example.testapp.domain.model.PrijavljenTrening
import com.example.testapp.domain.model.SportasUser
import com.example.testapp.domain.model.Teretana
import com.example.testapp.domain.model.TrainingDetails
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneId
import com.example.testapp.data.firebase.model.dto.*
import com.example.testapp.domain.model.*


private fun String.toLocalDateTimeIso(): LocalDateTime =
    OffsetDateTime.parse(this).toLocalDateTime()

fun AvailableTrainingDto.toDomain(): DostupniTrening {
    val rasporedId = rasporedId
    val treningId = requireNotNull(treningId) { "Missing trening_id" }
    val nazivVrsteTreninga = requireNotNull(treningVrstaNaziv) { "Missing trening_vrsta_naziv" }
    val pocetak = requireNotNull(startTime) { "Missing start_time" }.toLocalDateTimeIso()
    val kraj = requireNotNull(endTime) { "Missing end_time" }.toLocalDateTimeIso()
    val dvoranaId = requireNotNull(dvoranaId) { "Missing dvorana_id" }
    val dvoranaNaziv = requireNotNull(dvoranaNaziv) { "Missing dvorana_naziv" }
    val trenerId = requireNotNull(trenerId) { "Missing trener_id" }
    val maxBrojSportasa = requireNotNull(maxParticipants) { "Missing max_participants" }

    return DostupniTrening(
        rasporedId = rasporedId,
        treningId = treningId,
        nazivVrsteTreninga = nazivVrsteTreninga,
        pocetak = pocetak,
        kraj = kraj,
        dvoranaId = dvoranaId,
        dvoranaNaziv = dvoranaNaziv,
        trenerId = trenerId,
        trenerIme = trenerIme,
        trenerPrezime = trenerPrezime,
        maxBrojSportasa = maxBrojSportasa,
        trenutnoPrijavljenih = currentSignups,
        isFull = isFull
    )
}

fun GetTreningInfoResponseDto.toDomain(): TrainingDetails {
    val vrsta = requireNotNull(data.vrsta) { "Missing vrsta in get_trening_info response" }
    return TrainingDetails(
        treningId = data.treningId,
        nazivVrste = requireNotNull(vrsta.naziv) { "Missing vrsta.naziv" },
        tezina = requireNotNull(vrsta.tezina) { "Missing vrsta.tezina" }
    )
}

fun VrstaDto.toDomain(treningId: String): TrainingDetails =
    TrainingDetails(
        treningId = treningId,
        nazivVrste = requireNotNull(naziv) { "Missing vrsta.naziv" },
        tezina = requireNotNull(tezina) { "Missing vrsta.tezina" }
    )


fun FirestoreKorisnik.toSportasDomain(userId: String): SportasUser? {
    val s = sportas ?: return null
    val date = s.datumRodenja
        ?.toDate()
        ?.toInstant()
        ?.atZone(ZoneId.systemDefault())
        ?.toLocalDate()
        ?: return null

    return SportasUser(
        id = userId,
        ime = ime.orEmpty(),
        prezime = prezime.orEmpty(),
        datumRodenja = date,
        tipClanarine = s.tipClanarine
    )
}


fun AttendanceUpdate.toDto() = AttendanceUpdateDto(
    sportasId = sportasId,
    dolazak = dolazak
)

fun AttendanceUpdateResultDto.toDomain() = AttendanceUpdateResult(
    success = success,
    updated = updated
)

fun DeleteResultDto.toDomain() = DeleteResult(success = success)

fun CreateTreningRequest.toDto() = CreateTreningRequestDto(
    trening = TreningCreateDto(
        idTreninga = trening.idTreninga,
        idDvOdr = trening.idDvOdr,
        idVrTreninga = trening.idVrTreninga,
        idLaksijegTreninga = trening.idLaksijegTreninga,
        idTezegTreninga = trening.idTezegTreninga,
        maksBrojSportasa = trening.maksBrojSportasa
    ),
    vrsta = vrsta?.let { VrstaTreningaCreateDto(it.naziv, it.tezina) }
)

fun CreateTreningResultDto.toDomain() = CreateTreningResult(
    treningId = treningId,
    vrstaTreningaId = vrstaTreningaId,
    createdVrsta = createdVrsta
)

fun PrijavljeniSudionikDto.toDomain() = PrijavljeniSudionik(
    prijavaId = prijavaId,
    sportasId = sportasId,
    ime = ime,
    prezime = prezime,
    dolazakNaTrening = dolazakNaTrening,
    ocjenaTreninga = ocjenaTreninga
)
fun TreningOptionDto.toDomain(): TreningOption =
    TreningOption(
        treningId = treningId,
        maksBrojSportasa = maksBrojSportasa,
        vrstaNaziv = vrstaNaziv,
        tezina = tezina,
        dvoranaNaziv = dvoranaNaziv,
        teretanaNaziv = teretanaNaziv
    )

fun List<TreningOptionDto>.toDomain(): List<TreningOption> =
    map { it.toDomain() }

fun PrijavljenTreningDto.toDomain(): PrijavljenTrening =
    PrijavljenTrening(
        id = id,
        naziv = naziv,
        pocetak = pocetak,
        kraj = kraj,
        dvorana = dvorana,
        teretana = teretana
    )

fun TeretanaDto.toDomain(): Teretana =
    Teretana(
        id = id,
        naziv = naziv,
        adresa = adresa,
        mjesto = mjesto
    )

fun DvoranaDto.toDomain(): Dvorana =
    Dvorana(
        id = id,
        naziv = naziv,
        idTeretane = teretanaId
    )

fun VrstaTreningaDto.toDomain(): VrstaTreninga =
    VrstaTreninga(
        id = id,
        naziv = naziv,
        tezina = tezina
    )

