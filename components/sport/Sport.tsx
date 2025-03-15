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


// import React from "react";
// import { StyleSheet, Text, View } from "react-native";

// export type SportType = {
//   name: string;
// };

// export default function Sport({
//   name,
// }: SportType) {
//   return (
//     <View style={styles.sportContainer}>
//       <View style={styles.sportInfo}>
//         <Text style={styles.sportTitle}>{name}</Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sportContainer: {
//     flexDirection: "row",
//     backgroundColor: "white",
//     padding: 15,
//     margin: 10,
//     borderRadius: 10,
//     elevation: 3,
//     shadowColor: "black",
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 1, height: 2 },
//     shadowRadius: 5,
//   },
//   sportInfo: {
//     flex: 1,
//     justifyContent: "center",
//   },
//   sportTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
// });
