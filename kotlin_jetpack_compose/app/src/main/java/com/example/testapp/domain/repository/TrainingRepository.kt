package com.example.testapp.domain.repository

import com.example.testapp.data.supabase.model.DTOs.RasporedDTO
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
import java.time.LocalDate

interface TrainingRepository {
    suspend fun getTrainingsForUser(sportasId: String): List<PrijavljenTrening>
    suspend fun getTrainingsByDateAndTeretana(teretana: String, date: LocalDate): List<DostupniTrening>
    suspend fun prijaviSeNaTrening(rasporedId: String)

    suspend fun getTrainingDetails(treningId: String): TrainingDetails

    suspend fun getDvorane(): List<Dvorana>

    suspend fun getTeretane(): List<Teretana>
    suspend fun getTrainingsForTrainer(trenerId: String): List<TrenerTrening>
    suspend fun getAttendeesForRaspored(rasporedId: String): List<PrijavljeniSudionik>

    suspend fun setAttendanceForRaspored(
        rasporedId: String,
        updates: List<AttendanceUpdate>
    ): AttendanceUpdateResult

    suspend fun getVrsteTreninga(): List<com.example.testapp.domain.model.VrstaTreninga>

    suspend fun createTrening(request: CreateTreningRequest)
            : CreateTreningResult

    suspend fun getTreningOptions(): List<TreningOption>
    suspend fun createRaspored(request: CreateRasporedRequest): Raspored

    suspend fun deleteRaspored(rasporedId: String): DeleteResult


}