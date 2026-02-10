# Kotlin Jetpack Compose – Mobilna aplikacija

## Uvod

Ova verzija mobilne aplikacije razvijena je u sklopu diplomskog rada koristeći **Kotlin Jetpack Compose** za klijentski dio i dvije pozadinske platforme: **Supabase i Firebase**.

---

## Preduvjeti

* Android Studio
* Kotlin 2.2.21
* Gradle 8+
* Android SDK i emulator ili stvarni uređaj
### Konfiguracija backend platforme
#### Supabase konfiguracija

**SupabaseConfig.kt datoteka**: potrebno je u mapu `kotlin_jetpack_compose/app/src/main/java/com/example/testapp/data/supabase/network/` dodati datoteku `SupabaseConfig.kt` s podacima za spajanje na Supabase:

```

object SupabaseConfig {
    const val URL =<tvoj_supabase_url>

    const val ANON_KEY =<tvoj_supabase_anon_key>
}

```

#### Firebase konfiguracija (Kotlin / Android)

Firebase konfiguracijska datoteka nije uključena u repozitorij.

Prije pokretanja aplikacije potrebno je:

1. Kreirati Firebase projekt u Firebase Console.
2. Dodati Android aplikaciju u Firebase projekt.
3. Preuzeti datoteku `google-services.json`.
4. Smjestiti datoteku u sljedeću putanju unutar projekta: `kotlin_jetpack_compose/app/google-services.json`


Za odabir backend platforme koristi se konfiguracija u **kotlin_jetpack_compose/app/src/main/java/com/example/testapp/Config.kt** datoteci, gdje se može birati između **Supabase** i **Firebase**.

---

## Build i pokretanje aplikacije

1. Otvori projekt u **Android Studiju**.
2. Odaberi uređaj ili emulator na kojem želiš pokrenuti aplikaciju.
3. Klikni na **Run App** ili odaberi **Run → Run 'app'**.
4. Android Studio će automatski buildati projekt i instalirati aplikaciju na odabrani uređaj ili emulator.

Aplikacija je spremna za korištenje čim se završi instalacija i pokretanje.
