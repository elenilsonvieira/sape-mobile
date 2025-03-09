import React, { useState, useEffect } from "react";
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  TextInput,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { ISport } from "../../interfaces/ISport";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { height, width } = Dimensions.get("window");

export default function SportList() {
  const [sportData, setSportData] = useState<ISport[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState<ISport | null>(null);
  const [sportName, setSportName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadSportsData = async () => {
      try {
        const storedData = await AsyncStorage.getItem("@SapeApp:sports");
        setSportData(storedData ? JSON.parse(storedData) : []);
      } catch (e) {
        console.error("Erro ao carregar dados de esportes:", e);
        Alert.alert("Erro", "Falha ao carregar os esportes.");
      }
    };
    loadSportsData();
  }, []);

  const theme = useColorScheme();
  const themeColors = {
    dark: {
      background: "#121212",
      text: "#fff",
      inputText: "#fff",
      placeholder: "#ccc",
      overlay: "rgba(0, 0, 0, 0.7)",
      modalBackground: "#333",
    },
    light: {
      background: "#f5f5f5",
      text: "#000",
      inputText: "#000",
      placeholder: "#888",
      overlay: "rgba(0, 0, 0, 0.5)",
      modalBackground: "#fff",
    },
  };
  const currentTheme = themeColors[theme || "light"];

  const generateId = (): string =>
    Math.floor(1000 + Math.random() * 9000).toString();

  const handleSaveSport = async () => {
    if (!sportName.trim()) {
      Alert.alert("Erro", "O nome do esporte não pode estar vazio.");
      return;
    }

    const updatedData = isAdding
      ? [...sportData, { id: generateId(), name: sportName }]
      : sportData.map((sport) =>
          sport.id === selectedSport?.id ? { ...sport, name: sportName } : sport
        );

    try {
      await AsyncStorage.setItem(
        "@SapeApp:sports",
        JSON.stringify(updatedData)
      );
      Alert.alert(
        "Sucesso",
        isAdding
          ? "Esporte adicionado com sucesso!"
          : "Esporte atualizado com sucesso!"
      );
      setSportData(updatedData);
    } catch {
      Alert.alert("Erro", "Falha ao salvar o esporte.");
    }
    closeModal();
  };

  const handleDeleteSport = async (id: string) => {
    Alert.alert("Confirmação", "Tem certeza que deseja excluir este esporte?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: async () => {
          const updatedData = sportData.filter((sport) => sport.id !== id);
          try {
            await AsyncStorage.setItem(
              "@SapeApp:sports",
              JSON.stringify(updatedData)
            );
            Alert.alert("Sucesso", "Esporte excluído com sucesso!");
            setSportData(updatedData);
          } catch {
            Alert.alert("Erro", "Falha ao excluir o esporte.");
          }
          closeModal();
        },
        style: "destructive",
      },
    ]);
  };

  const openModal = (sport: ISport | null = null) => {
    setSelectedSport(sport);
    setSportName(sport?.name || "");
    setIsAdding(!sport);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSport(null);
    setSportName("");
  };

  const renderSportItem = ({ item }: { item: ISport }) => (
    <TouchableOpacity onPress={() => openModal(item)} style={styles.sportItem}>
      <Text style={styles.sportText}>
        {item.id} - {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.title, { color: currentTheme.text }]}>
        Lista de Esportes
      </Text>
      <FlatList
        data={sportData}
        renderItem={renderSportItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.buttonAdd} onPress={() => openModal()}>
        <Text style={[styles.addButtonText, { color: currentTheme.text }]}>
          +
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
        transparent={Platform.OS === "ios"}
      >
        <View
          style={[styles.overlay, { backgroundColor: currentTheme.overlay }]}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: currentTheme.modalBackground },
            ]}
          >
            <TextInput
              value={sportName}
              onChangeText={setSportName}
              placeholder="Nome do esporte"
              placeholderTextColor={currentTheme.placeholder}
              style={[styles.input, { color: currentTheme.inputText }]}
            />
            <SafeAreaView style={styles.buttonsContainer}>
              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={closeModal}
                >
                  <Text
                    style={[styles.buttonText, { color: currentTheme.text }]}
                  >
                    Cancelar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.primaryButton]}
                  onPress={handleSaveSport}
                >
                  <Text
                    style={[styles.buttonText, { color: currentTheme.text }]}
                  >
                    {isAdding ? "Adicionar" : "Salvar"}
                  </Text>
                </TouchableOpacity>
              </View>
              {!isAdding && (
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={() => handleDeleteSport(selectedSport?.id || "")}
                >
                  <Text
                    style={[styles.buttonText, { color: currentTheme.text }]}
                  >
                    Deletar Esporte
                  </Text>
                </TouchableOpacity>
              )}
            </SafeAreaView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 40,
  },
  sportItem: {
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
  sportText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  buttonAdd: {
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
  buttonText: {
    fontSize: 16, // Tamanho reduzido para botões menores
    color: "#fff",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    maxHeight: height * 0.6,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
    width: "100%", // Agora o input ocupa o mesmo espaço que o botão Excluir
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
    padding: 10, // Tamanho menor de padding
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  primaryButton: {
    backgroundColor: "#6DCA41",
  },
  cancelButton: {
    backgroundColor: "#6DCA41",
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 12, // Tamanho menor de padding
    borderRadius: 5,
    marginTop: 15,
    width: "100%", // Ocupa toda a largura do modal
    alignItems: "center",
  },
});
