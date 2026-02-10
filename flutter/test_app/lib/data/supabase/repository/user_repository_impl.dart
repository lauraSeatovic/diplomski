import '../../../domain/model/sportas_user.dart';
import '../../../domain/repository/user_repository.dart';
import '../model/mapper/user_mapper.dart';
import '../network/service/user_service.dart';

class UserRepositoryImpl implements UserRepository {
  final UserService service;

  UserRepositoryImpl(this.service);

  @override
  Future<SportasUser?> getSportasUser(String id) async {
    try {
      final korisnik = await service.getKorisnik(id);
      final sportas = await service.getSportas(id);

      if (korisnik == null || sportas == null) return null;

      return mapToDomain(korisnik, sportas);
    } catch (_) {
      return null;
    }
  }
}