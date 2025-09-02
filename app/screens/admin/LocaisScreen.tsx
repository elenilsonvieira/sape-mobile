import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import colors from "../../../constants/Colors";
import { usePlaces } from "../../../context/PlacesContext";
import IPlace from "../../../interfaces/IPlace";
import CustomAlert, { type AlertType } from "../../../components/alerts/CustumAlert";

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function LocaisScreen() {
  const router = useRouter();
  const { places, removePlace, reloadPlaces } = usePlaces();
  const [loading, setLoading] = useState(false);

  const [alertInfo, setAlertInfo] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    type: "success",
    onClose: () => {},
    onConfirm: () => {},
  });

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, visible: false });
  };

  const loadPlaces = async () => {
    try {
      setLoading(true);
      await reloadPlaces();
    } catch {
      setAlertInfo({
        visible: true,
        title: "Erro",
        message: "Não foi possível carregar os locais.",
        type: "error",
        onClose: handleCloseAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, [])
  );

  const removePlaceHandler = async (id: string) => {
    try {
      setLoading(true);
      await removePlace(id);
      setAlertInfo({
        visible: true,
        title: "Sucesso",
        message: "Local excluído!",
        type: "success",
        onClose: handleCloseAlert,
      });
    } catch {
      setAlertInfo({
        visible: true,
        title: "Erro",
        message: "Não foi possível excluir o local.",
        type: "error",
        onClose: handleCloseAlert,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConfirmation = (item: IPlace) => {
    setAlertInfo({
      visible: true,
      title: "Excluir Local",
      message: `Tem certeza que deseja excluir o local "${item.name}"?`,
      type: "delete",
      onClose: handleCloseAlert,
      onConfirm: async () => {
        await removePlaceHandler(item.id);
        handleCloseAlert();
      },
    });
  };

  const renderItem = ({ item }: { item: IPlace }) => (
    <View style={styles.card}>
      <Text style={styles.text}>{item.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => router.push({ pathname: "/form/admin/CadastroLocal", params: { id: item.id } })}
          style={styles.actionButton}
        >
          <MaterialIcons name="edit" size={20} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteConfirmation(item)}
          style={styles.actionButton}
        >
          <MaterialIcons name="delete" size={20} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back" size={24} color={colors.ifGreen} />
        </TouchableOpacity>
        <Text style={styles.title}>Locais</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.ifGreen} style={{ marginTop: 50 }} />
      ) : places.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Nenhum local cadastrado.</Text>
        </View>
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/form/admin/CadastroLocal")}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={32} color={colors.white} />
      </TouchableOpacity>

      <CustomAlert
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={alertInfo.onClose}
        onConfirm={alertInfo.onConfirm}
        confirmText="Excluir"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, paddingTop: 20, backgroundColor: colors.background },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  botaoVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  title: { fontSize: 22, fontWeight: "bold", color: colors.textPrimary, marginLeft: 15 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 16, color: "#666" },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f7f7f7",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
  },
  text: { fontSize: 16, color: colors.textPrimary },
  actions: { flexDirection: "row", alignItems: "center" },
  actionButton: { marginLeft: 15 },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: colors.ifGreen,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: colors.black,
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
