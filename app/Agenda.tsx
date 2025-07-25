import { View, Text, StyleSheet, FlatList} from "react-native";

import { useActivities } from "../context/ActivitiesContext";
import { useSubscriptions } from "../context/SubscripitionContext";
import ActivityCard from "../components/Activity/ActivityCard";


export default function AgendaScreen() {
  const { activities } = useActivities();
  const { inscricoes, desinscrever } = useSubscriptions();

  const atividadesInscritas = activities.filter((act) => inscricoes.includes(act.id));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sua Agenda</Text>
        {/* Espaço para alinhar o título no centro */}
        <View style={{ width: 60 }} />
      </View>

       <FlatList
        data={atividadesInscritas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            item={item}
            showInscrever={true}
            onInscrever={() => desinscrever(item.id)}
            inscrito={true} // já está inscrito
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: "#fff",
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
    color: "#2e7d32",
  },
});
