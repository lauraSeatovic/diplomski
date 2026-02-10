import 'package:flutter/material.dart';
import '../profile/profile_screen.dart';
import '../trainings/trainings_screen.dart';

class SportasHomeShell extends StatefulWidget {
  const SportasHomeShell({
    super.key,
    required this.userId,
  });

  final String userId;

  @override
  State<SportasHomeShell> createState() => _SportasHomeShellState();
}

class _SportasHomeShellState extends State<SportasHomeShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final screens = [
      ProfileScreen(userId: widget.userId),
      TrainingSelectionScreen(userId: widget.userId),
    ];

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (newIndex) {
          setState(() {
            _currentIndex = newIndex;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profil',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.fitness_center),
            label: 'Treninzi',
          ),
        ],
      ),
    );
  }
}
