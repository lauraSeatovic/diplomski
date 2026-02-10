
import 'package:flutter/material.dart';

import '../trainer/raspored/create_raspored_screen.dart';
import '../trainer/trainer_trainings_screen.dart';
import '../trainer/trening/create_training_screen.dart';

class TrainerHomeShell extends StatelessWidget {
  const TrainerHomeShell({
    super.key,
    required this.userId,
  });

  final String userId;

  @override
  Widget build(BuildContext context) {
    return TrainerTrainingsScreen(
      trenerId: userId,
      onAddRasporedClick: () {
        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => CreateRasporedScreen(trenerId: userId,),
          ),
        );
      },
      onAddTrainingClick: () {

        Navigator.of(context).push(
          MaterialPageRoute(
            builder: (_) => CreateTrainingScreen(),
          ),
        );

      },
    );
  }
}
