import PlaceModal from "@/components/modals/PlaceModal";
import Place from "@/components/Place/Place";
import { ThemedView } from "@/components/ThemedView";
import IPlace from "@/interfaces/IPlace";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Button, FlatList, SafeAreaView, StyleSheet } from "react-native";

export default function PlaceScreen(){
    const [places, setPlaces] = useState<IPlace[]>([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(()=>{
        loadStorage();
    }, []);

    const loadStorage = async () => {
        try{
            const storage = await AsyncStorage.getItem("@sape-mobile:places");
            const placeStorage = storage != null ? JSON.parse(storage) : [];
            setPlaces(placeStorage);
        } catch (err) {
            console.error({'Error': err});   
        }
    }

    const handleStorage = async (places: IPlace[]) => {
        AsyncStorage.setItem('@sape-mobile:places', JSON.stringify(places));
    }

    const handleAddPlace = (newPlace: IPlace) => {

        const placeAdd: IPlace[] = [...places, newPlace]
        setPlaces(placeAdd);
        handleStorage(placeAdd);

        setShowModal(false);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.header}>
                <Button title="Adicionar Local" onPress={() => setShowModal(true)} />
            </ThemedView>

            <PlaceModal
                visible={showModal}
                onCancel={() => setShowModal(false)}
                onAdd={handleAddPlace}
            />

            <FlatList 
                data={places}
                keyExtractor={(item)=> item.id}
                renderItem={({ item }) => <Place place={item} />}
                contentContainerStyle={styles.list}
             />
        </SafeAreaView>

    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
    },
    list: {
      padding: 16,
    },
  });