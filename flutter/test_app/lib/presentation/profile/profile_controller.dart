import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/profile/profile_state.dart';

import '../../domain/model/prijavljen_trening.dart';
import '../../domain/model/sportas_user.dart';
import '../../domain/repository/user_repository.dart';
import '../../domain/repository/training_repository.dart';

class ProfileController extends StateNotifier<ProfileState> {
  final UserRepository userRepo;
  final TrainingRepository trainingRepo;

  ProfileController(this.userRepo, this.trainingRepo)
      : super(ProfileState.initial());

  Future<void> load(String id) async {
    state = state.copyWith(isLoading: true, error: null);

    try {
      final results = await Future.wait([
        userRepo.getSportasUser(id),
        trainingRepo.getTrainingsForUser(id),
      ]);

      final user = results[0] as SportasUser?;
      final prijavljeni = results[1] as List<PrijavljenTrening>;

      if (user == null) {
        state = state.copyWith(
          isLoading: false,
          user: null,
          prijavljeniTreninzi: const [],
          error: 'Greška pri učitavanju profila.',
        );
        return;
      }

      state = state.copyWith(
        isLoading: false,
        user: user,
        prijavljeniTreninzi: prijavljeni,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> reload(String id) => load(id);
}
