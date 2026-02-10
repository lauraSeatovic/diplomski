class Teretana {
  final String idTeretane;
  final String nazivTeretane;
  final String adresa;
  final String mjesto;

  Teretana({
    required this.idTeretane,
    required this.nazivTeretane,
    required this.adresa,
    required this.mjesto,
  });
}

class DostupniTrening {
  final String rasporedId;
  final String treningId;

  final String nazivVrsteTreninga;

  final DateTime pocetak;
  final DateTime kraj;

  final String dvoranaId;
  final String nazivDvorane;

  final String? nazivTeretane;

  final String trenerId;
  final String trenerIme;
  final String trenerPrezime;

  final int maxBrojSportasa;
  final int trenutnoPrijavljenih;
  final bool isFull;

  DostupniTrening({
    required this.rasporedId,
    required this.treningId,
    required this.nazivVrsteTreninga,
    required this.pocetak,
    required this.kraj,
    required this.dvoranaId,
    required this.nazivDvorane,
    this.nazivTeretane,
    required this.trenerId,
    required this.trenerIme,
    required this.trenerPrezime,
    required this.maxBrojSportasa,
    required this.trenutnoPrijavljenih,
    required this.isFull,
  });
}

class VrstaTreninga {
  final String idVrTreninga;
  final String nazivVrTreninga;
  final int tezina;

  VrstaTreninga({
    required this.idVrTreninga,
    required this.nazivVrTreninga,
    required this.tezina,
  });
}

class VrstaTreningaOption {
  final String idVrTreninga;
  final String label;

  VrstaTreningaOption({
    required this.idVrTreninga,
    required this.label,
  });
}

class TreningOption {
  final String idTreninga;
  final String label;
  final int? maksBrojSportasa;

  TreningOption({
    required this.idTreninga,
    required this.label,
    this.maksBrojSportasa,
  });
}

class CreateTreningInput {
  final String dvoranaId;
  final int maksBrojSportasa;

  final String? existingVrstaId;

  final String? newVrstaNaziv;
  final int? newVrstaTezina;

  final String? idLaksijegTreninga;
  final String? idTezegTreninga;

  CreateTreningInput({
    required this.dvoranaId,
    required this.maksBrojSportasa,
    this.existingVrstaId,
    this.newVrstaNaziv,
    this.newVrstaTezina,
    this.idLaksijegTreninga,
    this.idTezegTreninga,
  });
}

class CreateRasporedInput {
  final String treningId;
  final DateTime start;
  final DateTime end;

  CreateRasporedInput({
    required this.treningId,
    required this.start,
    required this.end,
  });
}

class DeleteRasporedResult {
  final bool success;

  DeleteRasporedResult({required this.success});
}

class Dvorana {
  final String idDvorane;
  final String nazivDvorane;
  final Teretana teretana;

  Dvorana({
    required this.idDvorane,
    required this.nazivDvorane,
    required this.teretana,
  });
}

class DvoranaSimple {
  final String idDvorane;
  final String nazivDvorane;
  final String teretanaId;

  DvoranaSimple({
    required this.idDvorane,
    required this.nazivDvorane,
    required this.teretanaId,
  });
}



