import '../../../../domain/model/sportas_user.dart';
import '../DTOs/korisnik_dto.dart';
import '../DTOs/sportas_dto.dart';

SportasUser mapToDomain(KorisnikDto k, SportasDto s) {
  return SportasUser(
    id: k.idKorisnika,
    ime: k.imeKorisnika,
    prezime: k.prezimeKorisnika,
    datumRodenja: DateTime.parse(s.datumRodenja),
    tipClanarine: s.tipClanarine,
  );
}