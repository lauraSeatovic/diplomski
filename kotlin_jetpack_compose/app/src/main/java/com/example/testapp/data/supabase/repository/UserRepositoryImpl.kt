package com.example.testapp.data.supabase.repository

import com.example.testapp.data.supabase.model.mappers.korisnikISportasToDomain
import com.example.testapp.data.supabase.network.service.SupabaseUserService
import com.example.testapp.domain.model.SportasUser
import com.example.testapp.domain.repository.UserRepository
import io.github.jan.supabase.auth.auth

class UserRepositoryImpl(
    private val supabaseUserService: SupabaseUserService
) : UserRepository {

    override suspend fun getSportasById(id: String): SportasUser? {
        return try {
            val korisnik = supabaseUserService.getKorisnikById(id)
            val sportas = supabaseUserService.getSportasById(id)
            korisnikISportasToDomain(korisnik, sportas)
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun getCurrentSportas(): SportasUser {
        return getSportasById(supabaseUserService.getCurrentUserId()!!)!!
    }
}
