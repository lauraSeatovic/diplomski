import { TrenerTrening, PrijavljeniSudionik, AttendanceUpdate, AttendanceUpdateResult, Dvorana, VrstaTreningaDomain } from '../../../domain/models/trainer';
import { DostupniTrening, PrijavljenTrening, Teretana } from '../../../domain/models/Trening';
import { RasporedFullDto, AttendeeDto, AttendanceUpdateRequestDto, AttendanceUpdateResponseDto } from '../dtos/TrenerDtos';
import { PrijavaFullDto, TeretanaDto, AvailableTrainingDto, DvoranaDTO, VrstaTreninga, VrstaTreningaDTO } from '../dtos/TreningDTOs';

export function prijavaFullDtoToDomain(dto: PrijavaFullDto): PrijavljenTrening {
  const r = dto.Raspored;
  const t = r.Trening;

  return {
    naziv: t.VrstaTreninga.NazivVrTreninga,
    pocetak: new Date(r.PocetakVrijeme),
    kraj: new Date(r.ZavrsetakVrijeme),
    dvorana: t.Dvorana.NazivDvorane,
    teretana: t.Dvorana.Teretana.NazivTeretane,
  };
}

export function teretanaDtoToDomain(dto: TeretanaDto): Teretana {
  return {
    idTeretane: dto.IdTeretane,
    nazivTeretane: dto.NazivTeretane,
    adresa: dto.Adresa,
    mjesto: dto.Mjesto,
  };
}

export function availableTrainingDtoToDomain(
  dto: AvailableTrainingDto
): DostupniTrening {
  return {
    rasporedId: dto.raspored_id,
    treningId: dto.trening_id,
    nazivVrsteTreninga: dto.trening_vrsta_naziv,
    pocetak: new Date(dto.start_time),
    kraj: new Date(dto.end_time),
    nazivDvorane: dto.dvorana_naziv,
    nazivTeretane: undefined, 
    trenerIme: dto.trener_ime,
    trenerPrezime: dto.trener_prezime,
    maxBrojSportasa: dto.max_participants,
    trenutnoPrijavljenih: dto.current_signups,
    isFull: dto.is_full,
  };
}

export function mapRasporedFullDtoToTrenerTrening(dto: RasporedFullDto): TrenerTrening {
  return {
    rasporedId: dto.IdRasporeda,
    pocetakVrijeme: dto.PocetakVrijeme,
    zavrsetakVrijeme: dto.ZavrsetakVrijeme,
    idTrenera: dto.IdTrenera,

    vrstaTreningaNaziv: dto.Trening.VrstaTrening.NazivVrTreninga,
    tezina: dto.Trening.VrstaTrening.Tezina,

    dvoranaNaziv: dto.Trening.Dvorana.NazivDvorane,
    teretanaNaziv: dto.Trening.Dvorana.Teretana.NazivTeretane,
    adresa: dto.Trening.Dvorana.Teretana.Adresa,
    mjesto: dto.Trening.Dvorana.Teretana.Mjesto,

    maksBrojSportasa: dto.Trening.MaksBrojSportasa,
  };
}

export function mapAttendeeDtoToPrijavljeniSudionik(dto: AttendeeDto): PrijavljeniSudionik {
  return {
    prijavaId: dto.prijava_id,
    sportasId: dto.sportas_id,
    ime: dto.ime,
    prezime: dto.prezime,
    dolazakNaTrening: !!dto.dolazak_na_trening,
    ocjenaTreninga: dto.ocjena_treninga ?? null,
  };
}

export function mapAttendanceUpdateToRequestDto(
  rasporedId: string,
  updates: AttendanceUpdate[]
): AttendanceUpdateRequestDto {
  return {
    raspored_id: rasporedId,
    updates: updates.map((u) => ({
      sportas_id: u.sportasId,
      dolazak: u.dolazak,
    })),
  };
}

export function mapAttendanceResponseToDomain(
  dto: AttendanceUpdateResponseDto
): AttendanceUpdateResult {
  return {
    success: !!dto.success,
    updated: Number(dto.updated ?? 0),
  };
}

export function mapDvorana(dto: DvoranaDTO): Dvorana {
  return {
    idDvorane: dto.IdDvorane,
    nazivDvorane: dto.NazivDvorane,
    idTeretane: dto.IdTeretane,
  };
}

export function mapVrstaTreninga(dto: VrstaTreningaDTO): VrstaTreningaDomain {
  return {
    idVrTreninga: dto.IdVrTreninga,
    nazivVrTreninga: dto.NazivVrTreninga,
    tezina: dto.Tezina,
  };
}
