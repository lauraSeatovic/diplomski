import '../../domain/model/sportas_user.dart';
import '../../domain/model/prijavljen_trening.dart';

class ProfileState {
  final bool isLoading;
  final SportasUser? user;
  final List<PrijavljenTrening> prijavljeniTreninzi;
  final String? error;

  const ProfileState({
    required this.isLoading,
    this.user,
    this.error,
    this.prijavljeniTreninzi = const [],
  });

  factory ProfileState.initial() => const ProfileState(
    isLoading: true,
    user: null,
    error: null,
    prijavljeniTreninzi: const [],
  );

  ProfileState copyWith({
    bool? isLoading,
    SportasUser? user,
    List<PrijavljenTrening>? prijavljeniTreninzi,
    String? error,
  }) {
    return ProfileState(
      isLoading: isLoading ?? this.isLoading,
      user: user ?? this.user,
      prijavljeniTreninzi:
      prijavljeniTreninzi ?? this.prijavljeniTreninzi,
      error: error,
    );
  }
}
