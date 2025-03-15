import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ISport } from "../../interfaces/ISport";
import Sport from "@/components/Sport/Sport";
import SportModal from "@/components/modals/SportModal";

const { height, width } = Dimensions.get("window");

export default function SportScreen() {
  const [sportData, setSportData] = useState<ISport[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSport, setSelectedSport] = useState<ISport | null>(null);
  const [sportName, setSportName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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
        style: "destructive",
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

  return (
    <SafeAreaView
          style={[
            styles.container,
            { backgroundColor: currentTheme.background },
          ]}
        >
        <Text style={[styles.title, { color: currentTheme.text }]}>
          Lista de Esportes
        </Text>
        <FlatList
          data={sportData}
          renderItem={({ item }) => (
            <Sport sport={item} onPress={() => openModal(item)} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
        <TouchableOpacity style={styles.buttonAdd} onPress={() => openModal()}>
          <Text style={[styles.addButtonText, { color: currentTheme.text }]}>
            +
          </Text>
        </TouchableOpacity>

        <SportModal
          visible={modalVisible}
          onClose={closeModal}
          onSave={handleSaveSport}
          onDelete={handleDeleteSport}
          sportName={sportName}
          onSportNameChange={setSportName}
          isAdding={isAdding}
          selectedSport={selectedSport}
          currentTheme={currentTheme}
        />
    </SafeAreaView>
  );
};

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


// import React, { useEffect, useState } from "react";
// import {
//   FlatList,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   useColorScheme,
//   Alert,
//   Modal,
//   TextInput,
//   Button,
// } from "react-native";
// import { ISport } from "../../interfaces/ISport";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// export default function SportList() {
//   const [sportData, setSportData] = useState<ISport[]>([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedSport, setSelectedSport] = useState<ISport | null>(null);
//   const [sportName, setSportName] = useState("");
//   const [isAdding, setIsAdding] = useState(false);

//   useEffect(() => {
//     async function getData() {
//       try {
//         const data = await AsyncStorage.getItem("@sape-mobile:sports");
//         const sportsData: ISport[] = data ? JSON.parse(data) : [];
//         setSportData(sportsData);
//       } catch (e) {
//         console.error("Erro ao carregar esportes:", e);
//         Alert.alert("Erro", "Falha ao carregar os esportes.");
//       }
//     }
//     getData();
//   }, []);

//   const theme = useColorScheme();

//   const generateId = (): string => {
//     return Math.floor(1000 + Math.random() * 9000).toString();
//   };

//   const handleAddSport = () => {
//     if (!sportName.trim()) {
//       Alert.alert("Erro", "O nome do esporte não pode estar vazio.");
//       return;
//     }

//     const newSportWithId: ISport = { id: generateId(), name: sportName };

//     setSportData((prevData) => {
//       const updatedData = [...prevData, newSportWithId];
//       AsyncStorage.setItem("@sape-mobile:sports", JSON.stringify(updatedData))
//         .then(() => Alert.alert("Sucesso", "Esporte adicionado com sucesso!"))
//         .catch(() => Alert.alert("Erro", "Falha ao adicionar o esporte."));
//       return updatedData;
//     });

//     closeModal();
//   };

//   const openModal = (sport: ISport | null = null) => {
//     setSelectedSport(sport);
//     setSportName(sport ? sport.name : "");
//     setIsAdding(!sport);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     setSelectedSport(null);
//     setSportName("");
//   };

//   const handleUpdateSport = () => {
//     if (!selectedSport) return;

//     setSportData((prevData) => {
//       const updatedData = prevData.map((sport) =>
//         sport.id === selectedSport.id ? { ...sport, name: sportName } : sport
//       );
//       AsyncStorage.setItem("@sape-mobile:sports", JSON.stringify(updatedData))
//         .then(() => Alert.alert("Sucesso", "Esporte atualizado com sucesso!"))
//         .catch(() => Alert.alert("Erro", "Falha ao atualizar o esporte."));
//       return updatedData;
//     });

//     closeModal();
//   };

//   const handleDeleteSport = (id: string) => {
//     Alert.alert("Confirmação", "Tem certeza que deseja excluir este esporte?", [
//       {
//         text: "Cancelar",
//         style: "cancel",
//       },
//       {
//         text: "Excluir",
//         onPress: () => {
//           setSportData((prevData) => {
//             const updatedData = prevData.filter((sport) => sport.id !== id);
//             AsyncStorage.setItem("@sape-mobile:sports", JSON.stringify(updatedData))
//               .then(() =>
//                 Alert.alert("Sucesso", "Esporte removido com sucesso!")
//               )
//               .catch(() => Alert.alert("Erro", "Falha ao remover o esporte."));
//             return updatedData;
//           });
//           closeModal();
//         },
//         style: "destructive",
//       },
//     ]);
//   };

//   const renderSportItem = ({ item }: { item: ISport }) => (
//     <TouchableOpacity onPress={() => openModal(item)} style={styles.sportItem}>
//       <Text style={styles.sportText}>
//         {item.id} - {item.name}
//       </Text>
//     </TouchableOpacity>
//   );

//   return (
//     <View
//       style={[
//         styles.container,
//         { backgroundColor: theme === "dark" ? "#000" : "#fff" },
//       ]}
//     >
//       <Text
//         style={[styles.title, { color: theme === "dark" ? "#fff" : "#000" }]}
//       >
//         Lista de Esportes
//       </Text>
//       <FlatList
//         data={sportData}
//         renderItem={renderSportItem}
//         keyExtractor={(item) => item.id.toString()}
//         contentContainerStyle={styles.listContainer}
//       />

//       <TouchableOpacity style={styles.buttonAdd} onPress={() => openModal()}>
//         <Text style={styles.buttonText}>+</Text>
//       </TouchableOpacity>

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={closeModal}
//       >
//         <View style={styles.modalContainer}>
//           <TextInput
//             value={sportName}
//             onChangeText={setSportName}
//             placeholder="Nome do esporte"
//             style={styles.input}
//           />
//           <View style={styles.buttonsContainer}>
//             <Button
//               title={isAdding ? "Adicionar" : "Salvar"}
//               onPress={isAdding ? handleAddSport : handleUpdateSport}
//             />
//             {!isAdding && (
//               <Button
//                 title="Excluir"
//                 onPress={() => handleDeleteSport(selectedSport?.id || "")}
//                 color="red"
//               />
//             )}
//             <Button title="Cancelar" onPress={closeModal} />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     justifyContent: "flex-start",
//     alignItems: "center",
//   },
//   title: {
//     fontSize: 30,
//     fontWeight: "bold",
//     marginBottom: 30,
//     textAlign: "center",
//   },
//   listContainer: {
//     flexGrow: 1,
//     width: "100%",
//     paddingBottom: 40,
//   },
//   sportItem: {
//     marginBottom: 4,
//     backgroundColor: "#6DCA41",
//     padding: 20,
//     borderRadius: 8,
//     width: "100%",
//     alignItems: "center",
//   },
//   sportText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   buttonAdd: {
//     position: "absolute",
//     bottom: 50,
//     right: 20,
//     backgroundColor: "#6DCA41",
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 30,
//     fontWeight: "bold",
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 20,
//     backgroundColor: "white",
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingLeft: 10,
//   },
//   buttonsContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   deleteButton: {
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   deleteButtonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });
