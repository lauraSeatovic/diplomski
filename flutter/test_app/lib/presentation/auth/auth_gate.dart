import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/auth/providers.dart';
import 'package:test_app/presentation/auth/sportas_home_shell.dart';
import 'package:test_app/presentation/auth/trainer_home_shell.dart';

import '../../domain/model/user_role.dart';
import '../../providers.dart';
import '../profile/providers.dart';import 'login_screen.dart';

class AuthGate extends ConsumerWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authControllerProvider);

    if (authState.userId == null || authState.role == null) {
      return const LoginScreen();
    }

    if (authState.role == UserRole.SPORTAS) {
      return SportasHomeShell(userId: authState.userId!);
    } else {
      return TrainerHomeShell(userId: authState.userId!);
    }
  }
}
