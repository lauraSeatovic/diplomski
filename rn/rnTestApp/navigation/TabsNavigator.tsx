import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ProfileStack } from './ProfileStack';
import { TrainingsStack } from './TrainingStack';

export type TabsParamList = {
  ProfileTab: undefined;
  TrainingsTab: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0066ff',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{ title: 'Profil' }}
      />

      <Tab.Screen
        name="TrainingsTab"
        component={TrainingsStack}
        options={{ title: 'Trening' }}
      />
    </Tab.Navigator>
  );
}
