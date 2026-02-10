package com.example.testapp.presentation.trainer

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.AttendanceUpdate
import com.example.testapp.domain.model.PrijavljeniSudionik
import com.example.testapp.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class TrainerAttendeesUiState(
    val isLoading: Boolean = false,
    val attendees: List<PrijavljeniSudionik> = emptyList(),
    val isEditMode: Boolean = false,
    val selection: Map<String, Boolean> = emptyMap(),
    val isSaving: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class TrainerAttendeesViewModel @Inject constructor(
    private val trainingRepository: TrainingRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(TrainerAttendeesUiState())
    val uiState: StateFlow<TrainerAttendeesUiState> = _uiState.asStateFlow()

    fun load(rasporedId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null, isEditMode = false)
            try {
                val data = trainingRepository.getAttendeesForRaspored(rasporedId)
                _uiState.value = TrainerAttendeesUiState(
                    attendees = data,
                    selection = data.associate { it.sportasId to it.dolazakNaTrening }
                )
            } catch (e: Exception) {
                _uiState.value = TrainerAttendeesUiState(
                    error = e.message ?: "Greška.",
                    attendees = emptyList()
                )
            }
        }
    }

    fun enterEditMode() {
        _uiState.value = _uiState.value.copy(
            isEditMode = true,
            error = null
        )
    }

    fun cancelEditMode() {
        val restoredSelection = _uiState.value.attendees.associate { it.sportasId to it.dolazakNaTrening }
        _uiState.value = _uiState.value.copy(
            isEditMode = false,
            selection = restoredSelection,
            error = null
        )
    }

    fun toggleAttendance(sportasId: String, checked: Boolean) {
        val current = _uiState.value.selection.toMutableMap()
        current[sportasId] = checked
        _uiState.value = _uiState.value.copy(selection = current)
    }

    fun confirmAttendance(rasporedId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isSaving = true, error = null)

            try {
                val updates = _uiState.value.selection.map { (sportasId, dolazak) ->
                    AttendanceUpdate(sportasId = sportasId, dolazak = dolazak)
                }

                val result = trainingRepository.setAttendanceForRaspored(
                    rasporedId = rasporedId,
                    updates = updates
                )

                if (!result.success) {
                    _uiState.value = _uiState.value.copy(
                        isSaving = false,
                        error = "Spremanje nije uspjelo."
                    )
                    return@launch
                }

                load(rasporedId)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isSaving = false,
                    error = e.message ?: "Greška pri spremanju."
                )
            }
        }
    }
}
