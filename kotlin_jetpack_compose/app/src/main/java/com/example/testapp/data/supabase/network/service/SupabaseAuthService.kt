package com.example.testapp.data.supabase.network.service


import com.example.testapp.domain.model.UserRole
import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.postgrest.from
import kotlinx.coroutines.flow.firstOrNull
import kotlinx.serialization.Serializable


class SupabaseAuthService(
    private val client: SupabaseClient
) {
    @Serializable private data class SportasRow(val IdKorisnika: String)
    @Serializable private data class TrenerRow(val IdKorisnika: String)

    suspend fun signIn(email: String, password: String) {
        client.auth.signInWith(Email) {
            this.email = email
            this.password = password
        }
    }

    suspend fun signOut() {
        client.auth.signOut()
    }

    fun currentUserId(): String? = client.auth.currentUserOrNull()?.id

    suspend fun getCurrentUserRole(): UserRole {
        val userId = currentUserId() ?: return UserRole.SPORTAS

        val isTrener = client.from("Trener")
            .select { filter { eq("IdKorisnika", userId) } }
            .decodeList<TrenerRow>()
            .isNotEmpty()

        if (isTrener) return UserRole.TRENER

        val isSportas = client.from("Sportas")
            .select { filter { eq("IdKorisnika", userId) } }
            .decodeList<SportasRow>()
            .isNotEmpty()

        if (isSportas) return UserRole.SPORTAS

        return UserRole.SPORTAS
    }
}
