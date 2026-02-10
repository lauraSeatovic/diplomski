package com.example.testapp.data.firebase.model.DTOs

import com.squareup.moshi.Json

data class AvailableTrainingsResponseDto(
    val data: List<AvailableTrainingDto>
)

data class AvailableTrainingDto(
    @Json(name = "raspored_id") val rasporedId: String,
    @Json(name = "start_time") val startTime: String?,
    @Json(name = "end_time") val endTime: String?,
    @Json(name = "trening_id") val treningId: String?,
    @Json(name = "trening_vrsta_naziv") val treningVrstaNaziv: String?,
    @Json(name = "max_participants") val maxParticipants: Int?,
    @Json(name = "dvorana_id") val dvoranaId: String?,
    @Json(name = "dvorana_naziv") val dvoranaNaziv: String?,
    @Json(name = "trener_id") val trenerId: String?,
    @Json(name = "trener_ime") val trenerIme: String?,
    @Json(name = "trener_prezime") val trenerPrezime: String?,
    @Json(name = "current_signups") val currentSignups: Int,
    @Json(name = "is_full") val isFull: Boolean,
)

data class GetTreningInfoResponseDto(
    val data: GetTreningInfoDataDto
)

data class GetTreningInfoDataDto(
    @Json(name = "trening_id") val treningId: String,
    val vrsta: VrstaDto?
)

data class VrstaDto(
    val id: String?,
    val naziv: String?,
    val opis: String?,
    val tezina: Int?
)




data class SignupForTrainingResponseDto(
    val success: Boolean
)

