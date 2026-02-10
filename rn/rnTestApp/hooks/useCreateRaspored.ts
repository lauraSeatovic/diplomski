import { useCallback, useEffect, useState } from "react";
import { TrainingRepositorySupabase } from "../data/supabase/repository/TreningRepositorySupabase";
import { AuthRepositoryImpl } from "../data/supabase/repository/AuthRepositoryImpl";
import { authRepository, trainingRepository } from "./configuration/repositories";

const repo = trainingRepository;
const authRepo = authRepository;

export type TrainingOption = {
  treningId: string;
  label: string;
};

export function useCreateRaspored() {
  const [options, setOptions] = useState<TrainingOption[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isError, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const list = await repo.getTrainingsForDropdown();      setOptions(list);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = useCallback(
    async (input: { treningId: string; pocetak: Date; zavrsetak: Date }) => {
      setSaving(true);
      setError(false);
      try {
        const trenerId = await authRepo.getCurrentUserId();
        if (!trenerId) throw new Error("Nema trenera u sesiji.");

        await repo.createRaspored({
          idTreninga: input.treningId,
          pocetakVrijeme: input.pocetak,
          zavrsetakVrijeme: input.zavrsetak,
          idTrenera: trenerId,
        });
      } catch (e) {
        setError(true);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return { options, isLoading, isSaving, isError, reload: load, submit };
}
