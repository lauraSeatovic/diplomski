import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '../screens/profileScreen';
import { authRepository } from '../hooks/configuration/repositories';

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export function ProfileStack() {
const authRepo = authRepository;
const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    authRepo.getCurrentUserId().then(setUserId);
  }, []);

  if (!userId) {
    return null;  }

const Stack = createNativeStackNavigator<ProfileStackParamList>();

  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" options={{ title: 'My Profile' }}>
        {() => <ProfileScreen userId={userId} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
