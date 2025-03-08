import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";

const Homepage: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo ao SAPE</Text>

        <Text style={styles.description}>
          O SAPE (Sistema de Agendamento de Esportes) permite que você agende
          suas atividades esportivas de maneira prática e rápida. Escolha entre
          diferentes modalidades, agende seu horário e aproveite o seu tempo!
        </Text>

        <Text style={styles.details}>
          Nosso objetivo é facilitar a organização e o agendamento de esportes,
          garantindo que você tenha mais tempo para se dedicar ao que gosta.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
  },
  content: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  details: {
    fontSize: 16,
    color: "#444",
    textAlign: "center",
    marginBottom: 40,
  },
});

export default Homepage;
