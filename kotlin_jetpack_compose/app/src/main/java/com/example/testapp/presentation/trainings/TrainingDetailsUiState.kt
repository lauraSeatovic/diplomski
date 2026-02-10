package com.example.testapp.presentation.trainings

import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.model.TrainingDetails

data class TrainingDetailsUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val trening: TrainingDetails? = null,
    val success: Boolean = false
)