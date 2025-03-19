import { TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ISport } from '@/interfaces/ISport';
import IPlace from '@/interfaces/IPlace';
import IActivity from '@/interfaces/IActivity';

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
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
});
