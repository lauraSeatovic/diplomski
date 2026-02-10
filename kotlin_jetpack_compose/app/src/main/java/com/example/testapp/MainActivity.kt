package com.example.testapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.testapp.domain.model.UserRole
import com.example.testapp.navigation.BottomNavBar
import com.example.testapp.navigation.BottomNavItem
import com.example.testapp.presentation.auth.AuthNavigation
import com.example.testapp.presentation.auth.AuthViewModel
import com.example.testapp.presentation.auth.LoginScreen
import com.example.testapp.presentation.profile.ProfileScreen
import com.example.testapp.presentation.profile.ProfileViewModel
import com.example.testapp.presentation.trainer.TrainerAttendeesRoute
import com.example.testapp.presentation.trainer.TrainerTrainingsRoute
import com.example.testapp.presentation.trainer.createRaspored.CreateRasporedRoute
import com.example.testapp.presentation.trainer.createTraining.CreateTreningRoute
import com.example.testapp.presentation.trainings.AvailableTrainingsScreen
import com.example.testapp.presentation.trainings.TrainingDetailsScreen
import com.example.testapp.presentation.trainings.TrainingDetailsViewModel
import com.example.testapp.ui.theme.TestAppTheme
import dagger.hilt.android.AndroidEntryPoint

object AppRoutes {
    const val Login = "login"
    const val TrainerTrainings = "trainerTrainings"
    const val CreateTrening = "createTrening"
    const val CreateRaspored = "createRaspored"
}

@AndroidEntryPoint
class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TestAppTheme {
                val navController = rememberNavController()
                val authVm: AuthViewModel = hiltViewModel()

                val startDestination = remember {

                    AppRoutes.Login
                }

                Scaffold(
                    bottomBar = {
                        val currentDestination = navController.currentBackStackEntryFlow
                            .collectAsState(initial = navController.currentBackStackEntry)
                            .value?.destination?.route

                        val hideBottomNav =
                            currentDestination == AppRoutes.Login ||
                                    currentDestination == AppRoutes.TrainerTrainings ||
                                    currentDestination == AppRoutes.CreateTrening ||
                                    (currentDestination?.startsWith("trainingDetails") == true) ||
                                    (currentDestination?.startsWith("trainerTrainingDetails") == true)

                        if (!hideBottomNav) {
                            BottomNavBar(navController = navController)
                        }
                    }
                ) { innerPadding ->

                    Surface(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        NavHost(
                            navController = navController,
                            startDestination = startDestination
                        ) {

                            composable(AppRoutes.Login) {

                                LaunchedEffect(Unit) {
                                    authVm.navigation.collect { nav ->
                                        when (nav) {
                                            AuthNavigation.ToTrener -> {
                                                navController.navigate(AppRoutes.TrainerTrainings) {
                                                    popUpTo(AppRoutes.Login) { inclusive = true }
                                                }
                                            }

                                            AuthNavigation.ToSportas -> {
                                                navController.navigate(BottomNavItem.Profile.route) {
                                                    popUpTo(AppRoutes.Login) { inclusive = true }
                                                }
                                            }
                                        }
                                    }
                                }

                                LoginScreen(
                                    state = authVm.state,
                                    onEmailChange = authVm::onEmailChange,
                                    onPasswordChange = authVm::onPasswordChange,
                                    onLoginClick = { authVm.signIn() }
                                )
                            }

                            composable(AppRoutes.TrainerTrainings) {
                                TrainerTrainingsRoute(
                                    onTrainingClick = { t ->
                                        navController.navigate("trainerTrainingDetails/${t.rasporedId}")
                                    },
                                    onAddTrainingClick = {
                                        navController.navigate(AppRoutes.CreateTrening)
                                    },
                                    onAddRasporedClick = {
                                        navController.navigate(AppRoutes.CreateRaspored)
                                    },
                                )
                            }

                            composable(BottomNavItem.Profile.route) {
                                val vm: ProfileViewModel = hiltViewModel()
                                val state by vm.uiState.collectAsState()

                                ProfileScreen(
                                    state = state,
                                    onRetry = { vm.loadCurrentUser() }
                                )
                            }

                            composable(BottomNavItem.Trainings.route) {
                                AvailableTrainingsScreen(
                                    onTrainingClick = { trening ->
                                        navController.navigate(
                                            "trainingDetails/${trening.rasporedId}/${trening.treningId}"
                                        )
                                    }
                                )
                            }

                            composable("trainingDetails/{rasporedId}/{treningId}") { backStackEntry ->
                                val rasporedId = backStackEntry.arguments?.getString("rasporedId")!!
                                val treningId = backStackEntry.arguments?.getString("treningId")!!

                                val vm: TrainingDetailsViewModel = hiltViewModel()
                                val state by vm.uiState.collectAsState()

                                LaunchedEffect(rasporedId, treningId) {
                                    vm.loadTraining(rasporedId, treningId)
                                }

                                TrainingDetailsScreen(
                                    state = state,
                                    onPrijaviSeClick = { vm.onPrijaviSeClick(rasporedId) },
                                    onBackClick = { navController.popBackStack() }
                                )
                            }

                            composable("trainerTrainingDetails/{rasporedId}") { backStackEntry ->
                                val rasporedId = backStackEntry.arguments?.getString("rasporedId")!!
                                TrainerAttendeesRoute(
                                    rasporedId = rasporedId,
                                    onBack = { navController.popBackStack() }
                                )
                            }

                            composable(AppRoutes.CreateTrening) {
                                CreateTreningRoute(
                                    onBack = { navController.popBackStack() },
                                    onCreated = {
                                        navController.popBackStack()
                                    }
                                )
                            }

                            composable("createRaspored") {
                                CreateRasporedRoute(
                                    onBack = { navController.popBackStack() },
                                    onCreated = { navController.popBackStack() }
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
