import React, { useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, Alert, Platform } from "react-native";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TrainerTrainingsStackParamList } from "../navigation/TrainerTrainingsStack";
import { useCreateRaspored } from "../hooks/useCreateRaspored";
import { DropdownOption, DropdownModal } from "./dropdown";

type Nav = NativeStackNavigationProp<TrainerTrainingsStackParamList, "CreateRaspored">;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatDateTimeHR(d: Date) {
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

type PickerTarget = "startDate" | "startTime" | "endDate" | "endTime" | null;

export function CreateRasporedScreen() {
  const nav = useNavigation<Nav>();
  const { options, isLoading, isSaving, isError, submit } = useCreateRaspored();

  const [treningId, setTreningId] = useState<string>("");

  // default: now + 1h
  const [pocetak, setPocetak] = useState<Date>(new Date());
  const [zavrsetak, setZavrsetak] = useState<Date>(new Date(Date.now() + 60 * 60 * 1000));

  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const trainingOptions: DropdownOption[] = useMemo(
    () => options.map((o) => ({ value: o.treningId, label: o.label })),
    [options]
  );

  const canSubmit = useMemo(() => {
    return !!treningId && zavrsetak.getTime() > pocetak.getTime();
  }, [treningId, pocetak, zavrsetak]);

  const openStart = () => setPickerTarget("startDate");
  const openEnd = () => setPickerTarget("endDate");

  const closePicker = () => setPickerTarget(null);

  const onChange = (event: DateTimePickerEvent, selected?: Date) => {
    // Android: cancel gives type === "dismissed"
    if (Platform.OS === "android" && event.type === "dismissed") {
      closePicker();
      return;
    }
    if (!selected) return;

    if (pickerTarget === "startDate") {
      // set date, keep time
      const next = new Date(pocetak);
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setPocetak(next);
      // chain to time picker
      setPickerTarget("startTime");
      return;
    }

    if (pickerTarget === "startTime") {
      const next = new Date(pocetak);
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setPocetak(next);

      // optionally auto-adjust end if now invalid
      if (zavrsetak.getTime() <= next.getTime()) {
        setZavrsetak(new Date(next.getTime() + 60 * 60 * 1000));
      }

      closePicker();
      return;
    }

    if (pickerTarget === "endDate") {
      const next = new Date(zavrsetak);
      next.setFullYear(selected.getFullYear(), selected.getMonth(), selected.getDate());
      setZavrsetak(next);
      setPickerTarget("endTime");
      return;
    }

    if (pickerTarget === "endTime") {
      const next = new Date(zavrsetak);
      next.setHours(selected.getHours(), selected.getMinutes(), 0, 0);
      setZavrsetak(next);
      closePicker();
      return;
    }
  };

  const currentPickerValue = useMemo(() => {
    switch (pickerTarget) {
      case "startDate":
      case "startTime":
        return pocetak;
      case "endDate":
      case "endTime":
        return zavrsetak;
      default:
        return new Date();
    }
  }, [pickerTarget, pocetak, zavrsetak]);

  const pickerMode = useMemo(() => {
    if (pickerTarget === "startDate" || pickerTarget === "endDate") return "date";
    if (pickerTarget === "startTime" || pickerTarget === "endTime") return "time";
    return "date";
  }, [pickerTarget]);

  const onSave = async () => {
    if (!canSubmit) {
      Alert.alert("Neispravno", "Provjeri odabir treninga i vremena (završetak mora biti nakon početka).");
      return;
    }

    try {
      await submit({ treningId, pocetak, zavrsetak });
      Alert.alert("Uspjeh", "Termin je kreiran.");
      nav.goBack();
    } catch (e: any) {
      Alert.alert("Greška", e?.message ?? "Kreiranje termina nije uspjelo.");
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, padding: 16, justifyContent: "center", gap: 12 }}>
        <Text>Dogodila se greška.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novi termin</Text>

      <DropdownModal
        label="Trening"
        value={treningId}
        options={trainingOptions}
        onChange={(v) => setTreningId(v)}
        placeholder="Odaberi trening"
        searchPlaceholder="Pretraži treninge..."
        disabled={trainingOptions.length === 0}
      />

      <Text style={{ fontWeight: "600" }}>Početak</Text>
      <Pressable
        onPress={openStart}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      >
        <Text>{formatDateTimeHR(pocetak)}</Text>
      </Pressable>

      <Text style={{ fontWeight: "600" }}>Završetak</Text>
      <Pressable
        onPress={openEnd}
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      >
        <Text>{formatDateTimeHR(zavrsetak)}</Text>
      </Pressable>

      <Pressable
        disabled={!canSubmit || isSaving}
        onPress={onSave}
        style={{
          padding: 14,
          borderRadius: 10,
          alignItems: "center",
          borderWidth: 1,
          opacity: !canSubmit || isSaving ? 0.5 : 1,
        }}
      >
        <Text style={{ fontWeight: "700" }}>{isSaving ? "Spremam..." : "Spremi"}</Text>
      </Pressable>

      {!!pickerTarget && (
        <DateTimePicker
          value={currentPickerValue}
          mode={pickerMode as any}
          is24Hour={true}
          onChange={onChange}
          display={Platform.OS === "ios" ? "spinner" : "default"}
        />
      )}
    </View>
  );
}
