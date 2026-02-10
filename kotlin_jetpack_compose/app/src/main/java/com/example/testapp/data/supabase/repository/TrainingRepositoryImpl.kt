package com.example.testapp.data.supabase.repository

import com.example.testapp.data.supabase.model.DTOs.AttendanceUpdateRequestDto
import com.example.testapp.data.supabase.model.DTOs.CreateRasporedRequestDto
import com.example.testapp.data.supabase.model.DTOs.RasporedCreateDto
import com.example.testapp.data.supabase.model.DTOs.toDomain
import com.example.testapp.data.supabase.model.mappers.availableTrainingEdgeDtoToDomain
import com.example.testapp.data.supabase.model.mappers.prijavaFullDtoToDomain
import com.example.testapp.data.supabase.model.mappers.toDomain
import com.example.testapp.data.supabase.model.mappers.toDto
import com.example.testapp.data.supabase.network.service.SupabaseTrainingService
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
import java.time.LocalDate
import javax.inject.Inject

class TrainingRepositoryImpl @Inject constructor(
    private val supabaseTrainingService: SupabaseTrainingService
) : TrainingRepository {

    override suspend fun getTrainingsForUser(sportasId: String): List<PrijavljenTrening> {
        return supabaseTrainingService.getTrainingsForUser(sportasId)
            .map { prijavaFullDtoToDomain(it) }
    }

    override suspend fun getTrainingsByDateAndTeretana(
        teretana: String,
        date: LocalDate
    ): List<DostupniTrening> {
        return supabaseTrainingService.getAvailableTrainings(date = date, teretanaId = teretana)
            .map { availableTrainingEdgeDtoToDomain(it) }
    }

    override suspend fun prijaviSeNaTrening(rasporedId: String) {
        val korisnikId = "temp" //used just for testing
        supabaseTrainingService.signUpForTraining(
            rasporedId = rasporedId,
            korisnikId = korisnikId
        )
    }

    override suspend fun getTrainingDetails(treningId: String): TrainingDetails {
        val dto = supabaseTrainingService.getTrainingDetails(treningId)
        return dto.toDomain()
    }

    override suspend fun getDvorane(): List<Dvorana> {
        return supabaseTrainingService.getDvorane().map { it.toDomain() }
    }

    override suspend fun getTeretane(): List<Teretana> {
        return supabaseTrainingService.getTeretane().map { it.toDomain() }
    }

    override suspend fun getTrainingsForTrainer(trenerId: String): List<TrenerTrening> {
        return supabaseTrainingService.getTrainingsForTrainer(trenerId).map { it.toDomain() }
    }

    override suspend fun getAttendeesForRaspored(rasporedId: String): List<PrijavljeniSudionik> {
        return supabaseTrainingService
            .getAttendeesByRaspored(rasporedId)
            .map { it.toDomain() }
    }

    override suspend fun setAttendanceForRaspored(
        rasporedId: String,
        updates: List<AttendanceUpdate>
    ): AttendanceUpdateResult {
        val request = AttendanceUpdateRequestDto(
            rasporedId = rasporedId,
            updates = updates.map { it.toDto() }
        )

        val response = supabaseTrainingService.setAttendanceForRaspored(request)
        return response.toDomain()
    }

    override suspend fun getVrsteTreninga(): List<VrstaTreninga> {
        return supabaseTrainingService.getVrsteTreninga().map { it.toDomain() }
    }

    override suspend fun createTrening(request: CreateTreningRequest): CreateTreningResult {
        val dto = request.toDto()
        val resp = supabaseTrainingService.createTrening(dto)
        return resp.toDomain()
    }

    override suspend fun getTreningOptions(): List<TreningOption> {
        return supabaseTrainingService.getTreningOptions().map { it.toDomain() }
    }

    override suspend fun createRaspored(request: CreateRasporedRequest): Raspored {
        val reqDto = CreateRasporedRequestDto(
            raspored = RasporedCreateDto(
                IdRasporeda = request.idRasporeda,
                IdTreninga = request.treningId,
                PocetakVrijeme = request.pocetak.toString(),
                ZavrsetakVrijeme = request.zavrsetak.toString(),
                IdTrenera = request.trenerId
            )
        )

        val createdDto = supabaseTrainingService.createRaspored(reqDto)
        return createdDto.toDomain()
    }

    override suspend fun deleteRaspored(rasporedId: String): DeleteResult {
        val dto = supabaseTrainingService.deleteRaspored(rasporedId)
        return DeleteResult(success = dto.success)
    }


}