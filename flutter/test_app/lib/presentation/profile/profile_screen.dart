import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:test_app/presentation/profile/providers.dart';

import '../../domain/model/prijavljen_trening.dart';
import '../../providers.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  final String userId;

  const ProfileScreen({super.key, required this.userId});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(profileControllerProvider.notifier).load(widget.userId);
    });
  }

  @override
  Widget build(BuildContext context) {
    final state = ref.watch(profileControllerProvider);
    final controller = ref.read(profileControllerProvider.notifier);

    if (state.isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (state.error != null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                state.error!,
                style: const TextStyle(color: Colors.red),
              ),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () => controller.reload(widget.userId),
                child: const Text('Pokušaj ponovno'),
              ),
            ],
          ),
        ),
      );
    }

    final user = state.user;

    if (user == null) {
      return Scaffold(
        body: Center(
          child: ElevatedButton(
            onPressed: () => controller.load(widget.userId),
            child: const Text('Učitaj profil'),
          ),
        ),
      );
    }

    final prijavljeniTreninzi = state.prijavljeniTreninzi;

    return Scaffold(
      appBar: AppBar(title: const Text('Moj profil')),
      body: RefreshIndicator(
        onRefresh: () => controller.reload(widget.userId),
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _label('Ime i prezime'),
                    _value('${user.ime} ${user.prezime}'),
                    const Divider(),
                    _label('Datum rođenja'),
                    _value(_formatDate(user.datumRodenja)),
                    const Divider(),
                    _label('Tip članarine'),
                    _value(user.tipClanarine ?? 'Nije definirano'),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            const Text(
              'Prijavljeni treninzi',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 8),

            if (prijavljeniTreninzi.isEmpty)
              const Padding(
                padding: EdgeInsets.only(top: 8.0),
                child: Text(
                  'Još nemaš prijavljenih treninga.',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              )
            else
              ...prijavljeniTreninzi.map(_buildTrainingCard),
          ],
        ),
      ),
    );
  }

  Widget _label(String text) => Text(
    text,
    style: const TextStyle(fontSize: 14, color: Colors.grey),
  );

  Widget _value(String text) => Padding(
    padding: const EdgeInsets.only(top: 4.0, bottom: 8.0),
    child: Text(
      text,
      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
    ),
  );

  Widget _buildTrainingCard(PrijavljenTrening trening) {
    return Card(
      elevation: 2,
      margin: const EdgeInsets.symmetric(vertical: 6.0),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10),
      ),
      child: Padding(
        padding: const EdgeInsets.all(12.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              trening.nazivVrsteTreninga,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 4),
            Text(
              '${trening.nazivDvorane} – ${trening.nazivTeretane}, ${trening.mjestoTeretane}',
              style: const TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 8),
            Text(
              '${_formatDateTime(trening.pocetak)} - ${_formatTime(trening.kraj)}',
              style: const TextStyle(fontSize: 14),
            ),
            if (trening.ocjenaTreninga != null) ...[
              const SizedBox(height: 8),
              Text(
                'Ocjena: ${trening.ocjenaTreninga}/5',
                style: const TextStyle(fontSize: 14),
              ),
            ],
          ],
        ),
      ),
    );
  }

  String _formatDate(DateTime date) {
    return '${date.day}.${date.month}.${date.year}.';
  }

  String _formatDateTime(DateTime dt) {
    final date = _formatDate(dt);
    final time = _formatTime(dt);
    return '$date $time';
  }

  String _formatTime(DateTime dt) {
    final hh = dt.hour.toString().padLeft(2, '0');
    final mm = dt.minute.toString().padLeft(2, '0');
    return '$hh:$mm';
  }
}
