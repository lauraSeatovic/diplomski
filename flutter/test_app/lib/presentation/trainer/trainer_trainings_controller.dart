
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/trainer/trainer_state.dart';
import '../../../domain/repository/training_repository.dart';
import '../../providers.dart';
import '../profile/providers.dart';

final trainerTrainingsControllerProvider = StateNotifierProvider.family<
    TrainerTrainingsController, TrainerTrainingsState, String>((ref, trenerId) {
  final repo = ref.watch(trainingRepositoryProvider);
  return TrainerTrainingsController(repo, trenerId);
});

class TrainerTrainingsController extends StateNotifier<TrainerTrainingsState> {
  final TrainingRepository repo;
  final String trenerId;

  TrainerTrainingsController(this.repo, this.trenerId)
      : super(TrainerTrainingsState.initial());

  Future<void> load() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final list = await repo.getTrainingsForTrainer(trenerId);
      state = state.copyWith(isLoading: false, trainings: list);
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  Future<void> deleteRaspored(String rasporedId) async {
    try {
      state = state.copyWith(isLoading: true, error: null);

      await repo.deleteRaspored(rasporedId);

      await load();
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }
}
