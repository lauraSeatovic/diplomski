class ApiResponseDto<T> {
  final bool ok;
  final T? data;
  final String? code;
  final String? message;

  ApiResponseDto({
    required this.ok,
    this.data,
    this.code,
    this.message,
  });

  factory ApiResponseDto.fromJson(
      Map<String, dynamic> json,
      T Function(Object? raw) parseData,
      ) {
    final ok = json['ok'] == true;

    if (ok) {
      return ApiResponseDto<T>(
        ok: true,
        data: parseData(json['data']),
      );
    }

    return ApiResponseDto<T>(
      ok: false,
      code: json['code']?.toString(),
      message: json['message']?.toString(),
    );
  }

  T requireData() {
    if (!ok) {
      throw StateError(message ?? 'Greška (${code ?? "ERROR"}).');
    }
    if (data == null) {
      throw StateError('Neispravan response: nema data.');
    }
    return data as T;
  }
}


class SignupForTrainingRequestDto {
  final String rasporedId;
  const SignupForTrainingRequestDto({required this.rasporedId});

  Map<String, dynamic> toJson() => {
    'rasporedId': rasporedId,
  };
}

class DeleteRasporedRequestDto {
  final String rasporedId;
  const DeleteRasporedRequestDto({required this.rasporedId});

  Map<String, dynamic> toJson() => {
    'rasporedId': rasporedId,
  };
}

class GetAttendeesRequestDto {
  final String rasporedId;
  const GetAttendeesRequestDto({required this.rasporedId});

  Map<String, dynamic> toJson() => {
    'rasporedId': rasporedId,
  };
}

class AttendanceEntryDto {
  final String sportasId;
  final bool present;

  const AttendanceEntryDto({
    required this.sportasId,
    required this.present,
  });

  Map<String, dynamic> toJson() => {
    'sportasId': sportasId,
    'present': present,
  };
}

class SetAttendanceRequestDto {
  final String rasporedId;
  final List<AttendanceEntryDto> attendance;

  const SetAttendanceRequestDto({
    required this.rasporedId,
    required this.attendance,
  });

  Map<String, dynamic> toJson() => {
    'rasporedId': rasporedId,
    'attendance': attendance.map((x) => x.toJson()).toList(),
  };
}

class CreateTrainingRequestDto {
  final String dvoranaId;
  final bool useExistingVrsta;
  final String? vrstaId;
  final String? novaVrstaNaziv;
  final int? novaVrstaTezina;
  final int maksBrojSportasa;

  const CreateTrainingRequestDto({
    required this.dvoranaId,
    required this.useExistingVrsta,
    required this.maksBrojSportasa,
    this.vrstaId,
    this.novaVrstaNaziv,
    this.novaVrstaTezina,
  });

  Map<String, dynamic> toJson() => {
    'dvoranaId': dvoranaId,
    'useExistingVrsta': useExistingVrsta,
    'vrstaId': vrstaId,
    'novaVrstaNaziv': novaVrstaNaziv,
    'novaVrstaTezina': novaVrstaTezina,
    'maksBrojSportasa': maksBrojSportasa,
  };
}

class CreateRasporedRequestDto {
  final String treningId;
  final String teretanaId;
  final String pocetakIso;  final String zavrsetakIso;

  const CreateRasporedRequestDto({
    required this.treningId,
    required this.teretanaId,
    required this.pocetakIso,
    required this.zavrsetakIso,
  });

  Map<String, dynamic> toJson() => {
    'treningId': treningId,
    'teretanaId': teretanaId,
    'pocetak': pocetakIso,
    'zavrsetak': zavrsetakIso,
  };
}

class TrainingsByGymDateRequestDto {
  final String teretanaId;
  final String date;
  const TrainingsByGymDateRequestDto({
    required this.teretanaId,
    required this.date,
  });

  Map<String, dynamic> toJson() => {
    'teretanaId': teretanaId,
    'date': date,
  };
}

class TrainingDetailsRequestDto {
  final String treningId;
  final String rasporedId;

  const TrainingDetailsRequestDto({
    required this.treningId,
    required this.rasporedId,
  });

  Map<String, dynamic> toJson() => {
    'treningId': treningId,
    'rasporedId': rasporedId,
  };
}


class SignupForTrainingResponseDto {
  final String result;  const SignupForTrainingResponseDto({required this.result});

  factory SignupForTrainingResponseDto.fromJson(Map<String, dynamic> json) =>
      SignupForTrainingResponseDto(result: json['result']?.toString() ?? '');
}

