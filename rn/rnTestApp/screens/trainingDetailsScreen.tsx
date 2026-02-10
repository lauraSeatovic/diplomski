import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SignUpResult } from '../domain/models/common';
import { useTrainingDetails } from '../hooks/useTrainingDetails';
import { TrainingsStackParamList } from '../navigation/TrainingStack';
import { authRepository } from '../hooks/configuration/repositories';


type Props = NativeStackScreenProps<
  TrainingsStackParamList,
  'TrainingDetails'
>;

export const TrainingDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { treningId, rasporedId } = route.params;

  const authRepo = authRepository;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    authRepo.getCurrentUserId().then(setUserId);
  }, [authRepo]);

  const {
    details,
    isLoading,
    isSigningUp,
    error,
    reload,
    signUp,
  } = useTrainingDetails(treningId, rasporedId, userId ?? "");

  // UI “gate” ide NAKON hooka (to je ok)
  if (!userId) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Učitavanje korisnika…</Text>
      </View>
    );
  }

  const handleSignUp = async () => {
    const result = await signUp();

    let message = '';
    switch (result) {
      case SignUpResult.Success:
        message = 'Uspješna prijava na trening';
        Alert.alert('Prijava', message, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
        return;
      case SignUpResult.UserAlreadySigned:
        message = 'Već si prijavljena na ovaj trening';
        break;
      case SignUpResult.TrainingFull:
        message = 'Trening je pun';
        break;
      default:
        message = 'Dogodila se greška prilikom prijave.';
    }

    Alert.alert('Prijava', message);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Učitavanje detalja treninga…</Text>
      </View>
    );
  }

  if (error || !details) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error ?? 'Neuspješno učitavanje detalja treninga.'}
        </Text>
        <Button title="Pokušaj ponovno" onPress={reload} />
      </View>
    );
  }

  return (
  <ScrollView contentContainerStyle={styles.container}>
    <Text style={styles.title}>{details.nazivVrste}</Text>

    <View style={styles.card}>

      <Label text="Težina treninga" />
      <Value text={details.tezina.toString()} />
    </View>

    <View style={styles.buttonContainer}>
      <Button
        title={isSigningUp ? 'Prijava…' : 'Prijavi se na trening'}
        onPress={handleSignUp}
        disabled={isSigningUp}
      />
    </View>
  </ScrollView>
);
};

const Label: React.FC<{ text: string }> = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

const Value: React.FC<{ text: string }> = ({ text }) => (
  <Text style={styles.value}>{text}</Text>
);

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
  },
  errorText: {
    marginBottom: 16,
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 14,
    color: '#777',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 8,
  },
  buttonContainer: {
    marginTop: 24,
  },
});
