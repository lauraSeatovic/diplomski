import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { TrainerTrainingsStack } from "./TrainerTrainingsStack";

export type TrainerTabsParamList = {
  TrainerTrainingsTab: undefined;
};

const Tab = createBottomTabNavigator<TrainerTabsParamList>();

export function TrainerTabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#0066ff",
        tabBarInactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="TrainerTrainingsTab"
        component={TrainerTrainingsStack}
        options={{ title: "Trainings" }}
      />
    </Tab.Navigator>
  );
}
