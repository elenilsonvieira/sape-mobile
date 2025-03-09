import { useState, useEffect } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { ISport } from "../../interfaces/ISport";

const { height, width } = Dimensions.get("window");

interface SportModalProps {
  visible: boolean;
  sportData: ISport | null;
  onAdd: (newSport: Omit<ISport, "id">) => void;
  onCancel: () => void;
}

const SportModal: React.FC<SportModalProps> = ({
  visible,
  sportData,
  onAdd,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [validates, setValidates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (sportData) {
      setName(sportData.name);
    } else {
      setName("");
    }
  }, [sportData]);

  const clearForm = () => {
    setName("");
    setValidates({});
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = "O nome do esporte é obrigatório!";
    }
    setValidates(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    onAdd({ name });
    onCancel();
    clearForm();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <ThemedView style={styles.overlay}>
        <ThemedView style={styles.modalContainer}>
          <ThemedText style={styles.title}>Adicionar Esporte</ThemedText>
          <TextInput
            style={[styles.input, validates.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Nome do esporte"
          />
          {validates.name && (
            <ThemedText style={styles.errorText}>{validates.name}</ThemedText>
          )}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              onPress={onCancel}
              style={[styles.button, { backgroundColor: "#d9534f" }]}
            >
              <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.button, { backgroundColor: "#6DCA41" }]}
            >
              <ThemedText style={styles.buttonText}>Salvar</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#000", // Título padrão, pode ser ajustado para tema
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "red",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
  },
});

export default SportModal;
