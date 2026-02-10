

import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart' hide AuthState;

import 'package:test_app/domain/repository/auth_repository.dart';
import 'package:test_app/domain/repository/training_repository.dart';
import 'package:test_app/domain/repository/user_repository.dart';

import 'package:test_app/data/supabase/network/service/supabase_auth_service.dart' as sb;
import 'package:test_app/data/supabase/network/service/user_service.dart' as sb;
import 'package:test_app/data/supabase/network/service/training_service.dart' as sb;

import 'package:test_app/data/supabase/repository/auth_repository_impl.dart' as sb;
import 'package:test_app/data/supabase/repository/user_repository_impl.dart' as sb;
import 'package:test_app/data/supabase/repository/training_repository_impl.dart' as sb;

import 'package:test_app/data/firebase/network/service/auth_service.dart' as fb;
import 'package:test_app/data/firebase/network/service/role_service.dart' as fb;
import 'package:test_app/data/firebase/network/service/user_service.dart' as fb;
import 'package:test_app/data/firebase/network/service/training_service.dart' as fb;

import 'package:test_app/data/firebase/repository/firebase_auth_repository_impl.dart' as fb;
import 'package:test_app/data/firebase/repository/user_repository_impl.dart' as fb;
import 'package:test_app/data/firebase/repository/firebase_training_repository_impl.dart' as fb;

import 'package:test_app/presentation/auth/auth_controller.dart';
import 'package:test_app/presentation/auth/auth_state.dart';

import 'package:test_app/presentation/profile/profile_controller.dart';
import 'package:test_app/presentation/profile/profile_state.dart';

import 'package:test_app/presentation/trainings/trainings_controller.dart';
import 'package:test_app/presentation/trainings/training_state.dart';


enum BackendType { supabase, firebase }

final backendTypeProvider = Provider<BackendType>((ref) {
  return BackendType.firebase;
});


final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return Supabase.instance.client;
});


final firebaseAuthProvider = Provider<FirebaseAuth>((ref) => FirebaseAuth.instance);

final firestoreProvider = Provider<FirebaseFirestore>((ref) => FirebaseFirestore.instance);

final functionsProvider = Provider<FirebaseFunctions>((ref) {
  return FirebaseFunctions.instance;
});



final supabaseAuthServiceProvider = Provider<sb.SupabaseAuthService>((ref) {
  return sb.SupabaseAuthService(ref.watch(supabaseClientProvider));
});

final supabaseUserServiceProvider = Provider<sb.UserService>((ref) {
  return sb.UserService(ref.watch(supabaseClientProvider));
});

final supabaseTrainingServiceProvider = Provider<sb.TrainingService>((ref) {
  return sb.TrainingService(ref.watch(supabaseClientProvider));
});

final firebaseAuthServiceProvider = Provider<fb.FirebaseAuthService>((ref) {
  return fb.FirebaseAuthService(ref.watch(firebaseAuthProvider));
});

final firebaseRoleServiceProvider = Provider<fb.FirebaseRoleService>((ref) {
  return fb.FirebaseRoleService(firestore: ref.watch(firestoreProvider));
});

final firebaseUserServiceProvider = Provider<fb.FirebaseUserService>((ref) {
  return fb.FirebaseUserService(
    firestore: ref.watch(firestoreProvider),
    auth: ref.watch(firebaseAuthProvider),
  );
});

final firebaseTrainingServiceProvider = Provider<fb.FirebaseTrainingService>((ref) {
  return fb.FirebaseTrainingService(
    functions: ref.watch(functionsProvider),
    firestore: ref.watch(firestoreProvider),
  );
});



final supabaseAuthRepositoryImplProvider = Provider<sb.AuthRepositoryImpl>((ref) {
  return sb.AuthRepositoryImpl(ref.watch(supabaseAuthServiceProvider));
});

final supabaseUserRepositoryImplProvider = Provider<sb.UserRepositoryImpl>((ref) {
  return sb.UserRepositoryImpl(ref.watch(supabaseUserServiceProvider));
});

final supabaseTrainingRepositoryImplProvider = Provider<sb.TrainingRepositoryImpl>((ref) {
  return sb.TrainingRepositoryImpl(ref.watch(supabaseTrainingServiceProvider));
});

final firebaseAuthRepositoryImplProvider = Provider<fb.FirebaseAuthRepositoryImpl>((ref) {
  return fb.FirebaseAuthRepositoryImpl(
    ref.watch(firebaseAuthServiceProvider),
    ref.watch(firebaseRoleServiceProvider),
  );
});

final firebaseUserRepositoryImplProvider = Provider<fb.FirebaseUserRepositoryImpl>((ref) {
  return fb.FirebaseUserRepositoryImpl(ref.watch(firebaseUserServiceProvider));
});

final firebaseTrainingRepositoryImplProvider = Provider<fb.FirebaseTrainingRepositoryImpl>((ref) {
  return fb.FirebaseTrainingRepositoryImpl(ref.watch(firebaseTrainingServiceProvider));
});



final authRepositoryProvider = Provider<AuthRepository>((ref) {
  final backend = ref.watch(backendTypeProvider);
  switch (backend) {
    case BackendType.firebase:
      return ref.watch(firebaseAuthRepositoryImplProvider);
    case BackendType.supabase:
      return ref.watch(supabaseAuthRepositoryImplProvider);
  }
});

final userRepositoryProvider = Provider<UserRepository>((ref) {
  final backend = ref.watch(backendTypeProvider);
  switch (backend) {
    case BackendType.firebase:
      return ref.watch(firebaseUserRepositoryImplProvider);
    case BackendType.supabase:
      return ref.watch(supabaseUserRepositoryImplProvider);
  }
});

final trainingRepositoryProvider = Provider<TrainingRepository>((ref) {
  final backend = ref.watch(backendTypeProvider);
  switch (backend) {
    case BackendType.firebase:
      return ref.watch(firebaseTrainingRepositoryImplProvider);
    case BackendType.supabase:
      return ref.watch(supabaseTrainingRepositoryImplProvider);
  }
});



final authControllerProvider =
StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref.watch(authRepositoryProvider));
});

final profileControllerProvider =
StateNotifierProvider<ProfileController, ProfileState>((ref) {
  final userRepo = ref.watch(userRepositoryProvider);
  final trainingRepo = ref.watch(trainingRepositoryProvider);
  return ProfileController(userRepo, trainingRepo);
});

final trainingsControllerProvider =
StateNotifierProvider.family<TrainingsController, TrainingsState, String>(
        (ref, userId) {
      final repo = ref.watch(trainingRepositoryProvider);
      return TrainingsController(repo, userId: userId);
    });
