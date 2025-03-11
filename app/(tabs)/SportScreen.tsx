import React, { useEffect, useState } from "react";
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
  Button,
} from "react-native";
import { ISport } from "../../interfaces/ISport";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SportList() {
  const [sportData, setSportData] = useState<ISport[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState<ISport | null>(null);
  const [sportName, setSportName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function getData() {
      try {
        const data = await AsyncStorage.getItem("@sape-mobile:sports");
        const sportsData: ISport[] = data ? JSON.parse(data) : [];
        setSportData(sportsData);
      } catch (e) {
        console.error("Erro ao carregar esportes:", e);
        Alert.alert("Erro", "Falha ao carregar os esportes.");
      }
    }
    getData();
  }, []);

  const theme = useColorScheme();

  const generateId = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleAddSport = () => {
    if (!sportName.trim()) {
      Alert.alert("Erro", "O nome do esporte não pode estar vazio.");
      return;
    }

    const newSportWithId: ISport = { id: generateId(), name: sportName };

    setSportData((prevData) => {
      const updatedData = [...prevData, newSportWithId];
      AsyncStorage.setItem("@sape-mobile:sports", JSON.stringify(updatedData))
        .then(() => Alert.alert("Sucesso", "Esporte adicionado com sucesso!"))
        .catch(() => Alert.alert("Erro", "Falha ao adicionar o esporte."));
      return updatedData;
    });

    closeModal();
  };

  const openModal = (sport: ISport | null = null) => {
    setSelectedSport(sport);
    setSportName(sport ? sport.name : "");
    setIsAdding(!sport);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSport(null);
    setSportName("");
  };

  const handleUpdateSport = () => {
    if (!selectedSport) return;

    setSportData((prevData) => {
      const updatedData = prevData.map((sport) =>
        sport.id === selectedSport.id ? { ...sport, name: sportName } : sport
      );
      AsyncStorage.setItem("@sape-mobile:sports", JSON.stringify(updatedData))
        .then(() => Alert.alert("Sucesso", "Esporte atualizado com sucesso!"))
        .catch(() => Alert.alert("Erro", "Falha ao atualizar o esporte."));
      return updatedData;
    });

    closeModal();
  };

  const handleDeleteSport = (id: string) => {
    Alert.alert("Confirmação", "Tem certeza que deseja excluir este esporte?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Excluir",
        onPress: () => {
          setSportData((prevData) => {
            const updatedData = prevData.filter((sport) => sport.id !== id);
            AsyncStorage.setItem("@sape-mobile:sports", JSON.stringify(updatedData))
              .then(() =>
                Alert.alert("Sucesso", "Esporte removido com sucesso!")
              )
              .catch(() => Alert.alert("Erro", "Falha ao remover o esporte."));
            return updatedData;
          });
          closeModal();
        },
        style: "destructive",
      },
    ]);
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
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#000" : "#fff" },
      ]}
    >
      <Text
        style={[styles.title, { color: theme === "dark" ? "#fff" : "#000" }]}
      >
        Lista de Esportes
      </Text>
      <FlatList
        data={sportData}
        renderItem={renderSportItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.buttonAdd} onPress={() => openModal()}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TextInput
            value={sportName}
            onChangeText={setSportName}
            placeholder="Nome do esporte"
            style={styles.input}
          />
          <View style={styles.buttonsContainer}>
            <Button
              title={isAdding ? "Adicionar" : "Salvar"}
              onPress={isAdding ? handleAddSport : handleUpdateSport}
            />
            {!isAdding && (
              <Button
                title="Excluir"
                onPress={() => handleDeleteSport(selectedSport?.id || "")}
                color="red"
              />
            )}
            <Button title="Cancelar" onPress={closeModal} />
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 40,
  },
  sportItem: {
    marginBottom: 4,
    backgroundColor: "#6DCA41",
    padding: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  sportText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonAdd: {
    position: "absolute",
    bottom: 50,
    right: 20,
    backgroundColor: "#6DCA41",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
