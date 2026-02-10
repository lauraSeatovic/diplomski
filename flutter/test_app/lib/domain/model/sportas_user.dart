class SportasUser {
  final String id;
  final String ime;
  final String prezime;
  final DateTime datumRodenja;
  final String? tipClanarine;

  SportasUser({
    required this.id,
    required this.ime,
    required this.prezime,
    required this.datumRodenja,
    this.tipClanarine,
  });
}
