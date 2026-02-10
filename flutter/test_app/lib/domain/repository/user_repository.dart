import '../model/sportas_user.dart';

abstract class UserRepository {
  Future<SportasUser?> getSportasUser(String id);
}