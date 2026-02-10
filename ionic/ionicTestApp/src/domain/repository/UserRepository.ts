import { SportasUser } from '../models/SportasUser';

export interface UserRepository {
  getSportasUserById(id: string): Promise<SportasUser | null>;
}