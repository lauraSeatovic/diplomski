

import '../../data/supabase/network/service/supabase_auth_service.dart';
import '../model/user_role.dart';

abstract class AuthRepository {
  Future<void> signIn(String email, String password);

  Future<void> signOut();

  String? currentUserId();

  Future<UserRole> getUserRole();
}
