import 'package:cloud_firestore/cloud_firestore.dart';

import '../../../../domain/model/user_role.dart';

class FirebaseRoleService {
  final FirebaseFirestore firestore;

  FirebaseRoleService({
    required this.firestore,
  });

  Future<UserRole> getUserRole(String userId) async {
    final snap = await firestore.collection('korisnici').doc(userId).get();

    if (!snap.exists) {
      throw StateError('Korisnik ne postoji u bazi.');
    }

    final data = snap.data() ?? <String, dynamic>{};

    final jeSportas = data['jeSportas'] == true;
    final jeTrener = data['jeTrener'] == true;

    if (jeSportas) return UserRole.SPORTAS;
    if (jeTrener) return UserRole.TRENER;

    throw StateError('Uloga korisnika nije definirana.');
  }
}
