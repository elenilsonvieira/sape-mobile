import { TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { ISport } from "../../interfaces/ISport";

const { width } = Dimensions.get("window");

export type SportProps = {
  sport: ISport;
  onPress: () => void;
}

export default function Sport({ sport, onPress }: SportProps){
  return (
    <TouchableOpacity onPress={onPress} style={styles.sportItem}>
      <Text style={styles.sportText}>
        {sport.id} - {sport.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sportItem: {
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
  sportText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});