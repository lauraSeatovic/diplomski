import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../model/korisnik_dtos.dart';

class FirebaseUserService {
  final FirebaseFirestore firestore;
  final FirebaseAuth auth;

  FirebaseUserService({
    required this.firestore,
    required this.auth,
  });

  Future<FirestoreKorisnikDto?> getKorisnikById(String id) async {
    final snap = await firestore
        .collection('korisnici')
        .doc(id)
        .get();

    if (!snap.exists) return null;

    return FirestoreKorisnikDto.fromDoc(snap);
  }

  String? getCurrentUserId() => auth.currentUser?.uid;
}
