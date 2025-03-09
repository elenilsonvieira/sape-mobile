import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Switch,
  Alert,
  SafeAreaView,
  FlatList,
  Dimensions,
  useColorScheme,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IPlace from "../../interfaces/IPlace"; // Importe a interface IPlace

const { height, width } = Dimensions.get("window");

export default function PlaceScreen() {
  const [placesData, setPlacesData] = useState<IPlace[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const [placeName, setPlaceName] = useState("");
  const [placeReference, setPlaceReference] = useState("");
  const [placeMaxCapacity, setPlaceMaxCapacity] = useState<number | undefined>(
    undefined
  );
  const [isPublic, setIsPublic] = useState(false);

  const theme = useColorScheme(); // Detecta o tema atual (light ou dark)

  useEffect(() => {
    async function getData() {
      try {
        const data = await AsyncStorage.getItem("@SapeApp:places");
        const places: IPlace[] = data ? JSON.parse(data) : [];
        setPlacesData(places);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
        Alert.alert("Erro", "Falha ao carregar os locais.");
      }
    }

    getData();
  }, []);

  const handleAddPlace = () => {
    if (!placeName.trim()) {
      Alert.alert("Erro", "O nome do local não pode estar vazio.");
      return;
    }

    const newPlace: IPlace = {
      id: Math.floor(Math.random() * 1000).toString(),
      name: placeName,
      reference: placeReference,
      maximumCapacityParticipants: placeMaxCapacity,
      isPublic,
    };

    setPlacesData((prevData) => {
      const updatedData = [...prevData, newPlace];
      AsyncStorage.setItem("@SapeApp:places", JSON.stringify(updatedData));
      return updatedData;
    });

    closeModal();
  };

  const handleUpdatePlace = () => {
    if (!selectedPlace) return;

    setPlacesData((prevData) => {
      const updatedData = prevData.map((place) =>
        place.id === selectedPlace.id
          ? {
              ...place,
              name: placeName,
              reference: placeReference,
              maximumCapacityParticipants: placeMaxCapacity,
              isPublic,
            }
          : place
      );
      AsyncStorage.setItem("@SapeApp:places", JSON.stringify(updatedData));
      return updatedData;
    });

    closeModal();
  };

  const handleDeletePlace = () => {
    if (!selectedPlace) return;

    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este local?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            setPlacesData((prevData) => {
              const updatedData = prevData.filter(
                (place) => place.id !== selectedPlace.id
              );
              AsyncStorage.setItem(
                "@SapeApp:places",
                JSON.stringify(updatedData)
              );
              return updatedData;
            });

            closeModal();
          },
        },
      ]
    );
  };

  const openModal = (place: IPlace | null) => {
    setSelectedPlace(place);
    setPlaceName(place?.name || "");
    setPlaceReference(place?.reference || "");
    setPlaceMaxCapacity(place?.maximumCapacityParticipants || undefined);
    setIsPublic(place?.isPublic || false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setPlaceName("");
    setPlaceReference("");
    setPlaceMaxCapacity(undefined);
    setIsPublic(false);
    setModalVisible(false);
    setSelectedPlace(null);
  };

  const renderItem = ({ item }: { item: IPlace }) => (
    <TouchableOpacity
      style={[styles.placeItem]} // Fundo verde fixo nos itens
      onPress={() => openModal(item)}
    >
      <Text style={styles.placeName}>{item.name}</Text>
      <Text style={styles.placeReference}>
        Referência: {item.reference || "N/A"}
      </Text>
      <Text style={styles.placeCapacity}>
        Capacidade Máxima: {item.maximumCapacityParticipants || "N/A"}
      </Text>
      <Text style={styles.placePublic}>
        Público: {item.isPublic ? "Sim" : "Não"}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#121212" : "#f5f5f5" },
      ]}
    >
      <Text
        style={[styles.title, { color: theme === "dark" ? "#fff" : "#000" }]}
      >
        Lista de Locais
      </Text>

      <FlatList
        data={placesData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => openModal(null)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        onRequestClose={closeModal}
        animationType="slide"
        transparent
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
              value={placeName}
              onChangeText={setPlaceName}
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
              value={placeReference}
              onChangeText={setPlaceReference}
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
              value={placeMaxCapacity?.toString()}
              onChangeText={(text) => setPlaceMaxCapacity(Number(text))}
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
              <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={selectedPlace ? handleUpdatePlace : handleAddPlace}
              >
                <Text style={styles.modalButtonText}>
                  {selectedPlace ? "Atualizar Local" : "Adicionar Local"}
                </Text>
              </TouchableOpacity>
            </View>

            {selectedPlace && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDeletePlace}
              >
                <Text style={styles.deleteButtonText}>Deletar Local</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  list: {
    paddingBottom: 100,
  },
  placeItem: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: width * 0.8,
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeReference: {
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
  },
  placeCapacity: {
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
  },
  placePublic: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: "italic",
    color: "#fff",
  },
  addButton: {
    position: "absolute",
    bottom: Platform.OS === "android" ? height * 0.1 : height * 0.12,
    right: 20,
    backgroundColor: "#6DCA41",
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: (width * 0.15) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 30,
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: width * 0.8,
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
  modalButton: {
    backgroundColor: "#4CAF50",
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
