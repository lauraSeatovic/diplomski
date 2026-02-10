import auth from "@react-native-firebase/auth";

export const firebaseAuthApi = {
  async signIn(email: string, password: string): Promise<void> {
    await auth().signInWithEmailAndPassword(email.trim(), password);
  },

  async signOut(): Promise<void> {
    await auth().signOut();
  },

  getCurrentUserId(): string | null {
    return auth().currentUser?.uid ?? null;
  },
};

