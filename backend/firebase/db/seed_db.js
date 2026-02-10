
const admin = require("firebase-admin");
const path = require("path");

const serviceAccount = require(path.join(__dirname, "serviceAccountKey.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

function ts(dateStr) {
  return admin.firestore.Timestamp.fromDate(new Date(dateStr));
}

async function seed() {
  const batch = db.batch();

        const TERETANE = { t1: "t1_v3", t2: "t2_v3" };
  const DVORANE = { d1: "d1_v3", d2: "d2_v3", d3: "d3_v3" };
  const VRSTE = { vt1: "vt1_v3", vt2: "vt2_v3", vt3: "vt3_v3" };
  const USERS = { jane: "user_jane_v3", marko: "user_marko_v3" };
  const TRENINZI = { tr1: "tr1_v3", tr2: "tr2_v3", tr3: "tr3_v3" };
  const RASPOREDI = { r1: "r1_v3", r2: "r2_v3", r3: "r3_v3" };

          batch.set(db.collection("teretane").doc(TERETANE.t1), {
    nazivTeretane: "Fit Gym Jarun",
    adresa: "Jarunska ulica 1",
    mjesto: "Zagreb",
  });

  batch.set(db.collection("teretane").doc(TERETANE.t2), {
    nazivTeretane: "Downtown Fitness",
    adresa: "Trg Bana 2",
    mjesto: "Zagreb",
  });

            batch.set(
    db.collection("teretane").doc(TERETANE.t1).collection("dvorane").doc(DVORANE.d1),
    { nazivDvorane: "Dvorana 1" }
  );

  batch.set(
    db.collection("teretane").doc(TERETANE.t1).collection("dvorane").doc(DVORANE.d2),
    { nazivDvorane: "Dvorana 2" }
  );

  batch.set(
    db.collection("teretane").doc(TERETANE.t2).collection("dvorane").doc(DVORANE.d3),
    { nazivDvorane: "Glavna dvorana" }
  );

          batch.set(db.collection("vrsteTreninga").doc(VRSTE.vt1), {
    nazivVrTreninga: "Kardio trening",
    tezina: 2,
  });

  batch.set(db.collection("vrsteTreninga").doc(VRSTE.vt2), {
    nazivVrTreninga: "Snaga – cijelo tijelo",
    tezina: 3,
  });

  batch.set(db.collection("vrsteTreninga").doc(VRSTE.vt3), {
    nazivVrTreninga: "Mobility & stretching",
    tezina: 1,
  });

            batch.set(db.collection("korisnici").doc(USERS.jane), {
    ime: "Jana",
    prezime: "Sportaš",
    jeSportas: true,
    jeTrener: false,
    sportas: {
      datumRodenja: ts("1998-05-10T00:00:00Z"),
      tipClanarine: "MJESEČNA",
    },
    trener: null,
  });

  batch.set(db.collection("korisnici").doc(USERS.marko), {
    ime: "Marko",
    prezime: "Trener",
    jeSportas: false,
    jeTrener: true,
    sportas: null,
    trener: {
      opisTrenera: "Specijalist za HIIT i funkcionalni trening.",
      kontaktTrenera: "marko.trener@example.com",
    },
  });

              batch.set(db.collection("treninzi").doc(TRENINZI.tr1), {
    teretanaId: TERETANE.t1,
    dvoranaId: DVORANE.d1,
    vrstaTreningaId: VRSTE.vt1,
    laksiTreningId: TRENINZI.tr3,
    teziTreningId: TRENINZI.tr2,
    maksBrojSportasa: 20,
  });

  batch.set(db.collection("treninzi").doc(TRENINZI.tr2), {
    teretanaId: TERETANE.t1,
    dvoranaId: DVORANE.d1,
    vrstaTreningaId: VRSTE.vt2,
    laksiTreningId: TRENINZI.tr1,
    teziTreningId: null,
    maksBrojSportasa: 15,
  });

  batch.set(db.collection("treninzi").doc(TRENINZI.tr3), {
    teretanaId: TERETANE.t1,
    dvoranaId: DVORANE.d2,
    vrstaTreningaId: VRSTE.vt3,
    laksiTreningId: null,
    teziTreningId: TRENINZI.tr1,
    maksBrojSportasa: 25,
  });

              batch.set(db.collection("rasporedi").doc(RASPOREDI.r1), {
    treningId: TRENINZI.tr1,
    trenerId: USERS.marko,
    teretanaId: TERETANE.t1,

    pocetakVrijeme: ts("2026-01-18T18:00:00Z"),
    zavrsetakVrijeme: ts("2026-01-18T19:00:00Z"),
    datum: "2026-01-18",

    maksBrojSportasa: 20,
    brojPrijava: 1,
  });

  batch.set(db.collection("rasporedi").doc(RASPOREDI.r2), {
    treningId: TRENINZI.tr2,
    trenerId: USERS.marko,
    teretanaId: TERETANE.t1,

    pocetakVrijeme: ts("2026-01-19T18:00:00Z"),
    zavrsetakVrijeme: ts("2026-01-19T19:00:00Z"),
    datum: "2026-01-19",

    maksBrojSportasa: 15,
    brojPrijava: 0,
  });

  batch.set(db.collection("rasporedi").doc(RASPOREDI.r3), {
    treningId: TRENINZI.tr3,
    trenerId: USERS.marko,
    teretanaId: TERETANE.t1,

    pocetakVrijeme: ts("2026-01-18T17:00:00Z"),
    zavrsetakVrijeme: ts("2026-01-18T18:00:00Z"),
    datum: "2026-01-18",

    maksBrojSportasa: 25,
    brojPrijava: 0,
  });

              const prijavaDocId = `${USERS.jane}_${RASPOREDI.r1}`;

  batch.set(
    db.collection("rasporedi").doc(RASPOREDI.r1).collection("prijave").doc(prijavaDocId),
    {
      sportasId: USERS.jane,
      dolazakNaTrening: false,
      ocjenaTreninga: null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  );

  await batch.commit();
  console.log("Firestore test data uploaded successfully (final _v3)");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
