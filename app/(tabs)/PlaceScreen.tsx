import alert from "@/components/alert";
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
    const [editPlace, setEditPlace] = useState<IPlace | null>(null);

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
        if(editPlace){
            const editingPlace = (prevPlaces: IPlace[]) => prevPlaces.map((place) => place.id === newPlace.id ? newPlace : place);
            const placesUpdt = editingPlace(places);
            setPlaces(placesUpdt);
            handleStorage(placesUpdt);

            alert("Sucesso", "Local editado com sucesso!");
        } else {
            const placeAdd: IPlace[] = [...places, newPlace]
            setPlaces(placeAdd);
            handleStorage(placeAdd);
            
            alert("Sucesso", "Local adicionado com sucesso!");
        }

        setEditPlace(null);
        setShowModal(false);
    }

    const handleDeletePlace = (id: string) => {
        alert(
            "Confirmar Exclusão",
            "Tem certeza que deseja excluir este local?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: () => {
                        const delPlace = (prevPlaces: IPlace[]) => prevPlaces.filter((place) => place.id !== id);
                        const placesUpdt = delPlace(places);
                        setPlaces(placesUpdt);
                        handleStorage(placesUpdt);

                        alert("Sucesso", "Local excluido com sucesso!");
                    }
                }
            ]
        )
        
    }

    const handleEditPlace = (place: IPlace) =>{
        setEditPlace(place);
        setShowModal(true);
    }

    return (
        <SafeAreaView style={styles.container}>
            <ThemedView style={styles.header}>
                <Button title="Adicionar Local" onPress={() => setShowModal(true)} />
            </ThemedView>

            <PlaceModal
                visible={showModal}
                onCancel={() => {setShowModal(false); setEditPlace(null);}}
                onAdd={handleAddPlace}
                placeToEdit={editPlace}
            />

            <FlatList 
                data={places}
                keyExtractor={(item)=> item.id}
                renderItem={({ item }) => <Place place={item} onDelete={()=> handleDeletePlace(item.id)} onEdit={()=> handleEditPlace(item)}/>}
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