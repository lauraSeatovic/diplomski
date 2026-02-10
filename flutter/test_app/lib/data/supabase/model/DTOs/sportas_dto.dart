class SportasDto {
  final String idKorisnika;
  final String datumRodenja;
  final String? tipClanarine;

  SportasDto({
    required this.idKorisnika,
    required this.datumRodenja,
    this.tipClanarine,
  });

  factory SportasDto.fromJson(Map<String, dynamic> json) {
    return SportasDto(
      idKorisnika: json['IdKorisnika'] as String,
      datumRodenja: json['DatumRodenja'] as String,
      tipClanarine: json['TipClanarine'] as String?,
    );
  }
}
