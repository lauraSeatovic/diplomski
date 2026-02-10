package com.example.testapp.presentation.trainer.createRaspored


import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.CreateRasporedRequest
import com.example.testapp.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneId
import javax.inject.Inject

@HiltViewModel
class CreateRasporedViewModel @Inject constructor(
    private val repo: TrainingRepository
) : ViewModel() {

    private val _state = MutableStateFlow(CreateRasporedUiState())
    val state: StateFlow<CreateRasporedUiState> = _state

    fun load() {
        if (_state.value.isLoading) return
        _state.update { it.copy(isLoading = true, error = null) }

        viewModelScope.launch {
            try {
                val options = repo.getTreningOptions()
                _state.update {
                    it.copy(
                        isLoading = false,
                        trainings = options,
                        selectedTreningId = options.firstOrNull()?.treningId
                    )
                }
            } catch (e: Exception) {
                _state.update { it.copy(isLoading = false, error = e.message ?: e.toString()) }
            }
        }
    }

    fun setSelectedTrening(id: String) = _state.update { it.copy(selectedTreningId = id) }
    fun setStartDate(d: java.time.LocalDate) = _state.update { it.copy(startDate = d) }
    fun setStartTime(t: java.time.LocalTime) = _state.update { it.copy(startTime = t) }
    fun setEndDate(d: java.time.LocalDate) = _state.update { it.copy(endDate = d) }
    fun setEndTime(t: java.time.LocalTime) = _state.update { it.copy(endTime = t) }

    fun submit() {
        val s = _state.value

        val treningId = s.selectedTreningId
        if (treningId.isNullOrBlank()) {
            _state.update { it.copy(error = "Odaberi trening.") }
            return
        }

        val sd = s.startDate; val st = s.startTime
        val ed = s.endDate; val et = s.endTime
        if (sd == null || st == null || ed == null || et == null) {
            _state.update { it.copy(error = "Odaberi početak i završetak (datum i vrijeme).") }
            return
        }

        val startLdt = LocalDateTime.of(sd, st)
        val endLdt = LocalDateTime.of(ed, et)
        if (!startLdt.isBefore(endLdt)) {
            _state.update { it.copy(error = "Početak mora biti prije završetka.") }
            return
        }

        val zone = ZoneId.systemDefault()
        val startOdt: OffsetDateTime = startLdt.atZone(zone).toOffsetDateTime()
        val endOdt: OffsetDateTime = endLdt.atZone(zone).toOffsetDateTime()

        _state.update { it.copy(isSubmitting = true, error = null) }

        viewModelScope.launch {
            try {
                repo.createRaspored(
                    CreateRasporedRequest(
                        treningId = treningId,
                        trenerId = null,
                        pocetak = startOdt,
                        zavrsetak = endOdt
                    )
                )
                _state.update { it.copy(isSubmitting = false, created = true) }
            } catch (e: Exception) {
                _state.update { it.copy(isSubmitting = false, error = e.message ?: e.toString()) }
            }
        }
    }

    fun consumeCreated() = _state.update { it.copy(created = false) }
}
