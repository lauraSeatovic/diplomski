import '../model/common_models.dart';
import '../model/prijavljen_trening.dart';
import '../model/training_models.dart';
import '../model/trener_models.dart';

abstract class TrainingRepository {
  Future<List<PrijavljenTrening>> getTrainingsForUser(String sportasId);

  Future<List<Teretana>> getTeretane();

  Future<List<DostupniTrening>> getTrainingsByDateAndTeretana({
    required String teretanaId,
    required DateTime date,
  });

  Future<SignUpResult> signUpForTraining({
    required String rasporedId,
    required String korisnikId,
  });

  Future<List<TrainerTraining>> getTrainingsForTrainer(String trenerId);

  Future<List<PrijavljeniSudionik>> getAttendeesForRaspored(String rasporedId);

  Future<AttendanceUpdateResult> setAttendanceForRaspored({
    required String rasporedId,
    required List<AttendanceUpdate> updates,
  });

  Future<List<VrstaTreninga>> getVrsteTreninga();
  Future<List<VrstaTreningaOption>> getVrsteTreningaOptions();

  Future<List<TreningOption>> getTreningOptions();

  Future<void> createTrening(CreateTreningInput input);

  Future<void> createRaspored(CreateRasporedInput input);

  Future<DeleteRasporedResult> deleteRaspored(String rasporedId);

  Future<List<DvoranaSimple>> getDvorane();
  }
