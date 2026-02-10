import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/trainings/provider.dart';

import '../../domain/model/common_models.dart';
import '../../domain/model/training_models.dart';
import '../../providers.dart';

class TrainingDetailsScreen extends ConsumerStatefulWidget {
  const TrainingDetailsScreen({
    super.key,
    required this.userId,
    required this.trening,
  });

  final String userId;
  final DostupniTrening trening;

  @override
  ConsumerState<TrainingDetailsScreen> createState() =>
      _TrainingDetailsScreenState();
}

class _TrainingDetailsScreenState
    extends ConsumerState<TrainingDetailsScreen> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final controller =
    ref.read(trainingsControllerProvider(widget.userId).notifier);
    final t = widget.trening;

    final datePart =
        '${t.pocetak.day}.${t.pocetak.month}.${t.pocetak.year}.';
    final timePart =
        '${t.pocetak.hour.toString().padLeft(2, '0')}:${t.pocetak.minute.toString().padLeft(2, '0')}'
        ' - '
        '${t.kraj.hour.toString().padLeft(2, '0')}:${t.kraj.minute.toString().padLeft(2, '0')}';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Detalji treninga'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              t.nazivVrsteTreninga,
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 12),
            Text(
              '${t.nazivDvorane}'
                  '${t.nazivTeretane != null ? ' – ${t.nazivTeretane}' : ''}',
            ),
            const SizedBox(height: 4),
            Text('Trener: ${t.trenerIme} ${t.trenerPrezime}'),
            const SizedBox(height: 8),
            Text('Vrijeme: $datePart $timePart'),
            const SizedBox(height: 8),
            Text(
              'Prijavljeno: ${t.trenutnoPrijavljenih}/${t.maxBrojSportasa}',
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _isLoading
                    ? null
                    : () async {
                  setState(() => _isLoading = true);
                  final result = await controller
                      .signUpForTraining(t.rasporedId);
                  if (!mounted) return;
                  setState(() => _isLoading = false);

                  String msg;
                  switch (result) {
                    case SignUpResult.success:
                      msg = 'Uspješno si prijavljen na trening';
                      break;
                    case SignUpResult.userAlreadySigned:
                      msg = 'Već si prijavljen na ovaj trening';
                      break;
                    case SignUpResult.trainingFull:
                      msg = 'Trening je popunjen';
                      break;
                    case SignUpResult.error:
                    default:
                      msg = 'Greška pri prijavi.';
                  }

                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text(msg)),
                  );

                  if (result == SignUpResult.success) {
                    Navigator.of(context).pop();
                  }
                },
                child: _isLoading
                    ? const SizedBox(
                  height: 20,
                  width: 20,
                  child: CircularProgressIndicator(strokeWidth: 2),
                )
                    : const Text('Prijavi se'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
