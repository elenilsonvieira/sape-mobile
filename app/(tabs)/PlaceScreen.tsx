import { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import IPlace from "../../interfaces/IPlace";
import Place from "@/components/Place/Place";
import PlaceModal from "@/components/modals/PlaceModal";

const { height, width } = Dimensions.get("window");

export default function PlaceScreen(){
  const [placesData, setPlacesData] = useState<IPlace[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<IPlace | null>(null);
  const theme = useColorScheme();

  useEffect(() => {
    const loadPlaceData = async () => {
      try {
        const data = await AsyncStorage.getItem("@SapeApp:places");
        const places: IPlace[] = data ? JSON.parse(data) : [];
        setPlacesData(places);
      } catch (error) {
        console.error("Erro ao carregar locais:", error);
        Alert.alert("Erro", "Falha ao carregar os locais.");
      }
    };
    loadPlaceData();
  }, []);

  const handleSavePlace = async (place: IPlace) => {
    try {
      const updatedPlaces = selectedPlace
        ? placesData.map((p) => (p.id === place.id ? place : p))
        : [...placesData, place];

      await AsyncStorage.setItem("@SapeApp:places", JSON.stringify(updatedPlaces));
      setPlacesData(updatedPlaces);
      setModalVisible(false);
      Alert.alert(
              "Sucesso",
              selectedPlace
                ? "Local atualizado com sucesso!"
                : "Local adicionado com sucesso!"
            );
    } catch (error) {
      console.error("Erro ao salvar local:", error);
      Alert.alert("Erro", "Falha ao salvar o local.");
    }
    setSelectedPlace(null);
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
          onPress: async () => {
            try {
              const updatedPlaces = placesData.filter(
                (p) => p.id !== selectedPlace.id
              );
              await AsyncStorage.setItem(
                "@SapeApp:places",
                JSON.stringify(updatedPlaces)
              );
              setPlacesData(updatedPlaces);
              Alert.alert("Sucesso", "Local excluído com sucesso!");
              setModalVisible(false);
            } catch (error) {
              console.error("Erro ao deletar local:", error);
              Alert.alert("Erro", "Falha ao deletar o local.");
            }
          },
        },
      ]
    );
  };

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
        renderItem={({ item }) => (
          <Place
            place={item}
            onPress={() => {
              setSelectedPlace(item);
              setModalVisible(true);
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          setSelectedPlace(null);
          setModalVisible(true);
        }}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <PlaceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedPlace={selectedPlace}
        onSave={handleSavePlace}
        onDelete={handleDeletePlace}
        theme={theme || "light"}
      />
    </SafeAreaView>
  );
};

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
});