import { useCallback, useEffect, useMemo, useState } from "react";
import { TrainingRepositorySupabase } from "../data/supabase/repository/TreningRepositorySupabase";
import { PrijavljeniSudionik, AttendanceUpdate } from "../domain/models/trainer";
import { trainingRepository } from "./configuration/repositories";


const trainingRepo = trainingRepository;

export function useTrainerAttendees(rasporedId: string) {
  const [attendees, setAttendees] = useState<PrijavljeniSudionik[]>([]);
  const [pending, setPending] = useState<Record<string, boolean>>({});
  const [isEditMode, setEditMode] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [isError, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const list = await trainingRepo.getAttendeesForRaspored(rasporedId);
      setAttendees(list);
      setEditMode(false);
      setPending({});
    } catch {
      setError(true);
    }

    setLoading(false);
  }, [rasporedId]);

  useEffect(() => {
    load();
  }, [load]);

  const enterEditMode = useCallback(() => {
    const init: Record<string, boolean> = {};
    for (const a of attendees) init[a.sportasId] = a.dolazakNaTrening;
    setPending(init);
    setEditMode(true);
  }, [attendees]);

  const cancelEditMode = useCallback(() => {
    setEditMode(false);
    setPending({});
  }, []);

  const toggle = useCallback((sportasId: string, value: boolean) => {
    setPending((prev) => ({ ...prev, [sportasId]: value }));
  }, []);

  const submit = useCallback(async () => {
    setSaving(true);
    setError(false);

    try {
      const updates: AttendanceUpdate[] = Object.entries(pending).map(([sportasId, dolazak]) => ({
        sportasId,
        dolazak,
      }));

      await trainingRepo.setAttendanceForRaspored(rasporedId, updates);
      await load();
    } catch {
      setError(true);
    }

    setSaving(false);
  }, [pending, rasporedId, load]);

  const canEdit = useMemo(() => attendees.length > 0, [attendees.length]);

  return {
    attendees,
    pending,
    isEditMode,
    isLoading,
    isSaving,
    isError,
    canEdit,
    refetch: load,
    enterEditMode,
    cancelEditMode,
    toggle,
    submit,
  };
}
