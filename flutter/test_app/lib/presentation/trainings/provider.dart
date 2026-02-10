
/*
import 'package:cloud_firestore/cloud_firestore.dart';

import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/trainings/training_state.dart';
import 'package:test_app/presentation/trainings/trainings_controller.dart';

import '../../data/supabase/network/service/training_service.dart';
import '../../data/supabase/repository/training_repository_impl.dart';
import '../../domain/repository/training_repository.dart';
import '../profile/providers.dart';


final trainingServiceProvider = Provider<TrainingService>((ref) {
  final client = ref.watch(supabaseClientProvider);
  return TrainingService(client);
});

final trainingRepositoryProvider = Provider<TrainingRepository>((ref) {
  final service = ref.watch(trainingServiceProvider);
  return TrainingRepositoryImpl(service);
});

final trainingsControllerProvider = StateNotifierProvider.family<
    TrainingsController, TrainingsState, String>((ref, userId) {
  final repo = ref.watch(trainingRepositoryProvider);
  return TrainingsController(repo, userId: userId);
});

final firebaseAuthProvider = Provider((ref) => FirebaseAuth.instance);
final firestoreProvider = Provider((ref) => FirebaseFirestore.instance);
final functionsProvider = Provider((ref) => FirebaseFunctions.instance);
*/