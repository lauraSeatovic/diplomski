import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';

import '../../model/dtos.dart';

class FirebaseTrainingService {
  final FirebaseFunctions functions;
  final FirebaseFirestore firestore;

  FirebaseTrainingService({required this.functions, required this.firestore});

  T _callableParseApiResponse<T>(
    HttpsCallableResult result,
    T Function(Object? rawData) parseData,
  ) {
    final raw = result.data;
    if (raw is! Map) {
      throw StateError('Neispravan response format (očekivan Map root).');
    }
    final map = Map<String, dynamic>.from(raw as Map);
    final api = ApiResponseDto<T>.fromJson(map, parseData);
    return api.requireData();
  }

  Future<List<TeretanaDto>> getTeretane() async {
    final snaps = await firestore.collection('teretane').get();
    return snaps.docs.map((d) => TeretanaDto.fromDoc(d.id, d.data())).toList();
  }

  Future<List<DvoranaDto>> getDvorane() async {
    final snaps = await firestore.collectionGroup('dvorane').get();

    return snaps.docs.map((d) {
      final pathSegments = d.reference.path.split('/');
      final teretanaId = pathSegments.length >= 2 ? pathSegments[1] : null;

      return DvoranaDto.fromDoc(d.id, {...d.data(), 'teretanaId': teretanaId});
    }).toList();
  }

  Future<List<VrstaTreningaDto>> getVrsteTreninga() async {
    final snaps = await firestore.collection('vrsteTreninga').get();
    return snaps.docs
        .map((d) => VrstaTreningaDto.fromDoc(d.id, d.data()))
        .toList();
  }

  Future<SignupForTrainingResponseDto> signupForTraining(
    SignupForTrainingRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('signup_for_training')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return SignupForTrainingResponseDto.fromJson(data);
  }

  Future<DeleteRasporedResponseDto> deleteRaspored(
    DeleteRasporedRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('delete_raspored_with_prijave')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return DeleteRasporedResponseDto.fromJson(data);
  }

  Future<AttendeesByRasporedResponseDto> attendeesByRaspored(
    GetAttendeesRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('attendees_by_raspored')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return AttendeesByRasporedResponseDto.fromJson(data);
  }

  Future<SetAttendanceResponseDto> setAttendanceForRaspored(
    SetAttendanceRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('set_attendance_for_raspored')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return SetAttendanceResponseDto.fromJson(data);
  }

  Future<CreateTrainingResponseDto> createTraining(
    CreateTrainingRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('create_training')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return CreateTrainingResponseDto.fromJson(data);
  }

  Future<CreateRasporedResponseDto> createRaspored(
    CreateRasporedRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('create_raspored')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return CreateRasporedResponseDto.fromJson(data);
  }

  Future<TrainerTrainingsResponseDto> trainerTrainings() async {
    final result = await functions.httpsCallable('trainer_trainings').call({});

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return TrainerTrainingsResponseDto.fromJson(data);
  }

  Future<TrainingsByGymDateResponseDto> trainingsByGymDate(
    TrainingsByGymDateRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('trainings_by_gym_date')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return TrainingsByGymDateResponseDto.fromJson(data);
  }

  Future<TrainingDetailsResponseDto> trainingDetails(
    TrainingDetailsRequestDto req,
  ) async {
    final result = await functions
        .httpsCallable('training_details')
        .call(req.toJson());

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    return TrainingDetailsResponseDto.fromJson(data);
  }

  Future<List<Map<String, dynamic>>> myTrainingsRaw() async {
    final result = await functions.httpsCallable('my_trainings').call({});

    final data = _callableParseApiResponse<Map<String, dynamic>>(
      result,
      (raw) => Map<String, dynamic>.from(raw as Map),
    );

    final items = (data['items'] as List?) ?? const [];
    return items
        .whereType<Map>()
        .map((e) => Map<String, dynamic>.from(e))
        .toList();
  }

