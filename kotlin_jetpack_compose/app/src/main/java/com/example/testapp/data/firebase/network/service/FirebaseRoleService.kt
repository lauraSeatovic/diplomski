package com.example.testapp.data.firebase.network.service

import com.example.testapp.domain.model.UserRole
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class FirebaseRoleService(
    private val firestore: FirebaseFirestore
) {
    suspend fun getUserRole(userId: String): UserRole {
        val snap = firestore.collection("korisnici").document(userId).get().await()
        if (!snap.exists()) {
            throw IllegalStateException("Korisnik ne postoji u bazi.")
        }

        val jeSportas = snap.getBoolean("jeSportas") ?: false
        val jeTrener = snap.getBoolean("jeTrener") ?: false

        return when {
            jeSportas -> UserRole.SPORTAS
            jeTrener -> UserRole.TRENER
            else -> throw IllegalStateException("Uloga korisnika nije definirana.")
        }
    }
}
