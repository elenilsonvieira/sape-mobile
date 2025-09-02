import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useActivities } from "../../context/ActivitiesContext";
import { useSports } from "../../context/SportsContext";
import { usePlaces } from "../../context/PlacesContext";
import { useSchedules } from "../../context/SchedulesContext";
import IActivity from "../../interfaces/IActivity";
import colors from "../../constants/Colors";

export default function AgendamentoForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addActivity, editActivity, getActivityById } = useActivities();
  const { sports } = useSports();
  const { places } = usePlaces();
  const { config } = useSchedules();

  const [step, setStep] = useState(1);
  const [nomeAtividade, setNomeAtividade] = useState("");
  const [esporteSelecionado, setEsporteSelecionado] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");
  const [isPrivado, setIsPrivado] = useState(true);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [horarioInicial, setHorarioInicial] = useState<string | null>(null);
  const [horarioFinal, setHorarioFinal] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Carregar atividade para edição
  useEffect(() => {
    if (id) {
      const atividade = getActivityById(id as string);
      if (atividade) {
        setNomeAtividade(atividade.titulo);
        setEsporteSelecionado(atividade.sportId);
        setLocalSelecionado(atividade.placeId);
        setIsPrivado(false);
        setSelectedDate(new Date(atividade.dataAtividade));
        setHorarioInicial(atividade.atividadeStartTime);
        setHorarioFinal(atividade.atividadeFinishTime);
      }
    }
  }, [id]);

  const podeAvancar =
    nomeAtividade.trim().length >= 5 &&
    esporteSelecionado &&
    localSelecionado;

  const podeConcluir =
    selectedDate !== null && horarioInicial !== null && horarioFinal !== null;

  const handleNext = () => {
    if (!podeAvancar) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }
    setStep(2);
  };

  const handleConcluir = () => {
    if (!podeConcluir) {
      Alert.alert("Erro", "Preencha a data e os horários.");
      return;
    }

    const novaAtividade: IActivity = {
      id: id ? id.toString() : (Math.random() * 1000000).toFixed(0),
      titulo: nomeAtividade.trim(),
      sportId: esporteSelecionado,
      placeId: localSelecionado,
      dataAtividade: selectedDate!.toISOString(),
      atividadeStartTime: horarioInicial!,
      atividadeFinishTime: horarioFinal!,
    };

    if (id) editActivity(novaAtividade);
    else addActivity(novaAtividade);

    router.back();
  };

  // Funções auxiliares para converter strings de horário
  const stringToDate = (time: string, date: Date) => {
    const [hours, minutes] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hours, minutes, 0, 0);
    return d;
  };

  const dateToString = (date: Date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

  // Função para validar horário dentro do intervalo definido no config
  const validarHorario = (horario: string) => {
    const [h, m] = horario.split(":").map(Number);
    const [sh, sm] = (config?.startTime || "08:00").split(":").map(Number);
    const [eh, em] = (config?.endTime || "22:00").split(":").map(Number);

    const totalMin = h * 60 + m;
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;

    if (totalMin < startMin || totalMin > endMin) {
      Alert.alert(
        "Horário inválido",
        `O horário deve estar entre ${config?.startTime || "08:00"} e ${
          config?.endTime || "22:00"
        }`
      );
      return false;
    }
    return true;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* STEP 1 */}
      {step === 1 && (
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.botaoVoltar}
            >
              <Ionicons name="chevron-back" size={24} color={colors.ifGreen} />
            </TouchableOpacity>
            <Text style={styles.title}>
              {id ? "Editar Atividade" : "Nova Atividade"}
            </Text>
          </View>

          <View style={styles.containerStepOne}>
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
                {sports.map((sport) => (
                  <Picker.Item key={sport.id} label={sport.name} value={sport.id} />
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
                {places.map((place) => (
                  <Picker.Item key={place.id} label={place.name} value={place.id} />
                ))}
              </Picker>
            </View>

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Público?</Text>
              <Switch
                value={!isPrivado}
                onValueChange={(val) => setIsPrivado(!val)}
                trackColor={{ false: colors.disabled, true: colors.ifGreen }}
                thumbColor="#f4f3f4"
              />
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

      {/* STEP 2 */}
      {step === 2 && (
        <View>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.botaoVoltar}
              onPress={() => setStep(1)}
            >
              <Ionicons name="chevron-back" size={24} color={colors.ifGreen} />
            </TouchableOpacity>
            <Text style={styles.title}>Data e Horário</Text>
          </View>

          <View style={styles.containerStepTwo}>
            {/* Data */}
            <Text style={styles.label}>Data</Text>
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => setShowDatePicker(true)}
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
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (Platform.OS !== "ios" && event.type !== "set") return;
                  if (date) setSelectedDate(date);
                }}
              />
            )}

            {/* Horário Inicial */}
            <Text style={styles.label}>Horário Inicial</Text>
            <TouchableOpacity
              style={styles.horarioBox}
              onPress={() => selectedDate && setShowStartPicker(true)}
            >
              <Text style={styles.horarioTexto}>
                {horarioInicial || "Horário Inicial"}
              </Text>
            </TouchableOpacity>
            {showStartPicker && selectedDate && (
              <DateTimePicker
                value={
                  horarioInicial
                    ? stringToDate(horarioInicial, selectedDate)
                    : stringToDate(config?.startTime || "08:00", selectedDate)
                }
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={(event, date) => {
                  setShowStartPicker(false);
                  if (event.type === "set" && date) {
                    const novoHorario = dateToString(date);
                    if (!validarHorario(novoHorario)) return;
                    setHorarioInicial(novoHorario);
                    if (horarioFinal && stringToDate(horarioFinal, selectedDate) < date) {
                      setHorarioFinal(novoHorario);
                    }
                  }
                }}
              />
            )}

            {/* Horário Final */}
            <Text style={styles.label}>Horário Final</Text>
            <TouchableOpacity
              style={styles.horarioBox}
              onPress={() => selectedDate && setShowEndPicker(true)}
            >
              <Text style={styles.horarioTexto}>
                {horarioFinal || "Horário Final"}
              </Text>
            </TouchableOpacity>
            {showEndPicker && selectedDate && (
              <DateTimePicker
                value={
                  horarioFinal
                    ? stringToDate(horarioFinal, selectedDate)
                    : stringToDate(config?.endTime || "22:00", selectedDate)
                }
                mode="time"
                display={Platform.OS === "ios" ? "spinner" : "clock"}
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (event.type === "set" && date) {
                    const novoHorario = dateToString(date);
                    if (!validarHorario(novoHorario)) return;
                    setHorarioFinal(novoHorario);
                  }
                }}
              />
            )}

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
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    zIndex: 10,
    paddingHorizontal: 20,
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

  containerStepOne: {
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 30,
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

  rodapeStepOne: {
    marginTop: 20,
  },

  containerStepTwo: {
    justifyContent: "center",
    paddingHorizontal: 30,
    paddingVertical: 30,
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

  horarioBox: {
    flex: 1,
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
  },

  horarioTexto: {
    fontSize: 16,
    color: colors.textPrimary,
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

