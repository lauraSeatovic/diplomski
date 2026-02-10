package com.example.testapp.data.firebase.repository

import com.example.testapp.data.firebase.model.mapper.toSportasDomain
import com.example.testapp.data.firebase.network.service.FirebaseUserService
import com.example.testapp.domain.model.SportasUser
import com.example.testapp.domain.repository.UserRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

class UserRepositoryFirebase(
    private val firebaseUserService: FirebaseUserService
) : UserRepository {

    override suspend fun getSportasById(id: String): SportasUser? =
        withContext(Dispatchers.IO) {
            try {
                val korisnik = firebaseUserService.getKorisnikById(id)
                korisnik?.toSportasDomain(id)
            } catch (e: Exception) {
                null
            }
        }

    override suspend fun getCurrentSportas(): SportasUser =
        withContext(Dispatchers.IO) {
            val uid = firebaseUserService.getCurrentUserId()
                ?: throw IllegalStateException("Korisnik nije prijavljen.")

            getSportasById(uid)
                ?: throw IllegalStateException("Profil sportaša nije pronađen.")
        }
}
