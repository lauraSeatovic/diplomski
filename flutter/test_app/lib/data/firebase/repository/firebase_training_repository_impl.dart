import '../../../domain/model/common_models.dart';
import '../../../domain/model/prijavljen_trening.dart';
import '../../../domain/model/training_models.dart';
import '../../../domain/model/trener_models.dart';
import '../../../domain/repository/training_repository.dart';

import '../model/dtos.dart';
import '../model/firebase_mapper.dart';
import '../network/service/training_service.dart';

class FirebaseTrainingRepositoryImpl implements TrainingRepository {
  final FirebaseTrainingService service;

  FirebaseTrainingRepositoryImpl(this.service);

  @override
  Future<List<PrijavljenTrening>> getTrainingsForUser(String sportasId) async {
    try {
      final items = await service.myTrainingsRaw();
      return items.map(FirebaseMapper.myTrainingsItemToDomain).toList();
    } catch (error) {
      return [];
    }
  }

  @override
  Future<List<Teretana>> getTeretane() async {
    final dtoList = await service.getTeretane();
    return dtoList.map(FirebaseMapper.teretanaToDomain).toList();
  }

  @override
  Future<List<DvoranaSimple>> getDvorane() async {
    final dtoList = await service.getDvorane();
    return dtoList.map(FirebaseMapper.dvoranaToDomain).toList();
  }

  @override
  Future<List<VrstaTreninga>> getVrsteTreninga() async {
    final dtoList = await service.getVrsteTreninga();
    return dtoList.map(FirebaseMapper.vrstaToDomain).toList();
  }

  @override
  Future<List<VrstaTreningaOption>> getVrsteTreningaOptions() async {
    final dtoList = await service.getVrsteTreninga();
    return dtoList.map(FirebaseMapper.vrstaToOptionDomain).toList();
  }

  @override
  Future<List<TreningOption>> getTreningOptions() async {
    final dtos = await service.getTreningOptions();
    return dtos.map(FirebaseMapper.treningOptionToDomain).toList();
  }

  @override
  Future<List<DostupniTrening>> getTrainingsByDateAndTeretana({
    required String teretanaId,
    required DateTime date,
  }) async {
    final req = TrainingsByGymDateRequestDto(
      teretanaId: teretanaId,
      date: _dateToYyyyMmDd(date),
    );

    final dto = await service.trainingsByGymDate(req);
    return dto.items.map(FirebaseMapper.availableTrainingToDomain).toList();
  }

  @override
  Future<SignUpResult> signUpForTraining({
    required String rasporedId,
    required String korisnikId,
  }) async {
    try {
      final req = SignupForTrainingRequestDto(rasporedId: rasporedId);
      final resp = await service.signupForTraining(req);
      return FirebaseMapper.signupResultToDomain(resp);
    } catch (_) {
      return SignUpResult.error;
    }
  }

  @override
  Future<List<TrainerTraining>> getTrainingsForTrainer(String trenerId) async {
    final dto = await service.trainerTrainings();
    return dto.items.map(FirebaseMapper.trainerTrainingToDomain).toList();
  }

  @override
  Future<List<PrijavljeniSudionik>> getAttendeesForRaspored(String rasporedId) async {
    final req = GetAttendeesRequestDto(rasporedId: rasporedId);
    final dto = await service.attendeesByRaspored(req);
    return dto.items.map(FirebaseMapper.attendeeToDomain).toList();
  }

  @override
  Future<AttendanceUpdateResult> setAttendanceForRaspored({
    required String rasporedId,
    required List<AttendanceUpdate> updates,
  }) async {
    final req = FirebaseMapper.toAttendanceRequestDto(
      rasporedId: rasporedId,
      updates: updates,
    );

    final dto = await service.setAttendanceForRaspored(req);
    return FirebaseMapper.attendanceResultToDomain(dto);
  }

  @override
  Future<void> createTrening(CreateTreningInput input) async {
    final req = FirebaseMapper.toCreateTrainingRequestDto(input);
    await service.createTraining(req);
  }

  @override
  Future<void> createRaspored(CreateRasporedInput input) async {
    final req = FirebaseMapper.toCreateRasporedRequestDto(input);
    await service.createRaspored(req);
  }

  @override
  Future<DeleteRasporedResult> deleteRaspored(String rasporedId) async {
    final req = DeleteRasporedRequestDto(rasporedId: rasporedId);
    final dto = await service.deleteRaspored(req);
    return FirebaseMapper.deleteRasporedToDomain(dto);
  }

  String _dateToYyyyMmDd(DateTime d) {
    final u = DateTime(d.year, d.month, d.day);
    final mm = u.month.toString().padLeft(2, '0');
    final dd = u.day.toString().padLeft(2, '0');
    return '${u.year}-$mm-$dd';
  }
}
