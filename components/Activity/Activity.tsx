import { TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ISport } from '@/interfaces/ISport';
import IPlace from '@/interfaces/IPlace';
import IActivity from '@/interfaces/IActivity';

const { width } = Dimensions.get("window");

export type ActivityProps = {
  activity: IActivity;
  sports: ISport[];
  places: IPlace[];
}

export default function Activity({ activity, sports, places }: ActivityProps){
  const getSportName = (id: string) => sports.find(s => s.id === id)?.name || 'Desconhecido';
  const getPlaceName = (id: string) => places.find(s => s.id === id)?.name || 'Desconhecido';

  return (
      <ThemedView style={styles.activityCard}>
        <ThemedText style={styles.activityTitle}>{activity.titulo}</ThemedText>
        <ThemedText>Esporte: {getSportName(activity.sportId)}</ThemedText>
        <ThemedText>Local: {getPlaceName(activity.placeId)}</ThemedText>
        <ThemedText>Data: {new Date(activity.dataAtividade).toLocaleDateString()}</ThemedText>
        <ThemedText>Hora Inicio: {activity.atividadeStartTime}</ThemedText>
        <ThemedText>Hora Fim: {activity.atividadeFinishTime}</ThemedText>
      </ThemedView>
  );
};

const styles = StyleSheet.create({
  activityCard: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    width: width * 0.8,
    alignSelf: "center",
    backgroundColor: "#4CAF50",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
