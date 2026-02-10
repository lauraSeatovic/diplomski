import firestore from "@react-native-firebase/firestore";
import { UserRole } from "../../../domain/repository/AuthRepository";

export const firebaseRoleApi = {
    async getUserRole(userId: string): Promise<UserRole> {
    const snap = await firestore()
      .collection("korisnici")
      .doc(userId)
      .get();

    if (!snap.exists) {
      throw new Error("Korisnik ne postoji u bazi.");
    }

    const data = snap.data() ?? {};

    const jeSportas = (data as any).jeSportas === true;
    const jeTrener = (data as any).jeTrener === true;

    if (jeSportas) return "SPORTAS";
    if (jeTrener) return "TRENER";

    throw new Error("Uloga korisnika nije definirana.");
  },
};
