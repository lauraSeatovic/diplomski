package com.example.testapp.data.firebase.model.DTOs

import com.google.firebase.Timestamp

data class FirestoreSportas(
    val datumRodenja: Timestamp? = null,
    val tipClanarine: String? = null
)

data class FirestoreKorisnik(
    val ime: String? = null,
    val prezime: String? = null,
    val sportas: FirestoreSportas? = null,
    val jeSportas: Boolean? = null,
    val jeTrener: Boolean? = null
)
