package com.example.testapp.data.supabase.model.DTOs
import kotlinx.serialization.Serializable

@Serializable
data class PrijavaFullDto(
    val IdPrijave: String,
    val IdSportasa: String,
    val DolazakNaTrening: Boolean,
    val OcjenaTreninga: Int? = null,
    val Raspored: RasporedWithTreningDto
)

@Serializable
data class RasporedWithTreningDto(
    val IdRasporeda: String,
    val PocetakVrijeme: String,
    val ZavrsetakVrijeme: String,
    val IdTrenera: String,
    val Trening: TreningDTO
)