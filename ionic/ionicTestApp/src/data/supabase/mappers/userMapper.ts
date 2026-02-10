import { SportasUser } from "../../../domain/models/SportasUser";
import { KorisnikDTO } from "../dtos/KorisnikDTO";
import { SportasDTO } from "../dtos/SportasDTO";

export function toSportasUser(
  k: KorisnikDTO,
  s: SportasDTO
): SportasUser {
  return {
    id: k.IdKorisnika,
    ime: k.ImeKorisnika,
    prezime: k.PrezimeKorisnika,
    datumRodenja: new Date(s.DatumRodenja),
    tipClanarine: s.TipClanarine,
  };
}