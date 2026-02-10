package com.example.testapp.data.firebase.network.service

import com.example.testapp.data.firebase.model.DTOs.FirestoreKorisnik
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import kotlinx.coroutines.tasks.await

class FirebaseUserService(
    private val firestore: FirebaseFirestore,
    private val auth: FirebaseAuth
) {

    suspend fun getKorisnikById(id: String): FirestoreKorisnik? {
        val snap = firestore
            .collection("korisnici")
            .document(id)
            .get()
            .await()

        return snap.toObject(FirestoreKorisnik::class.java)
    }

    fun getCurrentUserId(): String? =
        auth.currentUser?.uid
}