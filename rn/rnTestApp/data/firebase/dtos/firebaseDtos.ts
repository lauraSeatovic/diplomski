import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";


export type SignupForTrainingRequestDto = { rasporedId: string };
export type DeleteRasporedRequestDto = { rasporedId: string };
export type GetAttendeesRequestDto = { rasporedId: string };

export type AttendanceEntryDto = { sportasId: string; present: boolean };

export type SetAttendanceRequestDto = {
  rasporedId: string;
  attendance: AttendanceEntryDto[];
};

export type CreateTrainingRequestDto = {
  dvoranaId: string;
  useExistingVrsta: boolean;
  vrstaId?: string;
  novaVrstaNaziv?: string;
  novaVrstaTezina?: number;
  maksBrojSportasa: number;
};

export type CreateRasporedRequestDto = {
  treningId: string;
  teretanaId: string;  pocetak: string;  zavrsetak: string;};

export type TrainingsByGymDateRequestDto = {
  teretanaId: string;
  date: string;};

export type TrainingDetailsRequestDto = {
  treningId: string;
  rasporedId: string;
};


export type SignupForTrainingResponseDto = {
  result: "SUCCESS" | "USER_ALREADY_SIGNED" | "TRAINING_FULL" | string;
};

export type DeleteRasporedResponseDto = {
  deleted: boolean;
  deletedPrijave: number;
};

export type AttendeeDto = {
  prijavaDocId: string;
  sportasId: string;
  ime: string;
  prezime: string;
  dolazakNaTrening: boolean;
};

export type AttendeesByRasporedResponseDto = {
  items: AttendeeDto[];
};

export type SetAttendanceResponseDto = {
  updated: boolean;
  count: number;
};

export type CreateTrainingResponseDto = {
  treningId: string;
  vrstaTreningaId: string;
};

export type CreateRasporedResponseDto = {
  rasporedId: string;
};

export type TrainerTrainingItemDto = {
  rasporedId: string;
  treningId: string;
  pocetakVrijeme: unknown;  zavrsetakVrijeme: unknown;  datum: string;
  brojPrijava: number;
  maksBrojSportasa: number;
  vrstaTreningaNaziv: string;
  teretanaNaziv: string;
  dvoranaNaziv: string;
  trenerIme: string;
  trenerPrezime: string;
};

export type TrainerTrainingsResponseDto = {
  items: TrainerTrainingItemDto[];
};

export type TrainingByGymDateItemDto = {
  rasporedId: string;
  treningId: string;
  pocetakVrijeme: unknown;
  zavrsetakVrijeme: unknown;
  nazivTeretane: string;
  nazivDvorane: string;
  nazivVrsteTreninga: string;
  tezina: number;
  trenerIme: string;
  trenerPrezime: string;
  trenutnoPrijavljenih: number;
  maxBrojSportasa: number;
  isFull: boolean;
};

export type TrainingsByGymDateResponseDto = {
  items: TrainingByGymDateItemDto[];
};

export type TrainingDetailsResponseDto = {
  treningId: string;
  rasporedId: string;
  vrstaId: string;
  nazivVrste: string;
  tezina: number;

  pocetakVrijeme: unknown;
  zavrsetakVrijeme: unknown;
  datum: string;

  teretanaId: string;
  teretanaNaziv: string;
  dvoranaId: string;
  dvoranaNaziv: string;

  trenerId: string;
  trenerIme: string;
  trenerPrezime: string;

  trenutnoPrijavljenih: number;
  maxBrojSportasa: number;
  isFull: boolean;
};


export type TeretanaDto = {
  id: string;
  nazivTeretane: string;
  adresa: string;
  mjesto: string;
};

export type DvoranaDto = {
  id: string;
  nazivDvorane: string;
  teretanaId?: string;
};

export type VrstaTreningaDto = {
  id: string;
  nazivVrTreninga: string;
  tezina: number;
};


export type FirestoreTreningDto = {
  id: string;
  dvoranaId: string;
  vrstaTreningaId: string;
  maksBrojSportasa: number;
};

export type TreningOptionDto = {
  idTreninga: string;
  maksBrojSportasa: number;

  idVrTreninga: string;
  nazivVrTreninga: string;
  tezina: number;

  idDvorane: string;
  nazivDvorane: string;

  idTeretane: string;
  nazivTeretane: string;
  adresa: string;
  mjesto: string;
};


export type FirestoreSportasDto = {
  datumRodenja?: FirebaseFirestoreTypes.Timestamp | null;
  tipClanarine?: string | null;
};

export type FirestoreTrenerDto = {
  opisTrenera?: string | null;
  kontaktTrenera?: string | null;
};

export type FirestoreKorisnikDto = {
  id: string;
  ime: string;
  prezime: string;
  jeSportas: boolean;
  jeTrener: boolean;
  sportas?: FirestoreSportasDto | null;
  trener?: FirestoreTrenerDto | null;
};
