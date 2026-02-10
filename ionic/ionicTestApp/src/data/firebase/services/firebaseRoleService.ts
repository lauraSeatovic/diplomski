import { getDoc, doc } from "firebase/firestore";
import { UserRole } from "../../../domain/repository/AuthRepository";
import { db } from "./firebaseConfig";

export const firebaseRoleApi = {
    async getUserRole(userId: string): Promise<UserRole> {
    const snap = await getDoc(doc(db, "korisnici", userId));

    if (!snap.exists()) {
      throw new Error("Korisnik ne postoji u bazi.");
    }

    const data = snap.data() as any;

    const jeSportas = data.jeSportas === true;
    const jeTrener = data.jeTrener === true;

    if (jeSportas) return "SPORTAS";
    if (jeTrener) return "TRENER";

    throw new Error("Uloga korisnika nije definirana.");
  },
};
