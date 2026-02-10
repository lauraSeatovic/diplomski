package com.example.testapp.domain.model


import com.google.type.DateTime
import java.time.LocalDateTime
import kotlinx.serialization.Serializable

data class DostupniTrening(
    val rasporedId: String,
    val treningId: String,
    val nazivVrsteTreninga: String,
    val pocetak: LocalDateTime,
    val kraj: LocalDateTime,
    val dvoranaId: String,
    val dvoranaNaziv: String,
    val trenerId: String,
    val trenerIme: String?,
    val trenerPrezime: String?,
    val maxBrojSportasa: Int,
    val trenutnoPrijavljenih: Int,
    val isFull: Boolean
)