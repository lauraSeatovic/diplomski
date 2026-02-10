
import '../../domain/model/trener_models.dart';

class TrainerAttendeesState {
  final bool isLoading;
  final bool isEditMode;
  final bool isSaving;
  final List<PrijavljeniSudionik> attendees;
  final Map<String, bool> pending;  final String? error;

  const TrainerAttendeesState({
    required this.isLoading,
    required this.isEditMode,
    required this.isSaving,
    required this.attendees,
    required this.pending,
    this.error,
  });

  factory TrainerAttendeesState.initial() => const TrainerAttendeesState(
    isLoading: false,
    isEditMode: false,
    isSaving: false,
    attendees: [],
    pending: {},
  );

  TrainerAttendeesState copyWith({
    bool? isLoading,
    bool? isEditMode,
    bool? isSaving,
    List<PrijavljeniSudionik>? attendees,
    Map<String, bool>? pending,
    String? error,
  }) {
    return TrainerAttendeesState(
      isLoading: isLoading ?? this.isLoading,
      isEditMode: isEditMode ?? this.isEditMode,
      isSaving: isSaving ?? this.isSaving,
      attendees: attendees ?? this.attendees,
      pending: pending ?? this.pending,
      error: error,
    );
  }
}
