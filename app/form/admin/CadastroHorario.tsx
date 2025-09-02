import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useSchedules } from "../../../context/SchedulesContext";
import colors from "../../../constants/Colors";

export default function CadastroHorario() {
  const { config, setConfig } = useSchedules();
  const router = useRouter();

  const [startTime, setStartTime] = useState(config?.startTime || "07:00");
  const [endTime, setEndTime] = useState(config?.endTime || "22:00");
  const [duration, setDuration] = useState(config?.duration?.toString() || "60");

  const handleSave = () => {
    if (!startTime || !endTime || !duration) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    setConfig(startTime, endTime, Number(duration));
    Alert.alert("Sucesso", "Horários atualizados com sucesso!");
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuração de Horários</Text>

      <Text style={styles.label}>Horário de Início (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={startTime}
        onChangeText={setStartTime}
        placeholder="07:00"
      />

      <Text style={styles.label}>Horário de Fim (HH:MM)</Text>
      <TextInput
        style={styles.input}
        value={endTime}
        onChangeText={setEndTime}
        placeholder="22:00"
      />

      <Text style={styles.label}>Duração de cada atividade (minutos)</Text>
      <TextInput
        style={styles.input}
        value={duration}
        onChangeText={setDuration}
        placeholder="60"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: colors.textPrimary },
  label: { fontSize: 16, marginTop: 15, marginBottom: 5, color: colors.textPrimary },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#ccc" },
  button: { marginTop: 30, backgroundColor: colors.ifGreen, padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
