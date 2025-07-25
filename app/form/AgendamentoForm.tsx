import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Switch, StyleSheet, Alert} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useActivities } from "../../context/ActivitiesContext";
import IActivity from "../../interfaces/IActivity";
import colors from "../../constants/Colors";

const esportes = [
  "Futebol",
  "Vôlei",
  "Tênis de Mesa",
  "Basquete",
  "Queimada",
  "Handebol",
];
const locais = [
  "Quadra do IF - Perto do Estacionamento",
  "Mesa de Tênis - Bloco 2",
  "Espaço de Vôlei - Perto da Entrada",
  "Campo Aberto - Fundos do IF",
];
const horarios = [
  "10:00 às 11:00",
  "11:00 às 12:00",
  "12:00 às 13:00",
  "13:00 às 14:00",
  "14:00 às 15:00",
  "15:00 às 16:00",
  "16:00 às 17:00",
  "17:00 às 18:00",
];

export default function AgendamentoForm() {
  const router = useRouter();
  const { addActivity } = useActivities();

  const [step, setStep] = useState(1);
  const [nomeAtividade, setNomeAtividade] = useState("");
  const [esporteSelecionado, setEsporteSelecionado] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [isPrivado, setIsPrivado] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

  const podeAvancar = nomeAtividade.trim().length >= 5 && esporteSelecionado && localSelecionado;
  const podeConcluir = selectedDate !== null && horarioSelecionado !== null;

  const handleNext = () => {
    if (nomeAtividade.trim().length < 5) {
      Alert.alert("Erro", "O título da atividade deve ter pelo menos 5 caracteres.");
      return;
    }
    if (!esporteSelecionado) {
      Alert.alert("Erro", "Selecione um esporte.");
      return;
    }
    if (!localSelecionado) {
      Alert.alert("Erro", "Selecione um local.");
      return;
    }
    setStep(2);
  };

  const handleConcluir = () => {
    if (!selectedDate) {
      Alert.alert("Erro", "Selecione uma data.");
      return;
    }
    if (!horarioSelecionado) {
      Alert.alert("Erro", "Selecione um horário.");
      return;
    }

    const novaAtividade: IActivity = {
      id: (Math.random() * 1000000).toFixed(0),
      titulo: nomeAtividade.trim(),
      sportId: esporteSelecionado,
      placeId: localSelecionado,
      dataAtividade: selectedDate.toISOString(),
      atividadeStartTime: horarioSelecionado.split(" às ")[0], // "HH:mm"
      atividadeFinishTime: horarioSelecionado.split(" às ")[1], // "HH:mm"
      // Se quiser, você pode adicionar campo 'privado' no IActivity e passar aqui também
    };

    addActivity(novaAtividade);

    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {step === 1 && (
        <View>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
              <Ionicons name="chevron-back" size={24} color= {colors.ifGreen} />
            </TouchableOpacity>
            <Text style={styles.title}>Nova Atividade</Text>
          </View>
          <View style={styles.containerStepOne}>
            <View style={styles.mainStepOne}>
              <Text style={styles.label}>Nome da Atividade</Text>
              <TextInput
                style={styles.input}
                value={nomeAtividade}
                onChangeText={setNomeAtividade}
                placeholder="Ex: Futebol dos Amigos"
              />

              <Text style={styles.label}>Esporte</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={esporteSelecionado}
                  onValueChange={(itemValue) => setEsporteSelecionado(itemValue)}
                >
                  <Picker.Item label="Selecione um esporte" value="" />
                  {esportes.map((esp, index) => (
                    <Picker.Item key={index} label={esp} value={esp} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Local</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={localSelecionado}
                  onValueChange={(itemValue) => setLocalSelecionado(itemValue)}
                >
                  <Picker.Item label="Selecione um local" value="" />
                  {locais.map((loc, index) => (
                    <Picker.Item key={index} label={loc} value={loc} />
                  ))}
                </Picker>
              </View>

              <View style={styles.switchContainer}>
                <Text style={styles.label}>Público?</Text>
                <Switch
                  value={!isPrivado}
                  onValueChange={(val) => setIsPrivado(!val)}
                  trackColor={{ false: colors.disabled , true: colors.ifGreen }}
                  thumbColor="#f4f3f4"
                />
              </View>
            </View>
            <View style={styles.rodapeStepOne}>
              <TouchableOpacity
                style={[styles.button, !podeAvancar && styles.buttonDisabled]}
                disabled={!podeAvancar}
                onPress={handleNext}
              >
                <Text style={styles.buttonText}>Próximo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {step === 2 && (
        <View>
          <View style={styles.header}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => setStep(1)}>
              <Ionicons name="chevron-back" size={24} color= {colors.ifGreen} />
            </TouchableOpacity>
            <Text style={styles.title}>Data e Hora</Text>
          </View>
          <View style={styles.containerStepTwo}>
            <View style={styles.mainStepTwo}>
              <Text style={styles.label}>Data</Text>
              <TouchableOpacity
                style={styles.calendarButton}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.calendarText}>
                  {selectedDate
                    ? selectedDate.toLocaleDateString("pt-BR", {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })
                    : "Selecionar data"}
                </Text>
              </TouchableOpacity>

              {showPicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "calendar"}
                  minimumDate={new Date()}
                  onChange={(event, date) => {
                    setShowPicker(false);
                    if (Platform.OS !== "ios" && event.type !== "set") return;
                    if (date) setSelectedDate(date);
                  }}
                />
              )}

              <Text style={styles.label}>Horário</Text>
              <ScrollView style={styles.horariosScroll}>
                {horarios.map((h) => (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.horarioBox,
                      horarioSelecionado === h && styles.horarioSelecionado,
                    ]}
                    onPress={() => setHorarioSelecionado(h)}
                  >
                    <Text
                      style={[
                        styles.horarioTexto,
                        horarioSelecionado === h && { color: colors.white },
                      ]}
                    >
                      {h}
                    </Text>
                    <Text
                      style={[
                        styles.statusLivre,
                        horarioSelecionado === h && { color: colors.white },
                      ]}
                    >
                      LIVRE
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={[
                  styles.botaoConcluir,
                  podeConcluir ? styles.botaoAtivo : styles.botaoInativo,
                ]}
                disabled={!podeConcluir}
                onPress={handleConcluir}
              >
                <Text style={styles.botaoTexto}>Concluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  //Geral
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    zIndex: 10,
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
    zIndex: 10,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginLeft: 15,
  },

  // Step 1
  containerStepOne: {
    justifyContent: "center",
    marginTop: 15,
    paddingHorizontal: 30,
  },

  mainStepOne: {
    justifyContent: "center",
  },

  rodapeStepOne: {
    marginTop: 20,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
    color: colors.textPrimary,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: colors.white,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },

  button: {
    backgroundColor: colors.ifGreen,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: colors.disabled,
  },

  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },

  // Step 2
  containerStepTwo: {
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  mainStepTwo: {
    justifyContent: "center",
  },

  calendarButton: {
    backgroundColor: colors.ifGreen,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },

  calendarText: {
    color: "#fff",
    textAlign: "center",
  },

  horariosScroll: {
    maxHeight: 350,
    marginBottom: 16,
    padding: 5,
  },

  horarioBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  horarioSelecionado: {
    backgroundColor: colors.ifGreen,
  },

  horarioTexto: {
    fontSize: 16,
    color: colors.black,
  },

  statusLivre: {
    color: colors.textPrimary,
    fontWeight: "bold",
  },

  botaoConcluir: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  botaoAtivo: {
    backgroundColor: colors.ifGreen,
  },

  botaoInativo: {
    backgroundColor: colors.disabled,
  },

  botaoTexto: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
});
