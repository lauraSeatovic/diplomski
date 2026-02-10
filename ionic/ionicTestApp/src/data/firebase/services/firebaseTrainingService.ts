import {
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  collectionGroup,
} from "firebase/firestore";

import { httpsCallable } from "firebase/functions";

import {
  SignupForTrainingRequestDto,
  SignupForTrainingResponseDto,
  DeleteRasporedRequestDto,
  DeleteRasporedResponseDto,
  GetAttendeesRequestDto,
  AttendeesByRasporedResponseDto,
  SetAttendanceRequestDto,
  SetAttendanceResponseDto,
  CreateTrainingRequestDto,
  CreateTrainingResponseDto,
  CreateRasporedRequestDto,
  CreateRasporedResponseDto,
  TrainerTrainingsResponseDto,
  TrainingsByGymDateRequestDto,
  TrainingsByGymDateResponseDto,
  TrainingDetailsRequestDto,
  TrainingDetailsResponseDto,
  TeretanaDto,
  DvoranaDto,
  VrstaTreningaDto,
  FirestoreTreningDto,
  TreningOptionDto,
} from "../dtos/firebaseDtos";

import { asApiResponse, requireData } from "../dtos/apiResponse";

import { db, functions } from "./firebaseConfig";


const docGet = (d: QueryDocumentSnapshot<DocumentData>, key: string) =>
  (d.data() as any)?.[key];

