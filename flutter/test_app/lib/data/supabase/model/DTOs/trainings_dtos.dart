import '../../../../domain/model/training_models.dart';

class PrijavaFullDto {
  final String idPrijave;
  final String idSportasa;
  final bool dolazakNaTrening;
  final int? ocjenaTreninga;
  final RasporedDto raspored;

  PrijavaFullDto({
    required this.idPrijave,
    required this.idSportasa,
    required this.dolazakNaTrening,
    required this.ocjenaTreninga,
    required this.raspored,
  });

  factory PrijavaFullDto.fromJson(Map<String, dynamic> json) {
    return PrijavaFullDto(
      idPrijave: json['IdPrijave'] as String,
      idSportasa: json['IdSportasa'] as String,
      dolazakNaTrening: json['DolazakNaTrening'] as bool,
      ocjenaTreninga:
      json['OcjenaTreninga'] == null ? null : json['OcjenaTreninga'] as int,
      raspored: RasporedDto.fromJson(json['Raspored'] as Map<String, dynamic>),
    );
  }
}

class RasporedDto {
  final String idRasporeda;
  final DateTime pocetakVrijeme;
  final DateTime zavrsetakVrijeme;
  final String idTrenera;
  final TreningDto trening;

  RasporedDto({
    required this.idRasporeda,
    required this.pocetakVrijeme,
    required this.zavrsetakVrijeme,
    required this.idTrenera,
    required this.trening,
  });

  factory RasporedDto.fromJson(Map<String, dynamic> json) {
    return RasporedDto(
      idRasporeda: json['IdRasporeda'] as String,
      pocetakVrijeme: DateTime.parse(json['PocetakVrijeme'] as String),
      zavrsetakVrijeme: DateTime.parse(json['ZavrsetakVrijeme'] as String),
      idTrenera: json['IdTrenera'] as String,
      trening: TreningDto.fromJson(json['Trening'] as Map<String, dynamic>),
    );
  }
}

class TreningDto {
  final String idTreninga;
  final String idVrTreninga;
  final String idDvOdr;
  final int maksBrojSportasa;
  final DvoranaDto dvorana;
  final VrstaTreningaDto vrstaTreninga;

  TreningDto({
    required this.idTreninga,
    required this.idVrTreninga,
    required this.idDvOdr,
    required this.maksBrojSportasa,
    required this.dvorana,
    required this.vrstaTreninga,
  });

