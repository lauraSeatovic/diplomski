package com.example.testapp.data.supabase.repository

import com.example.testapp.data.supabase.network.service.SupabaseAuthService
import com.example.testapp.domain.model.UserRole
import com.example.testapp.domain.repository.AuthRepository
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.auth
import javax.inject.Inject
import javax.inject.Singleton
import io.github.jan.supabase.auth.providers.builtin.Email

@Singleton
class AuthRepositoryImpl @Inject constructor(
    private val supabaseAuthService: SupabaseAuthService
) : AuthRepository {

    override suspend fun signIn(email: String, password: String) {
        supabaseAuthService.signIn(email, password)
    }

    override suspend fun signOut() {
        supabaseAuthService.signOut()
    }

    override fun currentUserId(): String? {
        return supabaseAuthService.currentUserId()
    }

    override suspend fun getUserRole(): UserRole {
        return supabaseAuthService.getCurrentUserRole()
    }
}