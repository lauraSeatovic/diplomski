# Pozadinske platforme

Uz korištenje pripremljenih mobilnih aplikacija, moguće je i samostalno postaviti pozadinske platforme.

Unutar mape `backend` nalaze se potrebne datoteke za postavljanje pozadisnkih platformi korištenih u radu:

- **Firebase**: seed skripta za stvaranje baze podataka (kolekcija) te Cloud Functions koje su korištene u okviru rada.
- **Supabase**: SQL skripta za kreiranje relacijske baze podataka te funkcije korištene u okviru rada.

U slučaju samostalnog postavljanja potrebno je kreirati novi projekt na odabranoj platformi i ručno izvršiti konfiguraciju.  
Zbog korištenja **Firebase Cloud Functions**, za njihovo izvođenje potrebno je aktivirati **Blaze (plaćeni) plan**.
