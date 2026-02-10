package com.example.testapp.domain.model

import java.time.LocalDateTime
import java.time.OffsetDateTime

data class TrainingDetails(
    val treningId: String,
    val nazivVrste: String,
    val tezina: Int,
)

data class VrstaTreninga(
    val id: String,
    val naziv: String,
    val tezina: Int
)

data class VrstaTreningaCreate(
    val naziv: String,
    val tezina: Int
)

data class TreningCreate(
    val idTreninga: String? = null,
    val idDvOdr: String,
    val idVrTreninga: String? = null,
    val idLaksijegTreninga: String? = null,
    val idTezegTreninga: String? = null,
    val maksBrojSportasa: Int
)

data class CreateTreningRequest(
    val trening: TreningCreate,
    val vrsta: VrstaTreningaCreate? = null
)

data class CreateTreningResult(
    val treningId: String,
    val vrstaTreningaId: String,
    val createdVrsta: Boolean
)

data class TreningOption(
    val treningId: String,
    val vrstaNaziv: String,
    val tezina: Int,
    val dvoranaNaziv: String,
    val teretanaNaziv: String,
    val maksBrojSportasa: Int
)

data class Raspored(
    val idRasporeda: String,
    val treningId: String,
    val trenerId: String,
    val pocetak: LocalDateTime,
    val zavrsetak: LocalDateTime
)

data class CreateRasporedRequest(
    val treningId: String,
    val trenerId: String?,
    val pocetak: OffsetDateTime,
    val zavrsetak: OffsetDateTime,
    val idRasporeda: String? = null
)

data class DeleteResult(val success: Boolean)
