import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { DostupniTrening, Teretana } from '../domain/models/Trening';
import { TrainingsStackParamList } from '../navigation/TrainingStack';
import { useTrainingSelection } from '../hooks/useTrainingSelection';

type Props = {
  userId: string;
};

type Nav = NativeStackNavigationProp<
  TrainingsStackParamList,
  'TrainingSelection'
>;

export const TrainingSelectionScreen: React.FC<Props> = ({ userId }) => {
  const navigation = useNavigation<Nav>();

  const {
    teretane,
    selectedTeretana,
    selectedDate,
    trainings,
    isLoading,
    error,
    changeDate,
    changeTeretana,
  } = useTrainingSelection(userId);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTeretanaDropdown, setShowTeretanaDropdown] = useState(false);

  const formattedDate = selectedDate.toLocaleDateString('hr-HR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const onOpenDetails = (t: DostupniTrening) => {
    navigation.navigate('TrainingDetails', {
      treningId: t.treningId,
      rasporedId: t.rasporedId,
    });
  };

  const onChangeDate = (_event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      changeDate(date);
    }
  };

  const onSelectTeretana = (t: Teretana) => {
    changeTeretana(t);
    setShowTeretanaDropdown(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pretraga treninga</Text>

      {/* FILTRI */}
      <View style={styles.filtersContainer}>
        {/* Datum - kao u Flutteru/Kotlinu (date picker) */}
        <Text style={styles.filterLabel}>Datum</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.selectorText}>{formattedDate}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onChangeDate}
          />
        )}

        {/* Teretana - dropdown */}
        <Text style={[styles.filterLabel, { marginTop: 16 }]}>Teretana</Text>
        <TouchableOpacity
          style={styles.selector}
          onPress={() => setShowTeretanaDropdown((prev) => !prev)}
        >
          <Text style={styles.selectorText}>
            {selectedTeretana
              ? selectedTeretana.nazivTeretane
              : 'Odaberi teretanu'}
          </Text>
        </TouchableOpacity>

        {showTeretanaDropdown && (
          <View style={styles.dropdown}>
            {teretane.map((t) => (
              <TouchableOpacity
                key={t.idTeretane}
                style={styles.dropdownItem}
                onPress={() => onSelectTeretana(t)}
              >
                <Text style={styles.dropdownItemText}>{t.nazivTeretane}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Loading / error / prazno */}
      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      )}

      {error && !isLoading && (
        <Text style={styles.errorText}>{error}</Text>
      )}

      {!isLoading && trainings.length === 0 && !error && (
        <Text style={styles.emptyText}>
          Nema treninga za odabrani datum i teretanu.
        </Text>
      )}

      {/* Lista treninga */}
      {!isLoading && trainings.length > 0 && (
        <FlatList
          data={trainings}
          keyExtractor={(item) => item.rasporedId}
          contentContainerStyle={{ paddingTop: 16 }}
          renderItem={({ item }) => (
            <TrainingCard trening={item} onPress={() => onOpenDetails(item)} />
          )}
        />
      )}
    </View>
  );
};

type TrainingCardProps = {
  trening: DostupniTrening;
  onPress: () => void;
};

const TrainingCard: React.FC<TrainingCardProps> = ({ trening, onPress }) => {
  const start = trening.pocetak;
  const end = trening.kraj;

  const dateStr = `${start.getDate().toString().padStart(2, '0')}.${(
    start.getMonth() + 1
  )
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
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{trening.nazivVrsteTreninga}</Text>
      <Text style={styles.cardSubtitle}>
        {dateStr} {timeStr}
      </Text>
      <Text style={styles.cardText}>Dvorana: {trening.nazivDvorane}</Text>
      {trening.nazivTeretane && (
        <Text style={styles.cardText}>
          Teretana: {trening.nazivTeretane}
        </Text>
      )}
      <Text style={styles.cardText}>
        Trener: {trening.trenerIme} {trening.trenerPrezime}
      </Text>
      <Text style={styles.cardText}>
        {trening.trenutnoPrijavljenih}/{trening.maxBrojSportasa} prijavljenih
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
  },
  filtersContainer: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  selector: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorText: {
    fontSize: 16,
    color: '#333',
  },
  dropdown: {
    marginTop: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#333',
  },
  center: {
    marginTop: 16,
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    marginTop: 8,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  cardText: {
    fontSize: 13,
    marginTop: 2,
  },
});