class DeleteRasporedResponseDto {
  final bool deleted;
  final int deletedPrijave;

  const DeleteRasporedResponseDto({
    required this.deleted,
    required this.deletedPrijave,
  });

  factory DeleteRasporedResponseDto.fromJson(Map<String, dynamic> json) =>
      DeleteRasporedResponseDto(
        deleted: json['deleted'] == true,
        deletedPrijave: (json['deletedPrijave'] as num?)?.toInt() ?? 0,
      );
}

class AttendeeDto {
  final String prijavaDocId;
  final String sportasId;
  final String ime;
  final String prezime;
  final bool dolazakNaTrening;

  const AttendeeDto({
    required this.prijavaDocId,
    required this.sportasId,
    required this.ime,
    required this.prezime,
    required this.dolazakNaTrening,
  });

  factory AttendeeDto.fromJson(Map<String, dynamic> json) => AttendeeDto(
    prijavaDocId: json['prijavaDocId']?.toString() ?? '',
    sportasId: json['sportasId']?.toString() ?? '',
    ime: json['ime']?.toString() ?? '',
    prezime: json['prezime']?.toString() ?? '',
    dolazakNaTrening: json['dolazakNaTrening'] == true,
  );
}

class AttendeesByRasporedResponseDto {
  final List<AttendeeDto> items;
  const AttendeesByRasporedResponseDto({required this.items});

  factory AttendeesByRasporedResponseDto.fromJson(Map<String, dynamic> json) {
    final raw = (json['items'] as List?) ?? const [];
    return AttendeesByRasporedResponseDto(
      items: raw
          .whereType<Map>()
          .map((e) => AttendeeDto.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
    );
  }
}

class SetAttendanceResponseDto {
  final bool updated;
  final int count;

  const SetAttendanceResponseDto({
    required this.updated,
    required this.count,
  });

  factory SetAttendanceResponseDto.fromJson(Map<String, dynamic> json) =>
      SetAttendanceResponseDto(
        updated: json['updated'] == true,
        count: (json['count'] as num?)?.toInt() ?? 0,
      );
}

class CreateTrainingResponseDto {
  final String treningId;
  final String vrstaTreningaId;

  const CreateTrainingResponseDto({
    required this.treningId,
    required this.vrstaTreningaId,
  });

  factory CreateTrainingResponseDto.fromJson(Map<String, dynamic> json) =>
      CreateTrainingResponseDto(
        treningId: json['treningId']?.toString() ?? '',
        vrstaTreningaId: json['vrstaTreningaId']?.toString() ?? '',
      );
}

class CreateRasporedResponseDto {
  final String rasporedId;
  const CreateRasporedResponseDto({required this.rasporedId});

  factory CreateRasporedResponseDto.fromJson(Map<String, dynamic> json) =>
      CreateRasporedResponseDto(rasporedId: json['rasporedId']?.toString() ?? '');
}

class TrainerTrainingItemDto {
  final String rasporedId;
  final String treningId;
  final dynamic pocetakVrijeme;  final dynamic zavrsetakVrijeme;
  final String datum;
  final int brojPrijava;
  final int maksBrojSportasa;
  final String vrstaTreningaNaziv;
  final String teretanaNaziv;
  final String dvoranaNaziv;
  final String trenerIme;
  final String trenerPrezime;

  const TrainerTrainingItemDto({
    required this.rasporedId,
    required this.treningId,
    required this.pocetakVrijeme,
    required this.zavrsetakVrijeme,
    required this.datum,
    required this.brojPrijava,
    required this.maksBrojSportasa,
    required this.vrstaTreningaNaziv,
    required this.teretanaNaziv,
    required this.dvoranaNaziv,
    required this.trenerIme,
    required this.trenerPrezime,
  });

  factory TrainerTrainingItemDto.fromJson(Map<String, dynamic> json) =>
      TrainerTrainingItemDto(
        rasporedId: json['rasporedId']?.toString() ?? '',
        treningId: json['treningId']?.toString() ?? '',
        pocetakVrijeme: json['pocetakVrijeme'],
        zavrsetakVrijeme: json['zavrsetakVrijeme'],
        datum: json['datum']?.toString() ?? '',
        brojPrijava: (json['brojPrijava'] as num?)?.toInt() ?? 0,
        maksBrojSportasa: (json['maksBrojSportasa'] as num?)?.toInt() ?? 0,
        vrstaTreningaNaziv: json['vrstaTreningaNaziv']?.toString() ?? '',
        teretanaNaziv: json['teretanaNaziv']?.toString() ?? '',
        dvoranaNaziv: json['dvoranaNaziv']?.toString() ?? '',
        trenerIme: json['trenerIme']?.toString() ?? '',
        trenerPrezime: json['trenerPrezime']?.toString() ?? '',
      );
}

class TrainerTrainingsResponseDto {
  final List<TrainerTrainingItemDto> items;
  const TrainerTrainingsResponseDto({required this.items});

