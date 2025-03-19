import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
      <Text>Email: {user.email}</Text>
      <Text>Matrícula: {user.registration}</Text>
      <Text>Função: {user.role}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UserComponent;