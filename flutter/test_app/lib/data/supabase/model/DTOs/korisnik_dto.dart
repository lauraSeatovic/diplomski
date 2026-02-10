class KorisnikDto {
  final String idKorisnika;
  final String imeKorisnika;
  final String prezimeKorisnika;

  KorisnikDto({
    required this.idKorisnika,
    required this.imeKorisnika,
    required this.prezimeKorisnika,
  });

  factory KorisnikDto.fromJson(Map<String, dynamic> json) {
    return KorisnikDto(
      idKorisnika: json['IdKorisnika'] as String,
      imeKorisnika: json['ImeKorisnika'] as String,
      prezimeKorisnika: json['PrezimeKorisnika'] as String,
    );
  }
}