import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSchedules } from "../../../context/SchedulesContext";
import colors from "../../../constants/Colors";

export default function HorariosScreen() {
  const { config } = useSchedules();
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Cabeçalho com botão voltar e título */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back" size={24} color={colors.ifGreen} />
        </TouchableOpacity>
        <Text style={styles.title}>Horários</Text>
      </View>

      {!config ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum horário configurado.</Text>
        </View>
      ) : (
        <FlatList
          data={config.timeSlots}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/form/admin/CadastroHorario")}
        activeOpacity={0.7}
      >
        <Ionicons
          name={config ? "pencil" : "add"}
          size={28}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary, marginLeft: 15 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 16, color: "#666" },
  card: {
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  text: { fontSize: 16, color: colors.textPrimary },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.ifGreen,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
