import { Stack } from 'expo-router';
import { useAuth } from '../hooks/useAuth';
import { ActivityProvider } from '../context/ActivitiesContext'; // caminho correto
import { SubscriptionProvider } from '../context/SubscripitionContext'; // caminho correto


export default function RootLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <ActivityProvider>
      <SubscriptionProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {!isAuthenticated ? (
            <Stack.Screen name="login" />
          ) : (
            <Stack.Screen name="(tabs)" />
          )}
        </Stack>
      </SubscriptionProvider>
    </ActivityProvider>
  );
}
