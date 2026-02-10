package com.example.testapp.presentation.trainer

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.example.testapp.domain.model.TrenerTrening
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter

private val dtf = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")

@Composable
fun TrainerTrainingsRoute(
    onTrainingClick: (TrenerTrening) -> Unit,
    onAddTrainingClick: () -> Unit,
    onAddRasporedClick: () -> Unit,
) {
    val vm: TrainerTrainingsViewModel = hiltViewModel()
    val state by vm.uiState.collectAsState()

    LaunchedEffect(Unit) { vm.loadTrainings() }

    TrainerTrainingsScreen(
        state = state,
        onTrainingClick = onTrainingClick,
        onAddTrainingClick = onAddTrainingClick,
        onAddRasporedClick = onAddRasporedClick,
        onRetry = { vm.loadTrainings() },
        onDeleteRaspored = { rasporedId -> vm.deleteRaspored(rasporedId) }
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrainerTrainingsScreen(
    state: TrainerTrainingsUiState,
    onTrainingClick: (TrenerTrening) -> Unit,
    onAddTrainingClick: () -> Unit,
    onAddRasporedClick: () -> Unit,
    onRetry: () -> Unit,
    onDeleteRaspored: (String) -> Unit
) {
    var pendingDeleteId by remember { mutableStateOf<String?>(null) }

    if (pendingDeleteId != null) {
        AlertDialog(
            onDismissRequest = { pendingDeleteId = null },
            title = { Text("Brisanje termina") },
            text = { Text("Jeste li sigurni da želite obrisati ovaj termin?") },
            confirmButton = {
                TextButton(
                    onClick = {
                        val id = pendingDeleteId!!
                        pendingDeleteId = null
                        onDeleteRaspored(id)
                    }
                ) { Text("Obriši") }
            },
            dismissButton = {
                TextButton(onClick = { pendingDeleteId = null }) { Text("Odustani") }
            }
        )
    }

    Scaffold(
        topBar = { TopAppBar(title = { Text("Moji treninzi") }) }
    ) { padding ->

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
        ) {


            Box(modifier = Modifier.weight(1f).fillMaxWidth()) {
                when {
                    state.isLoading -> {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            CircularProgressIndicator()
                        }
                    }

                    state.error != null -> {
                        Column(
                            Modifier
                                .fillMaxSize()
                                .padding(16.dp)
                        ) {
                            Text(text = state.error, color = MaterialTheme.colorScheme.error)
                            Spacer(Modifier.height(12.dp))
                            Button(onClick = onRetry) { Text("Pokušaj ponovno") }
                        }
                    }

                    state.trainings.isEmpty() -> {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text("Nema termina za prikaz.")
                        }
                    }

                    else -> {
                        LazyColumn(
                            modifier = Modifier.fillMaxSize(),
                            contentPadding = PaddingValues(horizontal = 12.dp, vertical = 8.dp),
                            verticalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            items(state.trainings) { t ->
                                ElevatedCard(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { onTrainingClick(t) }
                                ) {
                                    Column(Modifier.padding(12.dp)) {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Text(
                                                text = t.nazivVrsteTreninga,
                                                style = MaterialTheme.typography.titleMedium,
                                                modifier = Modifier.weight(1f)
                                            )

                                            IconButton(onClick = { pendingDeleteId = t.rasporedId }) {
                                                Icon(
                                                    imageVector = Icons.Default.Delete,
                                                    contentDescription = "Obriši"
                                                )
                                            }
                                        }

                                        Spacer(Modifier.height(6.dp))
                                        Text("${fmt(t.pocetak)} – ${fmt(t.zavrsetak)}")
                                        Text("${t.nazivTeretane} • ${t.nazivDvorane}")
                                        Spacer(Modifier.height(6.dp))
                                        Text("Kapacitet: ${t.maxBrojSportasa}")
                                    }
                                }
                            }
                        }
                    }
                }
            }


            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 10.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Button(
                    onClick = onAddRasporedClick,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Novi termin")
                }

                OutlinedButton(
                    onClick = onAddTrainingClick,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Novi trening")
                }
            }
        }
    }
}

private fun fmt(dt: LocalDateTime): String = dt.format(dtf)
