package com.example.testapp.presentation.trainings

import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class TrainingDetailsViewModel @Inject constructor(
    private val repo: TrainingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TrainingDetailsUiState())
    val uiState: StateFlow<TrainingDetailsUiState> = _uiState

    fun loadTraining(rasporedId: String, treningId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }

            try {
                val details = repo.getTrainingDetails(treningId)

                _uiState.update {
                    it.copy(
                        isLoading = false,
                        trening = details
                    )
                }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(
                        isLoading = false,
                        errorMessage = e.message ?: "Greška pri učitavanju detalja"
                    )
                }
            }
        }
    }

    fun onPrijaviSeClick(rasporedId: String) {
        viewModelScope.launch {
            try {
                repo.prijaviSeNaTrening(rasporedId)
                _uiState.update { it.copy(success = true) }
            } catch (e: Exception) {
                _uiState.update {
                    it.copy(errorMessage = e.message)
                }
            }
        }
    }
}