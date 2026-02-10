import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../domain/model/training_models.dart';import 'create_training_controller.dart';

class CreateTrainingScreen extends ConsumerWidget {
  const CreateTrainingScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(createTrainingControllerProvider);
    final controller = ref.read(createTrainingControllerProvider.notifier);

    ref.listen(createTrainingControllerProvider, (prev, next) {
      if (next.created) {
        Navigator.of(context).pop();
      }
      if (next.errorMessage != null && next.errorMessage != prev?.errorMessage) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.errorMessage!)),
        );
      }
    });

    return Scaffold(
      appBar: AppBar(title: const Text('Novi trening')),
      body: state.isLoading
          ? const Center(child: CircularProgressIndicator())
          : ListView(
        padding: const EdgeInsets.all(16),
        children: [
          DropdownButtonFormField<String>(
            value: state.selectedDvoranaId,
            isExpanded: true,
            decoration: const InputDecoration(
              labelText: 'Dvorana',
              border: OutlineInputBorder(),
            ),
            items: state.dvorane
                .map(
                  (d) => DropdownMenuItem(
                value: d.idDvorane,
                child: Text(
                  '${d.nazivDvorane}',
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            )
                .toList(),
            onChanged: (id) => controller.setDvorana(id),
          ),
          const SizedBox(height: 12),

          Row(
            children: [
              Expanded(
                child: ChoiceChip(
                  label: const Text('Postojeća vrsta'),
                  selected: state.useExistingVrsta,
                  onSelected: (_) => controller.setUseExistingVrsta(true),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: ChoiceChip(
                  label: const Text('Nova vrsta'),
                  selected: !state.useExistingVrsta,
                  onSelected: (_) => controller.setUseExistingVrsta(false),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          if (state.useExistingVrsta)
            DropdownButtonFormField<String>(
              value: state.selectedVrstaId,
              isExpanded: true,
              decoration: const InputDecoration(
                labelText: 'Vrsta treninga',
                border: OutlineInputBorder(),
              ),
              items: state.vrste
                  .map(
                    (v) => DropdownMenuItem(
                  value: v.idVrTreninga,
                  child: Text(
                    '${v.nazivVrTreninga} (Težina ${v.tezina})',
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              )
                  .toList(),
              onChanged: (id) => controller.setVrsta(id),
            )
          else ...[
            TextField(
              decoration: const InputDecoration(
                labelText: 'Naziv vrste',
                border: OutlineInputBorder(),
              ),
              onChanged: controller.setNewVrstaNaziv,
            ),
            const SizedBox(height: 12),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Težina (1–10)',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
              onChanged: controller.setNewVrstaTezina,
            ),
          ],

          const SizedBox(height: 12),
          TextField(
            decoration: const InputDecoration(
              labelText: 'Maks. broj sportaša',
              border: OutlineInputBorder(),
            ),
            keyboardType: TextInputType.number,
            onChanged: controller.setMaxBrojSportasa,
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
}
