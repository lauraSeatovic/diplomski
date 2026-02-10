package com.example.testapp.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.List
import androidx.compose.material.icons.filled.List
import androidx.compose.material.icons.filled.Person
import androidx.compose.ui.graphics.vector.ImageVector

sealed class BottomNavItem(
    val route: String,
    val label: String,
    val icon: ImageVector
) {
    object Profile : BottomNavItem(
        route = "profile",
        label = "Profil",
        icon = Icons.Default.Person
    )

    object Trainings : BottomNavItem(
        route = "availableTrainings",
        label = "Treninzi",
        icon = Icons.AutoMirrored.Filled.List
    )
}
