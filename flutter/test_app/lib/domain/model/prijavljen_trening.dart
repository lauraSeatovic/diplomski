class PrijavljenTrening {
  final String idPrijave;
  final String idRasporeda;
  final String nazivVrsteTreninga;
  final DateTime pocetak;
  final DateTime kraj;
  final String nazivDvorane;
  final String nazivTeretane;
  final String mjestoTeretane;
  final bool dolazakNaTrening;
  final int? ocjenaTreninga;

  PrijavljenTrening({
    required this.idPrijave,
    required this.idRasporeda,
    required this.nazivVrsteTreninga,
    required this.pocetak,
    required this.kraj,
    required this.nazivDvorane,
    required this.nazivTeretane,
    required this.mjestoTeretane,
    required this.dolazakNaTrening,
    required this.ocjenaTreninga,
  });
}
