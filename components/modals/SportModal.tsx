import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import { ISport } from "../../interfaces/ISport";

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
  const theme = useColorScheme();
  const modalBackgroundColor = theme === "dark" ? "#333" : "#6DCA41"; 

  useEffect(() => {
    if (sportData) {
      setName(sportData.name);
    } else {
      setName("");
    }
  }, [sportData]);

  const handleSave = () => {
    if (name.trim()) {
      onAdd({ name });
      onCancel();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: modalBackgroundColor },
          ]}
        >
          <Text style={styles.title}>Adicionar Esporte</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nome do esporte"
            style={styles.input}
            placeholderTextColor="#fff"
          />
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#fff",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#fff",
    marginBottom: 15,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  buttonText: {
    fontWeight: "bold",
    color: "#000",
  },
});

export default SportModal;
