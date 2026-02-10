package com.example.testapp.data.supabase.model.mappers

import com.example.testapp.data.supabase.model.DTOs.AttendanceUpdateItemDto
import com.example.testapp.data.supabase.model.DTOs.AttendanceUpdateResponseDto
import com.example.testapp.data.supabase.model.DTOs.AvailableTrainingEdgeDto
import com.example.testapp.data.supabase.model.DTOs.CreateTreningRequestDto
import com.example.testapp.data.supabase.model.DTOs.CreateTreningResponseDto
import com.example.testapp.data.supabase.model.DTOs.DvoranaDTO
import com.example.testapp.data.supabase.model.DTOs.PrijavaFullDto
import com.example.testapp.data.supabase.model.DTOs.RasporedDTO
import com.example.testapp.data.supabase.model.DTOs.RasporedFullDto
import com.example.testapp.data.supabase.model.DTOs.TeretanaDTO
import com.example.testapp.data.supabase.model.DTOs.TrainingDetailsInnerDto
import com.example.testapp.data.supabase.model.DTOs.TreningCreateDto
import com.example.testapp.data.supabase.model.DTOs.TreningOptionDto
import com.example.testapp.data.supabase.model.DTOs.VrstaTreningaCreateDto
import com.example.testapp.data.supabase.model.DTOs.VrstaTreningaDto
import com.example.testapp.data.supabase.model.DTOs.VrstaTreningaDtoFull
import com.example.testapp.domain.model.AttendanceUpdate
import com.example.testapp.domain.model.AttendanceUpdateResult
import com.example.testapp.domain.model.CreateTreningRequest
import com.example.testapp.domain.model.CreateTreningResult
import com.example.testapp.domain.model.DostupniTrening
import com.example.testapp.domain.model.Dvorana
import com.example.testapp.domain.model.PrijavljenTrening
import com.example.testapp.domain.model.Raspored
import com.example.testapp.domain.model.Teretana
import com.example.testapp.domain.model.TrainingDetails
import com.example.testapp.domain.model.TrenerTrening
import com.example.testapp.domain.model.TreningOption
import com.example.testapp.domain.model.VrstaTreninga
import java.time.LocalDateTime
import java.time.OffsetDateTime

fun prijavaFullDtoToDomain(dto: PrijavaFullDto): PrijavljenTrening {
    val raspored = dto.Raspored
    val trening = raspored.Trening
    val dvorana = trening.Dvorana
    val teretana = dvorana?.Teretana

    return PrijavljenTrening(
        id = trening.IdTreninga,
        naziv = trening.VrstaTrening?.NazivVrTreninga ?: "Nepoznat naziv",
        pocetak = LocalDateTime.parse(raspored.PocetakVrijeme),
        kraj = LocalDateTime.parse(raspored.ZavrsetakVrijeme),
        dvorana = dvorana?.NazivDvorane ?: "Nepoznata dvorana",
        teretana = teretana?.NazivTeretane ?: "Nepoznata dvorana",
    )
}


fun availableTrainingEdgeDtoToDomain(
    dto: AvailableTrainingEdgeDto
): DostupniTrening =
    DostupniTrening(
        rasporedId = dto.rasporedId,
        treningId = dto.treningId,
        nazivVrsteTreninga = dto.treningVrstaNaziv,
        pocetak = LocalDateTime.parse(dto.startTime),
        kraj = LocalDateTime.parse(dto.endTime),
        dvoranaId = dto.dvoranaId,
        dvoranaNaziv = dto.dvoranaNaziv,
        trenerId = dto.trenerId,
        trenerIme = dto.trenerIme,
        trenerPrezime = dto.trenerPrezime,
        maxBrojSportasa = dto.maxParticipants,
        trenutnoPrijavljenih = dto.currentSignups,
        isFull = dto.isFull
    )

fun TrainingDetailsInnerDto.toDomain(): TrainingDetails {
    return TrainingDetails(
        treningId = trening_id,
        nazivVrste = vrsta.naziv,
        tezina = vrsta.tezina
    )
}

fun DvoranaDTO.toDomain(): Dvorana {
    return Dvorana(
        id = IdDvorane,
        naziv = NazivDvorane,
        idTeretane = IdDvorane
    )
}

fun TeretanaDTO.toDomain(): Teretana {
    return Teretana(
        id = IdTeretane,
        naziv = NazivTeretane,
        adresa = Adresa,
        mjesto = Mjesto
    )
}

private fun String.toLocalDateTime(): LocalDateTime =
    OffsetDateTime.parse(this).toLocalDateTime()

fun RasporedFullDto.toDomain(): TrenerTrening =
    TrenerTrening(
        rasporedId = idRasporeda,
        treningId = trening.idTreninga,
        pocetak = LocalDateTime.parse(pocetakVrijeme),
        zavrsetak = LocalDateTime.parse(zavrsetakVrijeme),
        nazivVrsteTreninga = trening.vrstaTrening.nazivVrTreninga,
        nazivDvorane = trening.dvorana.nazivDvorane,
        nazivTeretane = trening.dvorana.teretana.nazivTeretane,
        maxBrojSportasa = trening.maksBrojSportasa
    )

fun AttendanceUpdate.toDto(): AttendanceUpdateItemDto =
    AttendanceUpdateItemDto(
        sportasId = sportasId,
        dolazak = dolazak
    )

fun AttendanceUpdateResponseDto.toDomain(): AttendanceUpdateResult =
    AttendanceUpdateResult(
        success = success,
        updated = updated
    )

fun VrstaTreningaDto.toDomain() = VrstaTreninga(
    id = id,
    naziv = naziv,
    tezina = tezina
)

fun CreateTreningRequest.toDto(): CreateTreningRequestDto =
    CreateTreningRequestDto(
        trening = TreningCreateDto(
            IdTreninga = trening.idTreninga,
            IdDvOdr = trening.idDvOdr,
            IdVrTreninga = trening.idVrTreninga,
            IdLaksijegTreninga = trening.idLaksijegTreninga,
            IdTezegTreninga = trening.idTezegTreninga,
            MaksBrojSportasa = trening.maksBrojSportasa
        ),
        vrsta = vrsta?.let {
            VrstaTreningaCreateDto(
                NazivVrTreninga = it.naziv,
                Tezina = it.tezina
            )
        }
    )

fun CreateTreningResponseDto.toDomain(): CreateTreningResult =
    CreateTreningResult(
        treningId = trening.IdTreninga,
        vrstaTreningaId = trening.IdVrTreninga,
        createdVrsta = (vrsta != null)
    )


fun VrstaTreningaDtoFull.toDomain() = VrstaTreninga(
    id = IdVrTreninga,
    naziv = NazivVrTreninga,
    tezina = Tezina
)

fun TreningOptionDto.toDomain(): TreningOption =
    TreningOption(
        treningId = IdTreninga,
        vrstaNaziv = VrstaTreninga.NazivVrTreninga,
        tezina = VrstaTreninga.Tezina,
        dvoranaNaziv = Dvorana.NazivDvorane,
        teretanaNaziv = Dvorana.Teretana.NazivTeretane,
        maksBrojSportasa = MaksBrojSportasa
    )


fun RasporedDTO.toDomain(): Raspored =
    Raspored(
        idRasporeda = IdRasporeda,
        treningId = IdTreninga,
        trenerId = IdTrenera,
        pocetak = LocalDateTime.parse(PocetakVrijeme),
        zavrsetak = LocalDateTime.parse(ZavrsetakVrijeme)
    )