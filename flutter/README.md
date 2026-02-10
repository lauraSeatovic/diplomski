# Flutter – Mobilna aplikacija

## Uvod

Ova verzija mobilne aplikacije razvijena je u sklopu diplomskog rada koristeći **Flutter** za klijentski dio i dvije pozadinske platforme: **Supabase i Firebase**.

---

## Preduvjeti

* Flutter SDK
* Dart
* Android Studio
* Android SDK i emulator ili stvarni uređaj

### Konfiguracija backend platforme

#### Firebase


Firebase konfiguracijske datoteke nisu uključene u repozitorij.

Prije pokretanja aplikacije potrebno je:

1. Kreirati Firebase projekt u Firebase Console.
2. Dodati Android aplikaciju u Firebase projekt.
3. Preuzeti datoteku `google-services.json`.
4. Smjestiti datoteku u:
```

android/app/google-services.json

````
5. Generirati Flutter Firebase konfiguraciju pomoću FlutterFire CLI alata:
```bash
flutterfire configure
````

Ova naredba automatski generira potrebne konfiguracijske datoteke i omogućuje build i pokretanje aplikacije.

#### Supabase
**.env datoteka**: potrebno je u mapu `flutter/test_app/` dodati datoteku `.env` s podacima za spajanje na Supabase:

```

URL=<tvoj_supabase_url>
ANON_KEY=<tvoj_supabase_anon_key>

```
Za odabir backend platforme koristi se konfiguracija u **lib\providers.dart** datoteci, gdje se može birati između **Supabase** i **Firebase**. 

---

## Build i pokretanje aplikacije

1. Otvori projekt u **Android Studiju**.
2. Odaberi uređaj ili emulator na kojem želiš pokrenuti aplikaciju.
3. Klikni na **Run App**.
4. IDE će automatski buildati projekt i instalirati aplikaciju na odabrani uređaj ili emulator.

Aplikacija je spremna za korištenje čim se završi instalacija i pokretanje.

