package com.example.testapp.data.supabase.model.DTOs
import kotlinx.serialization.Serializable

@Serializable
data class PrijavaDTO
    (
    val IdPrijave: String,
    val IdSportasa: String,
    val DolazakNaTrening: Boolean,
    val OcjenaTreninga: Int? = null,
    val IdRasporeda: String
)

