import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  useColorScheme,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Homepage: React.FC = () => {
  const theme = useColorScheme(); // Detecta o tema (light ou dark)

  const themeColors = {
    dark: {
      background: "#121212",
      text: "#fff",
      descriptionText: "#ccc",
    },
    light: {
      background: "#f4f4f4",
      text: "#000",
      descriptionText: "#666",
    },
  };

  const currentTheme = themeColors[theme || "light"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title]}>Bem-vindo ao SAPE</Text>

        <Text
          style={[styles.description, { color: currentTheme.descriptionText }]}
        >
          O SAPE (Sistema de Agendamento de Esportes) permite que você agende
          suas atividades esportivas de maneira prática e rápida. Escolha entre
          diferentes modalidades, agende seu horário e aproveite o seu tempo!
        </Text>

        <Text style={[styles.details, { color: currentTheme.text }]}>
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
    paddingHorizontal: width * 0.05, // Ajusta a largura de acordo com a tela
  },
  content: {
    alignItems: "center",
    marginTop: height * 0.05, // Ajusta o espaçamento superior
    marginBottom: height * 0.03, // Ajusta o espaçamento inferior
  },
  title: {
    fontSize: width * 0.08, // Ajusta o tamanho da fonte com base na largura da tela
    fontWeight: "bold",
    color: "#4CAF50", // Cor verde fixa para o título
    marginBottom: height * 0.05, // Ajusta o espaçamento entre o título e a descrição
  },
  description: {
    fontSize: width * 0.05, // Ajusta o tamanho da fonte com base na largura da tela
    textAlign: "center",
    marginBottom: height * 0.05, // Ajusta o espaçamento entre a descrição e os detalhes
  },
  details: {
    fontSize: width * 0.045, // Ajusta o tamanho da fonte com base na largura da tela
    textAlign: "center",
    marginBottom: height * 0.08, // Ajusta o espaçamento inferior
  },
});

export default Homepage;

// import React from "react";
// import { View, Text, StyleSheet, SafeAreaView } from "react-native";

// const Homepage: React.FC = () => {
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.content}>
//         <Text style={styles.title}>Bem-vindo ao SAPE</Text>

//         <Text style={styles.description}>
//           O SAPE (Sistema de Agendamento de Esportes) permite que você agende
//           suas atividades esportivas de maneira prática e rápida. Escolha entre
//           diferentes modalidades, agende seu horário e aproveite o seu tempo!
//         </Text>

//         <Text style={styles.details}>
//           Nosso objetivo é facilitar a organização e o agendamento de esportes,
//           garantindo que você tenha mais tempo para se dedicar ao que gosta.
//         </Text>
//       </View>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f4f4f4",
//     paddingHorizontal: 20,
//   },
//   content: {
//     alignItems: "center",
//     marginTop: 30,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: "bold",
//     color: "#4CAF50",
//     marginBottom: 20,
//   },
//   description: {
//     fontSize: 18,
//     color: "#666",
//     textAlign: "center",
//     marginBottom: 30,
//   },
//   details: {
//     fontSize: 16,
//     color: "#444",
//     textAlign: "center",
//     marginBottom: 40,
//   },
// });

// export default Homepage;
