package com.example.testapp.data.supabase.model.DTOs

import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json


private val json = Json { ignoreUnknownKeys = true }

@Serializable
data class SignUpErrorResponse(
    val error: String? = null,
    val details: String? = null
)
