package com.example.testapp.presentation.trainings

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.testapp.domain.model.TrainingDetails

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TrainingDetailsScreen(
    state: TrainingDetailsUiState,
    onPrijaviSeClick: () -> Unit,
    onBackClick: () -> Unit
) {
    val trening: TrainingDetails? = state.trening

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = trening?.nazivVrste ?: "Detalji treninga"
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Natrag"
                        )
                    }
                }
            )
        },
        bottomBar = {
            BottomBarSection(
                isLoading = state.isLoading,
                success = state.success,
                errorMessage = state.errorMessage,
                onPrijaviSeClick = onPrijaviSeClick,
                isEnabled = trening != null && !state.success && !state.isLoading
            )
        }
    ) { innerPadding ->

        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp)
        ) {
            when {
                state.isLoading && trening == null -> {

                    LoadingSection()
                }

                trening == null -> {

                    ErrorSection(
                        errorMessage = state.errorMessage ?: "Nije moguće učitati trening."
                    )
                }

                else -> {

                    TrainingContent(trening = trening)
                }
            }
        }
    }
}

@Composable
private fun LoadingSection() {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ErrorSection(errorMessage: String) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = errorMessage,
            color = MaterialTheme.colorScheme.error,
            style = MaterialTheme.typography.bodyMedium
        )
    }
}

@Composable
private fun TrainingContent(trening: TrainingDetails) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = trening.nazivVrste,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold
        )

        Text(
            text = "Težina: ${trening.tezina}",
            style = MaterialTheme.typography.bodyLarge
        )
    }
}

@Composable
private fun BottomBarSection(
    isLoading: Boolean,
    success: Boolean,
    errorMessage: String?,
    isEnabled: Boolean,
    onPrijaviSeClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp)
    ) {

        if (errorMessage != null && !success) {
            Text(
                text = errorMessage,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        if (success) {
            Text(
                text = "Uspješno si prijavljena na trening.",
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.bodyMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        Button(
            onClick = onPrijaviSeClick,
            modifier = Modifier.fillMaxWidth(),
            enabled = isEnabled
        ) {
            if (isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier
                        .size(20.dp)
                        .padding(end = 8.dp),
                    strokeWidth = 2.dp,
                    color = MaterialTheme.colorScheme.onPrimary
                )
            }
            Text(
                text = when {
                    success -> "Prijavljena"
                    else -> "Prijavi se"
                }
            )
        }
    }
}
