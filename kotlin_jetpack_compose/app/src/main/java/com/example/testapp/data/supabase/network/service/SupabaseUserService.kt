package com.example.testapp.data.supabase.network.service

import com.example.testapp.data.supabase.model.DTOs.KorisnikDTO
import com.example.testapp.data.supabase.model.DTOs.SportasDTO

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.postgrest
import javax.inject.Inject

class SupabaseUserService @Inject constructor(
    private val client: SupabaseClient
) {

    suspend fun getKorisnikById(id: String): KorisnikDTO {
        return client
            .postgrest["Korisnik"]
            .select {
                filter { eq("IdKorisnika", id) }
                single()
            }
            .decodeAs<KorisnikDTO>()
    }

    suspend fun getSportasById(id: String): SportasDTO {
        return client
            .postgrest["Sportas"]
            .select {
                filter { eq("IdKorisnika", id) }
                single()
            }
            .decodeAs<SportasDTO>()
    }

    fun getCurrentUserId(): String? {
        return client.auth.currentUserOrNull()?.id
    }
}
