import React, { useMemo, useState } from "react";
import { View, Text, ActivityIndicator, Pressable, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TrainerTrainingsStackParamList } from "../navigation/TrainerTrainingsStack";
import { useCreateTrening } from "../hooks/useCreateTrening";
import { DropdownModal, DropdownOption } from "./dropdown";

type Nav = NativeStackNavigationProp<TrainerTrainingsStackParamList, "CreateTrening">;

export function CreateTreningScreen() {
  const nav = useNavigation<Nav>();
  const { dvorane, vrste, isLoading, isSaving, isError, submit } = useCreateTrening();

  const [dvoranaId, setDvoranaId] = useState<string>("");
  const [useExistingVrsta, setUseExistingVrsta] = useState(true);
  const [vrstaId, setVrstaId] = useState<string>("");
  const [novaVrstaNaziv, setNovaVrstaNaziv] = useState("");
  const [novaVrstaTezina, setNovaVrstaTezina] = useState<string>("");
  const [maks, setMaks] = useState<string>("20");

  const dvoranaOptions: DropdownOption[] = useMemo(
    () => dvorane.map((d) => ({ value: d.idDvorane, label: d.nazivDvorane })),
    [dvorane]
  );

  const vrstaOptions: DropdownOption[] = useMemo(
    () =>
      vrste.map((v) => ({
        value: v.idVrTreninga,
        label: v.nazivVrTreninga,
        subtitle: `Težina: ${v.tezina}`,
      })),
    [vrste]
  );

  const canSubmit = useMemo(() => {
    const maksNum = Number(maks);
    if (!dvoranaId) return false;
    if (!Number.isFinite(maksNum) || maksNum <= 0) return false;

    if (useExistingVrsta) return !!vrstaId;
    const tez = Number(novaVrstaTezina);
    return !!novaVrstaNaziv && Number.isFinite(tez);
  }, [dvoranaId, maks, useExistingVrsta, vrstaId, novaVrstaNaziv, novaVrstaTezina]);

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
        <Text>Dogodila se greška pri dohvaćanju podataka.</Text>
      </View>
    );
  }

  const onSave = async () => {
    try {
      await submit({
        dvoranaId,
        useExistingVrsta,
        vrstaId: useExistingVrsta ? vrstaId : undefined,
        novaVrstaNaziv: useExistingVrsta ? undefined : novaVrstaNaziv,
        novaVrstaTezina: useExistingVrsta ? undefined : Number(novaVrstaTezina),
        maksBrojSportasa: Number(maks),
      });
      Alert.alert("Uspjeh", "Trening je kreiran.");
      nav.goBack();
    } catch (e: any) {
      Alert.alert("Greška", e?.message ?? "Kreiranje nije uspjelo.");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 14 }}>
      <Text style={{ fontSize: 18, fontWeight: "700" }}>Novi trening</Text>

      <DropdownModal
        label="Dvorana"
        value={dvoranaId}
        options={dvoranaOptions}
        onChange={(v) => setDvoranaId(v)}
        placeholder="Odaberi dvoranu"
        searchPlaceholder="Pretraži dvorane..."
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={() => setUseExistingVrsta(true)}
          style={{
            flex: 1,
            padding: 12,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: useExistingVrsta ? "#eee" : "transparent",
          }}
        >
          <Text>Postojeća vrsta</Text>
        </Pressable>
        <Pressable
          onPress={() => setUseExistingVrsta(false)}
          style={{
            flex: 1,
            padding: 12,
            borderWidth: 1,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: !useExistingVrsta ? "#eee" : "transparent",
          }}
        >
          <Text>Nova vrsta</Text>
        </Pressable>
      </View>

      {useExistingVrsta ? (
        <DropdownModal
          label="Vrsta treninga"
          value={vrstaId}
          options={vrstaOptions}
          onChange={(v: React.SetStateAction<string>) => setVrstaId(v)}
          placeholder="Odaberi vrstu"
          searchPlaceholder="Pretraži vrste..."
          disabled={vrstaOptions.length === 0}
        />
      ) : (
        <>
          <Text style={{ fontWeight: "600" }}>Naziv vrste</Text>
          <TextInput
            value={novaVrstaNaziv}
            onChangeText={setNovaVrstaNaziv}
            placeholder="npr. HIIT"
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />

          <Text style={{ fontWeight: "600" }}>Težina</Text>
          <TextInput
            value={novaVrstaTezina}
            onChangeText={setNovaVrstaTezina}
            placeholder="npr. 3"
            keyboardType="numeric"
            style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
          />
        </>
      )}

      <Text style={{ fontWeight: "600" }}>Maks. broj sportaša</Text>
      <TextInput
        value={maks}
        onChangeText={setMaks}
        keyboardType="numeric"
        style={{ borderWidth: 1, borderRadius: 10, padding: 12 }}
      />

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
    </View>
  );
}
