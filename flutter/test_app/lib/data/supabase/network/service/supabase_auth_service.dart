import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../../domain/model/user_role.dart';


class SupabaseAuthService {
  final SupabaseClient client;
  SupabaseAuthService(this.client);

  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    final res = await client.auth.signInWithPassword(
      email: email,
      password: password,
    );

    if (res.user == null) {
      throw AuthException('Login failed: user is null');
    }
  }

  Future<void> signOut() async {
    await client.auth.signOut();
  }

  String? currentUserId() => client.auth.currentUser?.id;

  Future<UserRole> getCurrentUserRole() async {
    final userId = currentUserId();
    if (userId == null) return UserRole.SPORTAS;
    final trenerRow = await client
        .from('Trener')
        .select('IdKorisnika')
        .eq('IdKorisnika', userId)
        .maybeSingle();

    if (trenerRow != null) return UserRole.TRENER;

    final sportasRow = await client
        .from('Sportas')
        .select('IdKorisnika')
        .eq('IdKorisnika', userId)
        .maybeSingle();

    if (sportasRow != null) return UserRole.SPORTAS;

    return UserRole.SPORTAS;  }
}
