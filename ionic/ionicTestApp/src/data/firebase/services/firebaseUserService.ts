import { doc, getDoc } from "firebase/firestore";
import { FirestoreKorisnikDto } from "../dtos/firebaseDtos";

import { auth, db } from "./firebaseConfig";
export const firebaseUserApi = {
    async getKorisnikById(id: string): Promise<FirestoreKorisnikDto | null> {
    const ref = doc(db, "korisnici", id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data() ?? {};

    const sportasRaw = (data as any).sportas;
    const trenerRaw = (data as any).trener;

    return {
      id: snap.id,
      ime: String((data as any).ime ?? ""),
      prezime: String((data as any).prezime ?? ""),
      jeSportas: (data as any).jeSportas === true,
      jeTrener: (data as any).jeTrener === true,

      sportas:
        sportasRaw && typeof sportasRaw === "object"
          ? {
              datumRodenja: (sportasRaw as any).datumRodenja ?? null,
              tipClanarine:
                (sportasRaw as any).tipClanarine != null
                  ? String((sportasRaw as any).tipClanarine)
                  : null,
            }
          : null,

      trener:
        trenerRaw && typeof trenerRaw === "object"
          ? {
              opisTrenera:
                (trenerRaw as any).opisTrenera != null
                  ? String((trenerRaw as any).opisTrenera)
                  : null,
              kontaktTrenera:
                (trenerRaw as any).kontaktTrenera != null
                  ? String((trenerRaw as any).kontaktTrenera)
                  : null,
            }
          : null,
    };
  },

    getCurrentUserId(): string | null {
    return auth.currentUser?.uid ?? null;
  },
};
