package com.example.testapp.domain.model

import java.time.LocalDate

data class SportasUser(
    val id: String,
    val ime: String,
    val prezime: String,
    val datumRodenja: LocalDate,
    val tipClanarine: String?
)