export const firebaseTrainingApi = {
  async getTeretane(): Promise<TeretanaDto[]> {
    const snaps = await getDocs(collection(db, "teretane"));
    return snaps.docs.map((d) => ({
      id: d.id,
      nazivTeretane: String(docGet(d, "nazivTeretane") ?? ""),
      adresa: String(docGet(d, "adresa") ?? ""),
      mjesto: String(docGet(d, "mjesto") ?? ""),
    }));
  },

  async getDvorane(): Promise<DvoranaDto[]> {
    const snaps = await getDocs(collectionGroup(db, "dvorane"));
    return snaps.docs.map((d) => ({
      id: d.id,
      nazivDvorane: String(docGet(d, "nazivDvorane") ?? ""),
      teretanaId:
        docGet(d, "teretanaId") != null ? String(docGet(d, "teretanaId")) : undefined,
    }));
  },

  async getVrsteTreninga(): Promise<VrstaTreningaDto[]> {
    const snaps = await getDocs(collection(db, "vrsteTreninga"));
    return snaps.docs.map((d) => ({
      id: d.id,
      nazivVrTreninga: String(docGet(d, "nazivVrTreninga") ?? ""),
      tezina: Number(docGet(d, "tezina") ?? 0),
    }));
  },

  async signupForTraining(
    req: SignupForTrainingRequestDto
  ): Promise<SignupForTrainingResponseDto> {
    const call = httpsCallable(functions, "signup_for_training");
    const result = await call(req);
    return requireData(asApiResponse<SignupForTrainingResponseDto>(result.data));
  },

  async deleteRaspored(
    req: DeleteRasporedRequestDto
  ): Promise<DeleteRasporedResponseDto> {
    const call = httpsCallable(functions, "delete_raspored_with_prijave");
    const result = await call(req);
    return requireData(asApiResponse<DeleteRasporedResponseDto>(result.data));
  },

  async attendeesByRaspored(
    req: GetAttendeesRequestDto
  ): Promise<AttendeesByRasporedResponseDto> {
    const call = httpsCallable(functions, "attendees_by_raspored");
    const result = await call(req);
    return requireData(asApiResponse<AttendeesByRasporedResponseDto>(result.data));
  },

  async setAttendanceForRaspored(
    req: SetAttendanceRequestDto
  ): Promise<SetAttendanceResponseDto> {
    const call = httpsCallable(functions, "set_attendance_for_raspored");
    const result = await call(req);
    return requireData(asApiResponse<SetAttendanceResponseDto>(result.data));
  },

  async createTraining(
    req: CreateTrainingRequestDto
  ): Promise<CreateTrainingResponseDto> {
    const call = httpsCallable(functions, "create_training");
    const result = await call(req);
    return requireData(asApiResponse<CreateTrainingResponseDto>(result.data));
  },

  async createRaspored(
    req: CreateRasporedRequestDto
  ): Promise<CreateRasporedResponseDto> {
    const call = httpsCallable(functions, "create_raspored");
    const result = await call(req);
    return requireData(asApiResponse<CreateRasporedResponseDto>(result.data));
  },

  async trainerTrainings(): Promise<TrainerTrainingsResponseDto> {
    const call = httpsCallable(functions, "trainer_trainings");
    const result = await call({});
    return requireData(asApiResponse<TrainerTrainingsResponseDto>(result.data));
  },

  async trainingsByGymDate(
    req: TrainingsByGymDateRequestDto
  ): Promise<TrainingsByGymDateResponseDto> {
    const call = httpsCallable(functions, "trainings_by_gym_date");
    const result = await call(req);
    return requireData(asApiResponse<TrainingsByGymDateResponseDto>(result.data));
  },

  async trainingDetails(
    req: TrainingDetailsRequestDto
  ): Promise<TrainingDetailsResponseDto> {
    const call = httpsCallable(functions, "training_details");
    const result = await call(req);
    return requireData(asApiResponse<TrainingDetailsResponseDto>(result.data));
  },

  async myTrainingsRaw(): Promise<Record<string, any>[]> {
    const call = httpsCallable(functions, "my_trainings");
    const result = await call({});
    const data = requireData(asApiResponse<{ items?: unknown }>(result.data));

    const items = Array.isArray((data as any).items) ? (data as any).items : [];
    return items
      .filter((x: any) => x && typeof x === "object")
      .map((x: any) => x as Record<string, any>);
  },

  async getTreningOptions(): Promise<TreningOptionDto[]> {
    const vrsteSnap = await getDocs(collection(db, "vrsteTreninga"));
    const vrste: Record<string, VrstaTreningaDto> = {};
    vrsteSnap.docs.forEach((v) => {
      const data = v.data();
      vrste[v.id] = {
        id: v.id,
        nazivVrTreninga: String(data.nazivVrTreninga ?? ""),
        tezina: Number(data.tezina ?? 0),
      };
    });

    const teretaneSnap = await getDocs(collection(db, "teretane"));
    const resultList: TreningOptionDto[] = [];

    for (const t of teretaneSnap.docs) {
      const teretana: TeretanaDto = {
        id: t.id,
        nazivTeretane: String(t.data().nazivTeretane ?? ""),
        adresa: String(t.data().adresa ?? ""),
        mjesto: String(t.data().mjesto ?? ""),
      };

      const dvoraneSnap = await getDocs(collection(t.ref, "dvorane"));
      for (const d of dvoraneSnap.docs) {
        const dvorana: DvoranaDto = {
          id: d.id,
          nazivDvorane: String(d.data().nazivDvorane ?? ""),
          teretanaId: teretana.id,
        };

        const treninziSnap = await getDocs(collection(db, "treninzi"));
        for (const tr of treninziSnap.docs) {
          const vrstaId = String(tr.data().vrstaTreningaId ?? "");
          const vrsta = vrste[vrstaId];
          if (!vrsta) continue;

          resultList.push({
            idTreninga: tr.id,
            maksBrojSportasa: Number(tr.data().maksBrojSportasa ?? 0),

            idVrTreninga: vrsta.id,
            nazivVrTreninga: vrsta.nazivVrTreninga,
            tezina: vrsta.tezina,

            idDvorane: dvorana.id,
            nazivDvorane: dvorana.nazivDvorane,

            idTeretane: teretana.id,
            nazivTeretane: teretana.nazivTeretane,
            adresa: teretana.adresa,
            mjesto: teretana.mjesto,
          });
        }
      }
    }

    resultList.sort((a, b) => {
      const la = `${a.nazivVrTreninga}-${a.nazivTeretane}-${a.nazivDvorane}-${a.maksBrojSportasa}`;
      const lb = `${b.nazivVrTreninga}-${b.nazivTeretane}-${b.nazivDvorane}-${b.maksBrojSportasa}`;
      return la.localeCompare(lb);
    });

    return resultList;
  }
};
