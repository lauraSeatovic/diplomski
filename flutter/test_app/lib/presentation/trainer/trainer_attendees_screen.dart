
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'attendees_controler.dart';

class TrainerAttendeesScreen extends ConsumerWidget {
  final String rasporedId;

  const TrainerAttendeesScreen({
    super.key,
    required this.rasporedId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(trainerAttendeesControllerProvider(rasporedId));
    final notifier = ref.read(trainerAttendeesControllerProvider(rasporedId).notifier);
    /*
    if (!state.isLoading && state.attendees.isEmpty && state.error == null) {
      Future.microtask(() => notifier.load());
    }
*/
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sudionici'),
        actions: [
          if (!state.isEditMode && !state.isLoading)
            TextButton(
              onPressed: state.attendees.isEmpty ? null : notifier.enterEditMode,
              child: const Text('Označi prisutnost'),
            ),
          if (state.isEditMode)
            TextButton(
              onPressed: notifier.cancelEditMode,
              child: const Text('Odustani'),
            ),
        ],
      ),
      body: Builder(
        builder: (_) {
          if (state.isLoading) return const Center(child: CircularProgressIndicator());
          if (state.error != null) return Center(child: Text(state.error!));
          if (state.attendees.isEmpty) return const Center(child: Text('Nema prijavljenih.'));

          return ListView.separated(
            padding: const EdgeInsets.all(12),
            itemCount: state.attendees.length,
            separatorBuilder: (_, __) => const SizedBox(height: 8),
            itemBuilder: (_, i) {
              final a = state.attendees[i];
              final checked = state.isEditMode
                  ? (state.pending[a.sportasId] ?? a.dolazakNaTrening)
                  : a.dolazakNaTrening;

              return Card(
                child: ListTile(
                  title: Text('${a.ime} ${a.prezime}'),
                  subtitle: Text('Ocjena: ${a.ocjenaTreninga ?? '-'}'),
                  trailing: state.isEditMode
                      ? Checkbox(
                    value: checked,
                    onChanged: (v) => notifier.toggleAttendance(a.sportasId, v ?? false),
                  )
                      : Icon(checked ? Icons.check_circle : Icons.radio_button_unchecked),
                ),
              );
            },
          );
        },
      ),
      bottomNavigationBar: state.isEditMode
          ? SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: ElevatedButton(
            onPressed: state.isSaving ? null : notifier.submit,
            child: state.isSaving
                ? const SizedBox(
              height: 18,
              width: 18,
              child: CircularProgressIndicator(strokeWidth: 2),
            )
                : const Text('Potvrdi'),
          ),
        ),
      )
          : null,
    );
  }
}
