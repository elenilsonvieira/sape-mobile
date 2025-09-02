import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import IPlace from "../../interfaces/IPlace";

export type PlaceModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedPlace?: IPlace | null;
  onSave: (place: IPlace) => void;
  onDelete: () => void;
  theme: "light" | "dark";
}

export default function PlaceModal({
  visible,
  onClose,
  selectedPlace,
  onSave,
  onDelete,
  theme,
}: PlaceModalProps){
  const [name, setName] = useState("");
  const [reference, setReference] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (selectedPlace) {
      setName(selectedPlace.name);
      setReference(selectedPlace.reference || "");
      setMaxCapacity(selectedPlace.maximumCapacityParticipants);
      setIsPublic(selectedPlace.isPublic);
    } else {
      setName("");
      setReference("");
      setMaxCapacity(undefined);
      setIsPublic(false);
    }
  }, [selectedPlace]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome do local não pode estar vazio.");
      return;
    }

    const updatedPlace: IPlace = {
      id: selectedPlace?.id || Math.floor(Math.random() * 1000).toString(),
      name: name.trim(),
      reference: reference.trim(),
      maximumCapacityParticipants: maxCapacity,
      isPublic,
    };

    onSave(updatedPlace);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={Platform.OS === "ios" || true}
    >
      <View
        style={[
          styles.modalContainer,
          {
            backgroundColor:
              theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme === "dark" ? "#333" : "#fff" },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            {selectedPlace ? "Editar Local" : "Adicionar Novo Local"}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === "dark" ? "#444" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Nome do Local"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === "dark" ? "#444" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Referência"
            value={reference}
            onChangeText={setReference}
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === "dark" ? "#444" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Capacidade Máxima"
            keyboardType="numeric"
            value={maxCapacity?.toString()}
            onChangeText={(text) => setMaxCapacity(Number(text))}
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          />
          
          <View style={styles.switchContainer}>
            <Text
              style={[
                styles.switchLabel,
                { color: theme === "dark" ? "#fff" : "#000" },
              ]}
            >
              Local Público:
            </Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>
                {selectedPlace ? "Atualizar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedPlace && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Deletar Local</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
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
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalConfirmButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
