package com.example.testapp.presentation.profile

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Card
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.testapp.domain.model.PrijavljenTrening
import java.time.format.DateTimeFormatter

@Composable
fun TrainingsSection(
    trainings: List<PrijavljenTrening>
) {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Text(
            text = "Prijavljeni treninzi",
            style = MaterialTheme.typography.titleMedium
        )

        if (trainings.isEmpty()) {
            Text(
                text = "Još nemaš prijavljenih treninga.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        } else {
            trainings.forEach { training ->
                TrainingCard(training = training)
            }
        }
    }
}

private val dateFormatter: DateTimeFormatter =
    DateTimeFormatter.ofPattern("dd.MM.yyyy.")
private val timeFormatter: DateTimeFormatter =
    DateTimeFormatter.ofPattern("HH:mm")

@Composable
private fun TrainingCard(
    training: PrijavljenTrening,
    modifier: Modifier = Modifier
) {
    val dateText = training.pocetak.format(dateFormatter)
    val pocetakTimeText = training.pocetak.format(timeFormatter)
    val krajTimeText = training.kraj.format(timeFormatter)


    val lokacijaText = training.teretana?.let {
        "${training.dvorana} – $it"
    } ?: training.dvorana

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = MaterialTheme.shapes.medium
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp)
        ) {

            Text(
                text = training.naziv,
                style = MaterialTheme.typography.titleMedium
            )


            Text(
                text = lokacijaText,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )


            Text(
                text = "$dateText $pocetakTimeText - $krajTimeText",
                style = MaterialTheme.typography.bodySmall
            )

        }
    }
}
