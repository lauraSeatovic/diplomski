import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTrainerTrainings } from "../hooks/useTrainerTrainings";
import { TrainerTrainingsStackParamList } from "../navigation/TrainerTrainingsStack";
import { TrenerTrening } from "../domain/models/trainer";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


type Nav = NativeStackNavigationProp<
  TrainerTrainingsStackParamList,
  "TrainerTrainings"
>;

export function TrainerTrainingsScreen() {
  const nav = useNavigation<Nav>();
  const { trainings, isLoading, isError, refetch, deleteRaspored } =
    useTrainerTrainings();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, padding: 16, gap: 12, justifyContent: "center" }}>
        <Text>Dogodila se greška.</Text>
        <Pressable
          onPress={refetch}
          style={{
            padding: 12,
            borderWidth: 1,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          <Text>Pokušaj ponovno</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={trainings}
        keyExtractor={(item) => item.rasporedId}
        contentContainerStyle={{ padding: 12, paddingBottom: 88 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <Row
            item={item}
            onPress={() =>
              nav.navigate("TrainerAttendees", { rasporedId: item.rasporedId })
            }
            onDelete={() => {
              Alert.alert(
                "Brisanje termina",
                "Jeste li sigurni da želite obrisati ovaj termin?",
                [
                  { text: "Odustani", style: "cancel" },
                  {
                    text: "Obriši",
                    style: "destructive",
                    onPress: async () => {
                      try {
                        await deleteRaspored(item.rasporedId);
                      } catch (e: any) {
                        Alert.alert(
                          "Greška",
                          e?.message ?? "Brisanje termina nije uspjelo."
                        );
                      }
                    },
                  },
                ]
              );
            }}
          />
        )}
        ListEmptyComponent={<Text>Nema termina.</Text>}
        onRefresh={refetch}
        refreshing={isLoading}
      />

      {/* Bottom buttons */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          padding: 12,
          borderTopWidth: 1,
          backgroundColor: "white",
          flexDirection: "row",
          gap: 10,
        }}
      >
        <Pressable
          onPress={() => nav.navigate("CreateTrening" as any)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            borderWidth: 1,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Novi trening</Text>
        </Pressable>

        <Pressable
          onPress={() => nav.navigate("CreateRaspored" as any)}
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            borderWidth: 1,
          }}
        >
          <Text style={{ fontWeight: "600" }}>Novi termin</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  item,
  onPress,
  onDelete,
}: {
  item: TrenerTrening;
  onPress: () => void;
  onDelete: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        padding: 12,
        borderWidth: 1,
        borderRadius: 10,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "600" }}>
            {formatHm(item.pocetakVrijeme)} - {formatHm(item.zavrsetakVrijeme)} • {item.vrstaTreningaNaziv}
          </Text>

          <Text>
            {formatDate(item.pocetakVrijeme)} • {item.teretanaNaziv} • {item.dvoranaNaziv}
          </Text>
        </View>

        <Pressable onPress={onDelete} hitSlop={10}>
          <Icon name="delete" size={22} color="#B00020" />
        </Pressable>
      </View>
    </Pressable>
  );
}

function formatHm(iso: string) {
  const dt = new Date(iso);
  const h = String(dt.getHours()).padStart(2, "0");
  const m = String(dt.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function formatDate(iso: string) {
  const dt = new Date(iso);
  const d = String(dt.getDate()).padStart(2, "0");
  const mo = String(dt.getMonth() + 1).padStart(2, "0");
  const y = dt.getFullYear();
  return `${d}.${mo}.${y}.`;
}