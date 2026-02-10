package com.example.testapp.data.supabase.model.DTOs

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
data class AvailableTrainingEdgeResponseDto(
    val data: List<AvailableTrainingEdgeDto>
)

@Serializable
data class AvailableTrainingEdgeDto(
    @SerialName("raspored_id") val rasporedId: String,
    @SerialName("start_time") val startTime: String,
    @SerialName("end_time") val endTime: String,
    @SerialName("trening_id") val treningId: String,
    @SerialName("trening_vrsta_naziv") val treningVrstaNaziv: String,
    @SerialName("max_participants") val maxParticipants: Int,
    @SerialName("dvorana_id") val dvoranaId: String,
    @SerialName("dvorana_naziv") val dvoranaNaziv: String,
    @SerialName("trener_id") val trenerId: String,
    @SerialName("trener_ime") val trenerIme: String? = null,
    @SerialName("trener_prezime") val trenerPrezime: String? = null,
    @SerialName("current_signups") val currentSignups: Int,
    @SerialName("is_full") val isFull: Boolean
)
