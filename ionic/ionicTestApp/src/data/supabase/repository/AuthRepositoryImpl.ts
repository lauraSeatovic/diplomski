import { AuthRepository, UserRole } from "../../../domain/repository/AuthRepository";
import { authApi } from "../services/authApi";


export class AuthRepositoryImpl implements AuthRepository {
  async signIn(email: string, password: string): Promise<void> {
    await authApi.signIn(email, password);
  }

  async signOut(): Promise<void> {
    await authApi.signOut();
  }

  async getCurrentUserId(): Promise<string | null> {
    return await authApi.getCurrentUserId();
  }

  async getUserRole(userId: string): Promise<UserRole> {
    return await authApi.getCurrentUserRole(userId);
  }
}
