import { TrainingRepository } from '../../../domain/repository/TrainingRepository';
import { DostupniTrening, PrijavljenTrening, Teretana, TrainingDetails } from '../../../domain/models/Trening';
import { createRasporedFn, createTreningWithVrstaFn, deleteRasporedWithPrijavaFn, fetchAttendeesByRaspored, fetchAvailableTrainings, fetchTeretane, fetchTrainingDetails, fetchTrainingsForDropdown, getDvoraneApi, getTrainingsForTrainer, getTrainingsForUser, getVrsteTreningaApi, setAttendanceForRasporedFn, signUpForTrainingFn } from '../services/trainingApi';
import { availableTrainingDtoToDomain, mapAttendanceResponseToDomain, mapAttendanceUpdateToRequestDto, mapAttendeeDtoToPrijavljeniSudionik, mapDvorana, mapRasporedFullDtoToTrenerTrening, mapVrstaTreninga, prijavaFullDtoToDomain, teretanaDtoToDomain } from '../mappers/treningMapper';
import { SignUpResult } from '../../../domain/models/common';
import { TrenerTrening, PrijavljeniSudionik, AttendanceUpdate, AttendanceUpdateResult, Dvorana, VrstaTreningaDomain, CreateRasporedInput, CreateTreningInput, TrainingDropdownItem } from '../../../domain/models/trainer';
import { VrstaTreninga } from '../dtos/TreningDTOs';

export class TrainingRepositorySupabase implements TrainingRepository {
  async getTrainingsForUser(userId: string): Promise<PrijavljenTrening[]> {
    const dtoList = await getTrainingsForUser(userId);
    return dtoList.map(prijavaFullDtoToDomain);
  }

  async getAllTeretane(): Promise<Teretana[]> {
    const dtoList = await fetchTeretane();
    return dtoList.map(teretanaDtoToDomain);
  }

  async getAvailableTrainings(
    teretanaId: string,
    date: Date
  ): Promise<DostupniTrening[]> {
    const dateStr = date.toISOString().split('T')[0];
    const dtoList = await fetchAvailableTrainings(teretanaId, dateStr);
    return dtoList.map(availableTrainingDtoToDomain);
  }

  async getTrainingDetails(treningId: string, rasporedId: String): Promise<TrainingDetails> {
    const dto = await fetchTrainingDetails(treningId);

    return {
      treningId: dto.trening_id,
      vrstaId: dto.vrsta.id,
      nazivVrste: dto.vrsta.naziv,
      tezina: dto.vrsta.tezina,
    };
  }

  async signUpForTraining(
    rasporedId: string,
    userId: string
  ): Promise<SignUpResult> {
    try {
      const result = await signUpForTrainingFn(rasporedId, userId);

      if (result.success) return SignUpResult.Success;

      if (result.error?.includes('already signed')) {
        return SignUpResult.UserAlreadySigned;
      }

      if (result.error?.includes('full')) {
        return SignUpResult.TrainingFull;
      }

      return SignUpResult.Error;
    } catch {
      return SignUpResult.Error;
    }
    
  }

  async getTrainingsForTrainer(trenerId: string): Promise<TrenerTrening[]> {
    const dtoList = await getTrainingsForTrainer(trenerId);
    return dtoList.map(mapRasporedFullDtoToTrenerTrening);
  }

  async getAttendeesForRaspored(rasporedId: string): Promise<PrijavljeniSudionik[]> {
    const dtoList = await fetchAttendeesByRaspored(rasporedId);
    return dtoList.map(mapAttendeeDtoToPrijavljeniSudionik);
  }

  async setAttendanceForRaspored(
    rasporedId: string,
    updates: AttendanceUpdate[]
  ): Promise<AttendanceUpdateResult> {
    const request = mapAttendanceUpdateToRequestDto(rasporedId, updates);
    const responseDto = await setAttendanceForRasporedFn(request);
    return mapAttendanceResponseToDomain(responseDto);
  }

  async getDvorane(idTeretane?: string): Promise<Dvorana[]> {
    const dtos = await getDvoraneApi(idTeretane);
    return dtos.map(mapDvorana);
  }

  async getVrsteTreninga(): Promise<VrstaTreningaDomain[]> {
    const dtos = await getVrsteTreningaApi();
    return dtos.map(mapVrstaTreninga);
  }

   async createTrening(input: CreateTreningInput): Promise<void> {
    const hasExistingVrsta = !!input.idVrTreninga;

    const body = {
      trening: {
        IdDvOdr: input.idDvorane,
        IdVrTreninga: input.idVrTreninga ?? null,
        IdLaksijegTreninga: input.idLaksijegTreninga ?? null,
        IdTezegTreninga: input.idTezegTreninga ?? null,
        MaksBrojSportasa: input.maksBrojSportasa,
      },
      vrsta: hasExistingVrsta
        ? undefined
        : {
            NazivVrTreninga: input.novaVrsta?.nazivVrTreninga ?? '',
            Tezina: input.novaVrsta?.tezina ?? 0,
          },
    };

    if (!hasExistingVrsta) {
      if (!input.novaVrsta?.nazivVrTreninga || input.novaVrsta.tezina == null) {
        throw new Error('Nova vrsta je obavezna ako IdVrTreninga nije odabran.');
      }
    }

    await createTreningWithVrstaFn(body);
  }

  async createRaspored(input: CreateRasporedInput): Promise<void> {
    if (input.zavrsetakVrijeme <= input.pocetakVrijeme) {
      throw new Error('Završetak mora biti nakon početka.');
    }

    await createRasporedFn({
      raspored: {
        IdTreninga: input.idTreninga,
        PocetakVrijeme: input.pocetakVrijeme.toISOString(),
        ZavrsetakVrijeme: input.zavrsetakVrijeme.toISOString(),
        IdTrenera: input.idTrenera,
      },
    });
  }

  async deleteRaspored(idRasporeda: string): Promise<void> {
    await deleteRasporedWithPrijavaFn(idRasporeda);
  }

   async getTrainingsForDropdown(): Promise<TrainingDropdownItem[]> {
    const rows = await fetchTrainingsForDropdown();

    return rows.map((r) => ({
      treningId: r.IdTreninga,
      label: [
        r.VrstaTreninga?.NazivVrTreninga,
        r.Dvorana?.NazivDvorane,
        r.MaksBrojSportasa
          ? `(${r.MaksBrojSportasa})`
          : null,
      ]
        .filter(Boolean)
        .join(" • "),
    }));
  }
}