package com.example.testapp.presentation.profile

import com.example.testapp.domain.model.PrijavljenTrening
import com.example.testapp.domain.model.SportasUser

data class ProfileUiState(
    val isLoading: Boolean = false,
    val user: SportasUser? = null,
    val error: String? = null,
    val trainings: List<PrijavljenTrening> = emptyList()
)