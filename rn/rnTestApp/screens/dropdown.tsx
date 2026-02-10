import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
} from "react-native";

export type DropdownOption<T extends string = string> = {
  value: T;
  label: string;
  subtitle?: string;
};

type Props<T extends string> = {
  label: string;
  placeholder?: string;
  value: T | "";
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  searchPlaceholder?: string;
  disabled?: boolean;
};

export function DropdownModal<T extends string>({
  label,
  placeholder = "Odaberi...",
  value,
  options,
  onChange,
  searchPlaceholder = "Pretraži...",
  disabled,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const selectedLabel = useMemo(() => {
    if (!value) return "";
    return options.find((o) => o.value === value)?.label ?? "";
  }, [value, options]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return options;
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(query) ||
        (o.subtitle?.toLowerCase().includes(query) ?? false)
    );
  }, [q, options]);

  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <Pressable
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[styles.field, disabled ? { opacity: 0.5 } : null]}
      >
        <Text style={!value ? styles.placeholderText : styles.valueText}>
          {value ? selectedLabel : placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <Pressable onPress={() => setOpen(false)} style={styles.closeBtn}>
              <Text style={{ fontWeight: "700" }}>Zatvori</Text>
            </Pressable>
          </View>

          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={searchPlaceholder}
            style={styles.search}
          />

          <FlatList
            data={filtered}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  onChange(item.value);
                  setOpen(false);
                  setQ("");
                }}
                style={styles.option}
              >
                <Text style={styles.optionTitle}>{item.label}</Text>
                {!!item.subtitle && (
                  <Text style={styles.optionSubtitle}>{item.subtitle}</Text>
                )}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={{ padding: 16 }}>
                <Text>Nema rezultata.</Text>
              </View>
            }
          />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  fieldLabel: { fontWeight: "600" },
  field: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholderText: { color: "#666" },
  valueText: { color: "#111" },
  chevron: { fontSize: 16, color: "#111" },

  modalContainer: { flex: 1, backgroundColor: "white" },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", flex: 1 },
  closeBtn: { paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderRadius: 8 },

  search: {
    margin: 16,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  option: { borderWidth: 1, borderRadius: 10, padding: 12 },
  optionTitle: { fontWeight: "700" },
  optionSubtitle: { marginTop: 4, color: "#666" },
});
