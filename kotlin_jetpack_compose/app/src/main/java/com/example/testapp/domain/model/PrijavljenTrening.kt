package com.example.testapp.domain.model

import java.time.LocalDateTime

data class PrijavljenTrening(
    val id: String,
    val naziv: String,
    val pocetak: LocalDateTime,
    val kraj: LocalDateTime,
    val dvorana: String,
    val teretana: String
)

