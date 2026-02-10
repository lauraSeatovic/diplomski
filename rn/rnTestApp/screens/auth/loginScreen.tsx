import React, { useState } from "react";
import { View, Text, TextInput, Pressable, ActivityIndicator } from "react-native";
import { AuthRepositoryImpl } from "../../data/supabase/repository/AuthRepositoryImpl";
import { authRepository } from "../../hooks/configuration/repositories";

type Props = {
  onLoginSuccess: () => Promise<void>;
};

export function LoginScreen({ onLoginSuccess }: Props) {
  const authRepo = authRepository;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await authRepo.signIn(email.trim(), password);
      await onLoginSuccess();
    } catch (e: any) {
      setError(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
      <Text style={{ fontSize: 22, fontWeight: "600" }}>Prijava</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholder="Email"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Lozinka"
        style={{ borderWidth: 1, borderRadius: 8, padding: 12 }}
      />

      <Pressable
        onPress={onSubmit}
        disabled={isLoading}
        style={{
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          opacity: isLoading ? 0.6 : 1,
          borderWidth: 1,
        }}
      >
        {isLoading ? <ActivityIndicator /> : <Text>Prijavi se</Text>}
      </Pressable>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
    </View>
  );
}
