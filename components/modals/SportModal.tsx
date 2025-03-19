import React from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  SafeAreaView,
} from "react-native";
import { ISport } from "../../interfaces/ISport";

export type SportModalProps = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (id: string) => void;
  sportName: string;
  onSportNameChange: (text: string) => void;
  isAdding: boolean;
  selectedSport: ISport | null;
  currentTheme: {
    background: string;
    text: string;
    inputText: string;
    placeholder: string;
    overlay: string;
    modalBackground: string;
  };
}

export default function SportModal({
  visible,
  onClose,
  onSave,
  onDelete,
  sportName,
  onSportNameChange,
  isAdding,
  selectedSport,
  currentTheme,
}: SportModalProps){
  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={Platform.OS === "ios" || true}
    >
      <View style={[styles.overlay, { backgroundColor: currentTheme.overlay }]}>
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: currentTheme.modalBackground },
          ]}
        >
          <Text
                style={[
                styles.modalTitle,
                { color: currentTheme.text}]}
           >
            {isAdding ? "Adicionar Novo Esporte" : "Editar Esporte"}
          </Text>

          <TextInput
            value={sportName}
            onChangeText={onSportNameChange}
            placeholder="Nome do esporte"
            placeholderTextColor={currentTheme.placeholder}
            style={[styles.input, { color: currentTheme.inputText }]}
          />
          <SafeAreaView style={styles.buttonsContainer}>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={[styles.buttonText, { color: currentTheme.text }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={onSave}
              >
                <Text style={[styles.buttonText, { color: currentTheme.text }]}>
                  {isAdding ? "Adicionar" : "Atualizar"}
                </Text>
              </TouchableOpacity>
            </View>
            {!isAdding && (
              <TouchableOpacity
                style={[styles.button, styles.deleteButton]}
                onPress={() => onDelete(selectedSport?.id || "")}
              >
                <Text style={[styles.buttonText, { color: currentTheme.text }]}>
                  Deletar Esporte
                </Text>
              </TouchableOpacity>
            )}
          </SafeAreaView>
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
  },
  modalContainer: {
    width: "80%",
    maxHeight: Platform.select({ ios: "60%", android: "60%" }),
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    width: "100%",
  },
  buttonsContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#6DCA41",
  },
  cancelButton: {
    backgroundColor: "#FF9800",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 5,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
});