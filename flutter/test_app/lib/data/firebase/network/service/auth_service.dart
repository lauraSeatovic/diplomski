import 'package:firebase_auth/firebase_auth.dart';

class FirebaseAuthService {
  final FirebaseAuth auth;

  FirebaseAuthService(this.auth);

  Future<void> signIn(String email, String password) async {
    await auth.signInWithEmailAndPassword(
      email: email.trim(),
      password: password,
    );
  }

  void signOut() {
    auth.signOut();
  }

  String? currentUserId() => auth.currentUser?.uid;
}
