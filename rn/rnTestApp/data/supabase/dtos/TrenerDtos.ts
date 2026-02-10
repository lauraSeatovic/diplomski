export type RasporedFullDto = {
  IdRasporeda: string;
  PocetakVrijeme: string;
  ZavrsetakVrijeme: string;
  IdTrenera: string;
  Trening: {
    IdTreninga: string;
    IdVrTreninga: string;
    IdDvOdr: string;
    MaksBrojSportasa: number;
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
    VrstaTrening: {
      IdVrTreninga: string;
      NazivVrTreninga: string;
      Tezina: number;
    };
  };
};

export type AttendeeDto = {
  prijava_id: string;
  sportas_id: string;
  ime: string;
  prezime: string;
  dolazak_na_trening: boolean;
  ocjena_treninga: number | null;
};

export type AttendeesResponseDto = {
  data: AttendeeDto[];
};

export type AttendanceUpdateItemDto = {
  sportas_id: string;
  dolazak: boolean;
};

export type AttendanceUpdateRequestDto = {
  raspored_id: string;
  updates: AttendanceUpdateItemDto[];
};

export type AttendanceUpdateResponseDto = {
  success: boolean;
  updated: number;
};
