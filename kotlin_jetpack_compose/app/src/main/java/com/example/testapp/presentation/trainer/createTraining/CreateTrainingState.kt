package com.example.testapp.presentation.trainer.createTraining

import com.example.testapp.domain.model.Dvorana
import com.example.testapp.domain.model.VrstaTreninga

data class CreateTreningState(
    val isLoading: Boolean = false,
    val isSubmitting: Boolean = false,
    val error: String? = null,

    val dvorane: List<Dvorana> = emptyList(),
    val vrste: List<VrstaTreninga> = emptyList(),

    val selectedDvoranaId: String? = null,
    val selectedVrstaId: String? = null,

    val useExistingVrsta: Boolean = true,

    val newVrstaNaziv: String = "",
    val newVrstaTezina: String = "",

    val maksBrojSportasa: String = "",

    val created: Boolean = false
)