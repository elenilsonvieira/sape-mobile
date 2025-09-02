import React, { useState, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Platform,
  View,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ISport } from "@/interfaces/ISport";
import IPlace from "@/interfaces/IPlace";
import IActivity from "@/interfaces/IActivity";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export type ActivityModalProps = {
  visible: boolean;
  onClose: () => void;
  onAdd: (activity: IActivity) => void;
  onDelete?: () => void;
  activityToEdit?: IActivity | null;
  sports: ISport[];
  places: IPlace[];
  currentTheme: {
    background: string;
    text: string;
    inputText: string;
    placeholder: string;
    overlay: string;
    modalBackground: string;
  };
};

export default function ActivityModal({
  visible,
  onAdd,
  onClose,
  onDelete,
  activityToEdit,
  sports,
  places,
  currentTheme,
}: ActivityModalProps) {
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [titulo, setTitulo] = useState("");
  const [dateAtividade, setDateAtividade] = useState(new Date());
  const [timeStart, setTimeStart] = useState(new Date());
  const [timeFinish, setTimeFinish] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
  const [showTimeFinishPicker, setShowTimeFinishPicker] = useState(false);

  const [errors, setErrors] = useState({
    titulo: false,
    sport: false,
    place: false,
  });

  useEffect(() => {
    if (activityToEdit) {
      setTitulo(activityToEdit.titulo);
      setDateAtividade(new Date(activityToEdit.dataAtividade));
      setTimeStart(new Date(`1970-01-01T${activityToEdit.atividadeStartTime}`));
      setTimeFinish(new Date(`1970-01-01T${activityToEdit.atividadeFinishTime}`));
      setSelectedPlace(activityToEdit.placeId);
      setSelectedSport(activityToEdit.sportId);
    } else {
      clearForm();
    }
  }, [activityToEdit]);

  const clearForm = () => {
    setTitulo("");
    setSelectedPlace("");
    setSelectedSport("");
    setDateAtividade(new Date());
    setTimeStart(new Date());
    setTimeFinish(new Date());
    setErrors({
      titulo: false,
      sport: false,
      place: false,
    });
  };

  const handleSaveActivity = () => {
    const isTituloValido = titulo.trim().length > 0;
    const isSportValido = selectedSport.trim().length > 0;
    const isPlaceValido = selectedPlace.trim().length > 0;

    setErrors({
      titulo: !isTituloValido,
      sport: !isSportValido,
      place: !isPlaceValido,
    });

    if (!isTituloValido || !isSportValido || !isPlaceValido) {
      Alert.alert("Erro", "Preencha todos os campos obrigatórios.");
      return;
    }

    // Validação de horário desativada temporariamente, pois o problema das datas/hora fixas está sendo resolvido.
    /*
    const isStartBeforeFinish = timeStart < timeFinish;
    if (!isStartBeforeFinish) {
      Alert.alert("Erro", "O horário de início deve ser anterior ao horário de fim.");
      return;
    }
    */

    const newActivity: IActivity = {
      id: activityToEdit ? activityToEdit.id : (Math.random() * 1000).toString(),
      titulo: titulo.trim(),
      sportId: selectedSport,
      placeId: selectedPlace,
      dataAtividade: dateAtividade.toISOString(),
      atividadeStartTime: `${timeStart.getHours().toString().padStart(2, "0")}:${timeStart
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
      atividadeFinishTime: `${timeFinish.getHours().toString().padStart(2, "0")}:${timeFinish
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    };

    onAdd(newActivity);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={Platform.OS === "ios"}
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: currentTheme.overlay }]}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: currentTheme.modalBackground },
          ]}
        >
          <ThemedText style={[styles.title, { color: currentTheme.text }]}>
            {activityToEdit ? "Editar Atividade" : "Nova Atividade"}
          </ThemedText>

          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.inputText,
                backgroundColor: currentTheme.modalBackground,
                borderColor: errors.titulo ? "#FF0000" : "#ced4da",
              },
            ]}
            placeholder="Título da atividade"
            value={titulo}
            onChangeText={(text) => {
              setTitulo(text);
              if (errors.titulo && text.trim().length > 0) {
                setErrors((prev) => ({ ...prev, titulo: false }));
              }
            }}
            placeholderTextColor={currentTheme.placeholder}
          />
          {errors.titulo && (
            <ThemedText style={styles.errorText}>Campo obrigatório</ThemedText>
          )}

          <ThemedView
            style={[
              styles.pickerContainer,
              { borderColor: errors.sport ? "#FF0000" : "#ced4da" },
            ]}
          >
            <Picker
              selectedValue={selectedSport}
              onValueChange={(itemValue) => {
                setSelectedSport(itemValue);
                if (errors.sport && itemValue) {
                  setErrors((prev) => ({ ...prev, sport: false }));
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um esporte" value="" />
              {sports.map((sport) => (
                <Picker.Item key={sport.id} label={sport.name} value={sport.id} />
              ))}
            </Picker>
          </ThemedView>
          {errors.sport && (
            <ThemedText style={styles.errorText}>Campo obrigatório</ThemedText>
          )}

          <ThemedView
            style={[
              styles.pickerContainer,
              { borderColor: errors.place ? "#FF0000" : "#ced4da" },
            ]}
          >
            <Picker
              selectedValue={selectedPlace}
              onValueChange={(itemValue) => {
                setSelectedPlace(itemValue);
                if (errors.place && itemValue) {
                  setErrors((prev) => ({ ...prev, place: false }));
                }
              }}
              style={styles.picker}
            >
              <Picker.Item label="Selecione um local" value="" />
              {places.map((place) => (
                <Picker.Item key={place.id} label={place.name} value={place.id} />
              ))}
            </Picker>
          </ThemedView>
          {errors.place && (
            <ThemedText style={styles.errorText}>Campo obrigatório</ThemedText>
          )}

          <ThemedView style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowDatePicker(true)}
            >
              <ThemedText style={{ color: currentTheme.text }}>
                📅 Data Atividade: {dateAtividade.toLocaleDateString()}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowTimeStartPicker(true)}
            >
              <ThemedText style={{ color: currentTheme.text }}>
                ⏰ Hora de Início:{" "}
                {timeStart.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          <ThemedView style={styles.datetimeContainer}>
            <TouchableOpacity
              style={styles.datetimeButton}
              onPress={() => setShowTimeFinishPicker(true)}
            >
              <ThemedText style={{ color: currentTheme.text }}>
                ⏰ Hora de Fim:{" "}
                {timeFinish.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {showDatePicker && (
            <DateTimePicker
              value={dateAtividade}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowDatePicker(false);
                selectedDate && setDateAtividade(selectedDate);
              }}
            />
          )}

         {showTimeStartPicker && (
         <DateTimePicker
         value={timeStart}
         mode="time"
        display="default"
        is24Hour={true}
       onChange={(_, selectedTime) => {
       setShowTimeStartPicker(false);
      if (selectedTime) {
        const updated = new Date(timeStart);
        updated.setHours(selectedTime.getHours());
        updated.setMinutes(selectedTime.getMinutes());
        setTimeStart(updated);
              }}
            />
          )}

         {showTimeFinishPicker && (
          <DateTimePicker
          value={timeFinish}
          mode="time"
         display="default"
        is24Hour={true}
        onChange={(_, selectedTime) => {
      setShowTimeFinishPicker(false);
      if (selectedTime) {
        const updated = new Date(timeFinish);
        updated.setHours(selectedTime.getHours());
        updated.setMinutes(selectedTime.getMinutes());
        setTimeFinish(updated);
              }}
            />
          )}

          <ThemedView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#FF9800" }]}
              onPress={onClose}
            >
              <ThemedText style={{ color: currentTheme.text }}>Cancelar</ThemedText>
            </TouchableOpacity>

            {activityToEdit && (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: "#FF6347" }]}
                onPress={handleDelete}
              >
                <ThemedText style={{ color: currentTheme.text }}>Deletar</ThemedText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#4CAF50" }]}
              onPress={handleSaveActivity}
            >
              <ThemedText style={{ color: currentTheme.text }}>Confirmar</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    width: "100%",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 5,
    fontSize: 16,
    borderColor: "#ced4da", // padrão (alterado dinamicamente)
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 5,
    overflow: "hidden",
    borderColor: "#ced4da", // padrão (alterado dinamicamente)
  },
  picker: {
    height: 50,
    width: "100%",
    backgroundColor: "white",
  },
  datetimeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  datetimeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#FF0000",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
});
