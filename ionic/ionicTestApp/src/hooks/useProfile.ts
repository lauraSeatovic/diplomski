import { useEffect, useState, useCallback } from 'react';
import { UserRepositorySupabase } from '../data/supabase/repository/UserRepositorySupabase';
import { TrainingRepositorySupabase } from '../data/supabase/repository/TreningRepositorySupabase';

import { SportasUser } from '../domain/models/SportasUser';
import { PrijavljenTrening } from '../domain/models/Trening';
import { trainingRepository, userRepository } from './configuration/repositories';

const trainingRepo = trainingRepository;
const userRepo = userRepository;

export function useProfile(userId: string) {
  const [user, setUser] = useState<SportasUser | null>(null);
  const [trainings, setTrainings] = useState<PrijavljenTrening[]>([]);

  const [isLoading, setLoading] = useState(true);
  const [isError, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const fetchedUser = await userRepo.getSportasUserById(userId);
      if (!fetchedUser) {
        setError(true);
        setLoading(false);
        return;
      }

      setUser(fetchedUser);

      const fetchedTrainings = await trainingRepo.getTrainingsForUser(userId);
      setTrainings(fetchedTrainings);

    } catch {
      setError(true);
    }

    setLoading(false);
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  return { 
    user,
    trainings,
    isLoading,
    isError,
    refetch: load
  };
}
