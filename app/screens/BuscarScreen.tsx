import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useActivities } from "../../context/ActivitiesContext"; // ajuste o caminho
import { useSubscriptions } from "../../context/SubscripitionContext";
import ActivityCard from "../../components/Activity/ActivityCard";


export default function BuscarScreen() {
  const { activities } = useActivities();
  const [search, setSearch] = useState("");
  const [atividadesFiltradas, setAtividadesFiltradas] = useState(activities);
  const { inscrever, desinscrever, estaInscrito } = useSubscriptions();

  useEffect(() => {
    const filtered = activities.filter((atividade) =>
      atividade.titulo.toLowerCase().includes(search.toLowerCase())
    );
    setAtividadesFiltradas(filtered);
  }, [search, activities]);

  function handleInscrever(id: string) {
    if (estaInscrito(id)) {
      desinscrever(id);
    } else {
      inscrever(id);
    }
  }
  return (
    <View style={styles.container}>
      {/* Cabeçalho e busca igual antes */}
      <View style={styles.header}>
        <Text style={styles.title}>Buscar Atividades</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {atividadesFiltradas.length === 0 ? (
        <Text>Nenhuma atividade cadastrada</Text>
      ) : (
        <FlatList
          data={atividadesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ActivityCard
              item={item}
              showInscrever={true}
              onInscrever={() => handleInscrever(item.id)}
              inscrito={estaInscrito(item.id)} // pode passar para mudar texto do botão
            />
          )}
        />
      )}
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

  filterButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#eee",
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    borderRadius: 20,
    height: 40,
    marginBottom: 20,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: "#555",
  },

  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginTop: 50,
  },

  atividadeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    elevation: 1,
  },

  atividadeInfo: {
    flex: 1,
    marginRight: 12,
  },

  atividadeNome: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#222",
    marginBottom: 6,
  },

  atividadeDetail: {
    color: "#555",
    fontSize: 14,
    marginBottom: 2,
  },

  btnInscrever: {
    backgroundColor: "#4CAF50",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  btnInscreverText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
