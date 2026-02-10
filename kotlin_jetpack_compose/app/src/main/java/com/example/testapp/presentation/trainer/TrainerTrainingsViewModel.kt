package com.example.testapp.presentation.trainer
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.TrenerTrening
import com.example.testapp.domain.repository.AuthRepository
import com.example.testapp.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TrainerTrainingsUiState(
    val isLoading: Boolean = false,
    val trainings: List<TrenerTrening> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class TrainerTrainingsViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val trainingRepository: TrainingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TrainerTrainingsUiState())
    val uiState: StateFlow<TrainerTrainingsUiState> = _uiState.asStateFlow()

    fun loadTrainings() {
        val trenerId = authRepository.currentUserId()
        if (trenerId == null) {
            _uiState.value = TrainerTrainingsUiState(error = "Niste prijavljeni.")
            return
        }

        viewModelScope.launch {
            _uiState.value = TrainerTrainingsUiState(isLoading = true)
            try {
                val data = trainingRepository.getTrainingsForTrainer(trenerId)
                _uiState.value = TrainerTrainingsUiState(trainings = data)
            } catch (e: Exception) {
                _uiState.value = TrainerTrainingsUiState(error = e.message ?: "Greška pri dohvaćanju treninga.")
            }
        }
    }

    fun deleteRaspored(rasporedId: String) {
        viewModelScope.launch {
            try {
                trainingRepository.deleteRaspored(rasporedId)
                loadTrainings()
            } catch (e: Exception) {
                _uiState.update { it.copy(error = e.message ?: e.toString()) }
            }
        }
    }

}
