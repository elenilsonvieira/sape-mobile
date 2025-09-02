import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import IActivity from "@/interfaces/IActivity";
import colors from "../../constants/Colors";

import { useSports } from "../../context/SportsContext";   // import context esporte
import { usePlaces } from "../../context/PlacesContext";   // import context local

interface ActivityCardProps {
  item: IActivity;
  showInscrever?: boolean;
  onInscrever?: () => void;
  inscrito?: boolean;
  showActions?: boolean;
  onEditar?: () => void;
  onExcluir?: () => void;
}

export default function ActivityCard({
  item,
  showInscrever,
  onInscrever,
  inscrito,
  showActions,
  onEditar,
  onExcluir,
}: ActivityCardProps) {
  const { getSportById } = useSports();
  const { getPlaceById } = usePlaces();

  const sport = getSportById(item.sportId);
  const place = getPlaceById(item.placeId);

  function formatarData(data: string) {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  }

  return (
    <View style={styles.atividadeItem}>
      <View style={styles.atividadeInfo}>
        <Text style={styles.atividadeNome}>{item.titulo}</Text>
        <Text style={styles.atividadeDetail}>
          <Text style={styles.bold}>Esporte: </Text>
          {sport ? sport.name : item.sportId}
        </Text>
        <Text style={styles.atividadeDetail}>
          <Text style={styles.bold}>Local: </Text>
          {place ? place.name : item.placeId}
        </Text>
        <Text style={styles.atividadeDetail}>
          <Text style={styles.bold}>Data: </Text>
          {formatarData(item.dataAtividade)}
        </Text>
        <Text style={styles.atividadeDetail}>
          <Text style={styles.bold}>Horário: </Text>
          {item.atividadeStartTime} às {item.atividadeFinishTime}
        </Text>
      </View>

      {/* Botão Inscrever/Desinscrever */}
      {showInscrever && onInscrever && (
        <TouchableOpacity
          style={[styles.btnInscrever, inscrito && styles.btnCancelar]}
          onPress={onInscrever}
        >
          <Text style={styles.btnInscreverText}>
            {inscrito ? "Desinscrever" : "Inscrever"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Ícones de editar e excluir */}
      {showActions && (
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={onEditar} style={styles.iconButton}>
            <MaterialIcons name="edit" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onExcluir} style={styles.iconButton}>
            <MaterialIcons name="delete" size={20} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    atividadeItem: {
        backgroundColor: colors.backgroundCard,
        borderRadius: 10,
        padding: 12,
        marginBottom: 15,
        elevation: 1,
        shadowColor: colors.black,
        shadowOpacity: 0.1,
        shadowRadius: 3,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    atividadeInfo: {
        flex: 1,
    },
    atividadeNome: {
        fontWeight: "bold",
        fontSize: 18,
        color: colors.textPrimary,
        marginBottom: 6,
    },
    atividadeDetail: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    bold: {
        fontWeight: "bold",
    },
    btnInscrever: {
        backgroundColor: "#4CAF50",
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 8,
        alignSelf: "center",
    },
    btnInscreverText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    btnCancelar: {
        backgroundColor: "#d32f2f",
    },
    actionButtons: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    iconButton: {
        marginLeft: 8,
        padding: 4,
    },
});
