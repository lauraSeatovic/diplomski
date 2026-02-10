import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TrainingSelectionScreen } from '../screens/trainingScreen';
import { TrainingDetailsScreen } from '../screens/trainingDetailsScreen';
import { authRepository } from '../hooks/configuration/repositories';

export type TrainingsStackParamList = {
  TrainingSelection: undefined;
  TrainingDetails: { treningId: string; rasporedId: string };
};

export function TrainingsStack() {
const Stack = createNativeStackNavigator<TrainingsStackParamList>();

const authRepo = authRepository;
const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    authRepo.getCurrentUserId().then(setUserId);
  }, []);

  if (!userId) {
    return null;  }


  return (
    <Stack.Navigator>
      {/* MAIN SCREEN */}
      <Stack.Screen
        name="TrainingSelection"
        options={{ title: 'Trainings' }}
      >
        {() => <TrainingSelectionScreen userId={userId} />}
      </Stack.Screen>

      {/* DETAILS SCREEN */}
      <Stack.Screen
        name="TrainingDetails"
        component={TrainingDetailsScreen}
        options={{ title: 'Training Details' }}
      />
    </Stack.Navigator>
  );
}