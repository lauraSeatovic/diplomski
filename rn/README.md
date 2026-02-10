# React Native – Mobilna aplikacija

## Uvod

Ova verzija mobilne aplikacije razvijena je u sklopu diplomskog rada koristeći **React Native** za klijentski dio i dvije pozadinske platforme: **Supabase i Firebase**.

---

## Preduvjeti

* Node.js 18+
* npm 9+ ili Yarn 3+
* React Native CLI 0.72+
* Android SDK i emulator ili stvarni Android uređaj

#### Supabase

**config.ts datoteka**: potrebno je u mapu `\rn\rnTestApp\config.ts` dodati datoteku `config.ts` s podacima za spajanje na Supabase:

```

    export const URL = <tvoj_supabase_url>

    export const ANON_KEY = <tvoj_supabase_anon_key>

```

#### Firebase
**Firebase Config datoteka**: potrebno je u mapu `\rn\rnTestApp\android\app\google-services.json` dodati datoteku `\google-services.json` s podacima za spajanje na Firebase.



Za odabir backend platforme koristi se konfiguracija u **rn\rnTestApp\hooks\configuration\backend.ts** datoteci, gdje se može birati između **Supabase** i **Firebase**.

---

## Instalacija ovisnosti

Prije pokretanja aplikacije potrebno je instalirati sve ovisnosti:

```bash
npm install
```

ili

```bash
yarn install
```

Ova naredba preuzima sve pakete definirane u `package.json` i sprema ih u mapu `node_modules`.

---

## Build i pokretanje aplikacije

1. Otvori projekt u terminalu.
2. Pozicioniraj se unutar **\rn\rnTestApp** mape.
3. Pokreni aplikaciju: 

```
npm run android
```


4. React Native CLI će automatski buildati projekt i instalirati aplikaciju na odabrani uređaj ili emulator.

Aplikacija je spremna za korištenje čim se završi instalacija i pokretanje.

