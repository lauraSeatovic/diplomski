package com.example.testapp.presentation.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.SportasUser
import com.example.testapp.domain.repository.TrainingRepository
import com.example.testapp.domain.repository.UserRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val userRepository: UserRepository,
    private val trainingRepository: TrainingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState(isLoading = true))
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()

    init {
        loadCurrentUser()
    }

    fun loadCurrentUser() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                error = null
            )
            try {
                val user = userRepository.getCurrentSportas()
                val trainings = trainingRepository.getTrainingsForUser(user.id)
                _uiState.value = ProfileUiState(
                    isLoading = false,
                    user = user,
                    trainings = trainings,
                    error = null
                )
            } catch (e: Exception) {
                _uiState.value = ProfileUiState(
                    isLoading = false,
                    user = null,
                    error = e.message ?: "Dogodila se greška"
                )
            }
        }
    }

    fun reload() {
        loadCurrentUser()
    }
}