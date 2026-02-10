package com.example.testapp.data.supabase.model.DTOs
import kotlinx.serialization.Serializable

@Serializable
data class DvoranaDTO(
    val IdDvorane: String,
    val NazivDvorane: String,
    val Teretana: TeretanaDTO? = null
)