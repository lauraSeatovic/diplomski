export interface PrijavljenTrening {
  naziv: string;
  pocetak: Date;
  kraj: Date;
  dvorana: string;
  teretana?: string;
}

export interface Teretana {
  idTeretane: string;
  nazivTeretane: string;
  adresa: string;
  mjesto: string;
}

export interface DostupniTrening {
  rasporedId: string;
  treningId: string;
  nazivVrsteTreninga: string;
  pocetak: Date;
  kraj: Date;
  nazivDvorane: string;
  nazivTeretane?: string;
  trenerIme: string;
  trenerPrezime: string;
  maxBrojSportasa: number;
  trenutnoPrijavljenih: number;
  isFull: boolean;
}

export interface TrainingDetails {
  treningId: string;
  vrstaId: string;
  nazivVrste: string;
  tezina: number;
}
