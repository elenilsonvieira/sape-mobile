import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useActivities } from "../../context/ActivitiesContext";
import ActivityCard from "../../components/Activity/ActivityCard";
import IActivity from "../../interfaces/IActivity";
import colors from "../../constants/Colors";

export default function AgendamentoScreen() {
  const { activities } = useActivities();
  const router = useRouter();

  const renderAtividade = ({ item }: { item: IActivity }) => (
  <ActivityCard item={item} />
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
        <Ionicons name="add" size={32} color= {colors.white} />
      </TouchableOpacity>
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
