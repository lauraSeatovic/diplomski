import '../../domain/model/training_models.dart';

class TrainingsState {
  final bool isLoading;
  final String? errorMessage;

  final List<Teretana> teretane;
  final Teretana? selectedTeretana;

  final DateTime selectedDate;

  final List<DostupniTrening> treninzi;

  const TrainingsState({
    required this.isLoading,
    required this.errorMessage,
    required this.teretane,
    required this.selectedTeretana,
    required this.selectedDate,
    required this.treninzi,
  });

  factory TrainingsState.initial() {
    final today = DateTime.now();
    final onlyDate = DateTime(today.year, today.month, today.day);
    return TrainingsState(
      isLoading: false,
      errorMessage: null,
      teretane: const [],
      selectedTeretana: null,
      selectedDate: onlyDate,
      treninzi: const [],
    );
  }

  TrainingsState copyWith({
    bool? isLoading,
    String? errorMessage,
    List<Teretana>? teretane,
    Teretana? selectedTeretana,
    DateTime? selectedDate,
    List<DostupniTrening>? treninzi,
  }) {
    return TrainingsState(
      isLoading: isLoading ?? this.isLoading,
      errorMessage: errorMessage,
      teretane: teretane ?? this.teretane,
      selectedTeretana: selectedTeretana ?? this.selectedTeretana,
      selectedDate: selectedDate ?? this.selectedDate,
      treninzi: treninzi ?? this.treninzi,
    );
  }
}
