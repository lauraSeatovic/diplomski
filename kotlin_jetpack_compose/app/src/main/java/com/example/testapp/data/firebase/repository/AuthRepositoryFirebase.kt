package com.example.testapp.data.firebase.repository

import com.example.testapp.data.firebase.network.service.FirebaseAuthService
import com.example.testapp.data.firebase.network.service.FirebaseRoleService
import com.example.testapp.domain.model.UserRole
import com.example.testapp.domain.repository.AuthRepository
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class AuthRepositoryFirebase @Inject constructor(
    private val firebaseAuthService: FirebaseAuthService,
    private val firebaseRoleService: FirebaseRoleService
) : AuthRepository {

    override suspend fun signIn(email: String, password: String) {
        firebaseAuthService.signIn(email, password)
    }

    override suspend fun signOut() {
        firebaseAuthService.signOut()
    }

    override fun currentUserId(): String? {
        return firebaseAuthService.currentUserId()
    }

    override suspend fun getUserRole(): UserRole {
        val uid = currentUserId()
            ?: throw IllegalStateException("Korisnik nije prijavljen.")
        return firebaseRoleService.getUserRole(uid)
    }
}
