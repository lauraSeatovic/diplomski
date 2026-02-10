package com.example.testapp.presentation.trainer.createTraining

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.testapp.domain.model.CreateTreningRequest
import com.example.testapp.domain.model.TreningCreate
import com.example.testapp.domain.model.VrstaTreningaCreate
import com.example.testapp.domain.repository.TrainingRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class CreateTreningViewModel @Inject constructor(
    private val repo: TrainingRepository
) : ViewModel() {

    private val _state = MutableStateFlow(CreateTreningState())
    val state: StateFlow<CreateTreningState> = _state

    fun load() {
        if (_state.value.isLoading) return

        _state.update { it.copy(isLoading = true, error = null) }

        viewModelScope.launch {
            try {

                val dvorane = repo.getDvorane()
                val vrste = repo.getVrsteTreninga()

                _state.update {
                    it.copy(
                        isLoading = false,
                        dvorane = dvorane,
                        vrste = vrste,
                        selectedDvoranaId = dvorane.firstOrNull()?.id,
                        selectedVrstaId = vrste.firstOrNull()?.id
                    )
                }
            } catch (e: Exception) {
                _state.update {
                    it.copy(
                        isLoading = false,
                        error = e.message ?: e.toString()
                    )
                }
            }
        }
    }

    fun setSelectedDvorana(id: String) {
        _state.update { it.copy(selectedDvoranaId = id) }
    }

    fun setSelectedVrsta(id: String) {
        _state.update { it.copy(selectedVrstaId = id) }
    }

    fun setUseExistingVrsta(value: Boolean) {
        _state.update { it.copy(useExistingVrsta = value) }
    }

    fun setNewVrstaNaziv(value: String) {
        _state.update { it.copy(newVrstaNaziv = value) }
    }

    fun setNewVrstaTezina(value: String) {
        _state.update { it.copy(newVrstaTezina = value) }
    }

    fun setMaksBrojSportasa(value: String) {
        _state.update { it.copy(maksBrojSportasa = value) }
    }

    fun submit() {
        val s = _state.value

        val dvoranaId = s.selectedDvoranaId
        if (dvoranaId.isNullOrBlank()) {
            _state.update { it.copy(error = "Odaberi dvoranu.") }
            return
        }

        val maks = s.maksBrojSportasa.toIntOrNull()
        if (maks == null || maks <= 0) {
            _state.update { it.copy(error = "Maksimalni broj sportaša mora biti pozitivan broj.") }
            return
        }

        val existingVrstaId = if (s.useExistingVrsta) s.selectedVrstaId else null

        val newVrsta = if (!s.useExistingVrsta) {
            val tezina = s.newVrstaTezina.toIntOrNull()
            if (s.newVrstaNaziv.isBlank() || tezina == null || tezina !in 1..10) {
                _state.update { it.copy(error = "Nova vrsta: unesite naziv i težinu (1–10).") }
                return
            }
            VrstaTreningaCreate(
                naziv = s.newVrstaNaziv.trim(),
                tezina = tezina
            )
        } else null

        if (existingVrstaId.isNullOrBlank() && newVrsta == null) {
            _state.update { it.copy(error = "Odaberi postojeću vrstu ili unesi novu.") }
            return
        }

        _state.update { it.copy(isSubmitting = true, error = null) }

        viewModelScope.launch {
            try {
                repo.createTrening(
                    CreateTreningRequest(
                        trening = TreningCreate(
                            idTreninga = null,
                            idDvOdr = dvoranaId,
                            idVrTreninga = existingVrstaId?.takeIf { it.isNotBlank() },
                            idLaksijegTreninga = null,
                            idTezegTreninga = null,
                            maksBrojSportasa = maks
                        ),
                        vrsta = newVrsta
                    )
                )

                _state.update { it.copy(isSubmitting = false, created = true) }
            } catch (e: Exception) {
                _state.update { it.copy(isSubmitting = false, error = e.message ?: e.toString()) }
            }
        }
    }

    fun consumeCreated() {
        _state.update { it.copy(created = false) }
    }
}
