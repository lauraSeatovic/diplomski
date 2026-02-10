import '../../../../domain/model/sportas_user.dart';
import 'korisnik_dtos.dart';

extension KorisnikDtoMapper on FirestoreKorisnikDto {
  SportasUser toSportasDomain(String id) {
    final ts = sportas?.datumRodenja;
    if (ts == null) {
      throw StateError('Datum rođenja sportaša nije definiran.');
    }

    return SportasUser(
      id: id,
      ime: ime,
      prezime: prezime,
      datumRodenja: ts.toDate(),
    );
  }
}