  Future<List<TreningOptionDto>> getTreningOptions() async {
    final treninziFuture = firestore.collection('treninzi').get();
    final dvoraneFuture = firestore.collectionGroup('dvorane').get();
    final teretaneFuture = firestore.collection('teretane').get();
    final vrsteFuture = firestore.collection('vrsteTreninga').get();

    final treninziSnap = await treninziFuture;
    final dvoraneSnap = await dvoraneFuture;
    final teretaneSnap = await teretaneFuture;
    final vrsteSnap = await vrsteFuture;

    final Map<String, _DvoranaRow> dvoraneByKey = Map.fromEntries(
      dvoraneSnap.docs.map((d) {
        final dvoranaId = d.id;
        final teretanaId = d.reference.parent.parent?.id;
        final key = '${teretanaId ?? ''}|$dvoranaId';

        return MapEntry(
          key,
          _DvoranaRow(
            id: dvoranaId,
            naziv: d.data()['nazivDvorane'] ?? '',
            teretanaId: teretanaId,
          ),
        );
      }),
    );

    final Map<String, _TeretanaRow> teretaneById = {
      for (final t in teretaneSnap.docs)
        t.id: _TeretanaRow(
          id: t.id,
          naziv: t.data()['nazivTeretane'] ?? '',
          adresa: t.data()['adresa'] ?? '',
          mjesto: t.data()['mjesto'] ?? '',
        ),
    };

    final Map<String, _VrstaRow> vrsteById = {
      for (final v in vrsteSnap.docs)
        v.id: _VrstaRow(
          id: v.id,
          naziv: v.data()['nazivVrTreninga'] ?? '',
          tezina: (v.data()['tezina'] ?? 0) as int,
        ),
    };

    final result = <TreningOptionDto>[];

    for (final tr in treninziSnap.docs) {
      final data = tr.data();

      final treningId = tr.id;
      final teretanaId = data['teretanaId'];
      final dvoranaId = data['dvoranaId'];
      final vrstaId = data['vrstaTreningaId'];
      final maks = (data['maksBrojSportasa'] ?? 0) as int;

      if (teretanaId == null || dvoranaId == null || vrstaId == null) {
        continue;
      }

      final vrsta = vrsteById[vrstaId];
      final teretana = teretaneById[teretanaId];
      final dvoranaKey = '$teretanaId|$dvoranaId';
      final dvorana = dvoraneByKey[dvoranaKey];

      if (vrsta == null || teretana == null || dvorana == null) {
        continue;
      }

      result.add(
        TreningOptionDto(
          idTreninga: treningId,
          maksBrojSportasa: maks,
          idVrTreninga: vrsta.id,
          nazivVrTreninga: vrsta.naziv,
          tezina: vrsta.tezina,
          idDvorane: dvorana.id,
          nazivDvorane: dvorana.naziv,
          idTeretane: teretana.id,
          nazivTeretane: teretana.naziv,
          adresa: teretana.adresa,
          mjesto: teretana.mjesto,
        ),
      );
    }

    result.sort((a, b) {
      final la =
          '${a.nazivVrTreninga}-${a.nazivTeretane}-${a.nazivDvorane}-${a.maksBrojSportasa}';
      final lb =
          '${b.nazivVrTreninga}-${b.nazivTeretane}-${b.nazivDvorane}-${b.maksBrojSportasa}';
      return la.compareTo(lb);
    });

    return result;
  }
}

class _DvoranaRow {
  final String id;
  final String naziv;
  final String? teretanaId;

  _DvoranaRow({
    required this.id,
    required this.naziv,
    required this.teretanaId,
  });
}

class _TeretanaRow {
  final String id;
  final String naziv;
  final String adresa;
  final String mjesto;

  _TeretanaRow({
    required this.id,
    required this.naziv,
    required this.adresa,
    required this.mjesto,
  });
}

class _VrstaRow {
  final String id;
  final String naziv;
  final int tezina;

  _VrstaRow({required this.id, required this.naziv, required this.tezina});
}
