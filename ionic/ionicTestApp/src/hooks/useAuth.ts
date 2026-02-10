import { useCallback, useEffect, useState } from "react";
import { UserRole } from "../domain/repository/AuthRepository";
import { AuthRepositoryImpl } from "../data/supabase/repository/AuthRepositoryImpl";
import { AuthRepositoryFirebase } from "../data/firebase/repository/authRepositoryFirebase";
import { authRepository } from "./configuration/repositories";


const authRepo = authRepository;

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const [isLoading, setLoading] = useState<boolean>(true);
  const [isError, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const restore = useCallback(async () => {
    setLoading(true);
    setError(false);
    setErrorMessage(null);

    try {
      const uid = await authRepo.getCurrentUserId();
      if (!uid) {
        setUserId(null);
        setRole(null);
        setLoading(false);
        return;
      }

      const fetchedRole = await authRepo.getUserRole(uid);
      setUserId(uid);
      setRole(fetchedRole);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e?.message ?? String(e));
      setUserId(null);
      setRole(null);
    }

    setLoading(false);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(false);
    setErrorMessage(null);

    try {
      await authRepo.signIn(email, password);

      const uid = await authRepo.getCurrentUserId();
      if (!uid) throw new Error("Login succeeded but userId is null");

      const fetchedRole = await authRepo.getUserRole(uid);
      setUserId(uid);
      setRole(fetchedRole);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e?.message ?? String(e));
      setUserId(null);
      setRole(null);
    }

    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    setError(false);
    setErrorMessage(null);

    try {
      await authRepo.signOut();
      setUserId(null);
      setRole(null);
    } catch (e: any) {
      setError(true);
      setErrorMessage(e?.message ?? String(e));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    restore();
  }, [restore]);

  return {
    userId,
    role,
    isLoading,
    isError,
    errorMessage,
    signIn,
    signOut,
    restore,
  };
}
