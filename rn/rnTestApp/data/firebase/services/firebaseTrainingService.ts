import firestore from "@react-native-firebase/firestore";
import functions from "@react-native-firebase/functions";

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

const FUNCTIONS_REGION: string | undefined = undefined;
const fn = () => (FUNCTIONS_REGION ? functions(FUNCTIONS_REGION) : functions());

export const firebaseTrainingApi = {
  async getTeretane(): Promise<TeretanaDto[]> {
    const snaps = await firestore().collection("teretane").get();
    return snaps.docs.map((d) => ({
      id: d.id,
      nazivTeretane: String(d.get("nazivTeretane") ?? ""),
      adresa: String(d.get("adresa") ?? ""),
      mjesto: String(d.get("mjesto") ?? ""),
    }));
  },

  async getDvorane(): Promise<DvoranaDto[]> {
    const snaps = await firestore().collectionGroup("dvorane").get();
    return snaps.docs.map((d) => ({
      id: d.id,
      nazivDvorane: String(d.get("nazivDvorane") ?? ""),
      teretanaId: d.get("teretanaId") != null ? String(d.get("teretanaId")) : undefined,
    }));
  },

  async getVrsteTreninga(): Promise<VrstaTreningaDto[]> {
    const snaps = await firestore().collection("vrsteTreninga").get();
    return snaps.docs.map((d) => ({
      id: d.id,
      nazivVrTreninga: String(d.get("nazivVrTreninga") ?? ""),
      tezina: Number(d.get("tezina") ?? 0),
    }));
  },

  async signupForTraining(req: SignupForTrainingRequestDto): Promise<SignupForTrainingResponseDto> {
    const result = await fn().httpsCallable("signup_for_training")(req);
    return requireData(asApiResponse<SignupForTrainingResponseDto>(result.data));
  },

  async deleteRaspored(req: DeleteRasporedRequestDto): Promise<DeleteRasporedResponseDto> {
    const result = await fn().httpsCallable("delete_raspored_with_prijave")(req);
    return requireData(asApiResponse<DeleteRasporedResponseDto>(result.data));
  },

  async attendeesByRaspored(req: GetAttendeesRequestDto): Promise<AttendeesByRasporedResponseDto> {
    const result = await fn().httpsCallable("attendees_by_raspored")(req);
    return requireData(asApiResponse<AttendeesByRasporedResponseDto>(result.data));
  },

  async setAttendanceForRaspored(req: SetAttendanceRequestDto): Promise<SetAttendanceResponseDto> {
    const result = await fn().httpsCallable("set_attendance_for_raspored")(req);
    return requireData(asApiResponse<SetAttendanceResponseDto>(result.data));
  },

  async createTraining(req: CreateTrainingRequestDto): Promise<CreateTrainingResponseDto> {
    const result = await fn().httpsCallable("create_training")(req);
    return requireData(asApiResponse<CreateTrainingResponseDto>(result.data));
  },

  async createRaspored(req: CreateRasporedRequestDto): Promise<CreateRasporedResponseDto> {
    const result = await fn().httpsCallable("create_raspored")(req);
    return requireData(asApiResponse<CreateRasporedResponseDto>(result.data));
  },

  async trainerTrainings(): Promise<TrainerTrainingsResponseDto> {
    const result = await fn().httpsCallable("trainer_trainings")({});
    return requireData(asApiResponse<TrainerTrainingsResponseDto>(result.data));
  },

  async trainingsByGymDate(req: TrainingsByGymDateRequestDto): Promise<TrainingsByGymDateResponseDto> {
    const result = await fn().httpsCallable("trainings_by_gym_date")(req);
    return requireData(asApiResponse<TrainingsByGymDateResponseDto>(result.data));
  },

  async trainingDetails(req: TrainingDetailsRequestDto): Promise<TrainingDetailsResponseDto> {
    const result = await fn().httpsCallable("training_details")(req);
    return requireData(asApiResponse<TrainingDetailsResponseDto>(result.data));
  },

  async myTrainingsRaw(): Promise<Record<string, any>[]> {
    const result = await fn().httpsCallable("my_trainings")({});
    const data = requireData(asApiResponse<{ items?: unknown }>(result.data));

    const items = Array.isArray((data as any).items) ? (data as any).items : [];
    return items
      .filter((x: any) => x && typeof x === "object")
      .map((x: any) => x as Record<string, any>);
  },

  async getTreningOptions(): Promise<TreningOptionDto[]> {
    const vrsteSnap = await firestore()
      .collection("vrsteTreninga")
      .get();

    const vrste: Record<string, VrstaTreningaDto> = {};
    vrsteSnap.docs.forEach((v) => {
      vrste[v.id] = {
        id: v.id,
        nazivVrTreninga: String(v.get("nazivVrTreninga") ?? ""),
        tezina: Number(v.get("tezina") ?? 0),
      };
    });

    const teretaneSnap = await firestore()
      .collection("teretane")
      .get();

    const resultList: TreningOptionDto[] = [];

    for (const t of teretaneSnap.docs) {
      const teretana: TeretanaDto = {
        id: t.id,
        nazivTeretane: String(t.get("nazivTeretane") ?? ""),
        adresa: String(t.get("adresa") ?? ""),
        mjesto: String(t.get("mjesto") ?? ""),
      };

      const dvoraneSnap = await firestore()
        .collection("teretane")
        .doc(t.id)
        .collection("dvorane")
        .get();

      for (const d of dvoraneSnap.docs) {
        const dvorana: DvoranaDto = {
          id: d.id,
          nazivDvorane: String(d.get("nazivDvorane") ?? ""),
          teretanaId: teretana.id,
        };

        const treninziSnap = await firestore()
          .collection("treninzi")
          .get();

        for (const tr of treninziSnap.docs) {
          const vrstaId = String(tr.get("vrstaTreningaId") ?? "");
          const vrsta = vrste[vrstaId];

          if (!vrsta) continue;

          resultList.push({
            idTreninga: tr.id,
            maksBrojSportasa: Number(tr.get("maksBrojSportasa") ?? 0),

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
