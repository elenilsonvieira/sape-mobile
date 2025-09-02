import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import IPlace from "../../interfaces/IPlace";

const { width, height } = Dimensions.get("window");

export type PlaceProps = {
  place: IPlace;
  onPress: () => void;
}

export default function Place({ place, onPress }: PlaceProps){
  
  return (
    <TouchableOpacity style={styles.placeItem} onPress={onPress}>
      <Text style={styles.placeName}>{place.name}</Text>
      <Text style={styles.placeReference}>
        Referência: {place.reference || "N/A"}
      </Text>
      <Text style={styles.placeCapacity}>
        Capacidade Máxima: {place.maximumCapacityParticipants || "N/A"}
      </Text>
      <Text style={styles.placePublic}>
        Público: {place.isPublic ? "Sim" : "Não"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  placeItem: {
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
  placeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  placeReference: {
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
  },
  placeCapacity: {
    marginTop: 5,
    fontSize: 14,
    color: "#fff",
  },
  placePublic: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: "italic",
    color: "#fff",
  },
});
