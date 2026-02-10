
import 'package:test_app/data/supabase/model/DTOs/trainings_dtos.dart';

class AttendeeDto {
  final String prijavaId;
  final String sportasId;
  final String ime;
  final String prezime;
  final bool dolazakNaTrening;
  final int? ocjenaTreninga;

  AttendeeDto({
    required this.prijavaId,
    required this.sportasId,
    required this.ime,
    required this.prezime,
    required this.dolazakNaTrening,
    required this.ocjenaTreninga,
  });

  factory AttendeeDto.fromJson(Map<String, dynamic> json) {
    return AttendeeDto(
      prijavaId: json['prijava_id'] as String,
      sportasId: json['sportas_id'] as String,
      ime: json['ime'] as String,
      prezime: json['prezime'] as String,
      dolazakNaTrening: (json['dolazak_na_trening'] as bool?) ?? false,
      ocjenaTreninga: json['ocjena_treninga'] as int?,
    );
  }
}

class AttendanceUpdateItemDto {
  final String sportasId;
  final bool dolazak;

  AttendanceUpdateItemDto({
    required this.sportasId,
    required this.dolazak,
  });

  Map<String, dynamic> toJson() => {
    'sportas_id': sportasId,
    'dolazak': dolazak,
  };
}

class AttendanceUpdateRequestDto {
  final String rasporedId;
  final List<AttendanceUpdateItemDto> updates;

  AttendanceUpdateRequestDto({
    required this.rasporedId,
    required this.updates,
  });

  Map<String, dynamic> toJson() => {
    'raspored_id': rasporedId,
    'updates': updates.map((u) => u.toJson()).toList(),
  };
}

class AttendanceUpdateResponseDto {
  final bool success;
  final int updated;

  AttendanceUpdateResponseDto({
    required this.success,
    required this.updated,
  });

  factory AttendanceUpdateResponseDto.fromJson(Map<String, dynamic> json) {
    return AttendanceUpdateResponseDto(
      success: (json['success'] as bool?) ?? false,
      updated: (json['updated'] as num?)?.toInt() ?? 0,
    );
  }
}


class RasporedFullDto {
  final String idRasporeda;
  final DateTime pocetakVrijeme;
  final DateTime zavrsetakVrijeme;
  final String idTrenera;
  final TreningFullDto trening;

  RasporedFullDto({
    required this.idRasporeda,
    required this.pocetakVrijeme,
    required this.zavrsetakVrijeme,
    required this.idTrenera,
    required this.trening,
  });

  factory RasporedFullDto.fromJson(Map<String, dynamic> json) {
    return RasporedFullDto(
      idRasporeda: json['IdRasporeda'] as String,
      pocetakVrijeme: DateTime.parse(json['PocetakVrijeme'] as String),
      zavrsetakVrijeme: DateTime.parse(json['ZavrsetakVrijeme'] as String),
      idTrenera: json['IdTrenera'] as String,
      trening: TreningFullDto.fromJson(json['Trening'] as Map<String, dynamic>),
    );
  }
}

class TreningFullDto {
  final String idTreninga;
  final String idVrTreninga;
  final String idDvOdr;
  final int maksBrojSportasa;
  final DvoranaDto dvorana;
  final VrstaTreningDto vrstaTrening;

  TreningFullDto({
    required this.idTreninga,
    required this.idVrTreninga,
    required this.idDvOdr,
    required this.maksBrojSportasa,
    required this.dvorana,
    required this.vrstaTrening,
  });

  factory TreningFullDto.fromJson(Map<String, dynamic> json) {
    return TreningFullDto(
      idTreninga: json['IdTreninga'] as String,
      idVrTreninga: json['IdVrTreninga'] as String,
      idDvOdr: json['IdDvOdr'] as String,
      maksBrojSportasa: json['MaksBrojSportasa'] as int,
      dvorana: DvoranaDto.fromJson(json['Dvorana'] as Map<String, dynamic>),
      vrstaTrening:
      VrstaTreningDto.fromJson(json['VrstaTrening'] as Map<String, dynamic>),
    );
  }
}

class DvoranaDto {
  final String idDvorane;
  final String nazivDvorane;
  final TeretanaDto teretana;

  DvoranaDto({
    required this.idDvorane,
    required this.nazivDvorane,
    required this.teretana,
  });

  factory DvoranaDto.fromJson(Map<String, dynamic> json) {
    return DvoranaDto(
      idDvorane: json['IdDvorane'] as String,
      nazivDvorane: json['NazivDvorane'] as String,
      teretana:
      TeretanaDto.fromJson(json['Teretana'] as Map<String, dynamic>),
    );
  }
}



class VrstaTreningDto {
  final String idVrTreninga;
  final String nazivVrTreninga;
  final int tezina;

  VrstaTreningDto({
    required this.idVrTreninga,
    required this.nazivVrTreninga,
    required this.tezina,
  });

  factory VrstaTreningDto.fromJson(Map<String, dynamic> json) {
    return VrstaTreningDto(
      idVrTreninga: json['IdVrTreninga'] as String,
      nazivVrTreninga: json['NazivVrTreninga'] as String,
      tezina: json['Tezina'] as int,
    );
  }
}
