export type TrenerTrening = {
  rasporedId: string;
  pocetakVrijeme: string;
  zavrsetakVrijeme: string;
  idTrenera: string;

  vrstaTreningaNaziv: string;
  tezina: number;

  dvoranaNaziv: string;
  teretanaNaziv: string;
  adresa: string;
  mjesto: string;

  maksBrojSportasa: number;
};

export type PrijavljeniSudionik = {
  prijavaId: string;
  sportasId: string;
  ime: string;
  prezime: string;
  dolazakNaTrening: boolean;
  ocjenaTreninga: number | null;
};

export type AttendanceUpdate = {
  sportasId: string;
  dolazak: boolean;
};

export type AttendanceUpdateResult = {
  success: boolean;
  updated: number;
};

export type Dvorana = {
  idDvorane: string;
  nazivDvorane: string;
  idTeretane: string;
};

export type VrstaTreningaDomain = {
  idVrTreninga: string;
  nazivVrTreninga: string;
  tezina: number;
};

export type CreateTreningInput = {
  idDvorane: string;

  idVrTreninga?: string | null;
  novaVrsta?: { nazivVrTreninga: string; tezina: number } | null;

  idLaksijegTreninga?: string | null;
  idTezegTreninga?: string | null;

  maksBrojSportasa: number;
};

export type CreateRasporedInput = {
  idTreninga: string;
  pocetakVrijeme: Date;
  zavrsetakVrijeme: Date;
  idTrenera: string;
};

export type TrainingDropdownItem = {
  treningId: string;
  label: string;
};