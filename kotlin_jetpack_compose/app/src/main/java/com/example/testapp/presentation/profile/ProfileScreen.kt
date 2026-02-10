package com.example.testapp.presentation.profile

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Divider
import androidx.compose.material3.DividerDefaults
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.example.testapp.domain.model.SportasUser
import java.time.format.DateTimeFormatter

@Composable
fun ProfileScreen(
    state: ProfileUiState,
    onRetry: () -> Unit
) {
    when {
        state.isLoading -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }

        state.error != null -> {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(text = state.error)
                Spacer(modifier = Modifier.height(8.dp))
                Button(onClick = onRetry) {
                    Text("Pokušaj ponovno")
                }
            }
        }

        state.user != null -> {
            val user = state.user!!

            LazyColumn (
                modifier = Modifier
                    .fillMaxSize()
                    .padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp)
            ) {
                item {
                    ProfileInfoCard(user = user)
                }

                item {
                    TrainingsSection(trainings = state.trainings)
                }
            }
        }

    }
}

private val dateFormatter: DateTimeFormatter =
    DateTimeFormatter.ofPattern("dd.MM.yyyy.")

@Composable
private fun ProfileInfoCard(
    user: SportasUser,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            ProfileLabel(text = "Ime i prezime")
            ProfileValue(text = "${user.ime} ${user.prezime}")

            HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)

            ProfileLabel(text = "Datum rođenja")
            ProfileValue(text = user.datumRodenja.format(dateFormatter))

            HorizontalDivider(Modifier, DividerDefaults.Thickness, DividerDefaults.color)

            ProfileLabel(text = "Tip članarine")
            ProfileValue(text = user.tipClanarine ?: "Nije definirano")
        }
    }
}

@Composable
private fun ProfileLabel(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.bodySmall,
        color = MaterialTheme.colorScheme.onSurfaceVariant
    )
}

@Composable
private fun ProfileValue(text: String) {
    Text(
        text = text,
        style = MaterialTheme.typography.bodyMedium.copy(
            fontWeight = FontWeight.SemiBold
        )
    )
}