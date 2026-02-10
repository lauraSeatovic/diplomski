package com.example.testapp.presentation.trainer

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun TrainerAttendeesRoute(
    rasporedId: String,
    onBack: () -> Unit
) {
    val vm: TrainerAttendeesViewModel = hiltViewModel()
    val state by vm.uiState.collectAsState()

    LaunchedEffect(rasporedId) {
        vm.load(rasporedId)
    }

    TrainerAttendeesScreen(
        state = state,
        onBack = onBack,
        onRetry = { vm.load(rasporedId) },
        onEnterEdit = vm::enterEditMode,
        onCancelEdit = vm::cancelEditMode,
        onToggle = vm::toggleAttendance,
        onConfirm = { vm.confirmAttendance(rasporedId) }
    )
}

@Composable
fun TrainerAttendeesScreen(
    state: TrainerAttendeesUiState,
    onBack: () -> Unit,
    onRetry: () -> Unit,
    onEnterEdit: () -> Unit,
    onCancelEdit: () -> Unit,
    onToggle: (sportasId: String, checked: Boolean) -> Unit,
    onConfirm: () -> Unit
) {
    Column(Modifier.fillMaxSize().padding(12.dp)) {

        Row(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Sudionici", style = MaterialTheme.typography.titleLarge)
            Button(onClick = onBack) { Text("Nazad") }
        }

        Spacer(Modifier.height(12.dp))

        if (state.error != null) {
            Text(state.error, color = MaterialTheme.colorScheme.error)
            Spacer(Modifier.height(12.dp))
        }

        when {
            state.isLoading -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }

            state.attendees.isEmpty() -> Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text("Nema prijavljenih sudionika.")
            }

            else -> {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(state.attendees) { a ->
                        val checked = state.selection[a.sportasId] ?: a.dolazakNaTrening

                        ElevatedCard(Modifier.fillMaxWidth()) {
                            Row(
                                Modifier.fillMaxWidth().padding(12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column(Modifier.weight(1f)) {
                                    listOfNotNull(a.ime, a.prezime).joinToString(" ")
                                        .ifBlank { a.ime }?.let {
                                            Text(
                                                text = it,
                                                style = MaterialTheme.typography.titleMedium
                                            )
                                        }
                                    Spacer(Modifier.height(6.dp))
                                    Text("Ocjena: ${a.ocjenaTreninga?.toString() ?: "-"}")
                                }

                                if (state.isEditMode) {
                                    Checkbox(
                                        checked = checked,
                                        onCheckedChange = { onToggle(a.sportasId, it) }
                                    )
                                } else {
                                    Text(if (a.dolazakNaTrening) "DA" else "NE")
                                }
                            }
                        }
                    }
                }

                Spacer(Modifier.height(12.dp))

                if (!state.isEditMode) {
                    Button(
                        onClick = onEnterEdit,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Označi prisutnost")
                    }
                } else {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        OutlinedButton(
                            onClick = onCancelEdit,
                            enabled = !state.isSaving,
                            modifier = Modifier.weight(1f)
                        ) { Text("Odustani") }

                        Button(
                            onClick = onConfirm,
                            enabled = !state.isSaving,
                            modifier = Modifier.weight(1f)
                        ) {
                            if (state.isSaving) {
                                CircularProgressIndicator(
                                    modifier = Modifier.size(18.dp),
                                    strokeWidth = 2.dp
                                )
                                Spacer(Modifier.width(8.dp))
                            }
                            Text("Potvrdi")
                        }
                    }
                }
            }
        }

        if (!state.isLoading && state.attendees.isEmpty() && state.error != null) {
            Spacer(Modifier.height(12.dp))
            Button(onClick = onRetry, modifier = Modifier.fillMaxWidth()) { Text("Retry") }
        }
    }
}
