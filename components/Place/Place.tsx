import IPlace from "@/interfaces/IPlace"
import { ThemedView } from "../ThemedView";
import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";

export type PlaceProps = {
    place: IPlace;
};

export default function Place({ place }: PlaceProps) {
    return (
        <ThemedView style={styles.card}>
            <ThemedText style={styles.name}>{place.name}</ThemedText>
            {place.reference && <ThemedText style={styles.reference}>Referência: {place.reference}</ThemedText>}
            {place.maximumCapacityParticipants && <ThemedText style={styles.capacity}>Capacidade Máxima: {place.maximumCapacityParticipants}</ThemedText>}
            <ThemedText style={[styles.publicStatus, {color: place.isPublic ? 'green' : 'red'}]}>{place.isPublic ? 'Público' : 'Privado'}</ThemedText>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    card: {
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    reference: {
      fontSize: 14,
      marginBottom: 4,
    },
    capacity: {
      fontSize: 14,
      marginBottom: 4,
    },
    publicStatus: {
      fontSize: 14,
      fontWeight: 'bold',
    },
  });