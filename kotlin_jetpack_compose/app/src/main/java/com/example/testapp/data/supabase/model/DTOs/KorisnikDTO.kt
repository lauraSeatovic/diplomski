package com.example.testapp.data.supabase.model.DTOs

import kotlinx.serialization.Serializable
import kotlinx.serialization.SerialName

@Serializable
data class KorisnikDTO(
    @SerialName("IdKorisnika")
    val idKorisnika: String,
    @SerialName("ImeKorisnika")
    val imeKorisnika: String,
    @SerialName("PrezimeKorisnika")
    val prezimeKorisnika: String
)