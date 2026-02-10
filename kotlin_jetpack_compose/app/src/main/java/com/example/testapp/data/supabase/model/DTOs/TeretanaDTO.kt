package com.example.testapp.data.supabase.model.DTOs

import kotlinx.serialization.Serializable

@Serializable
data class TeretanaDTO(
    val IdTeretane: String,
    val NazivTeretane: String,
    val Adresa: String,
    val Mjesto: String
)
