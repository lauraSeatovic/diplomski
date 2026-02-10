export interface PrijavaFullDto {
  IdPrijave: string;
  IdSportasa: string;
  DolazakNaTrening: boolean;
  OcjenaTreninga: number | null;
  Raspored: {
    IdRasporeda: string;
    PocetakVrijeme: string;
    ZavrsetakVrijeme: string;
    Trening: {
      IdTreninga: string;
      IdVrTreninga: string;
      IdDvOdr: string;
      MaksBrojSportasa: number;
      VrstaTreninga: {
        IdVrTreninga: string;
        NazivVrTreninga: string;
        Tezina: number;
      };
      Dvorana: {
        IdDvorane: string;
        NazivDvorane: string;
        Teretana: {
          IdTeretane: string;
          NazivTeretane: string;
          Adresa: string;
          Mjesto: string;
        };
      };
    };
  };
}



export interface VrstaTreninga {
  Tezina: number
  IdVrTreninga: string
  NazivVrTreninga: string
}

export interface AvailableTrainingDto {
  raspored_id: string;
  start_time: string;
  end_time: string;
  trening_id: string;
  trening_vrsta_naziv: string;
  max_participants: number;
  dvorana_id: string;
  dvorana_naziv: string;
  trener_id: string;
  trener_ime: string;
  trener_prezime: string;
  current_signups: number;
  is_full: boolean;
}

export interface TeretanaDto {
  IdTeretane: string;
  NazivTeretane: string;
  Adresa: string;
  Mjesto: string;
}

export interface VrstaTreningaDto {
  id: string;
  naziv: string;
  tezina: number;
}

export interface TrainingDetailsInnerDto {
  trening_id: string;
  vrsta: VrstaTreningaDto;
}

export interface TrainingDetailsResponseDto {
  data: TrainingDetailsInnerDto;
}

export type VrstaTreningaCreateDTO = {
  IdVrTreninga?: string;  NazivVrTreninga?: string;  Tezina?: number;};

export type TreningCreateDTO = {
  IdDvOdr: string;
  IdVrTreninga?: string | null;  IdLaksijegTreninga?: string | null;
  IdTezegTreninga?: string | null;
  MaksBrojSportasa: number;
};

export type CreateTreningWithVrstaRequestDTO = {
  trening: TreningCreateDTO;
  vrsta?: VrstaTreningaCreateDTO;};

export type RasporedCreateDTO = {
  IdTreninga: string;
  PocetakVrijeme: string;  ZavrsetakVrijeme: string;  IdTrenera: string;
};

export type CreateRasporedRequestDTO = {
  raspored: RasporedCreateDTO;
};

export type EdgeResponseDTO<T> = {
  data: T;
  error?: string | null;
};

export type DvoranaDTO = {
  IdDvorane: string;
  NazivDvorane: string;
  IdTeretane: string;
};

export type VrstaTreningaDTO = {
  IdVrTreninga: string;
  NazivVrTreninga: string;
  Tezina: number;
};

export type TrainingDropdownDto = {
  IdTreninga: string;
  MaksBrojSportasa: number;
  VrstaTreninga: {
    NazivVrTreninga: string;
  } | null;
  Dvorana: {
    NazivDvorane: string;
  } | null;
};




