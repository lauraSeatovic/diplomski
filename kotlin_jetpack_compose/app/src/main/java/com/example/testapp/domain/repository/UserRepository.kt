package com.example.testapp.domain.repository

import com.example.testapp.domain.model.SportasUser

interface UserRepository {
    suspend fun getCurrentSportas(): SportasUser
    suspend fun getSportasById(id: String): SportasUser?
}