  factory TreningDto.fromJson(Map<String, dynamic> json) {
    return TreningDto(
      idTreninga: json['IdTreninga'] as String,
      idVrTreninga: json['IdVrTreninga'] as String,
      idDvOdr: json['IdDvOdr'] as String,
      maksBrojSportasa: json['MaksBrojSportasa'] as int,
      dvorana: DvoranaDto.fromJson(json['Dvorana'] as Map<String, dynamic>),
      vrstaTreninga: VrstaTreningaDto.fromJson(
        json['VrstaTrening'] as Map<String, dynamic>,
      ),
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

class TeretanaDto {
  final String idTeretane;
  final String nazivTeretane;
  final String adresa;
  final String mjesto;

  TeretanaDto({
    required this.idTeretane,
    required this.nazivTeretane,
    required this.adresa,
    required this.mjesto,
  });

  factory TeretanaDto.fromJson(Map<String, dynamic> json) {
    return TeretanaDto(
      idTeretane: json['IdTeretane'] as String,
      nazivTeretane: json['NazivTeretane'] as String,
      adresa: json['Adresa'] as String,
      mjesto: json['Mjesto'] as String,
    );
  }
}

class VrstaTreningaDto {
  final String idVrTreninga;
  final String nazivVrTreninga;
  final int tezina;

  VrstaTreningaDto({
    required this.idVrTreninga,
    required this.nazivVrTreninga,
    required this.tezina,
  });

  factory VrstaTreningaDto.fromJson(Map<String, dynamic> json) {
    return VrstaTreningaDto(
      idVrTreninga: json['IdVrTreninga'] as String,
      nazivVrTreninga: json['NazivVrTreninga'] as String,
      tezina: json['Tezina'] as int,
    );
  }
}

class AvailableTrainingEdgeDto {
  final String rasporedId;
  final DateTime startTime;
  final DateTime endTime;
  final String treningId;
  final String treningVrstaNaziv;
  final int maxParticipants;
  final String dvoranaId;
  final String dvoranaNaziv;
  final String trenerId;
  final String trenerIme;
  final String trenerPrezime;
  final int currentSignups;
  final bool isFull;
  final String? teretanaNaziv;

  AvailableTrainingEdgeDto({
    required this.rasporedId,
    required this.startTime,
    required this.endTime,
    required this.treningId,
    required this.treningVrstaNaziv,
    required this.maxParticipants,
    required this.dvoranaId,
    required this.dvoranaNaziv,
    required this.trenerId,
    required this.trenerIme,
    required this.trenerPrezime,
    required this.currentSignups,
    required this.isFull,
    this.teretanaNaziv,
  });

  factory AvailableTrainingEdgeDto.fromJson(Map<String, dynamic> json) {
    return AvailableTrainingEdgeDto(
      rasporedId: json['raspored_id'] as String,
      startTime: DateTime.parse(json['start_time'] as String),
      endTime: DateTime.parse(json['end_time'] as String),
      treningId: json['trening_id'] as String,
      treningVrstaNaziv: json['trening_vrsta_naziv'] as String,
      maxParticipants: (json['max_participants'] as num).toInt(),
      dvoranaId: json['dvorana_id'] as String,
      dvoranaNaziv: json['dvorana_naziv'] as String,
      trenerId: json['trener_id'] as String,
      trenerIme: json['trener_ime'] as String,
      trenerPrezime: json['trener_prezime'] as String,
      currentSignups: (json['current_signups'] as num).toInt(),
      isFull: json['is_full'] as bool,
      teretanaNaziv: json['teretana_naziv'] as String?,    );
  }

  Map<String, dynamic> toJson() {
    return {
      'raspored_id': rasporedId,
      'start_time': startTime.toIso8601String(),
      'end_time': endTime.toIso8601String(),
      'trening_id': treningId,
      'trening_vrsta_naziv': treningVrstaNaziv,
      'max_participants': maxParticipants,
      'dvorana_id': dvoranaId,
      'dvorana_naziv': dvoranaNaziv,
      'trener_id': trenerId,
      'trener_ime': trenerIme,
      'trener_prezime': trenerPrezime,
      'current_signups': currentSignups,
      'is_full': isFull,
      if (teretanaNaziv != null) 'teretana_naziv': teretanaNaziv,
    };
  }
}

extension AvailableTrainingEdgeDtoMapper on AvailableTrainingEdgeDto {
  DostupniTrening toDomain() {
    return DostupniTrening(
      rasporedId: rasporedId,
      treningId: treningId,
      nazivVrsteTreninga: treningVrstaNaziv,
      pocetak: startTime,
      kraj: endTime,
      dvoranaId: dvoranaId,
      nazivDvorane: dvoranaNaziv,
      nazivTeretane: teretanaNaziv,
      trenerId: trenerId,
      trenerIme: trenerIme,
      trenerPrezime: trenerPrezime,
      maxBrojSportasa: maxParticipants,
      trenutnoPrijavljenih: currentSignups,
      isFull: isFull,
    );
  }
}


class VrstaTreningaDtoFull {
  final String idVrTreninga;
  final String nazivVrTreninga;
  final int tezina;

  VrstaTreningaDtoFull({
    required this.idVrTreninga,
    required this.nazivVrTreninga,
    required this.tezina,
  });

  factory VrstaTreningaDtoFull.fromJson(Map<String, dynamic> json) {
    return VrstaTreningaDtoFull(
      idVrTreninga: json['IdVrTreninga'] as String,
      nazivVrTreninga: json['NazivVrTreninga'] as String,
      tezina: json['Tezina'] as int,
    );
  }
}

class VrstaTreningaCreateDto {
  final String nazivVrTreninga;
  final int tezina;

  VrstaTreningaCreateDto({
    required this.nazivVrTreninga,
    required this.tezina,
  });

  Map<String, dynamic> toJson() => {
    'NazivVrTreninga': nazivVrTreninga,
    'Tezina': tezina,
  };
}

class TreningCreateDto {
  final String idDvOdr;
  final String? idVrTreninga;  final String? idLaksijegTreninga;
  final String? idTezegTreninga;
  final int maksBrojSportasa;

  TreningCreateDto({
    required this.idDvOdr,
    required this.maksBrojSportasa,
    this.idVrTreninga,
    this.idLaksijegTreninga,
    this.idTezegTreninga,
  });

  Map<String, dynamic> toJson() => {
    'IdDvOdr': idDvOdr,
    'IdVrTreninga': idVrTreninga,
    'IdLaksijegTreninga': idLaksijegTreninga,
    'IdTezegTreninga': idTezegTreninga,
    'MaksBrojSportasa': maksBrojSportasa,
  }..removeWhere((k, v) => v == null);
}

class CreateTreningRequestDto {
  final TreningCreateDto trening;
  final VrstaTreningaCreateDto? vrsta;
  CreateTreningRequestDto({
    required this.trening,
    this.vrsta,
  });

  Map<String, dynamic> toJson() => {
    'trening': trening.toJson(),
    'vrsta': vrsta?.toJson(),
  }..removeWhere((k, v) => v == null);
}

class CreateTreningResponseDto {
  final Map<String, dynamic> trening;
  final Map<String, dynamic>? vrsta;

  CreateTreningResponseDto({
    required this.trening,
    this.vrsta,
  });

  factory CreateTreningResponseDto.fromJson(Map<String, dynamic> json) {
    return CreateTreningResponseDto(
      trening: (json['trening'] as Map).cast<String, dynamic>(),
      vrsta: json['vrsta'] == null ? null : (json['vrsta'] as Map).cast<String, dynamic>(),
    );
  }
}

class TeretanaDtoNested {
  final String idTeretane;
  final String nazivTeretane;
  final String adresa;
  final String mjesto;

  TeretanaDtoNested({
    required this.idTeretane,
    required this.nazivTeretane,
    required this.adresa,
    required this.mjesto,
  });

  factory TeretanaDtoNested.fromJson(Map<String, dynamic> json) => TeretanaDtoNested(
    idTeretane: json['IdTeretane'] as String,
    nazivTeretane: json['NazivTeretane'] as String,
    adresa: json['Adresa'] as String,
    mjesto: json['Mjesto'] as String,
  );
}

class DvoranaDtoNested {
  final String idDvorane;
  final String nazivDvorane;
  final TeretanaDtoNested teretana;

  DvoranaDtoNested({
    required this.idDvorane,
    required this.nazivDvorane,
    required this.teretana,
  });

  factory DvoranaDtoNested.fromJson(Map<String, dynamic> json) => DvoranaDtoNested(
    idDvorane: json['IdDvorane'] as String,
    nazivDvorane: json['NazivDvorane'] as String,
    teretana: TeretanaDtoNested.fromJson((json['Teretana'] as Map).cast<String, dynamic>()),
  );
}

class VrstaTreningaDtoNested {
  final String idVrTreninga;
  final String nazivVrTreninga;
  final int tezina;

  VrstaTreningaDtoNested({
    required this.idVrTreninga,
    required this.nazivVrTreninga,
    required this.tezina,
  });

  factory VrstaTreningaDtoNested.fromJson(Map<String, dynamic> json) => VrstaTreningaDtoNested(
    idVrTreninga: json['IdVrTreninga'] as String,
    nazivVrTreninga: json['NazivVrTreninga'] as String,
    tezina: json['Tezina'] as int,
  );
}

class TreningOptionDto {
  final String idTreninga;
  final int maksBrojSportasa;
  final VrstaTreningaDtoNested vrstaTreninga;
  final DvoranaDtoNested dvorana;

  TreningOptionDto({
    required this.idTreninga,
    required this.maksBrojSportasa,
    required this.vrstaTreninga,
    required this.dvorana,
  });

  factory TreningOptionDto.fromJson(Map<String, dynamic> json) {
    return TreningOptionDto(
      idTreninga: json['IdTreninga'] as String,
      maksBrojSportasa: json['MaksBrojSportasa'] as int,
      vrstaTreninga: VrstaTreningaDtoNested.fromJson(
        (json['VrstaTreninga'] as Map).cast<String, dynamic>(),
      ),
      dvorana: DvoranaDtoNested.fromJson(
        (json['Dvorana'] as Map).cast<String, dynamic>(),
      ),
    );
  }
}

class CreateRasporedRequestDto {
  final String idTreninga;
  final String idTrenera;  final String pocetakVrijemeIso;
  final String zavrsetakVrijemeIso;

  CreateRasporedRequestDto({
    required this.idTreninga,
    required this.idTrenera,
    required this.pocetakVrijemeIso,
    required this.zavrsetakVrijemeIso,
  });

  Map<String, dynamic> toJson() => {
    'raspored': {
      'IdTreninga': idTreninga,
      'PocetakVrijeme': pocetakVrijemeIso,
      'ZavrsetakVrijeme': zavrsetakVrijemeIso,
      'IdTrenera': idTrenera,
    },
  };
}

class DeleteRasporedResponseDto {
  final bool success;

  DeleteRasporedResponseDto({required this.success});

  factory DeleteRasporedResponseDto.fromJson(Map<String, dynamic> json) =>
      DeleteRasporedResponseDto(success: json['success'] == true);
}

class DvoranaSimpleDto {
  final String idDvorane;
  final String nazivDvorane;
  final String teretanaId;

  DvoranaSimpleDto({
    required this.idDvorane,
    required this.nazivDvorane,
    required this.teretanaId,
  });

  factory DvoranaSimpleDto.fromJson(Map<String, dynamic> json) {
    return DvoranaSimpleDto(
      idDvorane: json['IdDvorane'] as String,
      nazivDvorane: json['NazivDvorane'] as String,
      teretanaId: json['IdTeretane'] as String,
    );
  }
}

class NewRasporedResponseDto {
  final String idRasporeda;
  final String idTreninga;
  final String pocetakVrijeme;  final String zavrsetakVrijeme;  final String idTrenera;

  NewRasporedResponseDto({
    required this.idRasporeda,
    required this.idTreninga,
    required this.pocetakVrijeme,
    required this.zavrsetakVrijeme,
    required this.idTrenera,
  });

  factory NewRasporedResponseDto.fromJson(Map<String, dynamic> json) {
    return NewRasporedResponseDto(
      idRasporeda: json['IdRasporeda'] as String,
      idTreninga: json['IdTreninga'] as String,
      pocetakVrijeme: json['PocetakVrijeme'] as String,
      zavrsetakVrijeme: json['ZavrsetakVrijeme'] as String,
      idTrenera: json['IdTrenera'] as String,
    );
  }
}



