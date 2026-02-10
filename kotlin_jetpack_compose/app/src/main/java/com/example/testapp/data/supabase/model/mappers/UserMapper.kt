package com.example.testapp.data.supabase.model.mappers

import com.example.testapp.data.supabase.model.DTOs.KorisnikDTO
import com.example.testapp.data.supabase.model.DTOs.SportasDTO
import com.example.testapp.domain.model.SportasUser
import java.time.LocalDate

fun korisnikISportasToDomain(
    korisnik: KorisnikDTO,
    sportas: SportasDTO
): SportasUser =
    SportasUser(
        id = korisnik.idKorisnika,
        ime = korisnik.imeKorisnika,
        prezime = korisnik.prezimeKorisnika,
        datumRodenja = LocalDate.parse(sportas.datumRodenja),
        tipClanarine = sportas.tipClanarine
    )