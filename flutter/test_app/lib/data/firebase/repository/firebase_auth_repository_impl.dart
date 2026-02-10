
import '../../../domain/model/user_role.dart';
import '../../../domain/repository/auth_repository.dart';
import '../network/service/auth_service.dart';
import '../network/service/role_service.dart';

class FirebaseAuthRepositoryImpl implements AuthRepository {
  final FirebaseAuthService firebaseAuthService;
  final FirebaseRoleService firebaseRoleService;

  FirebaseAuthRepositoryImpl(
      this.firebaseAuthService,
      this.firebaseRoleService,
      );

  @override
  Future<void> signIn(String email, String password) async {
    await firebaseAuthService.signIn(email, password);
  }

  @override
  Future<void> signOut() async {
    firebaseAuthService.signOut();
  }

  @override
  String? currentUserId() {
    return firebaseAuthService.currentUserId();
  }

  @override
  Future<UserRole> getUserRole() async {
    final uid = currentUserId();
    if (uid == null) {
      throw StateError('Korisnik nije prijavljen.');
    }
    return firebaseRoleService.getUserRole(uid);
  }
}