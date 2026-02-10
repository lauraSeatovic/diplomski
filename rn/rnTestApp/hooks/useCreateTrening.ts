import { useCallback, useEffect, useState } from "react";
import { TrainingRepositorySupabase } from "../data/supabase/repository/TreningRepositorySupabase";
import { Dvorana, VrstaTreningaDomain } from "../domain/models/trainer";
import { trainingRepository, authRepository } from "./configuration/repositories";

const repo = trainingRepository;
const authRepo = authRepository;

export function useCreateTrening() {
  const [dvorane, setDvorane] = useState<Dvorana[]>([]);
  const [vrste, setVrste] = useState<VrstaTreningaDomain[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isError, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [dv, vr] = await Promise.all([
        repo.getDvorane(),        repo.getVrsteTreninga(),
      ]);
      setDvorane(dv);
      setVrste(vr);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = useCallback(
    async (input: {
      dvoranaId: string;
      useExistingVrsta: boolean;
      vrstaId?: string;
      novaVrstaNaziv?: string;
      novaVrstaTezina?: number;
      maksBrojSportasa: number;
    }) => {
      setSaving(true);
      setError(false);

      try {
        await repo.createTrening({
          idDvorane: input.dvoranaId,
          idVrTreninga: input.useExistingVrsta ? (input.vrstaId ?? null) : null,
          novaVrsta: input.useExistingVrsta
            ? null
            : {
                nazivVrTreninga: input.novaVrstaNaziv ?? "",
                tezina: input.novaVrstaTezina ?? 0,
              },
          maksBrojSportasa: input.maksBrojSportasa,
        });
      } catch {
        setError(true);
        throw new Error("Kreiranje treninga nije uspjelo.");
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return {
    dvorane,
    vrste,
    isLoading,
    isSaving,
    isError,
    reload: load,
    submit,
  };
}
