import UserCard from "@/components/User/UserCard";
import { User } from "@/components/User/UserComponent";
import React from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
} from "react-native";

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
  const theme = useColorScheme();
  const themeColors = {
    dark: {
      background: "#121212",
      text: "#fff",
      inputText: "#fff",
      placeholder: "#ccc",
      overlay: "rgba(0, 0, 0, 0.7)",
      modalBackground: "#333",
    },
    light: {
      background: "#f5f5f5",
      text: "#000",
      inputText: "#000",
      placeholder: "#888",
      overlay: "rgba(0, 0, 0, 0.5)",
      modalBackground: "#fff",
    },
  };
  const currentTheme = themeColors[theme || "light"];
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.background }]}
    >
      <Text style={[styles.title, { color: currentTheme.text }]}>
        Dados do usuário
      </Text>
      <FlatList
        data={initialUsers}
        renderItem={({ item }) => <UserCard user={item} />}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
    width: "100%",
    paddingBottom: 40,
  },
});
