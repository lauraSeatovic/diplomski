import { UserRepository } from '../..//../domain/repository/UserRepository';
import { SportasUser } from '../../../domain/models/SportasUser';
import {
  fetchKorisnikById,
  fetchSportasById,
} from '../services/profileApi';
import { toSportasUser } from '../mappers/userMapper';

export class UserRepositorySupabase implements UserRepository {
  async getSportasUserById(id: string): Promise<SportasUser | null> {
    const korisnik = await fetchKorisnikById(id);
    const sportas  = await fetchSportasById(id);

    if (!korisnik || !sportas) return null;

    return toSportasUser(korisnik, sportas);
  }
}