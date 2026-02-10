import { AuthRepository, UserRole } from "../../../domain/repository/AuthRepository";
import { firebaseAuthApi } from "../services/firebaseAuthService";
import { firebaseRoleApi } from "../services/firebaseRoleService";


export class AuthRepositoryFirebase implements AuthRepository {
  async signIn(email: string, password: string): Promise<void> {
    await firebaseAuthApi.signIn(email, password);
  }

  async signOut(): Promise<void> {
    await firebaseAuthApi.signOut();
  }

  async getCurrentUserId(): Promise<string | null> {
    return firebaseAuthApi.getCurrentUserId();
  }

  async getUserRole(userId: string): Promise<UserRole> {
    return firebaseRoleApi.getUserRole(userId);
  }
}
