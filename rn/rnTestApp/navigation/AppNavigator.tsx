import React, { useEffect, useMemo, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ActivityIndicator, View } from "react-native";

import { TabsNavigator } from "./TabsNavigator";
import { AuthRepositoryImpl } from "../data/supabase/repository/AuthRepositoryImpl";
import { UserRole } from "../domain/repository/AuthRepository";
import { TrainerTabsNavigator } from "./TrainerTabsNavigator";
import { LoginScreen } from "../screens/auth/loginScreen";
import { authRepository } from "../hooks/configuration/repositories";

export type RootStackParamList = {
  Login: undefined;
  SportasTabs: undefined;
  TrainerTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const authRepo = useMemo(() => authRepository, []);

  const [isLoading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  useEffect(() => {
    const restore = async () => {
      setLoading(true);
             setUserId(null);
          setRole(null);
          setLoading(false);
          return;
    };

    restore();
  }, [authRepo]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  const isAuthed = !!userId && !!role;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthed ? (
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen
                {...props}
                onLoginSuccess={async () => {
                  const uid = await authRepo.getCurrentUserId();
                  if (!uid) return;
                  const r = await authRepo.getUserRole(uid);
                  setUserId(uid);
                  setRole(r);
                }}
              />
            )}
          </Stack.Screen>
        ) : role === "SPORTAS" ? (
          <Stack.Screen name="SportasTabs" component={TabsNavigator} />
        ) : (
          <Stack.Screen name="TrainerTabs" component={TrainerTabsNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
