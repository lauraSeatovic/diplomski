import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/trainings/training_state.dart';

import '../../domain/model/common_models.dart';
import '../../domain/model/training_models.dart';
import '../../domain/repository/training_repository.dart';

class TrainingsController extends StateNotifier<TrainingsState> {
  final TrainingRepository repo;
  final String userId;

  TrainingsController(this.repo, {required this.userId})
      : super(TrainingsState.initial()) {
    _init();
  }

  Future<void> _init() async {
    await _loadTeretane();
  }

  Future<void> _loadTeretane() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final list = await repo.getTeretane();
      Teretana? selected;
      if (list.isNotEmpty) {
        selected = list.first;
      }
      state = state.copyWith(
        isLoading: false,
        teretane: list,
        selectedTeretana: selected,
      );
      if (selected != null) {
        await loadTrainings();
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> changeDate(DateTime date) async {
    final onlyDate = DateTime(date.year, date.month, date.day);
    state = state.copyWith(selectedDate: onlyDate);
    await loadTrainings();
  }

  Future<void> changeTeretana(Teretana teretana) async {
    state = state.copyWith(selectedTeretana: teretana);
    await loadTrainings();
  }

  Future<void> loadTrainings() async {
    final teretana = state.selectedTeretana;
    if (teretana == null) return;

    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final list = await repo.getTrainingsByDateAndTeretana(
        teretanaId: teretana.idTeretane,
        date: state.selectedDate,
      );
      state = state.copyWith(
        isLoading: false,
        treninzi: list,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        errorMessage: e.toString(),
      );
    }
  }

  Future<SignUpResult> signUpForTraining(String rasporedId) async {
    final result = await repo.signUpForTraining(
      rasporedId: rasporedId,
      korisnikId: userId,
    );
    if (result == SignUpResult.success) {
      await loadTrainings();
    }
    return result;
  }
}
