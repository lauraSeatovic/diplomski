package com.example.testapp.data.firebase.model.dto

import com.squareup.moshi.JsonClass
import java.time.LocalDateTime


@JsonClass(generateAdapter = true)
data class SignupForTrainingRequestDto(
    val korisnikId: String,
    val rasporedId: String
)

@JsonClass(generateAdapter = true)
data class DeleteRasporedRequestDto(
    val rasporedId: String
)

@JsonClass(generateAdapter = true)
data class AttendanceUpdateDto(
    val sportasId: String,
    val dolazak: Boolean
)

@JsonClass(generateAdapter = true)
data class SetAttendanceRequestDto(
    val rasporedId: String,
    val updates: List<AttendanceUpdateDto>
)

@JsonClass(generateAdapter = true)
data class AttendanceUpdateResultDto(
    val success: Boolean,
    val updated: Int
)

@JsonClass(generateAdapter = true)
data class DeleteResultDto(
    val success: Boolean
)


@JsonClass(generateAdapter = true)
data class VrstaTreningaCreateDto(
    val naziv: String,
    val tezina: Int
)

@JsonClass(generateAdapter = true)
data class TreningCreateDto(
    val idTreninga: String? = null,
    val idDvOdr: String,
    val idVrTreninga: String? = null,
    val idLaksijegTreninga: String? = null,
    val idTezegTreninga: String? = null,
    val maksBrojSportasa: Int
)

@JsonClass(generateAdapter = true)
data class CreateTreningRequestDto(
    val trening: TreningCreateDto,
    val vrsta: VrstaTreningaCreateDto? = null
)

@JsonClass(generateAdapter = true)
data class CreateTreningResultDto(
    val treningId: String,
    val vrstaTreningaId: String,
    val createdVrsta: Boolean
)


@JsonClass(generateAdapter = true)
data class CreateRasporedRequestDto(
    val treningId: String,
    val trenerId: String?,
    val pocetak: String,
    val zavrsetak: String,
    val idRasporeda: String? = null
)

@JsonClass(generateAdapter = true)
data class RasporedDto(
    val idRasporeda: String,
    val treningId: String,
    val trenerId: String,
    val pocetak: String,
    val zavrsetak: String
)


@JsonClass(generateAdapter = true)
data class GetAttendeesRequestDto(val rasporedId: String)

@JsonClass(generateAdapter = true)
data class PrijavljeniSudionikDto(
    val prijavaId: String,
    val sportasId: String,
    val ime: String?,
    val prezime: String?,
    val dolazakNaTrening: Boolean,
    val ocjenaTreninga: Int?
)
@JsonClass(generateAdapter = true)

data class TreningOptionDto(
    val treningId: String,
    val maksBrojSportasa: Int,
    val vrstaNaziv: String,
    val tezina: Int,
    val dvoranaNaziv: String,
    val teretanaNaziv: String
)

data class PrijavljenTreningDto(
    val id: String,
    val naziv: String,
    val pocetak: LocalDateTime,
    val kraj: LocalDateTime,
    val dvorana: String,
    val teretana: String
)

data class TeretanaDto(
    val id: String,
    val naziv: String,
    val adresa: String,
    val mjesto: String
)

data class DvoranaDto(
    val id: String,
    val naziv: String,
    val teretanaId: String?
)
data class VrstaTreningaDto(
    val id: String,
    val naziv: String,
    val tezina: Int
)





