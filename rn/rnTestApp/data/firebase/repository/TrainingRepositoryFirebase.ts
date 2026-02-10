import { TrainingRepository } from "../../../domain/repository/TrainingRepository";

import {
  DostupniTrening,
  PrijavljenTrening,
  Teretana,
  TrainingDetails,
} from "../../../domain/models/Trening";

import {
  AttendanceUpdate,
  AttendanceUpdateResult,
  CreateRasporedInput,
  CreateTreningInput,
  Dvorana,
  PrijavljeniSudionik,
  TrenerTrening,
  TrainingDropdownItem,
  VrstaTreningaDomain,
} from "../../../domain/models/trainer";

import { SignUpResult } from "../../../domain/models/common";

import {
  TrainingsByGymDateRequestDto,
  SignupForTrainingRequestDto,
  GetAttendeesRequestDto,
  DeleteRasporedRequestDto,
  SetAttendanceRequestDto,
  TrainingDetailsRequestDto,
} from "../dtos/firebaseDtos";

import {
  prijavljenTreningFromMyTrainingsItem,
  teretanaToDomain,
  dvoranaToDomain,
  vrstaTreningaToDomain,
  dostupniTreningToDomain,
  signupResultToDomain,
  trainerTrainingToDomain,
  attendeeToDomain,
  attendanceResultToDomain,
  toCreateTrainingRequest,
  toCreateRasporedRequest,
  treningOptionToDropdown,
} from "../mapper/firebaseMapper";
import { firebaseTrainingApi } from "../services/firebaseTrainingService";


export class TrainingRepositoryFirebase implements TrainingRepository {
  async getTrainingsForUser(userId: string): Promise<PrijavljenTrening[]> {
    try {
      const items = await firebaseTrainingApi.myTrainingsRaw();
      return items.map(prijavljenTreningFromMyTrainingsItem);
    } catch {
      return [];
    }
  }

  async getAllTeretane(): Promise<Teretana[]> {
    const dtoList = await firebaseTrainingApi.getTeretane();
    return dtoList.map(teretanaToDomain);
  }

  async getDvorane(idTeretane?: string): Promise<Dvorana[]> {
    const dtoList = await firebaseTrainingApi.getDvorane();
    const filtered = idTeretane
      ? dtoList.filter((d) => d.teretanaId === idTeretane)
      : dtoList;

    return filtered.map(dvoranaToDomain);
  }

  async getVrsteTreninga(): Promise<VrstaTreningaDomain[]> {
    const dtoList = await firebaseTrainingApi.getVrsteTreninga();
    return dtoList.map(vrstaTreningaToDomain);
  }

  async getAvailableTrainings(
    teretanaId: string,
    date: Date
  ): Promise<DostupniTrening[]> {
    const dateStr = date.toISOString().split("T")[0];

    const req: TrainingsByGymDateRequestDto = {
      teretanaId,
      date: dateStr,
    };

    const dto = await firebaseTrainingApi.trainingsByGymDate(req);
    return dto.items.map(dostupniTreningToDomain);
  }

  async getTrainingDetails(
  treningId: string,
  rasporedId: string
): Promise<TrainingDetails> {
  const req: TrainingDetailsRequestDto = {
    treningId,
    rasporedId,
  };

  const dto = await firebaseTrainingApi.trainingDetails(req);

  return {
    treningId: dto.treningId,
    vrstaId: dto.vrstaId,
    nazivVrste: dto.nazivVrste,
    tezina: dto.tezina,


  };
}


  async signUpForTraining(
    rasporedId: string,
    userId: string
  ): Promise<SignUpResult> {
    try {
      const req: SignupForTrainingRequestDto = { rasporedId };
      const dto = await firebaseTrainingApi.signupForTraining(req);
      return signupResultToDomain(dto);
    } catch {
      return SignUpResult.Error;
    }
  }

  async getTrainingsForTrainer(trenerId: string): Promise<TrenerTrening[]> {
    const dto = await firebaseTrainingApi.trainerTrainings();
    return dto.items.map(trainerTrainingToDomain);
  }

  async getAttendeesForRaspored(
    rasporedId: string
  ): Promise<PrijavljeniSudionik[]> {
    const req: GetAttendeesRequestDto = { rasporedId };
    const dto = await firebaseTrainingApi.attendeesByRaspored(req);
    return dto.items.map(attendeeToDomain);
  }

  async setAttendanceForRaspored(
    rasporedId: string,
    updates: AttendanceUpdate[]
  ): Promise<AttendanceUpdateResult> {
    const req: SetAttendanceRequestDto = {
      rasporedId,
      attendance: updates.map((u) => ({
        sportasId: u.sportasId,
        present: u.dolazak,
      })),
    };

    const dto = await firebaseTrainingApi.setAttendanceForRaspored(req);
    return attendanceResultToDomain(dto);
  }

  async createTrening(input: CreateTreningInput): Promise<void> {
    const req = toCreateTrainingRequest(input);
    await firebaseTrainingApi.createTraining(req);
  }

  async createRaspored(input: CreateRasporedInput): Promise<void> {
    if (input.zavrsetakVrijeme <= input.pocetakVrijeme) {
      throw new Error("Završetak mora biti nakon početka.");
    }
    const req = toCreateRasporedRequest(input);
    await firebaseTrainingApi.createRaspored(req);
  }

  async deleteRaspored(idRasporeda: string): Promise<void> {
    const req: DeleteRasporedRequestDto = { rasporedId: idRasporeda };
    await firebaseTrainingApi.deleteRaspored(req);
  }

  async getTrainingsForDropdown(): Promise<TrainingDropdownItem[]> {
    const rows = await firebaseTrainingApi.getTreningOptions();
    return rows.map(treningOptionToDropdown);
  }
}
