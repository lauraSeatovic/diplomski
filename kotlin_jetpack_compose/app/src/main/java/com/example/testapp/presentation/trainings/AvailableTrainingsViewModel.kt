package com.example.testapp.presentation.trainings

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.Teretana
import com.example.testapp.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDate
import javax.inject.Inject

@HiltViewModel
class AvailableTrainingsViewModel @Inject constructor(
    private val trainingRepository: TrainingRepository,
) : ViewModel() {

    private val _uiState = MutableStateFlow(AvailableTrainingsUiState())
    val uiState: StateFlow<AvailableTrainingsUiState> = _uiState.asStateFlow()

    init {
        loadInitialData()
    }

    private fun loadInitialData() {
        viewModelScope.launch {
            try {
                _uiState.update { it.copy(isLoading = true, errorMessage = null) }

                val teretaneList = trainingRepository.getTeretane()

                _uiState.update {
                    it.copy(
                        teretane = teretaneList,
                        selectedTeretanaId = teretaneList.firstOrNull()?.id
                    )
                }

                loadTrainings()
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Greška pri učitavanju podataka"
                    )
                }
            }
        }
    }

    fun onDateSelected(newDate: LocalDate) {
        _uiState.update { it.copy(selectedDate = newDate) }
        loadTrainings()
    }

    fun onTeretanaSelected(teretanaId: String) {
        _uiState.update { it.copy(selectedTeretanaId = teretanaId) }
        loadTrainings()
    }

    fun onRetryClicked() {
        loadTrainings()
    }

    private fun loadTrainings() {
        val currentState = _uiState.value
        val teretanaId = currentState.selectedTeretanaId ?: return

        viewModelScope.launch {
            try {
                _uiState.update { it.copy(isLoading = true, errorMessage = null) }

                val trainings = trainingRepository.getTrainingsByDateAndTeretana(
                    date = currentState.selectedDate,
                    teretana = teretanaId
                )

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        trainings = trainings
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Greška pri učitavanju treninga"
                    )
                }
            }
        }
    }
}
