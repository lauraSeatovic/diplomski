class PrijavljeniSudionik {
  final String prijavaId;
  final String sportasId;
  final String ime;
  final String prezime;
  final bool dolazakNaTrening;
  final int? ocjenaTreninga;

  const PrijavljeniSudionik({
    required this.prijavaId,
    required this.sportasId,
    required this.ime,
    required this.prezime,
    required this.dolazakNaTrening,
    required this.ocjenaTreninga,
  });
}


class AttendanceUpdate {
  final String sportasId;
  final bool dolazak;

  const AttendanceUpdate({
    required this.sportasId,
    required this.dolazak,
  });
}

class AttendanceUpdateResult {
  final bool success;
  final int updated;

  const AttendanceUpdateResult({
    required this.success,
    required this.updated,
  });
}


class TrainerTraining {
  final String rasporedId;
  final DateTime pocetak;
  final DateTime zavrsetak;

  final String vrstaNaziv;
  final String dvoranaNaziv;
  final String teretanaNaziv;

  const TrainerTraining({
    required this.rasporedId,
    required this.pocetak,
    required this.zavrsetak,
    required this.vrstaNaziv,
    required this.dvoranaNaziv,
    required this.teretanaNaziv,
  });
}
