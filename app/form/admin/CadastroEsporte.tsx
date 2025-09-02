import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../../../constants/Colors";
import { useSports } from "../../../context/SportsContext";
import ISport from "../../../interfaces/ISport";

export default function CadastroEsporte() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addSport, editSport, getSportById } = useSports();

  const [nomeEsporte, setNomeEsporte] = useState("");

  // Carregar dados para edição, se existir id
  useEffect(() => {
    if (id) {
      const sport = getSportById(id as string);
      if (sport) {
        setNomeEsporte(sport.name);
      }
    }
  }, [id]);

  const handleSalvar = () => {
    if (nomeEsporte.trim().length < 3) {
      Alert.alert("Erro", "O nome do esporte deve ter pelo menos 3 caracteres.");
      return;
    }

    const sportData: ISport = {
      id: id ? id.toString() : (Math.random() * 1000000).toFixed(0),
      name: nomeEsporte.trim(),
    };

    if (id) {
      editSport(sportData);
      Alert.alert("Sucesso", "Esporte atualizado com sucesso!");
    } else {
      addSport(sportData);
      Alert.alert("Sucesso", "Esporte criado com sucesso!");
    }

    router.back();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back" size={24} color={colors.ifGreen} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {id ? "Editar Esporte" : "Cadastrar Esporte"}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do Esporte</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome do esporte"
          value={nomeEsporte}
          onChangeText={setNomeEsporte}
          autoFocus
        />

        <TouchableOpacity style={styles.button} onPress={handleSalvar}>
          <Text style={styles.buttonText}>{id ? "Atualizar" : "Salvar"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
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
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginLeft: 15,
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.ifGreen,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
