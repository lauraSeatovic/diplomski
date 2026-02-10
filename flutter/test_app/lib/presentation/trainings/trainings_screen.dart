import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/trainings/provider.dart';
import 'package:test_app/presentation/trainings/training_details_screen.dart';
import 'package:test_app/presentation/trainings/training_state.dart';

import '../../domain/model/common_models.dart';
import '../../domain/model/training_models.dart';
import '../../providers.dart';

class TrainingSelectionScreen extends ConsumerWidget {
  const TrainingSelectionScreen({
    super.key,
    required this.userId,
  });

  final String userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(trainingsControllerProvider(userId));
    final controller =
    ref.read(trainingsControllerProvider(userId).notifier);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Prijava na trening'),
      ),
      body: RefreshIndicator(
        onRefresh: () => controller.loadTrainings(),
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            _FilterRow(
              state: state,
              onChangeDate: (date) => controller.changeDate(date),
              onChangeTeretana: (t) => controller.changeTeretana(t),
            ),
            const SizedBox(height: 16),
            if (state.isLoading)
              const Center(child: CircularProgressIndicator())
            else if (state.errorMessage != null)
              Text(
                state.errorMessage!,
                style: const TextStyle(color: Colors.red),
              )
            else if (state.treninzi.isEmpty)
                const Text('Nema treninga za odabrani datum i teretanu.')
              else
                ...state.treninzi.map(
                      (t) => _TrainingCard(
                    trening: t,
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => TrainingDetailsScreen(
                                userId: userId,
                                trening: t,
                              ),
                            ),
                          );
                        },

                      ),
                ),
          ],
        ),
      ),
    );
  }

  Future<void> _showTrainingDetails(
      BuildContext context,
      DostupniTrening trening,
      Future<SignUpResult> Function() onSignUp,
      ) async {
    final result = await showModalBottomSheet<SignUpResult>(
      context: context,
      builder: (context) {
        return _TrainingDetailsSheet(
          trening: trening,
          onSignUp: onSignUp,
        );
      },
    );

    if (result != null) {
      String msg;
      switch (result) {
        case SignUpResult.success:
          msg = 'Uspješno si prijavljen na trening 💪';
          break;
        case SignUpResult.userAlreadySigned:
          msg = 'Već si prijavljen na ovaj trening 🙂';
          break;
        case SignUpResult.trainingFull:
          msg = 'Trening je popunjen 😔';
          break;
        case SignUpResult.error:
        default:
          msg = 'Greška pri prijavi.';
      }

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(msg)),
      );
    }
  }
}

class _FilterRow extends StatelessWidget {
  const _FilterRow({
    required this.state,
    required this.onChangeDate,
    required this.onChangeTeretana,
  });

  final TrainingsState state;
  final ValueChanged<DateTime> onChangeDate;
  final ValueChanged<Teretana> onChangeTeretana;

  @override
  Widget build(BuildContext context) {
    final teretane = state.teretane;
    final selected = state.selectedTeretana;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'Filter',
          style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 8),
        Row(
          children: [
            Expanded(
              child: InkWell(
                onTap: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: state.selectedDate,
                    firstDate:
                    DateTime.now().subtract(const Duration(days: 1)),
                    lastDate:
                    DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) {
                    onChangeDate(picked);
                  }
                },
                child: InputDecorator(
                  decoration: const InputDecoration(
                    labelText: 'Datum',
                    border: OutlineInputBorder(),
                  ),
                  child: Text(
                    '${state.selectedDate.day}.${state.selectedDate.month}.${state.selectedDate.year}.',
                  ),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: DropdownButtonFormField<Teretana>(
                value: selected,
                isExpanded: true,
                decoration: const InputDecoration(
                  labelText: 'Teretana',
                  border: OutlineInputBorder(),
                ),
                items: teretane
                    .map(
                      (t) => DropdownMenuItem(
                    value: t,
                    child: Text(
                      t.nazivTeretane,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ),
                )
                    .toList(),
                onChanged: (t) {
                  if (t != null) {
                    onChangeTeretana(t);
                  }
                },
              ),
            ),

          ],
        ),
      ],
    );
  }
}

class _TrainingCard extends StatelessWidget {
  const _TrainingCard({
    required this.trening,
    required this.onTap,
  });

  final DostupniTrening trening;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final start = trening.pocetak;
    final end = trening.kraj;

    final datePart =
        '${start.day}.${start.month}.${start.year}.';
    final timePart =
        '${start.hour.toString().padLeft(2, '0')}:${start.minute.toString().padLeft(2, '0')}'
        ' - '
        '${end.hour.toString().padLeft(2, '0')}:${end.minute.toString().padLeft(2, '0')}';

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      child: ListTile(
        title: Text(trening.nazivVrsteTreninga),
        subtitle: Text(
          '${trening.nazivDvorane}'
              '${trening.nazivTeretane != null ? ' – ${trening.nazivTeretane}' : ''}\n'
              '$datePart $timePart',
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}

class _TrainingDetailsSheet extends StatefulWidget {
  const _TrainingDetailsSheet({
    required this.trening,
    required this.onSignUp,
  });

  final DostupniTrening trening;
  final Future<SignUpResult> Function() onSignUp;

  @override
  State<_TrainingDetailsSheet> createState() =>
      _TrainingDetailsSheetState();
}

class _TrainingDetailsSheetState extends State<_TrainingDetailsSheet> {
  bool _isLoading = false;

  @override
  Widget build(BuildContext context) {
    final t = widget.trening;

    return Padding(
      padding:
      const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            t.nazivVrsteTreninga,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            '${t.nazivDvorane}'
                '${t.nazivTeretane != null ? ' – ${t.nazivTeretane}' : ''}',
          ),
          const SizedBox(height: 4),
          Text('Trener: ${t.trenerIme} ${t.trenerPrezime}'),
          const SizedBox(height: 8),
          Text(
            'Prijavljeno: ${t.trenutnoPrijavljenih}/${t.maxBrojSportasa}',
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isLoading
                  ? null
                  : () async {
                setState(() => _isLoading = true);
                final result = await widget.onSignUp();
                if (!mounted) return;
                setState(() => _isLoading = false);
                Navigator.of(context).pop(result);
              },
              child: _isLoading
                  ? const CircularProgressIndicator()
                  : const Text('Prijavi se'),
            ),
          ),
        ],
      ),
    );
  }
}
