
# Ionic React – Mobilna aplikacija

## Uvod

Ova verzija mobilne aplikacije razvijena je u sklopu diplomskog rada koristeći **Ionic React** za klijentski dio i dvije pozadinske platforme: **Supabase i Firebase**.

---

## Preduvjeti

* Node.js 18+
* npm 9+ ili Yarn 3+
* Ionic CLI 7+
* Android Studio i Android SDK
* Emulator ili stvarni Android uređaj

**config.ts datoteka**: potrebno je u mapu `\ionic\ionicTestApp\config.ts` dodati datoteku `config.ts` s podacima za spajanje na Supabase:

```

    export const URL = <tvoj_supabase_url>

    export const ANON_KEY = <tvoj_supabase_anon_key>
}

```

**firebaseConfig.ts datoteka**: potrebno je u mapu `kotlin_jetpack_compose/app/src/main/java/com/example/testapp/data/firebase/network/` dodati datoteku `FirebaseConfig.kt` s podacima za spajanje na Firebase:

```

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "p",
  messagingSenderId: "",
  appId: ""
};

export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
export const functions = getFunctions(firebaseApp);
```

Za odabir backend platforme koristi se konfiguracija u **ionic\ionicTestApp\src\hooks\configuration\backend.ts** datoteci, gdje se može birati između **Supabase** i **Firebase**.

---

## Build i pokretanje aplikacije

1. Otvori terminal u rootu projekta (gdje je **`package.json`**).
2. Pokreni build aplikacije:

```
ionic build
```

3. Pokreni aplikaciju na Android uređaju ili emulatoru:

```
npx cap run android
```

* Ova naredba automatski builda i pokreće aplikaciju na odabranom uređaju ili emulatoru.

Aplikacija je spremna za korištenje čim se završi pokretanje.
