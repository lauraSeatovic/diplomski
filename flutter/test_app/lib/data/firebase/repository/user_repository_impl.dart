import 'package:test_app/data/firebase/model/user_mapper.dart';

import '../../../domain/model/sportas_user.dart';
import '../../../domain/repository/user_repository.dart';
import '../../firebase/network/service/user_service.dart';
import '../network/service/user_service.dart';

class FirebaseUserRepositoryImpl implements UserRepository {
  final FirebaseUserService firebaseUserService;

  FirebaseUserRepositoryImpl(this.firebaseUserService);

  @override
  Future<SportasUser?> getSportasUser(String id) async {
    try {
      final korisnik = await firebaseUserService.getKorisnikById(id);
      if (korisnik == null) return null;

      if (!korisnik.jeSportas) return null;

      return korisnik.toSportasDomain(id);
    } catch (_) {
      return null;
    }
  }

  Future<SportasUser> getCurrentSportas() async {
    final uid = firebaseUserService.getCurrentUserId();
    if (uid == null) {
      throw StateError('Korisnik nije prijavljen.');
    }

    final sportas = await getSportasUser(uid);
    if (sportas == null) {
      throw StateError('Profil sportaša nije pronađen.');
    }

    return sportas;
  }
}