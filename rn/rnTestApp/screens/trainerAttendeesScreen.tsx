import React from "react";
import { View, Text, ActivityIndicator, FlatList, Pressable, Switch } from "react-native";
import { useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import { useTrainerAttendees } from "../hooks/useTrainerAttendees";
import { TrainerTrainingsStackParamList } from "../navigation/TrainerTrainingsStack";
import { PrijavljeniSudionik } from "../domain/models/trainer";

type R = RouteProp<TrainerTrainingsStackParamList, "TrainerAttendees">;

export function TrainerAttendeesScreen() {
  const route = useRoute<R>();
  const { rasporedId } = route.params;

  const {
    attendees,
    pending,
    isEditMode,
    isLoading,
    isSaving,
    isError,
    canEdit,
    refetch,
    enterEditMode,
    cancelEditMode,
    toggle,
    submit,
  } = useTrainerAttendees(rasporedId);

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
          style={{ padding: 12, borderWidth: 1, borderRadius: 8, alignItems: "center" }}
        >
          <Text>Pokušaj ponovno</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, flexDirection: "row", gap: 12, justifyContent: "space-between" }}>
        {!isEditMode ? (
          <Pressable
            onPress={enterEditMode}
            disabled={!canEdit}
            style={{ padding: 10, borderWidth: 1, borderRadius: 8, opacity: canEdit ? 1 : 0.5 }}
          >
            <Text>Označi prisutnost</Text>
          </Pressable>
        ) : (
          <Pressable onPress={cancelEditMode} style={{ padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Text>Odustani</Text>
          </Pressable>
        )}

        {isEditMode ? (
          <Pressable
            onPress={submit}
            disabled={isSaving}
            style={{ padding: 10, borderWidth: 1, borderRadius: 8, opacity: isSaving ? 0.5 : 1 }}
          >
            <Text>{isSaving ? "Spremanje..." : "Potvrdi"}</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        data={attendees}
        keyExtractor={(i) => i.sportasId}
        contentContainerStyle={{ padding: 12 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <AttendeeRow
            item={item}
            isEditMode={isEditMode}
            value={isEditMode ? pending[item.sportasId] ?? item.dolazakNaTrening : item.dolazakNaTrening}
            onChange={(v) => toggle(item.sportasId, v)}
          />
        )}
        ListEmptyComponent={<Text>Nema prijavljenih.</Text>}
      />
    </View>
  );
}

function AttendeeRow({
  item,
  isEditMode,
  value,
  onChange,
}: {
  item: PrijavljeniSudionik;
  isEditMode: boolean;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={{ padding: 12, borderWidth: 1, borderRadius: 10 }}>
      <Text style={{ fontWeight: "600" }}>
        {item.ime} {item.prezime}
      </Text>
      <Text>Ocjena: {item.ocjenaTreninga ?? "-"}</Text>

      <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text>{value ? "Prisutan" : "Nije prisutan"}</Text>
        {isEditMode ? <Switch value={value} onValueChange={onChange} /> : null}
      </View>
    </View>
  );
}
