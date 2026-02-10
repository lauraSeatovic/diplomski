import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import 'create_raspored_controller.dart';

class CreateRasporedScreen extends ConsumerWidget {
  final String trenerId;

  const CreateRasporedScreen({
    super.key,
    required this.trenerId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createRasporedControllerProvider(trenerId));
    final controller =
    ref.read(createRasporedControllerProvider(trenerId).notifier);

    ref.listen(createRasporedControllerProvider(trenerId), (prev, next) {
      if (next.created) Navigator.of(context).pop();
      if (next.errorMessage != null && next.errorMessage != prev?.errorMessage) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.errorMessage!)),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Novi termin')),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            value: state.selectedTreningId,
            isExpanded: true,
            decoration: const InputDecoration(
              labelText: 'Trening',
              border: OutlineInputBorder(),
            ),
            items: state.options
                .map(
                  (o) => DropdownMenuItem(
                value: o.idTreninga,
                child: Text(
                  o.label,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            )
                .toList(),
            onChanged: (id) => controller.setTrening(id),
          ),
          const SizedBox(height: 12),

          InkWell(
            onTap: () async {
              final picked = await showDatePicker(
                context: context,
                initialDate: state.date,
                firstDate: DateTime.now().subtract(const Duration(days: 1)),
                lastDate: DateTime.now().add(const Duration(days: 365)),
              );
              if (picked != null) controller.setDate(picked);
            },
            child: InputDecorator(
              decoration: const InputDecoration(
                labelText: 'Datum',
                border: OutlineInputBorder(),
              ),
              child: Text(
                '${state.date.day.toString().padLeft(2, '0')}.'
                    '${state.date.month.toString().padLeft(2, '0')}.'
                    '${state.date.year}.',
              ),
            ),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: InkWell(
                  onTap: () async {
                    final t = await showTimePicker(
                      context: context,
                      initialTime: state.start,
                    );
                    if (t != null) controller.setStart(t);
                  },
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Početak',
                      border: OutlineInputBorder(),
                    ),
                    child: Text(_hm(state.start)),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: InkWell(
                  onTap: () async {
                    final t = await showTimePicker(
                      context: context,
                      initialTime: state.end,
                    );
                    if (t != null) controller.setEnd(t);
                  },
                  child: InputDecorator(
                    decoration: const InputDecoration(
                      labelText: 'Završetak',
                      border: OutlineInputBorder(),
                    ),
                    child: Text(_hm(state.end)),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: state.isSubmitting ? null : controller.submit,
              child: state.isSubmitting
                  ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(strokeWidth: 2),
              )
                  : const Text('Spremi'),
            ),
          ),
        ],
      ),
    );
  }

  static String _hm(TimeOfDay t) =>
      '${t.hour.toString().padLeft(2, '0')}:${t.minute.toString().padLeft(2, '0')}';
}
