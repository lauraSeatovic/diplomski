import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useProfile } from '../hooks/useProfile';

type ProfileScreenProps = {
  userId: string;
};

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ userId }) => {
  const { user, trainings, isLoading, isError } = useProfile(userId);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Učitavanje profila…</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Došlo je do pogreške pri učitavanju profila.
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Korisnik nije pronađen.</Text>
      </View>
    );
  }

  const formattedDate = user.datumRodenja.toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Moj profil</Text>

      <View style={styles.card}>
        <Label text="Ime i prezime" />
        <Value text={`${user.ime} ${user.prezime}`} />

        <Separator />

        <Label text="Datum rođenja" />
        <Value text={formattedDate} />

        <Separator />

        <Label text="Tip članarine" />
        <Value text={user.tipClanarine ?? 'Nije postavljeno'} />
      </View>

      {/* Moji treninzi */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Moji treninzi</Text>

        {trainings.length === 0 ? (
          <Text style={styles.emptyText}>Trenutno nemate prijavljenih treninga.</Text>
        ) : (
          trainings.map((t, index) => (
            <TrainingCard key={index.toString()} trening={t} />
          ))
        )}
      </View>
    </ScrollView>
  );
};

type TextProps = { text: string };

const Label: React.FC<TextProps> = ({ text }) => (
  <Text style={styles.label}>{text}</Text>
);

const Value: React.FC<TextProps> = ({ text }) => (
  <Text style={styles.value}>{text}</Text>
);

const Separator = () => <View style={styles.separator} />;

type TrainingCardProps = {
  trening: {
    naziv: string;
    pocetak: Date;
    kraj: Date;
    dvorana: string;
    teretana?: string | null;
  };
};

const TrainingCard: React.FC<TrainingCardProps> = ({ trening }) => {
  const start = trening.pocetak;
  const end = trening.kraj;

  const dateStr = `${start.getDate().toString().padStart(2, '0')}.${(start.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${start.getFullYear()}.`;

  const timeStr =
    `${start.getHours().toString().padStart(2, '0')}:${start
      .getMinutes()
      .toString()
      .padStart(2, '0')}` +
    ' - ' +
    `${end.getHours().toString().padStart(2, '0')}:${end
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

  return (
    <View style={styles.trainingCard}>
      <Text style={styles.trainingTitle}>{trening.naziv}</Text>
      <Text style={styles.trainingSubtitle}>
        {dateStr} {timeStr}
      </Text>
      <Text style={styles.trainingText}>Dvorana: {trening.dvorana}</Text>
      {trening.teretana && (
        <Text style={styles.trainingText}>Teretana: {trening.teretana}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    fontSize: 24,
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
  sectionContainer: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#777',
  },
  trainingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  trainingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  trainingSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  trainingText: {
    fontSize: 13,
    marginTop: 2,
  },
});
