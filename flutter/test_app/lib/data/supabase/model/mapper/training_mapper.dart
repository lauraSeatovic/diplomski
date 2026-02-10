import '../../../../domain/model/prijavljen_trening.dart';
import '../../../../domain/model/training_models.dart';
import '../../../../domain/model/trener_models.dart';
import '../DTOs/trainings_dtos.dart';
import '../DTOs/trener_dtos.dart' hide DvoranaDto;

PrijavljenTrening prijavaFullDtoToDomain(PrijavaFullDto dto) {
  final raspored = dto.raspored;
  final trening = raspored.trening;
  final vrsta = trening.vrstaTreninga;
  final dvorana = trening.dvorana;
  final teretana = dvorana.teretana;

  return PrijavljenTrening(
    idPrijave: dto.idPrijave,
    idRasporeda: raspored.idRasporeda,
    nazivVrsteTreninga: vrsta.nazivVrTreninga,
    pocetak: raspored.pocetakVrijeme,
    kraj: raspored.zavrsetakVrijeme,
    nazivDvorane: dvorana.nazivDvorane,
    nazivTeretane: teretana.nazivTeretane,
    mjestoTeretane: teretana.mjesto,
    dolazakNaTrening: dto.dolazakNaTrening,
    ocjenaTreninga: dto.ocjenaTreninga,
  );
}

extension TeretanaDtoMapper on TeretanaDto {
  Teretana toDomain() {
    return Teretana(
      idTeretane: idTeretane,
      nazivTeretane: nazivTeretane,
      adresa: adresa,
      mjesto: mjesto,
    );
  }
}


class TrainerMappers {
  static PrijavljeniSudionik toDomainAttendee(AttendeeDto dto) {
    return PrijavljeniSudionik(
      prijavaId: dto.prijavaId,
      sportasId: dto.sportasId,
      ime: dto.ime,
      prezime: dto.prezime,
      dolazakNaTrening: dto.dolazakNaTrening,
      ocjenaTreninga: dto.ocjenaTreninga,
    );
  }

  static AttendanceUpdateRequestDto toAttendanceRequestDto({
    required String rasporedId,
    required List<AttendanceUpdate> updates,
  }) {
    return AttendanceUpdateRequestDto(
      rasporedId: rasporedId,
      updates: updates
          .map((u) => AttendanceUpdateItemDto(
        sportasId: u.sportasId,
        dolazak: u.dolazak,
      ))
          .toList(),
    );
  }

  static AttendanceUpdateResult toDomainAttendanceResult(
      AttendanceUpdateResponseDto dto,
      ) {
    return AttendanceUpdateResult(
      success: dto.success,
      updated: dto.updated,
    );
  }
}

class RasporedFullMapper {
  static TrainerTraining toTrainerTraining(RasporedFullDto dto) {
    return TrainerTraining(
      rasporedId: dto.idRasporeda,
      pocetak: dto.pocetakVrijeme,
      zavrsetak: dto.zavrsetakVrijeme,
      vrstaNaziv: dto.trening.vrstaTrening.nazivVrTreninga,
      dvoranaNaziv: dto.trening.dvorana.nazivDvorane,
      teretanaNaziv: dto.trening.dvorana.teretana.nazivTeretane,
    );
  }
}

extension VrstaTreningaDtoFullMapper on VrstaTreningaDtoFull {
  VrstaTreninga toDomain() => VrstaTreninga(
    idVrTreninga: idVrTreninga,
    nazivVrTreninga: nazivVrTreninga,
    tezina: tezina,
  );

  VrstaTreningaOption toOption() => VrstaTreningaOption(
    idVrTreninga: idVrTreninga,
    label: '$nazivVrTreninga (Težina $tezina)',
  );
}

extension TreningOptionDtoMapper on TreningOptionDto {
  TreningOption toDomain() {
    final ter = dvorana.teretana;
    final v = vrstaTreninga;

    return TreningOption(
      idTreninga: idTreninga,
      maksBrojSportasa: maksBrojSportasa,
      label:
      '${v.nazivVrTreninga} (Težina ${v.tezina}) • ${ter.nazivTeretane} • ${dvorana.nazivDvorane} • Kapacitet $maksBrojSportasa',
    );
  }
}

extension DeleteRasporedMapper on DeleteRasporedResponseDto {
  DeleteRasporedResult toDomain() => DeleteRasporedResult(success: success);
}


extension DvoranaDtoMapper on DvoranaDto {
  Dvorana toDomain() => Dvorana(
    idDvorane: idDvorane,
    nazivDvorane: nazivDvorane,
    teretana: teretana.toDomain(),
  );
}

extension DvoranaSimpleDtoMapper on DvoranaSimpleDto {
  DvoranaSimple toDomain() => DvoranaSimple(
    idDvorane: idDvorane,
    nazivDvorane: nazivDvorane,
    teretanaId: teretanaId,
  );
}




