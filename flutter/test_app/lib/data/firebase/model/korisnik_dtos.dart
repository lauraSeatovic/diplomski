import 'package:cloud_firestore/cloud_firestore.dart';

class FirestoreSportasDto {
  final Timestamp? datumRodenja;
  final String? tipClanarine;

  const FirestoreSportasDto({
    this.datumRodenja,
    this.tipClanarine,
  });

  factory FirestoreSportasDto.fromJson(Map<String, dynamic> json) {
    return FirestoreSportasDto(
      datumRodenja: json['datumRodenja'] as Timestamp?,
      tipClanarine: json['tipClanarine']?.toString(),
    );
  }
}

class FirestoreTrenerDto {
  final String? opisTrenera;
  final String? kontaktTrenera;

  const FirestoreTrenerDto({
    this.opisTrenera,
    this.kontaktTrenera,
  });

  factory FirestoreTrenerDto.fromJson(Map<String, dynamic> json) {
    return FirestoreTrenerDto(
      opisTrenera: json['opisTrenera']?.toString(),
      kontaktTrenera: json['kontaktTrenera']?.toString(),
    );
  }
}

class FirestoreKorisnikDto {
  final String id;  final String ime;
  final String prezime;

  final bool jeSportas;
  final bool jeTrener;

  final FirestoreSportasDto? sportas;
  final FirestoreTrenerDto? trener;

  const FirestoreKorisnikDto({
    required this.id,
    required this.ime,
    required this.prezime,
    required this.jeSportas,
    required this.jeTrener,
    required this.sportas,
    required this.trener,
  });

  factory FirestoreKorisnikDto.fromDoc(
      DocumentSnapshot<Map<String, dynamic>> doc,
      ) {
    final data = doc.data() ?? <String, dynamic>{};

    final sportasRaw = data['sportas'];
    final trenerRaw = data['trener'];

    return FirestoreKorisnikDto(
      id: doc.id,
      ime: (data['ime'] ?? '').toString(),
      prezime: (data['prezime'] ?? '').toString(),
      jeSportas: data['jeSportas'] == true,
      jeTrener: data['jeTrener'] == true,
      sportas: sportasRaw is Map
          ? FirestoreSportasDto.fromJson(Map<String, dynamic>.from(sportasRaw))
          : null,
      trener: trenerRaw is Map
          ? FirestoreTrenerDto.fromJson(Map<String, dynamic>.from(trenerRaw))
          : null,
    );
  }
}
