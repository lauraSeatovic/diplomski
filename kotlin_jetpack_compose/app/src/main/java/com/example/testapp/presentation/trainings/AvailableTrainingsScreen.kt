package com.example.testapp.presentation.trainings

import androidx.compose.foundation.clickable
import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.model.Teretana

import android.app.DatePickerDialog
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import java.time.LocalDate
import java.time.format.DateTimeFormatter

@Composable
fun AvailableTrainingsScreen(
    viewModel: AvailableTrainingsViewModel = hiltViewModel(),
    onTrainingClick: (DostupniTrening) -> Unit = {}
) {
    val state by viewModel.uiState.collectAsState()
    val dateFormatter = remember { DateTimeFormatter.ofPattern("dd.MM.yyyy.") }

    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {


        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {

            OutlinedButton(
                onClick = {
                    val currentDate = state.selectedDate
                    DatePickerDialog(
                        context,
                        { _, year, month, dayOfMonth ->
                            val newDate = LocalDate.of(year, month + 1, dayOfMonth)
                            viewModel.onDateSelected(newDate)
                        },
                        currentDate.year,
                        currentDate.monthValue - 1,
                        currentDate.dayOfMonth
                    ).show()
                },
                modifier = Modifier.weight(1f)
            ) {
                Icon(
                    imageVector = Icons.Default.DateRange,
                    contentDescription = null
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(state.selectedDate.format(dateFormatter))
            }

            TeretanaDropdown(
                teretane = state.teretane,
                selectedTeretanaId = state.selectedTeretanaId,
                onTeretanaSelected = { id -> viewModel.onTeretanaSelected(id) },
                modifier = Modifier.weight(1f)
            )
        }

        Spacer(modifier = Modifier.height(16.dp))


        state.errorMessage?.let { msg ->
            Text(
                text = msg,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            TextButton(onClick = { viewModel.onRetryClicked() }) {
                Text("Pokušaj ponovno")
            }
        }


        if (state.isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {

            if (state.trainings.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Nema dostupnih treninga za odabrani datum i teretanu.")
                }
            } else {
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(state.trainings) { training ->
                        TrainingItemCard(
                            training = training,
                            onClick = { onTrainingClick(training) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TeretanaDropdown(
    teretane: List<Teretana>,
    selectedTeretanaId: String?,
    onTeretanaSelected: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    var expanded by remember { mutableStateOf(false) }

    val selected = teretane.firstOrNull { it.id == selectedTeretanaId }

    Box(modifier = modifier) {
        OutlinedButton(
            onClick = { expanded = true },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(selected?.naziv ?: "Odaberi teretanu")
        }

        DropdownMenu(
            expanded = expanded,
            onDismissRequest = { expanded = false }
        ) {
            teretane.forEach { teretana ->
                DropdownMenuItem(
                    text = { Text(teretana.naziv) },
                    onClick = {
                        expanded = false
                        onTeretanaSelected(teretana.id)
                    }
                )
            }
        }
    }
}

@Composable
fun TrainingItemCard(
    training: DostupniTrening,
    onClick: () -> Unit
) {

    val startTime = training.pocetak.toString().substringAfter("T").take(5)
    val endTime = training.kraj.toString().substringAfter("T").take(5)

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = training.nazivVrsteTreninga,
                    style = MaterialTheme.typography.titleMedium
                )

                if (training.isFull) {
                    Text(
                        text = "POPUNJENO",
                        color = MaterialTheme.colorScheme.error,
                        style = MaterialTheme.typography.labelMedium
                    )
                }
            }

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "$startTime - $endTime",
                style = MaterialTheme.typography.bodyMedium
            )

            Text(
                text = "${training.dvoranaNaziv} • ${training.trenerIme} ${training.trenerPrezime}",
                style = MaterialTheme.typography.bodyMedium
            )

            Spacer(modifier = Modifier.height(4.dp))

            Text(
                text = "Prijavljeno: ${training.trenutnoPrijavljenih}/${training.maxBrojSportasa}",
                style = MaterialTheme.typography.bodySmall
            )
        }
    }
}


