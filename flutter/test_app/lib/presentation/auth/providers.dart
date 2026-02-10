
/*
import 'package:flutter_riverpod/flutter_riverpod.dart';


import '../../data/supabase/network/service/supabase_auth_service.dart';
import '../../data/supabase/repository/auth_repository_impl.dart';
import '../../domain/repository/auth_repository.dart';
import '../profile/providers.dart';
import 'auth_controller.dart';
import 'auth_state.dart';

final authServiceProvider = Provider<SupabaseAuthService>((ref) {
  return SupabaseAuthService(ref.watch(supabaseClientProvider));
});

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(ref.watch(authServiceProvider));
});

final authControllerProvider =
StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref.watch(authRepositoryProvider));
});

 */