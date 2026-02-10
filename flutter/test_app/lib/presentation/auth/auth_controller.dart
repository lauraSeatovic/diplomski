import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/repository/auth_repository.dart';
import 'auth_state.dart';

class AuthController extends StateNotifier<AuthState> {
  final AuthRepository authRepo;

  AuthController(this.authRepo) : super(AuthState.initial());

  Future<void> signIn(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      await authRepo.signIn(email, password);

      final userId = authRepo.currentUserId();
      final role = await authRepo.getUserRole();

      state = state.copyWith(
        isLoading: false,
        userId: userId,
        role: role,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> signOut() async {
    await authRepo.signOut();
    state = AuthState.initial();
  }
}
