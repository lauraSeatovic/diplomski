package com.example.testapp.presentation.trainings

import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.model.Teretana
import java.time.LocalDate

data class AvailableTrainingsUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,

    val selectedDate: LocalDate = LocalDate.now(),
    val teretane: List<Teretana> = emptyList(),
    val selectedTeretanaId: String? = null,

    val trainings: List<DostupniTrening> = emptyList()
)
