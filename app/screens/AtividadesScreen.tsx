import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useActivities } from "../../context/ActivitiesContext";
import ActivityCard from "../../components/Activity/ActivityCard";
import IActivity from "../../interfaces/IActivity";
import colors from "../../constants/Colors";
import CustomAlert, { type AlertType } from "../../components/alerts/CustumAlert";

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function AtividadesScreen() {
  const { activities, removeActivity } = useActivities();
  const router = useRouter();

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

  const handleDeleteConfirmation = (item: IActivity) => {
    setAlertInfo({
      visible: true,
      title: "Excluir Atividade",
      message: "Tem certeza que deseja excluir esta atividade?",
      type: "delete",
      onClose: handleCloseAlert,
      onConfirm: () => {
        removeActivity(item.id);
        handleCloseAlert();
      },
    });
  };

  const renderAtividade = ({ item }: { item: IActivity }) => (
    <ActivityCard
      item={item}
      showActions={true}
      onEditar={() => router.push(`/form/AgendamentoForm?id=${item.id}`)}
      onExcluir={() => handleDeleteConfirmation(item)}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Minhas Atividades</Text>
      </View>

      {activities.length === 0 ? (
        <View style={styles.semAtividades}>
          <Text style={{ fontSize: 16, color: "#666" }}>
            Você ainda não cadastrou nenhuma atividade.
          </Text>
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={renderAtividade}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => router.push("/form/AgendamentoForm")}
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  semAtividades: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  botaoAdicionar: {
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