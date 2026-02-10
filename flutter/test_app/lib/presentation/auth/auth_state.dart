import '../../domain/model/user_role.dart';

class AuthState {
  final bool isLoading;
  final String? userId;
  final UserRole? role;
  final String? error;

  const AuthState({
    required this.isLoading,
    this.userId,
    this.role,
    this.error,
  });

  factory AuthState.initial() => const AuthState(isLoading: false);

  AuthState copyWith({
    bool? isLoading,
    String? userId,
    UserRole? role,
    String? error,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      userId: userId ?? this.userId,
      role: role ?? this.role,
      error: error,
    );
  }
}
