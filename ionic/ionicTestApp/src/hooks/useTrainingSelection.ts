import { useCallback, useEffect, useState } from 'react';
import { DostupniTrening, Teretana } from '../domain/models/Trening';
import { TrainingRepositorySupabase } from '../data/supabase/repository/TreningRepositorySupabase';
import { trainingRepository } from './configuration/repositories';

const repo = trainingRepository;

export function useTrainingSelection(_userId: string) {
  const [teretane, setTeretane] = useState<Teretana[]>([]);
  const [selectedTeretana, setSelectedTeretana] = useState<Teretana | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [trainings, setTrainings] = useState<DostupniTrening[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeretane = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const list = await repo.getAllTeretane();
      setTeretane(list);

      if (!selectedTeretana && list.length > 0) {
        setSelectedTeretana(list[0]);
      }
    } catch (e: any) {
      setError(e?.message ?? 'Greška pri učitavanju teretana.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedTeretana]);

  const loadTrainings = useCallback(async () => {
    if (!selectedTeretana) return;

    setIsLoading(true);
    setError(null);
    try {
      const list = await repo.getAvailableTrainings(
        selectedTeretana.idTeretane,
        selectedDate
      );
      setTrainings(list);
    } catch (e: any) {
      setError(e?.message ?? 'Greška pri učitavanju treninga.');
      setTrainings([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedTeretana, selectedDate]);

  useEffect(() => {
    loadTeretane();
  }, [loadTeretane]);

  useEffect(() => {
    if (selectedTeretana) {
      loadTrainings();
    }
  }, [selectedTeretana, selectedDate, loadTrainings]);

  const changeDate = (newDate: Date) => {
    setSelectedDate(newDate);
  };

  const changeDateByDays = (delta: number) => {
    setSelectedDate((prev) => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta);
      return next;
    });
  };

  const changeTeretana = (teretana: Teretana) => {
    setSelectedTeretana(teretana);
  };

  return {
    teretane,
    selectedTeretana,
    selectedDate,
    trainings,
    isLoading,
    error,
    changeDate,
    changeDateByDays,
    changeTeretana,    reload: loadTrainings,
  };
}
