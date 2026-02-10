import { SignUpResult } from "../../../domain/models/common";
import { SportasUser } from "../../../domain/models/SportasUser";
import { VrstaTreningaDomain, TrenerTrening, PrijavljeniSudionik, AttendanceUpdateResult, CreateTreningInput, CreateRasporedInput, TrainingDropdownItem } from "../../../domain/models/trainer";
import { Teretana, PrijavljenTrening, DostupniTrening } from "../../../domain/models/Trening";
import {
  AttendeeDto,
  CreateTrainingRequestDto,
  CreateRasporedRequestDto,
  DeleteRasporedResponseDto,
  FirestoreKorisnikDto,
  SignupForTrainingResponseDto,
  TrainerTrainingItemDto,
  TrainingByGymDateItemDto,
  TrainingDetailsResponseDto,
  TreningOptionDto,
  VrstaTreningaDto,
  TeretanaDto,
  DvoranaDto,
} from "../dtos/firebaseDtos";
import { timestampToDate } from "../dtos/timestampUtils";



export function korisnikToSportasDomain(
  dto: FirestoreKorisnikDto
): SportasUser {
  if (!dto.sportas?.datumRodenja) {
    throw new Error("Nedostaje datum rođenja sportaša.");
  }

  return {
    id: dto.id,
    ime: dto.ime,
    prezime: dto.prezime,
    datumRodenja: dto.sportas.datumRodenja.toDate(),
    tipClanarine: dto.sportas.tipClanarine ?? null,
  };
}


export function teretanaToDomain(dto: TeretanaDto): Teretana {
  return {
    idTeretane: dto.id,
    nazivTeretane: dto.nazivTeretane,
    adresa: dto.adresa,
    mjesto: dto.mjesto,
  };
}

export function dvoranaToDomain(dto: DvoranaDto) {
  return {
    idDvorane: dto.id,
    nazivDvorane: dto.nazivDvorane,
    idTeretane: dto.teretanaId ?? "",
  };
}

export function vrstaTreningaToDomain(
  dto: VrstaTreningaDto
): VrstaTreningaDomain {
  return {
    idVrTreninga: dto.id,
    nazivVrTreninga: dto.nazivVrTreninga,
    tezina: dto.tezina,
  };
}


export function signupResultToDomain(
  dto: SignupForTrainingResponseDto
): SignUpResult {
  switch (dto.result) {
    case "SUCCESS":
      return SignUpResult.Success;
    case "USER_ALREADY_SIGNED":
      return SignUpResult.UserAlreadySigned;
    case "TRAINING_FULL":
      return SignUpResult.TrainingFull;
    default:
      return SignUpResult.Error;
  }
}


export function prijavljenTreningFromMyTrainingsItem(
  raw: any
): PrijavljenTrening {
  return {
    naziv: raw.naziv ?? "",
    pocetak: timestampToDate(raw.pocetak),
    kraj: timestampToDate(raw.kraj),
    dvorana: raw.dvorana ?? "",
    teretana: raw.teretana ?? undefined,
  };
}


export function dostupniTreningToDomain(
  dto: TrainingByGymDateItemDto
): DostupniTrening {
  return {
    rasporedId: dto.rasporedId,
    treningId: dto.treningId,
    nazivVrsteTreninga: dto.nazivVrsteTreninga,
    pocetak: timestampToDate(dto.pocetakVrijeme),
    kraj: timestampToDate(dto.zavrsetakVrijeme),
    nazivDvorane: dto.nazivDvorane,
    nazivTeretane: dto.nazivTeretane,
    trenerIme: dto.trenerIme,
    trenerPrezime: dto.trenerPrezime,
    trenutnoPrijavljenih: dto.trenutnoPrijavljenih,
    maxBrojSportasa: dto.maxBrojSportasa,
    isFull: dto.isFull,
  };
}


export function trainerTrainingToDomain(
  dto: TrainerTrainingItemDto
): TrenerTrening {
  return {
    rasporedId: dto.rasporedId,
    pocetakVrijeme: timestampToDate(dto.pocetakVrijeme).toISOString(),
    zavrsetakVrijeme: timestampToDate(dto.zavrsetakVrijeme).toISOString(),
    idTrenera: "",

    vrstaTreningaNaziv: dto.vrstaTreningaNaziv,
    tezina: 0,

    dvoranaNaziv: dto.dvoranaNaziv,
    teretanaNaziv: dto.teretanaNaziv,
    adresa: "",
    mjesto: "",

    maksBrojSportasa: dto.maksBrojSportasa,
  };
}

export function attendeeToDomain(dto: AttendeeDto): PrijavljeniSudionik {
  return {
    prijavaId: dto.prijavaDocId,
    sportasId: dto.sportasId,
    ime: dto.ime,
    prezime: dto.prezime,
    dolazakNaTrening: dto.dolazakNaTrening,
    ocjenaTreninga: null,
  };
}

export function attendanceResultToDomain(
  dto: { updated: boolean; count: number }
): AttendanceUpdateResult {
  return {
    success: dto.updated,
    updated: dto.count,
  };
}


export function toCreateTrainingRequest(
  input: CreateTreningInput
): CreateTrainingRequestDto {
  return {
    dvoranaId: input.idDvorane,
    useExistingVrsta: !!input.idVrTreninga,
    vrstaId: input.idVrTreninga ?? undefined,
    novaVrstaNaziv: input.novaVrsta?.nazivVrTreninga,
    novaVrstaTezina: input.novaVrsta?.tezina,
    maksBrojSportasa: input.maksBrojSportasa,
  };
}

export function toCreateRasporedRequest(
  input: CreateRasporedInput
): CreateRasporedRequestDto {
  return {
    treningId: input.idTreninga,
    teretanaId: "",    pocetak: input.pocetakVrijeme.toISOString(),
    zavrsetak: input.zavrsetakVrijeme.toISOString(),
  };
}


export function treningOptionToDropdown(
  dto: TreningOptionDto
): TrainingDropdownItem {
  return {
    treningId: dto.idTreninga,
    label: `${dto.nazivVrTreninga} (Težina ${dto.tezina}) • ${dto.nazivTeretane} • ${dto.nazivDvorane} • Kapacitet ${dto.maksBrojSportasa}`,
  };
}


export function deleteRasporedToDomain(
  dto: DeleteRasporedResponseDto
) {
  return { success: dto.deleted };
}
