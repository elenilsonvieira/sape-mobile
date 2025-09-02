import React, { useState, useEffect } from "react";
import {
  FlatList,
  Button,
  StyleSheet,
  Alert,
  useColorScheme,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedView } from "@/components/ThemedView";
import IActivity from "@/interfaces/IActivity";
import { ISport } from "@/interfaces/ISport";
import IPlace from "@/interfaces/IPlace";
import ActivityModal from "@/components/modals/ActivityModal";
import Activity from "@/components/Activity/Activity";
import { ThemedText } from "@/components/ThemedText";
import { SafeAreaView } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

export default function ActivityScreen() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [sports, setSports] = useState<ISport[]>([]);
  const [places, setPlaces] = useState<IPlace[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editActivity, setEditActivity] = useState<IActivity | null>(null);

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

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sportsStorage, placesStorage, activitiesStorage] =
        await Promise.all([
          AsyncStorage.getItem("@SapeApp:sports"),
          AsyncStorage.getItem("@SapeApp:places"),
          AsyncStorage.getItem("@SapeApp:activities"),
        ]);

      const sportsData = sportsStorage != null ? JSON.parse(sportsStorage) : [];
      const placesData = placesStorage != null ? JSON.parse(placesStorage) : [];
      const activitiesData =
        activitiesStorage != null ? JSON.parse(activitiesStorage) : [];

      setSports(sportsData);
      setPlaces(placesData);
      setActivities(activitiesData);
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      Alert.alert("Erro", "Erro ao carregar dados.");
    }
  };

  const handleSaveActivity = async (newActivity: IActivity) => {
    if (editActivity) {
      try {
        const editingActivity = (prevActivities: IActivity[]) =>
          prevActivities.map((activity) =>
            activity.id === newActivity.id ? newActivity : activity
          );
        const updtActivity = editingActivity(activities);

        await AsyncStorage.setItem(
          "@SapeApp:activities",
          JSON.stringify(updtActivity)
        );
        setActivities(updtActivity);
      } catch (err) {
        console.error("Erro ao editar atividade:", err);
        Alert.alert("Erro", "Erro ao editar os dados.");
      }
    } else {
      const updatedActivities = [...activities, newActivity];

      try {
        await AsyncStorage.setItem(
          "@SapeApp:activities",
          JSON.stringify(updatedActivities)
        );
        setActivities(updatedActivities);
      } catch (err) {
        console.error("Erro ao salvar atividade:", err);
        Alert.alert("Erro", "Erro ao salvar os dados.");
      }
    }

    setEditActivity(null);
    setShowModal(false);
  };

  const handleEditActivity = (activity: IActivity) => {
    setEditActivity(activity);
    setShowModal(true);
  };

  const handleDeleteActivity = async (activityId: string) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta atividade?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const updatedActivities = activities.filter(
                (activity) => activity.id !== activityId
              );
              await AsyncStorage.setItem(
                "@SapeApp:activities",
                JSON.stringify(updatedActivities)
              );
              setActivities(updatedActivities);
            } catch (err) {
              console.error("Erro ao deletar atividade:", err);
              Alert.alert("Erro", "Não foi possível deletar a atividade");
            }
          },
        },
      ]
    );
  };

  const handleModal = async () => {
    loadData();
    setShowModal(true);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <ThemedText style={[styles.title, { color: currentTheme.text }]}>
        Lista de Atividades
      </ThemedText>

      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleEditActivity(item)}>
            <Activity activity={item} sports={sports} places={places} />
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.buttonAdd} onPress={() => handleModal()}>
        <ThemedText
          style={[styles.addButtonText, { color: currentTheme.text }]}
        >
          +
        </ThemedText>
      </TouchableOpacity>
      <ActivityModal
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setEditActivity(null);
        }}
        onAdd={handleSaveActivity}
        activityToEdit={editActivity}
        onDelete={() => editActivity && handleDeleteActivity(editActivity.id)}
        sports={sports}
        places={places}
        currentTheme={currentTheme}
      />
    </SafeAreaView>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
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
  activityCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 5,
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
});
