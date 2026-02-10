import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/model/training_models.dart';
import '../../../domain/repository/training_repository.dart';
import '../../../providers.dart';
import '../../profile/providers.dart';

class DvoranaOptionVm {
  final String id;
  final String nazivDvorane;
  final String nazivTeretane;

  DvoranaOptionVm({
    required this.id,
    required this.nazivDvorane,
    required this.nazivTeretane,
  });
}

class CreateTrainingState {
  final bool isLoading;
  final bool isSubmitting;
  final bool created;
  final String? errorMessage;

  final List<DvoranaSimple> dvorane;
  final List<VrstaTreninga> vrste;

  final String? selectedDvoranaId;
  final bool useExistingVrsta;
  final String? selectedVrstaId;

  final String newVrstaNaziv;
  final String newVrstaTezina;
  final String maxBrojSportasa;

  const CreateTrainingState({
    required this.isLoading,
    required this.isSubmitting,
    required this.created,
    required this.errorMessage,
    required this.dvorane,
    required this.vrste,
    required this.selectedDvoranaId,
    required this.useExistingVrsta,
    required this.selectedVrstaId,
    required this.newVrstaNaziv,
    required this.newVrstaTezina,
    required this.maxBrojSportasa,
  });

  factory CreateTrainingState.initial() => const CreateTrainingState(
    isLoading: true,
    isSubmitting: false,
    created: false,
    errorMessage: null,
    dvorane: [],
    vrste: [],
    selectedDvoranaId: null,
    useExistingVrsta: true,
    selectedVrstaId: null,
    newVrstaNaziv: '',
    newVrstaTezina: '',
    maxBrojSportasa: '',
  );

  CreateTrainingState copyWith({
    bool? isLoading,
    bool? isSubmitting,
    bool? created,
    String? errorMessage,
    List<DvoranaSimple>? dvorane,
    List<VrstaTreninga>? vrste,
    String? selectedDvoranaId,
    bool? useExistingVrsta,
    String? selectedVrstaId,
    String? newVrstaNaziv,
    String? newVrstaTezina,
    String? maxBrojSportasa,
  }) {
    return CreateTrainingState(
      isLoading: isLoading ?? this.isLoading,
      isSubmitting: isSubmitting ?? this.isSubmitting,
      created: created ?? this.created,
      errorMessage: errorMessage,
      dvorane: dvorane ?? this.dvorane,
      vrste: vrste ?? this.vrste,
      selectedDvoranaId: selectedDvoranaId ?? this.selectedDvoranaId,
      useExistingVrsta: useExistingVrsta ?? this.useExistingVrsta,
      selectedVrstaId: selectedVrstaId ?? this.selectedVrstaId,
      newVrstaNaziv: newVrstaNaziv ?? this.newVrstaNaziv,
      newVrstaTezina: newVrstaTezina ?? this.newVrstaTezina,
      maxBrojSportasa: maxBrojSportasa ?? this.maxBrojSportasa,
    );
  }
}

final createTrainingControllerProvider =
StateNotifierProvider.autoDispose<CreateTrainingController, CreateTrainingState>(
      (ref) {
    final repo = ref.watch(trainingRepositoryProvider);
    final controller = CreateTrainingController(repo);
    controller.load();
    return controller;
  },
);

class CreateTrainingController extends StateNotifier<CreateTrainingState> {
  final TrainingRepository _repo;

  CreateTrainingController(this._repo) : super(CreateTrainingState.initial());

  Future<void> load() async {
    try {
      state = state.copyWith(isLoading: true, errorMessage: null);

      final vrste = await _repo.getVrsteTreninga();

      final dvorane = await _repo.getDvorane();

      state = state.copyWith(
        isLoading: false,
        vrste: vrste,
        dvorane: dvorane,
        selectedVrstaId: vrste.isNotEmpty ? vrste.first.idVrTreninga : null,
        selectedDvoranaId: dvorane.isNotEmpty ? dvorane.first.idDvorane : null,
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void setDvorana(String? id) => state = state.copyWith(selectedDvoranaId: id);

  void setUseExistingVrsta(bool v) =>
      state = state.copyWith(useExistingVrsta: v, errorMessage: null);

  void setVrsta(String? id) => state = state.copyWith(selectedVrstaId: id);

  void setNewVrstaNaziv(String v) => state = state.copyWith(newVrstaNaziv: v);
  void setNewVrstaTezina(String v) => state = state.copyWith(newVrstaTezina: v);
  void setMaxBrojSportasa(String v) => state = state.copyWith(maxBrojSportasa: v);

  Future<void> submit() async {
    try {
      state = state.copyWith(isSubmitting: true, errorMessage: null);

      final dvoranaId = state.selectedDvoranaId;
      if (dvoranaId == null) throw Exception('Odaberite dvoranu.');

      final max = int.tryParse(state.maxBrojSportasa.trim());
      if (max == null || max <= 0) throw Exception('Neispravan maks. broj sportaša.');

      String? existingVrstaId;
      String? newNaziv;
      int? newTezina;

      if (state.useExistingVrsta) {
        existingVrstaId = state.selectedVrstaId;
        if (existingVrstaId == null) throw Exception('Odaberite vrstu treninga.');
      } else {
        newNaziv = state.newVrstaNaziv.trim();
        newTezina = int.tryParse(state.newVrstaTezina.trim());
        if (newNaziv.isEmpty) throw Exception('Naziv vrste je obavezan.');
        if (newTezina == null || newTezina < 1 || newTezina > 10) {
          throw Exception('Težina mora biti između 1 i 10.');
        }
      }

      await _repo.createTrening(
        CreateTreningInput(
          dvoranaId: dvoranaId,
          maksBrojSportasa: max,
          existingVrstaId: existingVrstaId,
          newVrstaNaziv: newNaziv,
          newVrstaTezina: newTezina,
        ),
      );

      state = state.copyWith(isSubmitting: false, created: true);
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
    }
  }
}