  factory TrainerTrainingsResponseDto.fromJson(Map<String, dynamic> json) {
    final raw = (json['items'] as List?) ?? const [];
    return TrainerTrainingsResponseDto(
      items: raw
          .whereType<Map>()
          .map((e) => TrainerTrainingItemDto.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
    );
  }
}

class TrainingByGymDateItemDto {
  final String rasporedId;
  final String treningId;
  final dynamic pocetakVrijeme;
  final dynamic zavrsetakVrijeme;
  final String nazivTeretane;
  final String nazivDvorane;
  final String nazivVrsteTreninga;
  final int tezina;
  final String trenerIme;
  final String trenerPrezime;
  final int trenutnoPrijavljenih;
  final int maxBrojSportasa;
  final bool isFull;

  const TrainingByGymDateItemDto({
    required this.rasporedId,
    required this.treningId,
    required this.pocetakVrijeme,
    required this.zavrsetakVrijeme,
    required this.nazivTeretane,
    required this.nazivDvorane,
    required this.nazivVrsteTreninga,
    required this.tezina,
    required this.trenerIme,
    required this.trenerPrezime,
    required this.trenutnoPrijavljenih,
    required this.maxBrojSportasa,
    required this.isFull,
  });

  factory TrainingByGymDateItemDto.fromJson(Map<String, dynamic> json) =>
      TrainingByGymDateItemDto(
        rasporedId: json['rasporedId']?.toString() ?? '',
        treningId: json['treningId']?.toString() ?? '',
        pocetakVrijeme: json['pocetakVrijeme'],
        zavrsetakVrijeme: json['zavrsetakVrijeme'],
        nazivTeretane: json['nazivTeretane']?.toString() ?? '',
        nazivDvorane: json['nazivDvorane']?.toString() ?? '',
        nazivVrsteTreninga: json['nazivVrsteTreninga']?.toString() ?? '',
        tezina: (json['tezina'] as num?)?.toInt() ?? 0,
        trenerIme: json['trenerIme']?.toString() ?? '',
        trenerPrezime: json['trenerPrezime']?.toString() ?? '',
        trenutnoPrijavljenih: (json['trenutnoPrijavljenih'] as num?)?.toInt() ?? 0,
        maxBrojSportasa: (json['maxBrojSportasa'] as num?)?.toInt() ?? 0,
        isFull: json['isFull'] == true,
      );
}

class TrainingsByGymDateResponseDto {
  final List<TrainingByGymDateItemDto> items;
  const TrainingsByGymDateResponseDto({required this.items});

  factory TrainingsByGymDateResponseDto.fromJson(Map<String, dynamic> json) {
    final raw = (json['items'] as List?) ?? const [];
    return TrainingsByGymDateResponseDto(
      items: raw
          .whereType<Map>()
          .map((e) => TrainingByGymDateItemDto.fromJson(Map<String, dynamic>.from(e)))
          .toList(),
    );
  }
}

class TrainingDetailsResponseDto {
  final String treningId;
  final String rasporedId;
  final String vrstaId;
  final String nazivVrste;
  final int tezina;

  final dynamic pocetakVrijeme;
  final dynamic zavrsetakVrijeme;
  final String datum;

  final String teretanaId;
  final String teretanaNaziv;
  final String dvoranaId;
  final String dvoranaNaziv;

  final String trenerId;
  final String trenerIme;
  final String trenerPrezime;

  final int trenutnoPrijavljenih;
  final int maxBrojSportasa;
  final bool isFull;

  const TrainingDetailsResponseDto({
    required this.treningId,
    required this.rasporedId,
    required this.vrstaId,
    required this.nazivVrste,
    required this.tezina,
    required this.pocetakVrijeme,
    required this.zavrsetakVrijeme,
    required this.datum,
    required this.teretanaId,
    required this.teretanaNaziv,
    required this.dvoranaId,
    required this.dvoranaNaziv,
    required this.trenerId,
    required this.trenerIme,
    required this.trenerPrezime,
    required this.trenutnoPrijavljenih,
    required this.maxBrojSportasa,
    required this.isFull,
  });

