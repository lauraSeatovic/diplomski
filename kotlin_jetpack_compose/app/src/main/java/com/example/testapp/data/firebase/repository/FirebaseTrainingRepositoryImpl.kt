package com.example.testapp.data.firebase.repository

import com.example.testapp.data.firebase.model.mapper.toDomain
import com.example.testapp.data.firebase.model.mapper.toDto
import com.example.testapp.data.firebase.network.service.FirebaseTrainingService
import com.example.testapp.data.supabase.model.DTOs.toDomain
import com.example.testapp.domain.model.AttendanceUpdate
import com.example.testapp.domain.model.AttendanceUpdateResult
import com.example.testapp.domain.model.CreateRasporedRequest
import com.example.testapp.domain.model.CreateTreningRequest
import com.example.testapp.domain.model.CreateTreningResult
import com.example.testapp.domain.model.DeleteResult
import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.model.Dvorana
import com.example.testapp.domain.model.PrijavljenTrening
import com.example.testapp.domain.model.PrijavljeniSudionik
import com.example.testapp.domain.model.Raspored
import com.example.testapp.domain.model.Teretana
import com.example.testapp.domain.model.TrainingDetails
import com.example.testapp.domain.model.TrenerTrening
import com.example.testapp.domain.model.TreningOption
import com.example.testapp.domain.model.VrstaTreninga
import com.example.testapp.domain.repository.TrainingRepository
import com.google.firebase.auth.FirebaseAuth
import java.time.LocalDate
import java.time.LocalDateTime
import javax.inject.Inject
import kotlin.collections.map

class FirebaseTrainingRepositoryImpl @Inject constructor(
    private val trainingService: FirebaseTrainingService,
    private val firebaseAuth: FirebaseAuth
) : TrainingRepository {

    override suspend fun getTrainingsForUser(sportasId: String): List<PrijavljenTrening> {



        return trainingService.getTrainingsForUser(sportasId).map { it.toDomain() }
    }

    override suspend fun getTrainingsByDateAndTeretana(teretana: String, date: LocalDate): List<DostupniTrening> {
        return trainingService.getTrainingsByDateAndTeretana(teretanaId = teretana, date = date)
    }

    override suspend fun prijaviSeNaTrening(rasporedId: String) {
        val uid = firebaseAuth.currentUser?.uid
            ?: throw IllegalStateException("Korisnik nije prijavljen.")
        trainingService.signupForTraining(korisnikId = uid, rasporedId = rasporedId)
    }

    override suspend fun getTrainingDetails(treningId: String): TrainingDetails {
        return trainingService.getTrainingDetails(treningId)
    }

    override suspend fun getDvorane(): List<Dvorana> {
        return trainingService.getDvorane().map { it.toDomain() }
    }

    override suspend fun getTeretane(): List<Teretana> {
        return trainingService.getTeretane().map { it.toDomain() }
    }

    override suspend fun getTrainingsForTrainer(trenerId: String): List<TrenerTrening> {
        return trainingService.getTrainingsForTrainer(trenerId)
    }

    override suspend fun getAttendeesForRaspored(rasporedId: String): List<PrijavljeniSudionik> {
        return trainingService.getAttendeesByRaspored(rasporedId)
    }

    override suspend fun setAttendanceForRaspored(
        rasporedId: String,
        updates: List<AttendanceUpdate>
    ): AttendanceUpdateResult {

        return trainingService.setAttendanceForRaspored(rasporedId, updates)
    }

    override suspend fun getVrsteTreninga(): List<VrstaTreninga> {
        return trainingService.getVrsteTreninga().map { it.toDomain() }
    }

    override suspend fun createTrening(request: CreateTreningRequest): CreateTreningResult {

        return trainingService.createTrening(request)
    }

    override suspend fun getTreningOptions(): List<TreningOption> {
        return trainingService.getTreningOptionsDto().toDomain()
    }

    override suspend fun createRaspored(request: CreateRasporedRequest): Raspored {
        val dto = com.example.testapp.data.firebase.model.dto.CreateRasporedRequestDto(
            treningId = request.treningId,
            trenerId = request.trenerId,
            pocetak = request.pocetak.toString(),
            zavrsetak = request.zavrsetak.toString(),
            idRasporeda = request.idRasporeda
        )

        val created = trainingService.createRaspored(request)
        return Raspored(
            idRasporeda = created.idRasporeda,
            treningId = created.treningId,
            trenerId = created.trenerId,
            pocetak = created.pocetak,
            zavrsetak = created.zavrsetak
        )
    }

    override suspend fun deleteRaspored(rasporedId: String): DeleteResult {
        return trainingService.deleteRaspored(rasporedId)
    }
}
