
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/repository/training_repository.dart';
import '../../domain/model/trener_models.dart';
import '../../providers.dart';
import '../profile/providers.dart';
import 'attendees_state.dart';

final trainerAttendeesControllerProvider = StateNotifierProvider.family<
    TrainerAttendeesController, TrainerAttendeesState, String>((ref, rasporedId) {
  final repo = ref.watch(trainingRepositoryProvider);
  return TrainerAttendeesController(repo, rasporedId);
});

class TrainerAttendeesController extends StateNotifier<TrainerAttendeesState> {
  final TrainingRepository repo;
  final String rasporedId;

  TrainerAttendeesController(this.repo, this.rasporedId)
      : super(TrainerAttendeesState.initial()){
    load();
  }

  Future<void> load() async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final list = await repo.getAttendeesForRaspored(rasporedId);
      state = state.copyWith(
        isLoading: false,
        attendees: list,
        isEditMode: false,
        pending: {},
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, error: e.toString());
    }
  }

  void enterEditMode() {
    final init = <String, bool>{
      for (final a in state.attendees) a.sportasId: a.dolazakNaTrening,
    };
    state = state.copyWith(isEditMode: true, pending: init);
  }

  void cancelEditMode() {
    state = state.copyWith(isEditMode: false, pending: {});
  }

  void toggleAttendance(String sportasId, bool value) {
    final map = Map<String, bool>.from(state.pending);
    map[sportasId] = value;
    state = state.copyWith(pending: map);
  }

  Future<void> submit() async {
    state = state.copyWith(isSaving: true, error: null);
    try {
      final updates = state.pending.entries
          .map((e) => AttendanceUpdate(sportasId: e.key, dolazak: e.value))
          .toList();

      await repo.setAttendanceForRaspored(
        rasporedId: rasporedId,
        updates: updates,
      );

      await load();
      state = state.copyWith(isSaving: false);
    } catch (e) {
      state = state.copyWith(isSaving: false, error: e.toString());
    }
  }
}
