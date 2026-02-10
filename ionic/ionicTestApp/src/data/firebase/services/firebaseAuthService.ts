import { signInWithEmailAndPassword, signOut, getAuth } from "firebase/auth";
import { auth } from "./firebaseConfig";


export const firebaseAuthApi = {
  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  getCurrentUserId(): string | null {
    return auth.currentUser?.uid ?? null;
  },
};
