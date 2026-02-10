import * as admin from "firebase-admin";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

admin.initializeApp();
const db = admin.firestore();

const COL = {
  teretane: "teretane",
  vrsteTreninga: "vrsteTreninga",
  korisnici: "korisnici",
  treninzi: "treninzi",
  rasporedi: "rasporedi",
  dvorane: "dvorane",   prijave: "prijave", } as const;

type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message?: string };

const ok = <T,>(data: T): ApiResponse<T> => ({ ok: true, data });
const fail = (code: string, message?: string): ApiResponse<never> => ({
  ok: false,
  code,
  message,
});

function requireAuth(req: any): string {
  const uid = req.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Korisnik nije prijavljen.");
  return uid;
}

function asString(v: any, name: string): string {
  const s = String(v ?? "").trim();
  if (!s) throw new HttpsError("invalid-argument", `Nedostaje ${name}.`);
  return s;
}

function toDateFromIsoOrTs(v: any, name: string): Date {
  if (!v) throw new HttpsError("invalid-argument", `Nedostaje ${name}.`);

    if (typeof v === "string") {
    const d = new Date(v);
    if (isNaN(d.getTime()))
      throw new HttpsError("invalid-argument", `Neispravan ${name}.`);
    return d;
  }

    if (typeof v?.toDate === "function") return v.toDate();

    if (typeof v === "object") {
    const seconds =
      typeof v.seconds === "number"
        ? v.seconds
        : typeof v._seconds === "number"
        ? v._seconds
        : null;
    const nanos =
      typeof v.nanoseconds === "number"
        ? v.nanoseconds
        : typeof v._nanoseconds === "number"
        ? v._nanoseconds
        : 0;

    if (seconds != null) {
      const ms = seconds * 1000 + Math.floor(nanos / 1e6);
      const d = new Date(ms);
      if (!isNaN(d.getTime())) return d;
    }
  }

  throw new HttpsError("invalid-argument", `Neispravan ${name}.`);
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function dvoranaRef(teretanaId: string, dvoranaId: string) {
  return db.collection(COL.teretane).doc(teretanaId).collection(COL.dvorane).doc(dvoranaId);
}

async function resolveTeretanaIdFromDvoranaId(dvoranaId: string): Promise<string | null> {
    const qs = await db.collectionGroup(COL.dvorane).get();
  if (qs.empty) return null;

    const matches = qs.docs.filter((d) => d.id === dvoranaId);

  if (matches.length === 0) return null;
  if (matches.length > 1) {
        throw new HttpsError(
      "failed-precondition",
      "dvoranaId nije jedinstven (pronađeno više dvorana s istim ID-jem)."
    );
  }

    const ref = matches[0].ref;
  const parentTeretana = ref.parent.parent;
  return parentTeretana?.id ?? null;
}

export const get_user_role = onCall(async (req) => {
  const uid = requireAuth(req);

  const userSnap = await db.collection(COL.korisnici).doc(uid).get();
  if (!userSnap.exists) return fail("USER_NOT_FOUND", "Korisnik ne postoji.");

  const jeSportas = Boolean(userSnap.get("jeSportas"));
  const jeTrener = Boolean(userSnap.get("jeTrener"));

  if (jeSportas && !jeTrener) return ok({ userId: uid, role: "SPORTAS" as const });
  if (jeTrener && !jeSportas) return ok({ userId: uid, role: "TRENER" as const });

  return fail("ROLE_INVALID", "Uloga korisnika nije jednoznačno određena.");
});

export const signup_for_training = onCall(async (req) => {
  const uid = requireAuth(req);   const rasporedId = asString(req.data?.rasporedId, "rasporedId");

  const raspRef = db.collection(COL.rasporedi).doc(rasporedId);
  const prijavaDocId = `${uid}_${rasporedId}`;
  const prijRef = raspRef.collection(COL.prijave).doc(prijavaDocId);

  try {
    const result = await db.runTransaction(async (tx) => {
      const raspSnap = await tx.get(raspRef);
      if (!raspSnap.exists) throw new HttpsError("not-found", "Termin ne postoji.");

      const max = Number(raspSnap.get("maksBrojSportasa") ?? 0);
      const count = Number(raspSnap.get("brojPrijava") ?? 0);

      if (!Number.isFinite(max) || max <= 0) {
        throw new HttpsError("failed-precondition", "Neispravan kapacitet termina.");
      }

      const existing = await tx.get(prijRef);
      if (existing.exists) return { outcome: "USER_ALREADY_SIGNED" as const };

      if (count >= max) return { outcome: "TRAINING_FULL" as const };

      tx.set(prijRef, {
        sportasId: uid,
        dolazakNaTrening: false,
        ocjenaTreninga: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      tx.update(raspRef, {
        brojPrijava: admin.firestore.FieldValue.increment(1),
      });

      return { outcome: "SUCCESS" as const };
    });

    return ok({ result: result.outcome });
  } catch (e: any) {
    if (e instanceof HttpsError) return fail("ERROR", e.message);
    return fail("ERROR", e?.message ?? "Dogodila se greška prilikom prijave.");
  }
});

export const trainer_trainings = onCall(async (req) => {
  const uid = requireAuth(req); 
  const qs = await db
    .collection(COL.rasporedi)
    .where("trenerId", "==", uid)
    .orderBy("pocetakVrijeme", "desc")
    .limit(200)
    .get();

  const trenerSnap = await db.collection(COL.korisnici).doc(uid).get();
  const trenerIme = trenerSnap.get("ime") ?? "";
  const trenerPrezime = trenerSnap.get("prezime") ?? "";

  const items = await Promise.all(
    qs.docs.map(async (d) => {
      const rasporedId = d.id;
      const treningId = d.get("treningId") as string;

      const treningSnap = await db.collection(COL.treninzi).doc(treningId).get();
      if (!treningSnap.exists) {
        return {
          rasporedId,
          treningId,
          pocetakVrijeme: d.get("pocetakVrijeme"),
          zavrsetakVrijeme: d.get("zavrsetakVrijeme"),
          datum: d.get("datum"),
          brojPrijava: Number(d.get("brojPrijava") ?? 0),
          maksBrojSportasa: Number(d.get("maksBrojSportasa") ?? 0),
          vrstaTreningaNaziv: "",
          teretanaNaziv: "",
          dvoranaNaziv: "",
          trenerIme,
          trenerPrezime,
        };
      }

      const dvoranaId = treningSnap.get("dvoranaId") as string;
      const vrstaId = treningSnap.get("vrstaTreningaId") as string;

      const teretanaId =
        (d.get("teretanaId") as string) ||
        (treningSnap.get("teretanaId") as string) ||
        "";

      const [teretanaSnap, vrstaSnap, dvoranaSnap] = await Promise.all([
        teretanaId ? db.collection(COL.teretane).doc(teretanaId).get() : Promise.resolve(null as any),
        db.collection(COL.vrsteTreninga).doc(vrstaId).get(),
        teretanaId ? dvoranaRef(teretanaId, dvoranaId).get() : Promise.resolve(null as any),
      ]);

      return {
        rasporedId,
        treningId,
        pocetakVrijeme: d.get("pocetakVrijeme"),
        zavrsetakVrijeme: d.get("zavrsetakVrijeme"),
        datum: d.get("datum"),
        brojPrijava: Number(d.get("brojPrijava") ?? 0),
        maksBrojSportasa: Number(d.get("maksBrojSportasa") ?? 0),

        vrstaTreningaNaziv: vrstaSnap.get("nazivVrTreninga") ?? "",
        teretanaNaziv: teretanaSnap?.get?.("nazivTeretane") ?? "",
        dvoranaNaziv: dvoranaSnap?.get?.("nazivDvorane") ?? "",
        trenerIme,
        trenerPrezime,
      };
    })
  );

  return ok({ items });
});

export const delete_raspored_with_prijave = onCall(async (req) => {
  const uid = requireAuth(req);
  const rasporedId = asString(req.data?.rasporedId, "rasporedId");

  const raspRef = db.collection(COL.rasporedi).doc(rasporedId);
  const rasp = await raspRef.get();
  if (!rasp.exists) return fail("NOT_FOUND", "Termin ne postoji.");
  if (rasp.get("trenerId") !== uid) return fail("FORBIDDEN", "Nemaš pravo brisati ovaj termin.");

  const prijaveQs = await raspRef.collection(COL.prijave).get();

    const batch = db.batch();
  prijaveQs.docs.forEach((p) => batch.delete(p.ref));
  batch.delete(raspRef);
  await batch.commit();

  return ok({ deleted: true, deletedPrijave: prijaveQs.size });
});

export const attendees_by_raspored = onCall(async (req) => {
  const uid = requireAuth(req);
  const rasporedId = asString(req.data?.rasporedId, "rasporedId");

  const raspRef = db.collection(COL.rasporedi).doc(rasporedId);
  const rasp = await raspRef.get();
  if (!rasp.exists) return fail("NOT_FOUND", "Termin ne postoji.");
  if (rasp.get("trenerId") !== uid) return fail("FORBIDDEN", "Nemaš pravo pristupa.");

  const prijaveQs = await raspRef.collection(COL.prijave).get();
  const sportasIds = prijaveQs.docs
    .map((d) => (d.get("sportasId") as string) || "")
    .filter(Boolean);

  const sportasi = await Promise.all(
    sportasIds.map(async (id) => {
      const u = await db.collection(COL.korisnici).doc(id).get();
      return { id, ime: u.get("ime") ?? "", prezime: u.get("prezime") ?? "" };
    })
  );

  const byId = new Map(sportasi.map((s) => [s.id, s]));

  const items = prijaveQs.docs.map((d) => {
    const sportasId = d.get("sportasId") as string;
    const s = byId.get(sportasId);
    return {
      prijavaDocId: d.id,
      sportasId,
      ime: s?.ime ?? "",
      prezime: s?.prezime ?? "",
      dolazakNaTrening: Boolean(d.get("dolazakNaTrening") ?? false),
    };
  });

  return ok({ items });
});

export const set_attendance_for_raspored = onCall(async (req) => {
  const uid = requireAuth(req);
  const rasporedId = asString(req.data?.rasporedId, "rasporedId");
  const attendance = req.data?.attendance as Array<{ sportasId: string; present: boolean }>;

  if (!Array.isArray(attendance)) return fail("INVALID_ARGUMENT", "Nedostaje lista prisutnosti.");

  const raspRef = db.collection(COL.rasporedi).doc(rasporedId);
  const rasp = await raspRef.get();
  if (!rasp.exists) return fail("NOT_FOUND", "Termin ne postoji.");
  if (rasp.get("trenerId") !== uid) return fail("FORBIDDEN", "Nemaš pravo izmjene.");

  const batch = db.batch();
  let count = 0;

  for (const a of attendance) {
    const sportasId = String(a?.sportasId ?? "").trim();
    if (!sportasId) continue;

    const docId = `${sportasId}_${rasporedId}`;
    batch.update(raspRef.collection(COL.prijave).doc(docId), {
      dolazakNaTrening: !!a.present,
    });
    count++;
  }

  await batch.commit();
  return ok({ updated: true, count });
});

export const create_training = onCall(async (req) => {
  const _uid = requireAuth(req);

  const dvoranaId = asString(req.data?.dvoranaId, "dvoranaId");
  const useExistingVrsta = Boolean(req.data?.useExistingVrsta ?? true);
  const maks = Number(req.data?.maksBrojSportasa ?? 0);

  if (!Number.isFinite(maks) || maks <= 0) return fail("INVALID_ARGUMENT", "Neispravan kapacitet.");

    let teretanaId = String(req.data?.teretanaId ?? "").trim();
  if (!teretanaId) {
    teretanaId = (await resolveTeretanaIdFromDvoranaId(dvoranaId)) ?? "";
    if (!teretanaId) return fail("NOT_FOUND", "Nije pronađena teretana za odabranu dvoranu.");
  }

    const dvorSnap = await dvoranaRef(teretanaId, dvoranaId).get();
  if (!dvorSnap.exists) return fail("NOT_FOUND", "Dvorana ne postoji.");

  const vrstaId = req.data?.vrstaId ? String(req.data.vrstaId) : null;
  const novaVrstaNaziv = req.data?.novaVrstaNaziv ? String(req.data.novaVrstaNaziv).trim() : null;
  const novaVrstaTezina = req.data?.novaVrstaTezina != null ? Number(req.data.novaVrstaTezina) : null;

  const created = await db.runTransaction(async (tx) => {
    let finalVrstaId: string;

    if (useExistingVrsta) {
      if (!vrstaId) throw new HttpsError("invalid-argument", "Nedostaje vrstaId.");
      const vRef = db.collection(COL.vrsteTreninga).doc(vrstaId);
      const v = await tx.get(vRef);
      if (!v.exists) throw new HttpsError("not-found", "Vrsta treninga ne postoji.");
      finalVrstaId = vrstaId;
    } else {
      if (!novaVrstaNaziv || novaVrstaTezina == null || !Number.isFinite(novaVrstaTezina)) {
        throw new HttpsError("invalid-argument", "Neispravan unos nove vrste.");
      }
      const newVrstaRef = db.collection(COL.vrsteTreninga).doc();
      tx.set(newVrstaRef, { nazivVrTreninga: novaVrstaNaziv, tezina: novaVrstaTezina });
      finalVrstaId = newVrstaRef.id;
    }

    const treningRef = db.collection(COL.treninzi).doc();
    tx.set(treningRef, {
      teretanaId,
      dvoranaId,
      vrstaTreningaId: finalVrstaId,
      laksiTreningId: null,
      teziTreningId: null,
      maksBrojSportasa: maks,
    });

    return { treningId: treningRef.id, vrstaTreningaId: finalVrstaId, teretanaId };
  });

  return ok(created);
});

export const create_raspored = onCall(async (req) => {
  const uid = requireAuth(req); 
  const treningId = asString(req.data?.treningId, "treningId");
  const pocetak = toDateFromIsoOrTs(req.data?.pocetak, "pocetak");
  const zavrsetak = toDateFromIsoOrTs(req.data?.zavrsetak, "zavrsetak");

  if (zavrsetak.getTime() <= pocetak.getTime()) {
    return fail("INVALID_ARGUMENT", "Završetak mora biti nakon početka.");
  }

  const trSnap = await db.collection(COL.treninzi).doc(treningId).get();
  if (!trSnap.exists) return fail("NOT_FOUND", "Trening ne postoji.");

  const maks = Number(trSnap.get("maksBrojSportasa") ?? 0);
  if (!Number.isFinite(maks) || maks <= 0) {
    return fail("INVALID_ARGUMENT", "Neispravan kapacitet treninga.");
  }

  const dvoranaId = trSnap.get("dvoranaId") as string | undefined;
  if (!dvoranaId) return fail("INVALID_ARGUMENT", "Trening nema dvoranaId.");

  const teretanaId = trSnap.get("teretanaId") as string | undefined;
  if (!teretanaId) {
    return fail("INVALID_ARGUMENT", "Trening nema teretanaId (potrebno zbog dvorana subcollection).");
  }

  const dvorSnap = await dvoranaRef(teretanaId, dvoranaId).get();
  if (!dvorSnap.exists) return fail("NOT_FOUND", "Dvorana ne postoji pod teretanom treninga.");

  const doc = await db.collection(COL.rasporedi).add({
    treningId,
    trenerId: uid,
    teretanaId,

    pocetakVrijeme: admin.firestore.Timestamp.fromDate(pocetak),
    zavrsetakVrijeme: admin.firestore.Timestamp.fromDate(zavrsetak),

    datum: ymd(pocetak),
    maksBrojSportasa: maks,
    brojPrijava: 0,
  });

  return ok({ rasporedId: doc.id, teretanaId });
});

export const trainings_by_gym_date = onCall(async (req) => {
  logger.info("[trainings_by_gym_date] called", { uid: req.auth?.uid, data: req.data });

  const _uid = requireAuth(req);
  const teretanaId = asString(req.data?.teretanaId, "teretanaId");
  const dateRaw = req.data?.date;

  let dateStr: string;
  if (typeof dateRaw === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateRaw)) {
    dateStr = dateRaw;
  } else {
    const d = toDateFromIsoOrTs(dateRaw, "date");
    dateStr = ymd(d);
  }

  const qs = await db
    .collection(COL.rasporedi)
    .where("teretanaId", "==", teretanaId)
    .where("datum", "==", dateStr)
    .orderBy("pocetakVrijeme", "asc")
    .limit(200)
    .get();

  const teretanaSnap = await db.collection(COL.teretane).doc(teretanaId).get();
  const teretanaNaziv = teretanaSnap.exists ? teretanaSnap.get("nazivTeretane") ?? "" : "";

  const items = await Promise.all(
    qs.docs.map(async (d) => {
      const rasporedId = d.id;
      const treningId = d.get("treningId") as string;
      const trenerId = d.get("trenerId") as string;

      const treningSnap = await db.collection(COL.treninzi).doc(treningId).get();
      if (!treningSnap.exists) {
        return {
          rasporedId,
          treningId,
          pocetakVrijeme: d.get("pocetakVrijeme"),
          zavrsetakVrijeme: d.get("zavrsetakVrijeme"),
          nazivTeretane: teretanaNaziv,
          nazivDvorane: "",
          nazivVrsteTreninga: "",
          tezina: 0,
          trenerIme: "",
          trenerPrezime: "",
          trenutnoPrijavljenih: Number(d.get("brojPrijava") ?? 0),
          maxBrojSportasa: Number(d.get("maksBrojSportasa") ?? 0),
          isFull: false,
        };
      }

      const dvoranaId = treningSnap.get("dvoranaId") as string;
      const vrstaId = treningSnap.get("vrstaTreningaId") as string;

      const [dvoranaSnap, vrstaSnap, trenerSnap] = await Promise.all([
        dvoranaRef(teretanaId, dvoranaId).get(),
        db.collection(COL.vrsteTreninga).doc(vrstaId).get(),
        db.collection(COL.korisnici).doc(trenerId).get(),
      ]);

      const max = Number(d.get("maksBrojSportasa") ?? 0);
      const count = Number(d.get("brojPrijava") ?? 0);

      return {
        rasporedId,
        treningId,
        pocetakVrijeme: d.get("pocetakVrijeme"),
        zavrsetakVrijeme: d.get("zavrsetakVrijeme"),

        nazivTeretane: teretanaNaziv,
        nazivDvorane: dvoranaSnap.exists ? dvoranaSnap.get("nazivDvorane") ?? "" : "",
        nazivVrsteTreninga: vrstaSnap.exists ? vrstaSnap.get("nazivVrTreninga") ?? "" : "",
        tezina: vrstaSnap.exists ? Number(vrstaSnap.get("tezina") ?? 0) : 0,

        trenerIme: trenerSnap.exists ? trenerSnap.get("ime") ?? "" : "",
        trenerPrezime: trenerSnap.exists ? trenerSnap.get("prezime") ?? "" : "",

        trenutnoPrijavljenih: count,
        maxBrojSportasa: max,
        isFull: max > 0 ? count >= max : false,
      };
    })
  );

  return ok({ items });
});

export const training_details = onCall(async (req) => {
  const _uid = requireAuth(req);

  const treningId = asString(req.data?.treningId, "treningId");
  const rasporedId = asString(req.data?.rasporedId, "rasporedId");

  const raspSnap = await db.collection(COL.rasporedi).doc(rasporedId).get();
  if (!raspSnap.exists) return fail("NOT_FOUND", "Termin ne postoji.");
  if (raspSnap.get("treningId") !== treningId) {
    return fail("MISMATCH", "Neusklađen treningId i rasporedId.");
  }

  const trSnap = await db.collection(COL.treninzi).doc(treningId).get();
  if (!trSnap.exists) return fail("NOT_FOUND", "Trening ne postoji.");

  const dvoranaId = trSnap.get("dvoranaId") as string;
  const vrstaId = trSnap.get("vrstaTreningaId") as string;

  const teretanaId = (raspSnap.get("teretanaId") as string) || (trSnap.get("teretanaId") as string);
  if (!teretanaId) return fail("ERROR", "Nedostaje teretanaId.");

  const trenerId = raspSnap.get("trenerId") as string;

  const [teretanaSnap, dvoranaSnap, vrstaSnap, trenerSnap] = await Promise.all([
    db.collection(COL.teretane).doc(teretanaId).get(),
    dvoranaRef(teretanaId, dvoranaId).get(),
    db.collection(COL.vrsteTreninga).doc(vrstaId).get(),
    db.collection(COL.korisnici).doc(trenerId).get(),
  ]);

  const max = Number(raspSnap.get("maksBrojSportasa") ?? 0);
  const count = Number(raspSnap.get("brojPrijava") ?? 0);

  return ok({
    treningId,
    rasporedId,
    vrstaId,
    nazivVrste: vrstaSnap.exists ? vrstaSnap.get("nazivVrTreninga") ?? "" : "",
    tezina: vrstaSnap.exists ? Number(vrstaSnap.get("tezina") ?? 0) : 0,

    pocetakVrijeme: raspSnap.get("pocetakVrijeme"),
    zavrsetakVrijeme: raspSnap.get("zavrsetakVrijeme"),
    datum: raspSnap.get("datum"),

    teretanaId,
    teretanaNaziv: teretanaSnap.exists ? teretanaSnap.get("nazivTeretane") ?? "" : "",
    dvoranaId,
    dvoranaNaziv: dvoranaSnap.exists ? dvoranaSnap.get("nazivDvorane") ?? "" : "",

    trenerId,
    trenerIme: trenerSnap.exists ? trenerSnap.get("ime") ?? "" : "",
    trenerPrezime: trenerSnap.exists ? trenerSnap.get("prezime") ?? "" : "",

    trenutnoPrijavljenih: count,
    maxBrojSportasa: max,
    isFull: max > 0 ? count >= max : false,
  });
});

export const my_trainings = onCall(async (req) => {
  const uid = requireAuth(req); 
  const prijaveQs = await db
    .collectionGroup(COL.prijave)
    .where("sportasId", "==", uid)
    .limit(200)
    .get();

  const items = await Promise.all(
    prijaveQs.docs.map(async (p) => {
      const rasporedId = p.ref.parent.parent?.id;
      if (!rasporedId) return null;

      const rasp = await db.collection(COL.rasporedi).doc(rasporedId).get();
      if (!rasp.exists) return null;

      const treningId = rasp.get("treningId") as string;
      const tr = await db.collection(COL.treninzi).doc(treningId).get();
      if (!tr.exists) return null;

      const dvoranaId = tr.get("dvoranaId") as string;
      const vrstaId = tr.get("vrstaTreningaId") as string;

      const teretanaId = (rasp.get("teretanaId") as string) || (tr.get("teretanaId") as string);
      if (!teretanaId) return null;

      const [dvoranaSnap, teretanaSnap, vrstaSnap] = await Promise.all([
        dvoranaRef(teretanaId, dvoranaId).get(),
        db.collection(COL.teretane).doc(teretanaId).get(),
        db.collection(COL.vrsteTreninga).doc(vrstaId).get(),
      ]);

      return {
        rasporedId,
        treningId,
        naziv: vrstaSnap.exists ? vrstaSnap.get("nazivVrTreninga") ?? "" : "",
        pocetak: rasp.get("pocetakVrijeme"),
        kraj: rasp.get("zavrsetakVrijeme"),
        dvorana: dvoranaSnap.exists ? dvoranaSnap.get("nazivDvorane") ?? "" : "",
        teretana: teretanaSnap.exists ? teretanaSnap.get("nazivTeretane") ?? "" : "",
        dolazakNaTrening: Boolean(p.get("dolazakNaTrening") ?? false),
      };
    })
  );

  return ok({ items: items.filter(Boolean) });
});
