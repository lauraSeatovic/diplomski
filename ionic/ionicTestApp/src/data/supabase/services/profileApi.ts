import { KorisnikDTO } from '../dtos/KorisnikDTO';
import { SportasDTO } from '../dtos/SportasDTO';
import { supabase } from './supabaseClient';

export async function fetchKorisnikById(
  id: string
): Promise<KorisnikDTO | null> {
  const { data, error } = await supabase
    .from('Korisnik')
    .select('*')
    .eq('IdKorisnika', id)
    .maybeSingle();

  if (error) {
    console.error('Supabase error fetchKorisnikById:', error);
    return null;
  }

  return data as KorisnikDTO | null;
}

export async function fetchSportasById(
  id: string
): Promise<SportasDTO | null> {
  const { data, error } = await supabase
    .from('Sportas')
    .select('*')
    .eq('IdKorisnika', id)
    .maybeSingle();

  if (error) {
    console.error('Supabase error fetchSportasById:', error);
    return null;
  }

  return data as SportasDTO | null;
}