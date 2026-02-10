import { PrijavljenTrening } from '../models/Trening';
import { Teretana } from '../models/Trening';
import { DostupniTrening } from '../models/Trening';
import { TrainingDetails } from '../models/Trening';
import { SignUpResult } from '../models/common';
import { AttendanceUpdate, AttendanceUpdateResult, CreateRasporedInput, CreateTreningInput, Dvorana, PrijavljeniSudionik, TrainingDropdownItem, TrenerTrening, VrstaTreningaDomain } from '../models/trainer';

export interface TrainingRepository {
  getTrainingsForUser(userId: string): Promise<PrijavljenTrening[]>;

  getAllTeretane(): Promise<Teretana[]>;
  getAvailableTrainings(
    teretanaId: string,
    date: Date
  ): Promise<DostupniTrening[]>;

  getTrainingDetails(treningId: string, rasporedId: String): Promise<TrainingDetails>;

  signUpForTraining(
    rasporedId: string,
    userId: string
  ): Promise<SignUpResult>;

  getTrainingsForTrainer(trenerId: string): Promise<TrenerTrening[]>;
  getAttendeesForRaspored(rasporedId: string): Promise<PrijavljeniSudionik[]>;
  setAttendanceForRaspored(
    rasporedId: string,
    updates: AttendanceUpdate[]
  ): Promise<AttendanceUpdateResult>;

  getDvorane(idTeretane?: string): Promise<Dvorana[]>;
  getVrsteTreninga(): Promise<VrstaTreningaDomain[]>;

  createTrening(input: CreateTreningInput): Promise<void>;
  createRaspored(input: CreateRasporedInput): Promise<void>;
  deleteRaspored(idRasporeda: string): Promise<void>;
  getTrainingsForDropdown(): Promise<TrainingDropdownItem[]>;
}
