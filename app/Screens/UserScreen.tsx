import UserCard from "@/components/User/UserCard";
import { User } from "@/components/User/UserComponent";
import React from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";

const initialUsers: User[] = [
  {
    id: 1,
    name: "Elenilson",
    email: "elenilson@exemplo.com",
    registration: "123",
    role: "Professor",
  },
];

const UserScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dados do usuário</Text>
      <FlatList
        data={initialUsers}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        style={styles.list}
      />
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  list: {
    flex: 1,
  },
});