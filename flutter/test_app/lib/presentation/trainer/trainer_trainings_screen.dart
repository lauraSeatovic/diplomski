import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/trainer/trainer_attendees_screen.dart';
import 'trainer_trainings_controller.dart';

class TrainerTrainingsScreen extends ConsumerWidget {
  final String trenerId;

  final VoidCallback onAddRasporedClick;
  final VoidCallback onAddTrainingClick;

  const TrainerTrainingsScreen({
    super.key,
    required this.trenerId,
    required this.onAddRasporedClick,
    required this.onAddTrainingClick,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(trainerTrainingsControllerProvider(trenerId));
    final notifier =
    ref.read(trainerTrainingsControllerProvider(trenerId).notifier);

    if (!state.isLoading && state.trainings.isEmpty && state.error == null) {
      Future.microtask(() => notifier.load());
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Moji treninzi')),
      body: Builder(
        builder: (_) {
          if (state.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.error != null) {
            return Center(child: Text(state.error!));
          }
          if (state.trainings.isEmpty) {
            return const Center(child: Text('Nema termina.'));
          }

          return ListView.separated(
            itemCount: state.trainings.length,
            separatorBuilder: (_, __) => const Divider(height: 1),
            itemBuilder: (_, i) {
              final t = state.trainings[i];
              final time = '${_dateTime(t.pocetak)} - ${_dateTime(t.zavrsetak)}';

              return ListTile(
                title: Text(
                  '${_dateTime(t.pocetak)} – ${_dateTime(t.zavrsetak)}',
                ),
                subtitle: Text(
                  '${t.vrstaNaziv}\n${t.teretanaNaziv} • ${t.dvoranaNaziv}',
                ),
                isThreeLine: true,
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.delete_outline),
                      onPressed: () async {
                        final ok = await _confirmDelete(context);

                        if (ok == true) {
                          await notifier.deleteRaspored(t.rasporedId);

                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(content: Text('Termin je obrisan.')),
                            );
                          }
                        }
                      },
                    ),
                    const Icon(Icons.chevron_right),
                  ],
                ),
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => TrainerAttendeesScreen(
                        rasporedId: t.rasporedId,
                      ),
                    ),
                  );
                },
              );

            },
          );
        },
      ),

      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(12, 8, 12, 12),
          child: Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: onAddRasporedClick,
                  child: const Text('Novi termin'),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: OutlinedButton(
                  onPressed: onAddTrainingClick,
                  child: const Text('Novi trening'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool?> _confirmDelete(BuildContext context) {
    return showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Brisanje termina'),
        content: const Text(
          'Jeste li sigurni da želite obrisati ovaj termin?',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: const Text('Odustani'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Obriši'),
          ),
        ],
      ),
    );
  }


  String _dateTime(DateTime dt) {
    final d =
        '${dt.day.toString().padLeft(2, '0')}.${dt.month.toString().padLeft(2, '0')}.${dt.year}.';
    final t =
        '${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}';
    return '$d $t';
  }

}
