import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/model/training_models.dart';
import '../../../domain/repository/training_repository.dart';
import '../../../providers.dart';
import '../../profile/providers.dart';

class CreateRasporedState {
  final bool isLoading;
  final bool isSubmitting;
  final bool created;
  final String? errorMessage;

  final List<TreningOption> options;
  final String? selectedTreningId;

  final DateTime date;
  final TimeOfDay start;
  final TimeOfDay end;

  const CreateRasporedState({
    required this.isLoading,
    required this.isSubmitting,
    required this.created,
    required this.errorMessage,
    required this.options,
    required this.selectedTreningId,
    required this.date,
    required this.start,
    required this.end,
  });

  factory CreateRasporedState.initial() => CreateRasporedState(
    isLoading: true,
    isSubmitting: false,
    created: false,
    errorMessage: null,
    options: const [],
    selectedTreningId: null,
    date: DateTime.now(),
    start: const TimeOfDay(hour: 18, minute: 0),
    end: const TimeOfDay(hour: 19, minute: 0),
  );

  CreateRasporedState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    bool? created,
    String? errorMessage,
    List<TreningOption>? options,
    String? selectedTreningId,
    DateTime? date,
    TimeOfDay? start,
    TimeOfDay? end,
  }) {
    return CreateRasporedState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      created: created ?? this.created,
      errorMessage: errorMessage,
      options: options ?? this.options,
      selectedTreningId: selectedTreningId ?? this.selectedTreningId,
      date: date ?? this.date,
      start: start ?? this.start,
      end: end ?? this.end,
    );
  }
}

final createRasporedControllerProvider = StateNotifierProvider.autoDispose
    .family<CreateRasporedController, CreateRasporedState, String>((ref, trenerId) {
  final repo = ref.watch(trainingRepositoryProvider);
  final c = CreateRasporedController(repo, trenerId);
  c.load();
  return c;
});

class CreateRasporedController extends StateNotifier<CreateRasporedState> {
  final TrainingRepository _repo;
  final String trenerId;

  CreateRasporedController(this._repo, this.trenerId)
      : super(CreateRasporedState.initial());

  Future<void> load() async {
    try {
      state = state.copyWith(isLoading: true, errorMessage: null);
      final options = await _repo.getTreningOptions();
      state = state.copyWith(
        isLoading: false,
        options: options,
        selectedTreningId: options.isNotEmpty ? options.first.idTreninga : null,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void setTrening(String? id) => state = state.copyWith(selectedTreningId: id);
  void setDate(DateTime d) => state = state.copyWith(date: d);
  void setStart(TimeOfDay t) => state = state.copyWith(start: t);
  void setEnd(TimeOfDay t) => state = state.copyWith(end: t);

  Future<void> submit() async {
    try {
      state = state.copyWith(isSubmitting: true, errorMessage: null);

      final treningId = state.selectedTreningId;
      if (treningId == null) throw Exception('Odaberite trening.');

      final startDt = DateTime(
        state.date.year,
        state.date.month,
        state.date.day,
        state.start.hour,
        state.start.minute,
      );

      final endDt = DateTime(
        state.date.year,
        state.date.month,
        state.date.day,
        state.end.hour,
        state.end.minute,
      );

      if (!startDt.isBefore(endDt)) {
        throw Exception('Početak mora biti prije završetka.');
      }

      await _repo.createRaspored(
        CreateRasporedInput(
          treningId: treningId,
          start: startDt,
          end: endDt,
        ),
      );

      state = state.copyWith(isSubmitting: false, created: true);
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
    }
  }
}
