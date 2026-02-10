package com.example.testapp.presentation.trainer.createRaspored

import com.example.testapp.domain.model.TreningOption
import java.time.LocalDate
import java.time.LocalTime

data class CreateRasporedUiState(
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,

    val trainings: List<TreningOption> = emptyList(),
    val selectedTreningId: String? = null,

    val startDate: LocalDate? = null,
    val startTime: LocalTime? = null,
    val endDate: LocalDate? = null,
    val endTime: LocalTime? = null,

    val created: Boolean = false
)