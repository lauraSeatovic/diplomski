package com.example.testapp.data.supabase.model.DTOs

import kotlinx.serialization.Serializable

@Serializable
data class RasporedDTO(
    val IdRasporeda: String,
    val IdTreninga: String,
    val PocetakVrijeme: String,
    val ZavrsetakVrijeme: String,
    val IdTrenera: String
)
