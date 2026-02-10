import { useCallback, useEffect, useState } from 'react';
import { TrainingRepositorySupabase } from '../data/supabase/repository/TreningRepositorySupabase';
import { SignUpResult } from '../domain/models/common';
import { TrainingDetails } from '../domain/models/Trening';
import { trainingRepository } from './configuration/repositories';

const repo = trainingRepository;

export function useTrainingDetails(
  treningId: string,
  rasporedId: string,
  userId: string
) {
  const [details, setDetails] = useState<TrainingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const d = await repo.getTrainingDetails(treningId, rasporedId);
      setDetails(d);
    } catch (e: any) {
      setError(e?.message ?? 'Error loading training details.');
    } finally {
      setIsLoading(false);
    }
  }, [treningId]);

  useEffect(() => {
    load();
  }, [load]);

  const signUp = useCallback(async (): Promise<SignUpResult> => {
    setIsSigningUp(true);
    try {
      const result = await repo.signUpForTraining(rasporedId, userId);
      return result;
    } finally {
      setIsSigningUp(false);
    }
  }, [rasporedId, userId]);

  return {
    details,
    isLoading,
    isSigningUp,
    error,
    reload: load,
    signUp,
  };
}
