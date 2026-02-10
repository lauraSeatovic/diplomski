import '../../model/DTOs/trainings_dtos.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../../model/DTOs/trener_dtos.dart' hide DvoranaDto;

class TrainingService {
  final SupabaseClient client;

  TrainingService(this.client);


  Future<List<PrijavaFullDto>> getPrijaveFullForUser(String userId) async {
    const _selectPrijavaFull = '''
    IdPrijave,
    IdSportasa,
    DolazakNaTrening,
    OcjenaTreninga,
    Raspored:IdRasporeda(
      IdRasporeda,
      PocetakVrijeme,
      ZavrsetakVrijeme,
      IdTrenera,
      Trening:IdTreninga(
        IdTreninga,
        IdVrTreninga,
        IdDvOdr,
        MaksBrojSportasa,
        Dvorana:IdDvOdr(
          IdDvorane,
          NazivDvorane,
          Teretana:IdTeretane(
            IdTeretane,
            NazivTeretane,
            Adresa,
            Mjesto
          )
        ),
        VrstaTrening:IdVrTreninga(
          IdVrTreninga,
          NazivVrTreninga,
          Tezina
        )
      )
    )
  ''';
    final response = await client
        .from('Prijava')
        .select(_selectPrijavaFull)
        .eq('IdSportasa', userId);

    final list = response as List<dynamic>;

    return list
        .map((json) => PrijavaFullDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<List<TeretanaDto>> getTeretane() async {
    final data = await client.from('Teretana').select();
    final list = data as List<dynamic>;
    return list
        .map((json) => TeretanaDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<List<AvailableTrainingEdgeDto>> getAvailableTrainings({
    required String teretanaId,
    required DateTime date,
  }) async {
    final dateStr =
        '${date.year.toString().padLeft(4, '0')}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';

    final response = await client.functions.invoke(
      'trainings_by_dvorana_date',
      queryParameters: {
        'teretanaId': teretanaId,
        'date': dateStr,
      },
    );

    final data = response.data;
    final list = data['data'] as List<dynamic>;
    return list
        .map((json) =>
        AvailableTrainingEdgeDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<Map<String, dynamic>?> signUpForTraining({
    required String korisnikId,
    required String rasporedId,
  }) async {
    final response = await client.functions.invoke(
      'signup_for_training',
      body: {
        'korisnik_id': korisnikId,
        'raspored_id': rasporedId,
      },
    );

    return response.data as Map<String, dynamic>?;
  }


  Future<List<RasporedFullDto>> getTrainingsForTrainer({
    required String trenerId,
  }) async {
    const _selectRasporedFull = '''
    IdRasporeda,
    PocetakVrijeme,
    ZavrsetakVrijeme,
    IdTrenera,
    Trening:IdTreninga(
      IdTreninga,
      IdVrTreninga,
      IdDvOdr,
      MaksBrojSportasa,
      Dvorana:IdDvOdr(
        IdDvorane,
        NazivDvorane,
        Teretana:IdTeretane(
          IdTeretane,
          NazivTeretane,
          Adresa,
          Mjesto
        )
      ),
      VrstaTrening:IdVrTreninga(
        IdVrTreninga,
        NazivVrTreninga,
        Tezina
      )
    )
  ''';

    final response = await client
        .from('Raspored')
        .select(_selectRasporedFull)
        .eq('IdTrenera', trenerId)
        .order('PocetakVrijeme', ascending: true);

    final list = response as List<dynamic>;

    return list
        .map((json) => RasporedFullDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<List<AttendeeDto>> getAttendeesByRaspored({
    required String rasporedId,
  }) async {
    final response = await client.functions.invoke(
      'sportasi_na_treningu',
      queryParameters: {
        'raspored_id': rasporedId,
      },
    );

    final data = response.data as Map<String, dynamic>;
    final list = data['data'] as List<dynamic>;

    return list
        .map((json) => AttendeeDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<AttendanceUpdateResponseDto> setAttendanceForRaspored({
    required AttendanceUpdateRequestDto request,
  }) async {
    final response = await client.functions.invoke(
      'postavi-prisutstvo',
      body: request.toJson(),
    );

    final data = response.data as Map<String, dynamic>;
    return AttendanceUpdateResponseDto.fromJson(data);
  }

  Future<List<VrstaTreningaDtoFull>> getVrsteTreninga() async {
    final data = await client.from('VrstaTreninga').select();
    final list = data as List<dynamic>;

    return list
        .map((json) => VrstaTreningaDtoFull.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<CreateTreningResponseDto> createTrening(CreateTreningRequestDto req) async {
    final res = await client.functions.invoke(
      'create-trening-with-vrsta',
      body: req.toJson(),
    );

    final data = res.data as Map<String, dynamic>;
    return CreateTreningResponseDto.fromJson(data);
  }

  Future<List<TreningOptionDto>> getTreningOptions() async {
    const selectColumns = '''
      IdTreninga,
      MaksBrojSportasa,
      VrstaTreninga:IdVrTreninga(
        IdVrTreninga,
        NazivVrTreninga,
        Tezina
      ),
      Dvorana:IdDvOdr(
        IdDvorane,
        NazivDvorane,
        Teretana:IdTeretane(
          IdTeretane,
          NazivTeretane,
          Adresa,
          Mjesto
        )
      )
    ''';

    final data = await client.from('Trening').select(selectColumns);
    final list = data as List<dynamic>;

    return list
        .map((json) => TreningOptionDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }

  Future<NewRasporedResponseDto> createRaspored(CreateRasporedRequestDto req) async {
    final userId = client.auth.currentUser?.id;
    if (userId == null) {
      throw Exception('Not logged in (currentUser is null)');
    }

    final body = req.toJson();
    (body['raspored'] as Map<String, dynamic>)['IdTrenera'] = userId;

    final res = await client.functions.invoke(
      'create-raspored',
      body: body,
    );

    final createdList = (res.data as List<dynamic>);
    if (createdList.isEmpty) throw Exception('create-raspored returned empty list');

    return NewRasporedResponseDto.fromJson(createdList.first as Map<String, dynamic>);
  }

  Future<DeleteRasporedResponseDto> deleteRaspored(String idRasporeda) async {
    final res = await client.functions.invoke(
      'delete-raspored-with-prijava',
      method: HttpMethod.delete,
      queryParameters: {
        'IdRasporeda': idRasporeda,
      },
    );

    final data = res.data as Map<String, dynamic>;
    return DeleteRasporedResponseDto.fromJson(data);
  }

  Future<List<DvoranaSimpleDto>> getDvorane() async {
    final data = await client.from('Dvorana').select();
    final list = data as List<dynamic>;
    return list
        .map((json) => DvoranaSimpleDto.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}

