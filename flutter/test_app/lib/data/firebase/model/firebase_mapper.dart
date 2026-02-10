import '../../../domain/model/common_models.dart';
import '../../../domain/model/prijavljen_trening.dart';
import '../../../domain/model/training_models.dart';

import '../model/dtos.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

import 'package:cloud_firestore/cloud_firestore.dart';

import '../../../../domain/model/common_models.dart';
import '../../../../domain/model/prijavljen_trening.dart';
import '../../../../domain/model/training_models.dart';
import '../../../../domain/model/trener_models.dart';

import '../model/dtos.dart';

class FirebaseMapper {
  static DateTime parseFbDateTime(dynamic v) {
    if (v == null) {
      throw StateError('Timestamp je null.');
    }

    if (v is Timestamp) {
      return v.toDate();
    }

    if (v is Map) {
      final m = Map<String, dynamic>.from(v as Map);

      final seconds = _readInt(m['_seconds']) ?? _readInt(m['seconds']);
      final nanos = _readInt(m['_nanoseconds']) ?? _readInt(m['nanoseconds']) ?? 0;

      if (seconds != null) {
        final ms = seconds * 1000 + (nanos ~/ 1000000);
        return DateTime.fromMillisecondsSinceEpoch(ms, isUtc: true).toLocal();
      }
    }

    if (v is String) {
      final dt = DateTime.tryParse(v);
      if (dt != null) return dt.toLocal();
    }

    if (v is num) {
      return DateTime.fromMillisecondsSinceEpoch(v.toInt(), isUtc: true).toLocal();
    }

    throw StateError('Nepoznati format datuma/vremena: ${v.runtimeType}');
  }

  static int? _readInt(dynamic v) {
    if (v == null) return null;
    if (v is int) return v;
    if (v is double) return v.toInt();
    if (v is String) return int.tryParse(v);
    return null;
  }

  static Teretana teretanaToDomain(TeretanaDto dto) {
    return Teretana(
      idTeretane: dto.id,
      nazivTeretane: dto.nazivTeretane,
      adresa: dto.adresa,
      mjesto: dto.mjesto,
    );
  }

  static DvoranaSimple dvoranaToDomain(DvoranaDto dto) {
    return DvoranaSimple(
      idDvorane: dto.id,
      nazivDvorane: dto.nazivDvorane,
      teretanaId: dto.teretanaId!,
    );
  }

  static VrstaTreninga vrstaToDomain(VrstaTreningaDto dto) {
    return VrstaTreninga(
      idVrTreninga: dto.id,
      nazivVrTreninga: dto.nazivVrTreninga,
      tezina: dto.tezina,
    );
  }

  static VrstaTreningaOption vrstaToOptionDomain(VrstaTreningaDto dto) {
    return VrstaTreningaOption(
      idVrTreninga: dto.id,
      label: '${dto.nazivVrTreninga} (Težina ${dto.tezina})',
    );
  }

  static DostupniTrening availableTrainingToDomain(TrainingByGymDateItemDto dto) {
    final start = parseFbDateTime(dto.pocetakVrijeme);
    final end = parseFbDateTime(dto.zavrsetakVrijeme);

    return DostupniTrening(
      rasporedId: dto.rasporedId,
      treningId: dto.treningId,
      pocetak: start,
      kraj: end,

      nazivTeretane: dto.nazivTeretane,
      nazivDvorane: dto.nazivDvorane,
      nazivVrsteTreninga: dto.nazivVrsteTreninga,

      trenerIme: dto.trenerIme,
      trenerPrezime: dto.trenerPrezime,

      trenutnoPrijavljenih: dto.trenutnoPrijavljenih,
      maxBrojSportasa: dto.maxBrojSportasa,
      isFull: dto.isFull, dvoranaId: '', trenerId: '',
    );
  }

  static Map<String, dynamic> trainingDetailsToMap(TrainingDetailsResponseDto dto) {
    return {
      'treningId': dto.treningId,
      'rasporedId': dto.rasporedId,
      'vrstaId': dto.vrstaId,
      'nazivVrste': dto.nazivVrste,
      'tezina': dto.tezina,
      'pocetak': parseFbDateTime(dto.pocetakVrijeme),
      'kraj': parseFbDateTime(dto.zavrsetakVrijeme),
      'datum': dto.datum,
      'teretanaId': dto.teretanaId,
      'teretanaNaziv': dto.teretanaNaziv,
      'dvoranaId': dto.dvoranaId,
      'dvoranaNaziv': dto.dvoranaNaziv,
      'trenerId': dto.trenerId,
      'trenerIme': dto.trenerIme,
      'trenerPrezime': dto.trenerPrezime,
      'trenutnoPrijavljenih': dto.trenutnoPrijavljenih,
      'maxBrojSportasa': dto.maxBrojSportasa,
      'isFull': dto.isFull,
    };
  }

  static SignUpResult signupResultToDomain(SignupForTrainingResponseDto dto) {
    switch (dto.result) {
      case 'SUCCESS':
        return SignUpResult.success;
      case 'USER_ALREADY_SIGNED':
        return SignUpResult.userAlreadySigned;
      case 'TRAINING_FULL':
        return SignUpResult.trainingFull;
      default:
        return SignUpResult.error;
    }
  }

