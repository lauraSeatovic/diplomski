package com.example.testapp.presentation.trainer.createTraining

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun CreateTreningRoute(
    onBack: () -> Unit,
    onCreated: () -> Unit
) {
    val vm: CreateTreningViewModel = hiltViewModel()

    CreateTreningScreen(
        viewModel = vm,
        onBack = onBack,
        onCreated = onCreated
    )
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateTreningScreen(
    viewModel: CreateTreningViewModel,
    onBack: () -> Unit,
    onCreated: () -> Unit
) {
    val state by viewModel.state.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.load()
    }

    LaunchedEffect(state.created) {
        if (state.created) {
            viewModel.consumeCreated()
            onCreated()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Dodaj trening") },
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
                modifier = Modifier
                    .padding(padding)
                    .fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
            return@Scaffold
        }

        Column(
            modifier = Modifier
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            state.error?.let {
                Text(it, color = MaterialTheme.colorScheme.error)
            }


            var dvoranaExpanded by remember { mutableStateOf(false) }
            val selectedDvorana = state.dvorane.firstOrNull { it.id == state.selectedDvoranaId }

            ExposedDropdownMenuBox(
                expanded = dvoranaExpanded,
                onExpandedChange = { dvoranaExpanded = !dvoranaExpanded }
            ) {
                OutlinedTextField(
                    value = selectedDvorana?.naziv ?: "",
                    onValueChange = {},
                    readOnly = true,
                    label = { Text("Dvorana") },
                    trailingIcon = {
                        ExposedDropdownMenuDefaults.TrailingIcon(expanded = dvoranaExpanded)
                    },
                    modifier = Modifier
                        .menuAnchor()
                        .fillMaxWidth()
                )

                ExposedDropdownMenu(
                    expanded = dvoranaExpanded,
                    onDismissRequest = { dvoranaExpanded = false }
                ) {
                    state.dvorane.forEach { d ->
                        DropdownMenuItem(
                            text = { Text(d.naziv) },
                            onClick = {
                                viewModel.setSelectedDvorana(d.id)
                                dvoranaExpanded = false
                            }
                        )
                    }
                }
            }


            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                FilterChip(
                    selected = state.useExistingVrsta,
                    onClick = { viewModel.setUseExistingVrsta(true) },
                    label = { Text("Postojeća vrsta") }
                )
                FilterChip(
                    selected = !state.useExistingVrsta,
                    onClick = { viewModel.setUseExistingVrsta(false) },
                    label = { Text("Nova vrsta") }
                )
            }

            if (state.useExistingVrsta) {
                var vrstaExpanded by remember { mutableStateOf(false) }
                val selectedVrsta = state.vrste.firstOrNull { it.id == state.selectedVrstaId }

                ExposedDropdownMenuBox(
                    expanded = vrstaExpanded,
                    onExpandedChange = { vrstaExpanded = !vrstaExpanded }
                ) {
                    OutlinedTextField(
                        value = selectedVrsta?.let { "${it.naziv} (Težina ${it.tezina})" } ?: "",
                        onValueChange = {},
                        readOnly = true,
                        label = { Text("Vrsta treninga") },
                        trailingIcon = {
                            ExposedDropdownMenuDefaults.TrailingIcon(expanded = vrstaExpanded)
                        },
                        modifier = Modifier
                            .menuAnchor()
                            .fillMaxWidth()
                    )

                    ExposedDropdownMenu(
                        expanded = vrstaExpanded,
                        onDismissRequest = { vrstaExpanded = false }
                    ) {
                        state.vrste.forEach { v ->
                            DropdownMenuItem(
                                text = { Text("${v.naziv} (Težina ${v.tezina})") },
                                onClick = {
                                    viewModel.setSelectedVrsta(v.id)
                                    vrstaExpanded = false
                                }
                            )
                        }
                    }
                }
            } else {
                OutlinedTextField(
                    value = state.newVrstaNaziv,
                    onValueChange = viewModel::setNewVrstaNaziv,
                    label = { Text("Naziv vrste") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = state.newVrstaTezina,
                    onValueChange = viewModel::setNewVrstaTezina,
                    label = { Text("Težina (1–10)") },
                    modifier = Modifier.fillMaxWidth()
                )
            }

            OutlinedTextField(
                value = state.maksBrojSportasa,
                onValueChange = viewModel::setMaksBrojSportasa,
                label = { Text("Maks. broj sportaša") },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = { viewModel.submit() },
                enabled = !state.isSubmitting,
                modifier = Modifier.fillMaxWidth()
            ) {
                if (state.isSubmitting) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp
                    )
                    Spacer(Modifier.width(8.dp))
                }
                Text("Spremi")
            }
        }
    }
}
