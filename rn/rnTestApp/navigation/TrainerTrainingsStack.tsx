import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TrainerTrainingsScreen } from "../screens/trainerTrainingsScreen";
import { TrainerAttendeesScreen } from "../screens/trainerAttendeesScreen";
import { CreateRasporedScreen } from "../screens/CreateRasporedScreen";
import { CreateTreningScreen } from "../screens/CreateTreningScreen";

export type TrainerTrainingsStackParamList = {
  TrainerTrainings: undefined;
  TrainerAttendees: { rasporedId: string };
  CreateTrening: undefined;
  CreateRaspored: undefined;
};

const Stack = createNativeStackNavigator<TrainerTrainingsStackParamList>();

export function TrainerTrainingsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TrainerTrainings"
        component={TrainerTrainingsScreen}
        options={{ title: "Moji treninzi" }}
      />
      <Stack.Screen
        name="TrainerAttendees"
        component={TrainerAttendeesScreen}
        options={{ title: "Sudionici" }}
      />

      <Stack.Screen
        name="CreateTrening"
        component={CreateTreningScreen}
        options={{ title: "Novi trening" }}
      />
      <Stack.Screen
        name="CreateRaspored"
        component={CreateRasporedScreen}
        options={{ title: "Novi termin" }}
      />
    </Stack.Navigator>
  );
}