  static DeleteRaspasporedResultFromFirebase(DeleteRasporedResponseDto dto) {
    return DeleteRasporedResult(success: dto.deleted);
  }

  static PrijavljeniSudionik attendeeToDomain(AttendeeDto dto) {
    return PrijavljeniSudionik(
      prijavaId: dto.prijavaDocId,
      sportasId: dto.sportasId,
      ime: dto.ime,
      prezime: dto.prezime,
      dolazakNaTrening: dto.dolazakNaTrening,
      ocjenaTreninga: null,    );
  }

  static TrainerTraining trainerTrainingToDomain(TrainerTrainingItemDto dto) {
    final pocetak = parseFbDateTime(dto.pocetakVrijeme);
    final zavrsetak = parseFbDateTime(dto.zavrsetakVrijeme);

    return TrainerTraining(
      rasporedId: dto.rasporedId,
      pocetak: pocetak,
      zavrsetak: zavrsetak,
      vrstaNaziv: dto.vrstaTreningaNaziv,
      dvoranaNaziv: dto.dvoranaNaziv,
      teretanaNaziv: dto.teretanaNaziv,
    );
  }

  static SetAttendanceRequestDto toAttendanceRequestDto({
    required String rasporedId,
    required List<AttendanceUpdate> updates,
  }) {
    return SetAttendanceRequestDto(
      rasporedId: rasporedId,
      attendance: updates
          .map((u) => AttendanceEntryDto(
        sportasId: u.sportasId,
        present: u.dolazak,
      ))
          .toList(),
    );
  }

  static AttendanceUpdateResult attendanceResultToDomain(SetAttendanceResponseDto dto) {
    return AttendanceUpdateResult(
      success: dto.updated,
      updated: dto.count,
    );
  }

  static CreateTrainingRequestDto toCreateTrainingRequestDto(CreateTreningInput input) {
    final useExisting = input.existingVrstaId != null;

    if (!useExisting) {
      if (input.newVrstaNaziv == null || input.newVrstaNaziv!.trim().isEmpty) {
        throw Exception('Naziv vrste treninga je obavezan.');
      }
      if (input.newVrstaTezina == null) {
        throw Exception('Težina vrste treninga je obavezna.');
      }
    }

    return CreateTrainingRequestDto(
      dvoranaId: input.dvoranaId,
      useExistingVrsta: useExisting,
      vrstaId: input.existingVrstaId,
      novaVrstaNaziv: useExisting ? null : input.newVrstaNaziv!.trim(),
      novaVrstaTezina: useExisting ? null : input.newVrstaTezina,
      maksBrojSportasa: input.maksBrojSportasa,
    );
  }

  static CreateRasporedRequestDto toCreateRasporedRequestDto(CreateRasporedInput input) {
    return CreateRasporedRequestDto(
      treningId: input.treningId,
      teretanaId: input.treningId,
      pocetakIso: input.start.toUtc().toIso8601String(),
      zavrsetakIso: input.end.toUtc().toIso8601String(),
    );
  }

  static PrijavljenTrening myTrainingsItemToDomain(Map<String, dynamic> m) {
    final pocetakRaw = m['pocetakVrijeme'] ?? m['pocetak'] ?? m['start'];
    final zavrsetakRaw = m['zavrsetakVrijeme'] ?? m['kraj'] ?? m['end'];

    final pocetak = parseFbDateTime(pocetakRaw);
    final kraj = parseFbDateTime(zavrsetakRaw);

    return PrijavljenTrening(
      idPrijave: (m['idPrijave'] ?? m['prijavaDocId'] ?? m['prijavaId'] ?? '').toString(),
      idRasporeda: (m['rasporedId'] ?? m['idRasporeda'] ?? '').toString(),
      nazivVrsteTreninga: (m['naziv'] ??
          m['nazivVrste'] ??
          m['vrstaTreningaNaziv'] ??
          '')
          .toString(),
      pocetak: pocetak,
      kraj: kraj,
      nazivDvorane: (m['nazivDvorane'] ?? m['dvorana'] ?? '').toString(),
      nazivTeretane: (m['nazivTeretane'] ?? m['teretana'] ?? '').toString(),
      mjestoTeretane: (m['mjestoTeretane'] ?? m['mjesto'] ?? '').toString(),
      dolazakNaTrening: m['dolazakNaTrening'] == true,
      ocjenaTreninga: null,
    );
  }

  static DeleteRasporedResult deleteRasporedToDomain(DeleteRasporedResponseDto dto) {
    return DeleteRasporedResult(success: dto.deleted);
  }

  static TreningOption treningOptionToDomain(TreningOptionDto dto) {
    return TreningOption(
      idTreninga: dto.idTreninga,
      maksBrojSportasa: dto.maksBrojSportasa,
      label:
      '${dto.nazivVrTreninga} (Težina ${dto.tezina}) • ${dto.nazivTeretane} • ${dto.nazivDvorane} • Kapacitet ${dto.maksBrojSportasa}',
    );
  }

}




