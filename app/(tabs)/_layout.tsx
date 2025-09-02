import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

            switch (route.name) {
              case 'inicio':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'minhaAgenda':
                iconName = focused ? 'calendar' : 'calendar-outline';
                break;
              case 'atividades':
                iconName = focused ? 'create' : 'create-outline';
                break;
              case 'ajustes':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
              case 'eventos':
                iconName = focused ? 'time' : 'time-outline'; 
                break;
            }

            return <Ionicons name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: '#2e7d32',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 0,
            elevation: 25,
            height: 60,
            paddingBottom: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          headerShown: false,
          tabBarPressColor: 'rgba(46, 125, 50, 0.15)',
        })}
      >
        <Tabs.Screen name="inicio" options={{ title: 'Início' }} />
        <Tabs.Screen name="minhaAgenda" options={{ title: 'Minha Agenda' }} />
        <Tabs.Screen name="eventos" options={{ title: 'Eventos' }} />
        <Tabs.Screen name="atividades" options={{ title: 'Atividades' }} />
        <Tabs.Screen name="ajustes" options={{ title: 'Ajustes' }} />
      </Tabs>
    </SafeAreaProvider>
  );
}