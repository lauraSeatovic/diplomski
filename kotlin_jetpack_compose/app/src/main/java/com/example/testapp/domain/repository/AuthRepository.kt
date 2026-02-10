package com.example.testapp.domain.repository

import com.example.testapp.domain.model.UserRole

interface AuthRepository {
    suspend fun signIn(email: String, password: String)
    suspend fun signOut()
    fun currentUserId(): String?
    suspend fun getUserRole(): UserRole
}