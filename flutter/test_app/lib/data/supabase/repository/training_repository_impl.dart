import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:test_app/data/supabase/model/DTOs/trainings_dtos.dart';

import '../../../domain/model/common_models.dart';
import '../../../domain/model/prijavljen_trening.dart';
import '../../../domain/model/training_models.dart';
import '../../../domain/model/trener_models.dart';
import '../../../domain/repository/training_repository.dart';
import '../model/DTOs/trener_dtos.dart';
import '../model/mapper/training_mapper.dart';
import '../network/service/training_service.dart';

class TrainingRepositoryImpl implements TrainingRepository {
  final TrainingService service;

  TrainingRepositoryImpl(this.service);

  @override
  Future<List<PrijavljenTrening>> getTrainingsForUser(String sportasId) async {
    try {
      final prijaveDto = await service.getPrijaveFullForUser(sportasId);
      return prijaveDto.map(prijavaFullDtoToDomain).toList();
    } catch (_) {
      return [];
    }
  }

  @override
  Future<List<Teretana>> getTeretane() async {
    final dtoList = await service.getTeretane();
    return dtoList.map((d) => d.toDomain()).toList();
  }

  @override
  Future<List<DostupniTrening>> getTrainingsByDateAndTeretana({
    required String teretanaId,
    required DateTime date,
  }) async {
    final dtoList = await service.getAvailableTrainings(
      teretanaId: teretanaId,
      date: date,
    );
    return dtoList.map((d) => d.toDomain()).toList();
  }

  @override
  Future<SignUpResult> signUpForTraining({
    required String rasporedId,
    required String korisnikId,
  }) async {
    try {
      final data = await service.signUpForTraining(
        korisnikId: korisnikId,
        rasporedId: rasporedId,
      );

      if (data != null && data['success'] == true) {
        return SignUpResult.success;
      }

      return SignUpResult.error;
    } on PostgrestException catch (e) {
      final msg = e.message ?? '';
      if (msg.contains('already')) {
        return SignUpResult.userAlreadySigned;
      }
      if (msg.contains('full')) {
        return SignUpResult.trainingFull;
      }

      return SignUpResult.error;
    } catch (_) {
      return SignUpResult.error;
    }
  }

  @override
  Future<List<TrainerTraining>> getTrainingsForTrainer(String trenerId) async {
    final List<RasporedFullDto> dtoList =
    await service.getTrainingsForTrainer(trenerId: trenerId);

    return dtoList.map(RasporedFullMapper.toTrainerTraining).toList();
  }

  @override
  Future<List<PrijavljeniSudionik>> getAttendeesForRaspored(String rasporedId) async {
    final List<AttendeeDto> dtoList =
    await service.getAttendeesByRaspored(rasporedId: rasporedId);

    return dtoList.map(TrainerMappers.toDomainAttendee).toList();
  }

  @override
  Future<AttendanceUpdateResult> setAttendanceForRaspored({
    required String rasporedId,
    required List<AttendanceUpdate> updates,
  }) async {
    final request = TrainerMappers.toAttendanceRequestDto(
      rasporedId: rasporedId,
      updates: updates,
    );

    final AttendanceUpdateResponseDto response =
    await service.setAttendanceForRaspored(request: request);

    return TrainerMappers.toDomainAttendanceResult(response);
  }

  @override
  Future<List<VrstaTreninga>> getVrsteTreninga() async {
    final dtos = await service.getVrsteTreninga();
    return dtos.map((d) => d.toDomain()).toList();
  }

  @override
  Future<List<VrstaTreningaOption>> getVrsteTreningaOptions() async {
    final dtos = await service.getVrsteTreninga();
    return dtos.map((d) => d.toOption()).toList();
  }

  @override
  Future<List<TreningOption>> getTreningOptions() async {
    final dtos = await service.getTreningOptions();
    return dtos.map((d) => d.toDomain()).toList();
  }

  @override
  Future<void> createTrening(CreateTreningInput input) async {
    final treningDto = TreningCreateDto(
      idDvOdr: input.dvoranaId,
      maksBrojSportasa: input.maksBrojSportasa,
      idVrTreninga: input.existingVrstaId,
      idLaksijegTreninga: input.idLaksijegTreninga,
      idTezegTreninga: input.idTezegTreninga,
    );

    VrstaTreningaCreateDto? vrstaDto;
    if (input.existingVrstaId == null) {
      if (input.newVrstaNaziv == null || input.newVrstaNaziv!.trim().isEmpty) {
        throw Exception('Naziv vrste treninga je obavezan.');
      }
      if (input.newVrstaTezina == null) {
        throw Exception('Težina vrste treninga je obavezna.');
      }
      vrstaDto = VrstaTreningaCreateDto(
        nazivVrTreninga: input.newVrstaNaziv!.trim(),
        tezina: input.newVrstaTezina!,
      );
    }

    final req = CreateTreningRequestDto(
      trening: treningDto,
      vrsta: vrstaDto,
    );

    await service.createTrening(req);
  }

  @override
  Future<void> createRaspored(CreateRasporedInput input) async {
    final startIso = input.start.toUtc().toIso8601String();
    final endIso = input.end.toUtc().toIso8601String();

    final req = CreateRasporedRequestDto(
      idTreninga: input.treningId,
      idTrenera: 'IGNORED',
      pocetakVrijemeIso: startIso,
      zavrsetakVrijemeIso: endIso,
    );

    final dto = await service.createRaspored(req);
    return;
  }

  @override
  Future<DeleteRasporedResult> deleteRaspored(String rasporedId) async {
    final dto = await service.deleteRaspored(rasporedId);
    return dto.toDomain();
  }

  @override
  Future<List<DvoranaSimple>> getDvorane() async {
    final dtoList = await service.getDvorane();
    return dtoList.map((d) => d.toDomain()).toList();
  }

}
