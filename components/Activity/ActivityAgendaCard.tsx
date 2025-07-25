import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

type Props = {
  atividades: {
    id: string;
    titulo: string;
    sportId: string;
    placeId: string;
    dataAtividade: string;
    atividadeStartTime: string;
    atividadeFinishTime: string;
  }[];
};

export default function ActivityAgendaCard({ atividades }: Props) {
  const router = useRouter();

  const formatarData = (data: string) => {
    const d = new Date(data);
    return d.toLocaleDateString("pt-BR");
  };

  if (atividades.length === 0) {
    return (
      <View style={styles.agendaBox}>
        <Text style={styles.agendaText}>Você ainda não marcou nenhuma atividade.</Text>
      </View>
    );
  }

  const primeira = atividades[0];
  const data = formatarData(primeira.dataAtividade);

  return (
    <View style={styles.agendaBox}>
      {atividades.length === 1 ? (
        <>
          <Text style={[styles.agendaText, { fontWeight: "bold", marginBottom: 6 }]}>
            {primeira.titulo}
          </Text>
          <Text style={styles.agendaText}>Esporte: {primeira.sportId}</Text>
          <Text style={styles.agendaText}>Local: {primeira.placeId}</Text>
          <Text style={styles.agendaText}>Data: {data}</Text>
          <Text style={styles.agendaText}>
            Horário: {primeira.atividadeStartTime} às {primeira.atividadeFinishTime}
          </Text>
        </>
      ) : (
        <Text style={styles.agendaText}>
          Você tem {atividades.length} atividades no dia {data}.
        </Text>
      )}

      <TouchableOpacity
        style={styles.btnVerAgenda}
        onPress={() => router.push("/Agenda")}
      >
        <Text style={styles.btnVerAgendaText}>Ver sua agenda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  agendaBox: {
    marginTop: 10,
    backgroundColor: "#f1f8e9",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 10,
  },
  agendaText: {
    color: "#666",
    fontSize: 14,
  },
  btnVerAgenda: {
    marginTop: 10,
    backgroundColor: "#4caf50",
    borderRadius: 8,
    padding: 12,

  },
  btnVerAgendaText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
