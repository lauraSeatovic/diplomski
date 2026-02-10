import { UserRepository } from "../../../domain/repository/UserRepository";
import { SportasUser } from "../../../domain/models/SportasUser";
import { korisnikToSportasDomain } from "../mapper/firebaseMapper";
import { firebaseUserApi } from "../services/firebaseUserService";

export class UserRepositoryFirebase implements UserRepository {
    async getSportasUserById(id: string): Promise<SportasUser | null> {
    try {
      const korisnik = await firebaseUserApi.getKorisnikById(id);
      if (!korisnik) return null;

      return korisnikToSportasDomain(korisnik);
    } catch {
      return null;
    }
  }
}
