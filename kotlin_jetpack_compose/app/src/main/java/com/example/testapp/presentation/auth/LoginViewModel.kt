package com.example.testapp.presentation.auth

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.UserRole
import com.example.testapp.domain.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.flow.receiveAsFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

sealed interface AuthNavigation {
    data object ToSportas : AuthNavigation
    data object ToTrener : AuthNavigation
}
data class AuthUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _navigation = Channel<AuthNavigation>(Channel.BUFFERED)
    val navigation = _navigation.receiveAsFlow()
    var state by mutableStateOf(AuthUiState())
        private set

    fun onEmailChange(value: String) {
        state = state.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        state = state.copy(password = value)
    }

    fun signIn() {
        viewModelScope.launch {
            authRepository.signIn(state.email, state.password)

            val role = authRepository.getUserRole()

            _navigation.send(
                if (role == UserRole.TRENER)
                    AuthNavigation.ToTrener
                else
                    AuthNavigation.ToSportas
            )
        }
    }

    fun isLoggedIn(): Boolean = authRepository.currentUserId() != null

    suspend fun getCurrentUserRole(): UserRole {
        return authRepository.getUserRole()
    }
}
