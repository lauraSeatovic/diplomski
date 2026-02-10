package com.example.testapp.presentation.trainer.createRaspored


import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.testapp.domain.model.TreningOption
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId

@Composable
fun CreateRasporedRoute(
    onBack: () -> Unit,
    onCreated: () -> Unit
) {
    val vm: CreateRasporedViewModel = hiltViewModel()
    val state by vm.state.collectAsState()

    LaunchedEffect(Unit) { vm.load() }

    LaunchedEffect(state.created) {
        if (state.created) {
            vm.consumeCreated()
            onCreated()
        }
    }

    CreateRasporedScreen(
        state = state,
        onBack = onBack,
        onSelectTraining = vm::setSelectedTrening,
        onPickStartDate = vm::setStartDate,
        onPickStartTime = vm::setStartTime,
        onPickEndDate = vm::setEndDate,
        onPickEndTime = vm::setEndTime,
        onSubmit = { vm.submit() }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateRasporedScreen(
    state: CreateRasporedUiState,
    onBack: () -> Unit,
    onSelectTraining: (String) -> Unit,
    onPickStartDate: (LocalDate) -> Unit,
    onPickStartTime: (LocalTime) -> Unit,
    onPickEndDate: (LocalDate) -> Unit,
    onPickEndTime: (LocalTime) -> Unit,
    onSubmit: () -> Unit
) {
    var trainingExpanded by remember { mutableStateOf(false) }

    var showStartDate by remember { mutableStateOf(false) }
    var showStartTime by remember { mutableStateOf(false) }
    var showEndDate by remember { mutableStateOf(false) }
    var showEndTime by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Dodaj termin") },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->

        if (state.isLoading) {
            Box(
                Modifier.fillMaxSize().padding(padding),
                contentAlignment = Alignment.Center
            ) { CircularProgressIndicator() }
            return@Scaffold
        }

        Column(
            modifier = Modifier.padding(padding).padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            state.error?.let { Text(it, color = MaterialTheme.colorScheme.error) }


            val selected = state.trainings.firstOrNull { it.treningId == state.selectedTreningId }

            ExposedDropdownMenuBox(
                expanded = trainingExpanded,
                onExpandedChange = { trainingExpanded = !trainingExpanded }
            ) {
                OutlinedTextField(
                    value = selected?.let(::formatTraining) ?: "",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Trening") },
                    trailingIcon = {
                        ExposedDropdownMenuDefaults.TrailingIcon(expanded = trainingExpanded)
                    },
                    modifier = Modifier.menuAnchor().fillMaxWidth()
                )

                ExposedDropdownMenu(
                    expanded = trainingExpanded,
                    onDismissRequest = { trainingExpanded = false }
                ) {
                    state.trainings.forEach { t ->
                        DropdownMenuItem(
                            text = { Text(formatTraining(t)) },
                            onClick = {
                                onSelectTraining(t.treningId)
                                trainingExpanded = false
                            }
                        )
                    }
                }
            }


            DateTimeRow(
                label = "Početak",
                dateText = state.startDate?.toString() ?: "Odaberi datum",
                timeText = state.startTime?.let { hm(it) } ?: "Odaberi vrijeme",
                onDateClick = { showStartDate = true },
                onTimeClick = { showStartTime = true }
            )


            DateTimeRow(
                label = "Završetak",
                dateText = state.endDate?.toString() ?: "Odaberi datum",
                timeText = state.endTime?.let { hm(it) } ?: "Odaberi vrijeme",
                onDateClick = { showEndDate = true },
                onTimeClick = { showEndTime = true }
            )

            Button(
                onClick = onSubmit,
                enabled = !state.isSubmitting,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (state.isSubmitting) {
                    CircularProgressIndicator(modifier = Modifier.size(18.dp), strokeWidth = 2.dp)
                    Spacer(Modifier.width(8.dp))
                }
                Text("Spremi")
            }
        }


        if (showStartDate) DatePickerDialogM3(
            onDismiss = { showStartDate = false },
            onConfirm = { onPickStartDate(it); showStartDate = false }
        )

        if (showEndDate) DatePickerDialogM3(
            onDismiss = { showEndDate = false },
            onConfirm = { onPickEndDate(it); showEndDate = false }
        )

        if (showStartTime) TimePickerDialogM3(
            onDismiss = { showStartTime = false },
            onConfirm = { onPickStartTime(it); showStartTime = false }
        )

        if (showEndTime) TimePickerDialogM3(
            onDismiss = { showEndTime = false },
            onConfirm = { onPickEndTime(it); showEndTime = false }
        )
    }
}

@Composable
private fun DateTimeRow(
    label: String,
    dateText: String,
    timeText: String,
    onDateClick: () -> Unit,
    onTimeClick: () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
        Text(label, style = MaterialTheme.typography.titleSmall)
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), modifier = Modifier.fillMaxWidth()) {
            OutlinedButton(onClick = onDateClick, modifier = Modifier.weight(1f)) { Text(dateText) }
            OutlinedButton(onClick = onTimeClick, modifier = Modifier.weight(1f)) { Text(timeText) }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun DatePickerDialogM3(
    onDismiss: () -> Unit,
    onConfirm: (LocalDate) -> Unit
) {
    val pickerState = rememberDatePickerState()

    DatePickerDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            TextButton(onClick = {
                val millis = pickerState.selectedDateMillis
                if (millis != null) {
                    val picked = Instant.ofEpochMilli(millis)
                        .atZone(ZoneId.systemDefault())
                        .toLocalDate()
                    onConfirm(picked)
                } else {
                    onDismiss()
                }
            }) { Text("OK") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } }
    ) {
        DatePicker(state = pickerState)
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun TimePickerDialogM3(
    onDismiss: () -> Unit,
    onConfirm: (LocalTime) -> Unit
) {
    val timeState = rememberTimePickerState(is24Hour = true)

    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            TextButton(onClick = {
                onConfirm(LocalTime.of(timeState.hour, timeState.minute))
            }) { Text("OK") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Cancel") } },
        text = { TimePicker(state = timeState) }
    )
}

private fun formatTraining(t: TreningOption): String =
    "${t.vrstaNaziv} • ${t.teretanaNaziv} • ${t.dvoranaNaziv}"

private fun hm(t: LocalTime): String =
    "${t.hour}:${t.minute}"
