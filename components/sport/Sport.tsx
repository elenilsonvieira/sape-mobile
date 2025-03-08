import React from "react";
import { StyleSheet, Text, View } from "react-native";

export type SportType = {
  name: string;
};

export default function Sport({
  name,
}: SportType) {
  return (
    <View style={styles.sportContainer}>
      <View style={styles.sportInfo}>
        <Text style={styles.sportTitle}>{name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sportContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 5,
  },
  sportInfo: {
    flex: 1,
    justifyContent: "center",
  },
  sportTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
