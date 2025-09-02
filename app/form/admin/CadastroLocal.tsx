import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import colors from "../../../constants/Colors";
import { usePlaces } from "../../../context/PlacesContext";
import IPlace from "../../../interfaces/IPlace";

export default function CadastroLocal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addPlace, editPlace, getPlaceById } = usePlaces();

  const [nome, setNome] = useState("");
  const [referencia, setReferencia] = useState("");
  const [capacidade, setCapacidade] = useState("100");
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const place = getPlaceById(Number(id));
      if (place) {
        setNome(place.name ?? "");
        setReferencia(place.reference ?? "");
        setCapacidade(place.maximumCapacityParticipants?.toString() ?? "100");
        setIsPublic(place.isPublic ?? true);
      }
    }
  }, [id]);

  const salvar = async () => {
    const nomeTrim = nome.trim();
    const refTrim = referencia.trim();
    const capacidadeNum = parseInt(capacidade, 10);

    if (nomeTrim.length < 4) {
      Alert.alert("Erro", "O nome do local deve ter ao menos 4 caracteres.");
      return;
    }

    if (refTrim.length < 3) {
      Alert.alert("Erro", "A referência deve ter ao menos 3 caracteres.");
      return;
    }

    if (isNaN(capacidadeNum) || capacidadeNum <= 0 || capacidadeNum > 400) {
      Alert.alert(
        "Erro",
        "A capacidade deve ser um número positivo e no máximo 400."
      );
      return;
    }

    const placeData: IPlace = {
      id: id ? Number(id) : undefined,
      name: nomeTrim,
      reference: refTrim,
      maximumCapacityParticipants: capacidadeNum,
      isPublic: isPublic,
    };

    try {
      setLoading(true);
      if (id) {
        await editPlace(placeData);
        Alert.alert("Sucesso", "Local atualizado com sucesso!");
      } else {
        await addPlace(placeData);
        Alert.alert("Sucesso", "Local cadastrado com sucesso!");
      }
      router.back();
    } catch (error: any) {
      console.error("Erro ao salvar local:", error);
      let msg = "Não foi possível salvar o local. Verifique se você tem permissão.";
      if (error.response?.data?.message) msg = error.response.data.message;
      Alert.alert("Erro", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.botaoVoltar}>
          <Ionicons name="chevron-back" size={24} color={colors.ifGreen} />
        </TouchableOpacity>
        <Text style={styles.title}>{id ? "Editar Local" : "Cadastrar Local"}</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nome do Local</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do local"
          value={nome}
          onChangeText={setNome}
          autoFocus
        />

        <Text style={styles.label}>Referência</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Bloco 2, perto do estacionamento"
          value={referencia}
          onChangeText={setReferencia}
        />

        <Text style={styles.label}>Capacidade Máxima</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 50"
          value={capacidade}
          onChangeText={setCapacidade}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.button}
          onPress={salvar}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>{id ? "Atualizar" : "Salvar"}</Text>
          )}
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
