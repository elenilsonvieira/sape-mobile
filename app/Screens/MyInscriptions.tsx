import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import IActivity from '@/interfaces/IActivity';
import IInscription from '@/interfaces/IInscription';
import Activity from '@/components/Activity/Activity';
import { ISport } from '@/interfaces/ISport';
import IPlace from '@/interfaces/IPlace';
import { ThemedText } from '@/components/ThemedText';

export default function MyInscriptionsScreen() {
    const [inscriptions, setInscriptions] = useState<IInscription[]>([]);
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [sports, setSports] = useState<ISport[]>([]);
    const [places, setPlaces] = useState<IPlace[]>([]);
    const currentUserId = 1; // fixo para exemplo

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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [inscriptionsStorage, activitiesStorage, sportsStorage, placesStorage] = await Promise.all([
            AsyncStorage.getItem("@SapeApp:inscriptions"),
            AsyncStorage.getItem("@SapeApp:activities"),
            AsyncStorage.getItem("@SapeApp:sports"),
            AsyncStorage.getItem("@SapeApp:places")
        ]);

        const allInscriptions = inscriptionsStorage != null ? JSON.parse(inscriptionsStorage) : [];
        const userInscriptions = allInscriptions.filter((i: IInscription) => i.userId === currentUserId);

        const activitiesData = activitiesStorage != null ? JSON.parse(activitiesStorage) : [];
        const sportsData = sportsStorage != null ? JSON.parse(sportsStorage) : [];
        const placesData = placesStorage != null ? JSON.parse(placesStorage) : [];

        setInscriptions(userInscriptions);

        setActivities(activitiesData);
        setSports(sportsData);
        setPlaces(placesData);
    };

    const getActivityById = (activityId: string) => {
        return activities.find(a => a.id === activityId);
    };

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity onPress={() => loadData()}>
                <ThemedText style={[styles.title, { color: currentTheme.text }]}>
                    Minhas Inscrições 🔄
                </ThemedText>
            </TouchableOpacity>
            
            <FlatList
                data={inscriptions}
                keyExtractor={(item) => item.activityId}
                renderItem={({ item }) => {
                    const activity = getActivityById(item.activityId);
                    return activity ? (
                        <Activity 
                            activity={activity}
                            sports={sports}
                            places={places}
                        />
                    ) : null;
                }}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    card: {
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 20,
        textAlign: "center",
    },
});