import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityProvider } from '../context/ActivitiesContext';
import { SubscriptionProvider } from '../context/SubscripitionContext';
import { SportProvider } from '../context/SportsContext';
import { PlacesProvider } from '../context/PlacesContext';
import { ScheduleProvider } from '../context/SchedulesContext';
import { MenuProvider } from '../context/MenuContext';

function InnerStack() {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name="login" />
      ) : (
        <Stack.Screen name="(tabs)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ActivityProvider>
        <SubscriptionProvider>
          <SportProvider>
            <PlacesProvider>
              <ScheduleProvider>
                <MenuProvider>
                  <InnerStack />
                </MenuProvider>
              </ScheduleProvider>
            </PlacesProvider>
          </SportProvider>
        </SubscriptionProvider>
      </ActivityProvider>
    </AuthProvider>
  );
}
