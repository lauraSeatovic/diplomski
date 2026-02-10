import { AuthRepositoryFirebase } from "../../data/firebase/repository/authRepositoryFirebase";
import { TrainingRepositoryFirebase } from "../../data/firebase/repository/TrainingRepositoryFirebase";
import { UserRepositoryFirebase } from "../../data/firebase/repository/UserRepositoryFirebase";
import { AuthRepositoryImpl } from "../../data/supabase/repository/AuthRepositoryImpl";
import { TrainingRepositorySupabase } from "../../data/supabase/repository/TreningRepositorySupabase";
import { UserRepositorySupabase } from "../../data/supabase/repository/UserRepositorySupabase";
import { AuthRepository } from "../../domain/repository/AuthRepository";
import { TrainingRepository } from "../../domain/repository/TrainingRepository";
import { UserRepository } from "../../domain/repository/UserRepository";
import { ACTIVE_BACKEND, BackendType } from "./backend";

const supabaseAuthRepo: AuthRepository = new AuthRepositoryImpl();
const supabaseUserRepo: UserRepository = new UserRepositorySupabase();
const supabaseTrainingRepo: TrainingRepository = new TrainingRepositorySupabase();

const firebaseAuthRepo: AuthRepository = new AuthRepositoryFirebase();
const firebaseUserRepo: UserRepository = new UserRepositoryFirebase();
const firebaseTrainingRepo: TrainingRepository = new TrainingRepositoryFirebase();

export const authRepository: AuthRepository =
  ACTIVE_BACKEND === BackendType.Firebase ? firebaseAuthRepo : supabaseAuthRepo;

export const userRepository: UserRepository =
  ACTIVE_BACKEND === BackendType.Firebase ? firebaseUserRepo : supabaseUserRepo;

export const trainingRepository: TrainingRepository =
  ACTIVE_BACKEND === BackendType.Firebase ? firebaseTrainingRepo : supabaseTrainingRepo;
