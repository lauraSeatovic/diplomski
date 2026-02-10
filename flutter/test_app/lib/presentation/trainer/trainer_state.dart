
import '../../domain/model/trener_models.dart';

class TrainerTrainingsState {
  final bool isLoading;
  final List<TrainerTraining> trainings;
  final String? error;

  const TrainerTrainingsState({
    required this.isLoading,
    required this.trainings,
    this.error,
  });

  factory TrainerTrainingsState.initial() =>
      const TrainerTrainingsState(isLoading: false, trainings: []);

  TrainerTrainingsState copyWith({
    bool? isLoading,
    List<TrainerTraining>? trainings,
    String? error,
  }) {
    return TrainerTrainingsState(
      isLoading: isLoading ?? this.isLoading,
      trainings: trainings ?? this.trainings,
      error: error,
    );
  }
}
