import { useCallback, useEffect, useState } from "react";
import { TrainingRepositorySupabase } from "../data/supabase/repository/TreningRepositorySupabase";
import { AuthRepositoryImpl } from "../data/supabase/repository/AuthRepositoryImpl";
import { TrenerTrening } from "../domain/models/trainer";
import { authRepository, trainingRepository, userRepository } from "./configuration/repositories";

const trainingRepo = trainingRepository;
const authRepo = authRepository;

export function useTrainerTrainings() {
  const [trainings, setTrainings] = useState<TrenerTrening[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const trenerId = await authRepo.getCurrentUserId();
      if (!trenerId) {
        setTrainings([]);
        setError(true);
        setLoading(false);
        return;
      }

      const items = await trainingRepo.getTrainingsForTrainer(trenerId);
      setTrainings(items);
    } catch (e) {
  console.log("getTrainingsForTrainer failed:", e);
  setError(true);
    }
    setLoading(false);
  }, []);

  const deleteRaspored = useCallback(
    async (idRasporeda: string) => {
      setTrainings(prev =>
        prev.filter(t => t.rasporedId !== idRasporeda)
      );

      try {
        await trainingRepo.deleteRaspored(idRasporeda);
        await load();      } catch {
        setError(true);
        await load();      }
    },
    [load]
  );

  useEffect(() => {
    load();
  }, [load]);

  return {
    trainings,
    isLoading,
    isError,
    refetch: load,
    deleteRaspored,
  };
}
