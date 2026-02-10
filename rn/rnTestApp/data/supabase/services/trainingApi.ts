import { RasporedFullDto, AttendeeDto, AttendeesResponseDto, AttendanceUpdateRequestDto, AttendanceUpdateResponseDto } from '../dtos/TrenerDtos';
import { AvailableTrainingDto, CreateRasporedRequestDTO, CreateTreningWithVrstaRequestDTO, DvoranaDTO, PrijavaFullDto, TeretanaDto, TrainingDetailsInnerDto, TrainingDetailsResponseDto, TrainingDropdownDto, VrstaTreningaDTO  } from '../dtos/TreningDTOs';
import { supabase } from './supabaseClient';

export async function getTrainingsForUser(
  sportasId: string
): Promise<PrijavaFullDto[]> {
  const selectColumns = `
    IdPrijave,
    IdSportasa,
    DolazakNaTrening,
    OcjenaTreninga,
    Raspored:IdRasporeda(
      IdRasporeda,
      PocetakVrijeme,
      ZavrsetakVrijeme,
      Trening:IdTreninga(
        IdTreninga,
        IdVrTreninga,
        IdDvOdr,
        MaksBrojSportasa,
        Dvorana:IdDvOdr(
          IdDvorane,
          NazivDvorane,
          Teretana:IdTeretane(
            IdTeretane,
            NazivTeretane,
            Adresa,
            Mjesto
          )
        ),
        VrstaTreninga:IdVrTreninga(
          IdVrTreninga,
          NazivVrTreninga,
          Tezina
        )
      )
    )
  `;

  const { data, error } = await supabase
    .from('Prijava')
    .select(selectColumns)
    .eq('IdSportasa', sportasId);

  if (error) {
    throw error;
  }

  return (data ?? []) as unknown as PrijavaFullDto[];
}

export async function fetchTeretane(): Promise<TeretanaDto[]> {
  const { data, error } = await supabase.from('Teretana').select('*');

  if (error) throw error;

  return (data ?? []) as TeretanaDto[];
}

export async function fetchAvailableTrainings(
  teretanaId: string,
  date: string
): Promise<AvailableTrainingDto[]> {
  const { data, error } = await supabase.functions.invoke(
    `trainings_by_dvorana_date?teretanaId=${encodeURIComponent(
      teretanaId
    )}&date=${encodeURIComponent(date)}`,
    {
      method: "GET"
    }
  );

  if (error) throw error;

  return (data?.data ?? []) as AvailableTrainingDto[];
}

export async function fetchTrainingDetails(
  treningId: string
): Promise<TrainingDetailsInnerDto> {
  const { data, error } = await supabase.functions.invoke(
    `get_trening_info?trening_id=${encodeURIComponent(treningId)}`,
    {
      method: 'GET',
    }
  );

  if (error) {
    throw error;
  }

  const resp = data as TrainingDetailsResponseDto;
  return resp.data;
}

export async function signUpForTrainingFn(
  rasporedId: string,
  userId: string
): Promise<{ success?: boolean; error?: string }> {
  const { data, error } = await supabase.functions.invoke(
    'signup_for_training',
    {
      body: {
        korisnik_id: userId,
        raspored_id: rasporedId,
      },
    }
  );

  if (error) {
    return { error: error.message };
  }

  return data ?? { error: 'Unknown error' };
}

