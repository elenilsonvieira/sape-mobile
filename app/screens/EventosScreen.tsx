import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-calendars";
import { useActivities } from "@/context/ActivitiesContext";
import IActivity from "@/interfaces/IActivity";
import { useRouter } from "expo-router";

export default function EventScreen() {
  const { activities, isConfirmed } = useActivities();
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState<{ [date: string]: any }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filteredActivities, setFilteredActivities] = useState<IActivity[]>([]);

  const typeColors: Record<string, string> = {
    reunião: "blue",
    oficina: "green",
    palestra: "orange",
    outro: "gray",
  };

  useEffect(() => {
    const markings: { [date: string]: any } = {};

    activities.forEach((atividade) => {
      const date = atividade.dataAtividade?.split("T")[0];
      const tipo = atividade.tipo || "outro"; // Alterado de atividadeStartTime para tipo

      if (date) {
        if (!markings[date]) {
          markings[date] = { dots: [], marked: true };
        }

        if (!markings[date].dots.find((d: any) => d.key === tipo)) {
          markings[date].dots.push({
            key: tipo,
            color: typeColors[tipo] || "gray",
          });
        }
      }
    });

    setMarkedDates(markings);
  }, [activities]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    const atividadesDoDia = activities.filter(
      (a) => a.dataAtividade?.split("T")[0] === day.dateString
    );
    setFilteredActivities(atividadesDoDia);
  };

  const handleActivityPress = (activity: IActivity) => {
    router.push({
      pathname: "../form/ConfirmForm",
      params: { 
        activityId: activity.id,
        activityTitle: activity.titulo,
        activityDate: activity.dataAtividade,
        activityTime: `${activity.atividadeStartTime} - ${activity.atividadeFinishTime}`
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Eventos</Text>
      <Calendar
        markedDates={{
          ...markedDates,
          ...(selectedDate && {
            [selectedDate]: {
              ...(markedDates[selectedDate] || {}),
              selected: true,
              selectedColor: "#aed581",
            },
          }),
        }}
        markingType="multi-dot"
        onDayPress={handleDayPress}
      />

      <Text style={styles.subtitle}>
        {selectedDate
          ? `Atividades em ${new Date(selectedDate).toLocaleDateString()}`
          : "Selecione uma data"}
      </Text>

      {filteredActivities.map((a) => (
        <TouchableOpacity 
          key={a.id} 
          style={styles.activityItem}
          onPress={() => handleActivityPress(a)}
        >
          <Text style={styles.activityTitle}>{a.titulo}</Text>
          <Text>{new Date(a.dataAtividade).toLocaleDateString()}</Text>
          <Text>{a.atividadeStartTime} - {a.atividadeFinishTime}</Text>
          <Text style={styles.tipo}>Local: {a.placeId}</Text>
          <Text style={styles.status}>
            Status: {isConfirmed(a.id) ? "✅ Confirmado" : "🔄 Pendente"}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  activityItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#e8f5e9",
    borderRadius: 8,
  },
  activityTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  tipo: {
    fontStyle: "italic",
    marginTop: 4,
  },
  status: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#333",
  },
});