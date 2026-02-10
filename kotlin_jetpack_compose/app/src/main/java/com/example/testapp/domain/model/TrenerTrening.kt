package com.example.testapp.domain.model

import java.time.LocalDateTime

data class TrenerTrening(
    val rasporedId: String,
    val treningId: String,
    val pocetak: LocalDateTime,
    val zavrsetak: LocalDateTime,
    val nazivVrsteTreninga: String,
    val nazivDvorane: String,
    val nazivTeretane: String,
    val maxBrojSportasa: Int
)


data class PrijavljeniSudionik(
    val prijavaId: String,
    val sportasId: String,
    val ime: String?,
    val prezime: String?,
    val dolazakNaTrening: Boolean,
    val ocjenaTreninga: Int?
)

data class AttendanceUpdate(
    val sportasId: String,
    val dolazak: Boolean
)

data class AttendanceUpdateResult(
    val success: Boolean,
    val updated: Int
)

