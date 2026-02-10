package com.example.testapp.data.supabase.model.DTOs

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class SportasDTO(
    @SerialName("IdKorisnika")
    val idKorisnika: String,
    @SerialName("DatumRodenja")
    val datumRodenja: String,
    @SerialName("TipClanarine")
    val tipClanarine: String? = null
)