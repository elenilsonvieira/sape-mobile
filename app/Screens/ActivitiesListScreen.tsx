import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import IActivity from '@/interfaces/IActivity';
import IInscription from '@/interfaces/IInscription';
import { ISport } from '@/interfaces/ISport';
import IPlace from '@/interfaces/IPlace';
import Activity from '@/components/Activity/Activity';

export default function ActivitiesListScreen() {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [sports, setSports] = useState<ISport[]>([]);
    const [places, setPlaces] = useState<IPlace[]>([]);
    const [inscriptions, setInscriptions] = useState<IInscription[]>([]);
    const currentUserId = 1; // ID do usuário "logado" (fixo para exemplo)

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
        const [activitiesStorage, sportsStorage, placesStorage, inscriptionsStorage] = await Promise.all([
            AsyncStorage.getItem("@SapeApp:activities"),
            AsyncStorage.getItem("@SapeApp:sports"),
            AsyncStorage.getItem("@SapeApp:places"),
            AsyncStorage.getItem("@SapeApp:inscriptions"),
        ]);
        
        
        const activitiesData = activitiesStorage != null ? JSON.parse(activitiesStorage) : [];
        const sportsData = sportsStorage != null ? JSON.parse(sportsStorage) : [];
        const placesData = placesStorage != null ? JSON.parse(placesStorage) : [];
        const inscriptionData = inscriptionsStorage != null ? JSON.parse(inscriptionsStorage) : [];

        setActivities(activitiesData);
        setSports(sportsData);
        setPlaces(placesData);
        setInscriptions(inscriptionData);
    };

    const isUserSubscribed = (activityId: string) => {
        return inscriptions.some(i => i.userId === currentUserId && i.activityId === activityId);
    };

    const handleSubscription = async (activityId: string) => {
        const newInscription: IInscription = {
            userId: currentUserId,
            activityId
        };

        const updatedInscriptions = isUserSubscribed(activityId)
            ? inscriptions.filter(i => !(i.userId === currentUserId && i.activityId === activityId))
            : [...inscriptions, newInscription];

        await AsyncStorage.setItem("@SapeApp:inscriptions", JSON.stringify(updatedInscriptions));
        setInscriptions(updatedInscriptions);
    };

    return (
        <ThemedView style={styles.container}>
            <TouchableOpacity onPress={() => loadData()}>
                <ThemedText style={[styles.title, { color: currentTheme.text }]}>
                    Atividades 🔄
                </ThemedText>
            </TouchableOpacity>
            <FlatList
                data={activities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ThemedView style={styles.card}>
                        <Activity 
                            activity={item}
                            sports={sports}
                            places={places}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => handleSubscription(item.id)}
                        >
                            <ThemedText style={styles.buttonText}>
                                {isUserSubscribed(item.id) ? 'Cancelar Inscrição' : 'Inscrever-se'}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                )}
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
    button: {
        marginTop: 10,
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
    },
});