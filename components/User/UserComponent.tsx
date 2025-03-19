import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export type User = {
  id?: number;
  name: string;
  email: string;
  registration: string;
  role: string;
};

type UserComponentProps = {
  user: User;
};

const UserComponent: React.FC<UserComponentProps> = ({ user }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{user.name}</Text>
      <Text style={styles.text}>Email: {user.email}</Text>
      <Text style={styles.text}>Matrícula: {user.registration}</Text>
      <Text style={styles.text}>Função: {user.role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  text: {
    fontSize: 14,
    color: "#fff",
  },
});

export default UserComponent;