  factory TrainingDetailsResponseDto.fromJson(Map<String, dynamic> json) =>
      TrainingDetailsResponseDto(
        treningId: json['treningId']?.toString() ?? '',
        rasporedId: json['rasporedId']?.toString() ?? '',
        vrstaId: json['vrstaId']?.toString() ?? '',
        nazivVrste: json['nazivVrste']?.toString() ?? '',
        tezina: (json['tezina'] as num?)?.toInt() ?? 0,
        pocetakVrijeme: json['pocetakVrijeme'],
        zavrsetakVrijeme: json['zavrsetakVrijeme'],
        datum: json['datum']?.toString() ?? '',
        teretanaId: json['teretanaId']?.toString() ?? '',
        teretanaNaziv: json['teretanaNaziv']?.toString() ?? '',
        dvoranaId: json['dvoranaId']?.toString() ?? '',
        dvoranaNaziv: json['dvoranaNaziv']?.toString() ?? '',
        trenerId: json['trenerId']?.toString() ?? '',
        trenerIme: json['trenerIme']?.toString() ?? '',
        trenerPrezime: json['trenerPrezime']?.toString() ?? '',
        trenutnoPrijavljenih: (json['trenutnoPrijavljenih'] as num?)?.toInt() ?? 0,
        maxBrojSportasa: (json['maxBrojSportasa'] as num?)?.toInt() ?? 0,
        isFull: json['isFull'] == true,
      );
}



class TeretanaDto {
  final String id;
  final String nazivTeretane;
  final String adresa;
  final String mjesto;

  const TeretanaDto({
    required this.id,
    required this.nazivTeretane,
    required this.adresa,
    required this.mjesto,
  });

  factory TeretanaDto.fromDoc(String id, Map<String, dynamic> data) => TeretanaDto(
    id: id,
    nazivTeretane: (data['nazivTeretane'] ?? '').toString(),
    adresa: (data['adresa'] ?? '').toString(),
    mjesto: (data['mjesto'] ?? '').toString(),
  );
}

class DvoranaDto {
  final String id;
  final String nazivDvorane;
  final String? teretanaId;

  const DvoranaDto({
    required this.id,
    required this.nazivDvorane,
    this.teretanaId,
  });

  factory DvoranaDto.fromDoc(String id, Map<String, dynamic> data) => DvoranaDto(
    id: id,
    nazivDvorane: (data['nazivDvorane'] ?? '').toString(),
    teretanaId: data['teretanaId']?.toString(),
  );
}

class VrstaTreningaDto {
  final String id;
  final String nazivVrTreninga;
  final int tezina;

  const VrstaTreningaDto({
    required this.id,
    required this.nazivVrTreninga,
    required this.tezina,
  });

  factory VrstaTreningaDto.fromDoc(String id, Map<String, dynamic> data) => VrstaTreningaDto(
    id: id,
    nazivVrTreninga: (data['nazivVrTreninga'] ?? '').toString(),
    tezina: (data['tezina'] as num?)?.toInt() ?? 0,
  );
}



class FirestoreTreningDto {
  final String id;
  final String dvoranaId;
  final String vrstaTreningaId;
  final int maksBrojSportasa;

  const FirestoreTreningDto({
    required this.id,
    required this.dvoranaId,
    required this.vrstaTreningaId,
    required this.maksBrojSportasa,
  });

  factory FirestoreTreningDto.fromDoc(String id, Map<String, dynamic> data) {
    return FirestoreTreningDto(
      id: id,
      dvoranaId: (data['dvoranaId'] ?? '').toString(),
      vrstaTreningaId: (data['vrstaTreningaId'] ?? '').toString(),
      maksBrojSportasa: (data['maksBrojSportasa'] as num?)?.toInt() ?? 0,
    );
  }
}

class TreningOptionDto {
  final String idTreninga;
  final int maksBrojSportasa;

  final String idVrTreninga;
  final String nazivVrTreninga;
  final int tezina;

  final String idDvorane;
  final String nazivDvorane;

  final String idTeretane;
  final String nazivTeretane;
  final String adresa;
  final String mjesto;

  const TreningOptionDto({
    required this.idTreninga,
    required this.maksBrojSportasa,
    required this.idVrTreninga,
    required this.nazivVrTreninga,
    required this.tezina,
    required this.idDvorane,
    required this.nazivDvorane,
    required this.idTeretane,
    required this.nazivTeretane,
    required this.adresa,
    required this.mjesto,
  });
}

