import React, { useState, useEffect } from 'react';
import { FlatList, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IActivity from '@/interfaces/IActivity';
import { ISport } from '@/interfaces/ISport';
import IPlace from '@/interfaces/IPlace';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ActivityModal from '@/components/modals/ActivityModal';
import Activity from '@/components/Activity/Activity';

export default function ActivityScreen(){
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [sports, setSports] = useState<ISport[]>([]);
    const [places, setPlaces] = useState<IPlace[]>([]);

    const [showModal, setShowModal] = useState(false);
    const [editActivity, setEditActivity] = useState<IActivity | null>(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [sportsStorage, placesStorage, activitiesStorage] = await Promise.all([
                AsyncStorage.getItem("@sape-mobile:sports"),
                AsyncStorage.getItem("@sape-mobile:places"),
                AsyncStorage.getItem("@sape-mobile:activities")
            ]);

            const sportsData = sportsStorage != null ? JSON.parse(sportsStorage) : [];
            const placesData = placesStorage != null ? JSON.parse(placesStorage) : [];
            const activitiesData = activitiesStorage != null ? JSON.parse(activitiesStorage) : [];

            setSports(sportsData);
            setPlaces(placesData);
            setActivities(activitiesData);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            Alert.alert("Erro", "Erro ao carregar dados.")
        }
    }

    const handleSaveActivity = async (newActivity: IActivity) => {
        if(editActivity){
            try {
                const editingActivity = (prevActivities: IActivity[]) => prevActivities.map((activity) => activity.id === newActivity.id ? newActivity : activity);
                const updtActivity = editingActivity(activities);
            
                await AsyncStorage.setItem("@sape-mobile:activities", JSON.stringify(updtActivity));
                setActivities(updtActivity);
            } catch (err) {
                console.error('Erro ao editar atividade:', err);
                Alert.alert("Erro", "Erro ao editar os dados.")
            }
            

        } else {
            const updatedActivities = [...activities, newActivity];

            try {
                await AsyncStorage.setItem("@sape-mobile:activities", JSON.stringify(updatedActivities));
                setActivities(updatedActivities);
            } catch (err) {
                console.error('Erro ao salvar atividade:', err);
                Alert.alert("Erro", "Erro ao salvar os dados.")
            }
        }

        setEditActivity(null);
        setShowModal(false);
    }

    const handleEditActivity = (activity: IActivity) => {
        setEditActivity(activity);
        setShowModal(true);
    }
    
    const handleDeleteActivity = async (activityId: string) => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir esta atividade?",
            [
                { text: "Cancelar", style: "cancel" },
                { 
                    text: "Excluir", 
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const updatedActivities = activities.filter(activity => activity.id !== activityId);
                            await AsyncStorage.setItem("@sape-mobile:activities", JSON.stringify(updatedActivities));
                            setActivities(updatedActivities);
                        } catch (err) {
                            console.error('Erro ao deletar atividade:', err);
                            Alert.alert("Erro", "Não foi possível deletar a atividade");
                        }
                    }
                }
            ]
        );
    }

    return (
        <ThemedView style={styles.container}>

            <ThemedView style={styles.header}>
                <Button title="Adicionar Atividade" onPress={() => setShowModal(true)} />
            </ThemedView>

            <ActivityModal 
                visible={showModal}
                onCancel={() => {setShowModal(false); setEditActivity(null);}}
                onAdd={handleSaveActivity}
                activityToEdit={editActivity}
                onDelete={() => editActivity && handleDeleteActivity(editActivity.id)}
                sports={sports}
                places={places}
            />

            <FlatList
                data={activities}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <Activity 
                        activity={item}
                        sports={sports}
                        places={places}
                        onPress={() => handleEditActivity(item)}
                    />
                )}
            />
        </ThemedView>
    )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
  },
  datetimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  activityCard: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
});