export async function getTrainingsForTrainer(
  trenerId: string
): Promise<RasporedFullDto[]> {
  const selectColumns = `
    IdRasporeda,
    PocetakVrijeme,
    ZavrsetakVrijeme,
    IdTrenera,
    Trening:IdTreninga(
      IdTreninga,
      IdVrTreninga,
      IdDvOdr,
      MaksBrojSportasa,
      Dvorana:IdDvOdr(
        IdDvorane,
        NazivDvorane,
        Teretana:IdTeretane(
          IdTeretane,
          NazivTeretane,
          Adresa,
          Mjesto
        )
      ),
      VrstaTrening:IdVrTreninga(
        IdVrTreninga,
        NazivVrTreninga,
        Tezina
      )
    )
  `;

  const { data, error } = await supabase
    .from("Raspored")
    .select(selectColumns)
    .eq("IdTrenera", trenerId)
    .order("PocetakVrijeme", { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as RasporedFullDto[];
}

export async function fetchAttendeesByRaspored(
  rasporedId: string
): Promise<AttendeeDto[]> {
  const { data, error } = await supabase.functions.invoke(
    `sportasi_na_treningu?raspored_id=${encodeURIComponent(rasporedId)}`,
    { method: "GET" }
  );

  if (error) throw error;

  const resp = data as AttendeesResponseDto;
  return (resp?.data ?? []) as AttendeeDto[];
}

export async function setAttendanceForRasporedFn(
  request: AttendanceUpdateRequestDto
): Promise<AttendanceUpdateResponseDto> {
  const { data, error } = await supabase.functions.invoke("postavi-prisutstvo", {
    method: "POST",
    body: request,
  });

  if (error) throw error;

  return data as AttendanceUpdateResponseDto;
}

export async function getDvoraneApi(idTeretane?: string): Promise<DvoranaDTO[]> {
  let q = supabase
    .from('Dvorana')
    .select('IdDvorane, NazivDvorane, IdTeretane')
    .order('NazivDvorane', { ascending: true });

  if (idTeretane) q = q.eq('IdTeretane', idTeretane);

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as DvoranaDTO[];
}

export async function getVrsteTreningaApi(): Promise<VrstaTreningaDTO[]> {
  const { data, error } = await supabase
    .from('VrstaTreninga')
    .select('IdVrTreninga, NazivVrTreninga, Tezina')
    .order('NazivVrTreninga', { ascending: true });

  if (error) throw error;
  return (data ?? []) as VrstaTreningaDTO[];
}

export async function fetchVrsteTreningaApi(): Promise<VrstaTreningaDTO[]> {
  const { data, error } = await supabase
    .from('VrstaTreninga')
    .select('IdVrTreninga, NazivVrTreninga, Tezina')
    .order('NazivVrTreninga', { ascending: true });

  if (error) throw error;

  return (data ?? []) as VrstaTreningaDTO[];
}

export async function createTreningWithVrstaFn(
  request: CreateTreningWithVrstaRequestDTO
): Promise<any> {
  const hasVrstaId = !!request?.trening?.IdVrTreninga;

  if (!hasVrstaId) {
    if (!request.vrsta?.NazivVrTreninga || request.vrsta.Tezina == null) {
      throw new Error(
        'If IdVrTreninga is not provided, vrsta (NazivVrTreninga, Tezina) must be provided.'
      );
    }
  }

  const { data, error } = await supabase.functions.invoke(
    'create-trening-with-vrsta',
    {
      method: 'POST',
      body: request,
    }
  );

  if (error) throw error;

  return data;
}

export async function createRasporedFn(
  request: CreateRasporedRequestDTO
): Promise<any> {
  const p = request?.raspored?.PocetakVrijeme;
  const z = request?.raspored?.ZavrsetakVrijeme;
  if (p && z && new Date(z).getTime() <= new Date(p).getTime()) {
    throw new Error('ZavrsetakVrijeme must be after PocetakVrijeme.');
  }

  const { data, error } = await supabase.functions.invoke('create-raspored', {
    method: 'POST',
    body: request,
  });

  if (error) throw error;

  return data;
}

export async function deleteRasporedWithPrijavaFn(
  idRasporeda: string
): Promise<any> {
  const { data, error } = await supabase.functions.invoke(
    `delete-raspored-with-prijava?IdRasporeda=${encodeURIComponent(idRasporeda)}`,
    {
      method: 'DELETE',
    }
  );

  if (error) throw error;

  return data;
}

export async function fetchTrainingsForDropdown(): Promise<TrainingDropdownDto[]> {
  const selectColumns = `
    IdTreninga,
    MaksBrojSportasa,
    VrstaTreninga:IdVrTreninga(
      NazivVrTreninga
    ),
    Dvorana:IdDvOdr(
      NazivDvorane
    )
  `;

  const { data, error } = await supabase
    .from("Trening")
    .select(selectColumns)
    .order("IdTreninga", { ascending: true });

  if (error) throw error;

  return (data ?? []) as unknown as TrainingDropdownDto[];
}
