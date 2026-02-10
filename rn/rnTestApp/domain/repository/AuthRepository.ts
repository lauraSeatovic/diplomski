export type UserRole = "TRENER" | "SPORTAS";

export interface AuthRepository {
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  getUserRole(userId: string): Promise<UserRole>;
}
