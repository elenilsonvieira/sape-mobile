import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="users"
        options={{
          title: "Usuários",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="places"
        options={{
          title: "Locais",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="location.circle" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sports"
        options={{
          title: "Esportes",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="sportscourt" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Criar Atividades",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="checkmark.seal.text.page.fill.rtl" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inscriptions"
        options={{
          title: "Inscrição",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="flag.2.crossed.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="MyInscriptions"
        options={{
          title: "Minhas Inscrições",
          tabBarIcon: ({ color }: { color: string }) => (
            <IconSymbol size={28} name="sprinkler.fill" color={color} />
          ),
        }}
      />
    </Tabs>
    
  );
}
