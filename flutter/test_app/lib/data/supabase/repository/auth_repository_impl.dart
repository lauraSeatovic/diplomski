
import '../../../domain/model/user_role.dart';
import '../../../domain/repository/auth_repository.dart';
import '../network/service/supabase_auth_service.dart';

class AuthRepositoryImpl implements AuthRepository {
  final SupabaseAuthService supabaseAuthService;

  AuthRepositoryImpl(this.supabaseAuthService);

  @override
  Future<void> signIn(String email, String password) async {
    await supabaseAuthService.signIn(
      email: email,
      password: password,
    );
  }

  @override
  Future<void> signOut() async {
    await supabaseAuthService.signOut();
  }

  @override
  String? currentUserId() {
    return supabaseAuthService.currentUserId();
  }

  @override
  Future<UserRole> getUserRole() async {
    return await supabaseAuthService.getCurrentUserRole();
  }
}
