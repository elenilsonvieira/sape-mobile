import IPlace from "@/interfaces/IPlace";
import { useEffect, useState } from "react";
import { Button, Modal, ScrollView, StyleSheet, Switch, TextInput } from "react-native";

import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";

export type PlaceModalProps = {
    visible: boolean;
    onCancel: () => void;
    onAdd: (place: IPlace) => void;
    placeToEdit?: IPlace | null;
}

export default function PlaceModal({
    visible, onAdd, onCancel, placeToEdit,
    }: PlaceModalProps){
        const [name, setName] = useState('');
        const [reference, setReference] = useState('');
        const [maximumCapacityParticipants, setMaximumCapacityParticipants] = useState<number | undefined>(undefined);
        const [isPublic, setIsPublic] = useState(false);

        const clearForm = () => {
            setName('');
            setReference('');
            setMaximumCapacityParticipants(undefined);
            setIsPublic(false);
        }

        const handleSave = () => {
            
            const newPlace: IPlace ={
                id: placeToEdit ? placeToEdit.id : (Math.random() * 1000).toString(),
                name,
                reference: reference.trim() || undefined,
                maximumCapacityParticipants: maximumCapacityParticipants || undefined,
                isPublic,
            };

            onAdd(newPlace);
            onCancel();
            clearForm();
        };

        useEffect(()=> {
            if(placeToEdit) {
                setName(placeToEdit.name);
                setReference(placeToEdit.reference || '');
                setMaximumCapacityParticipants(placeToEdit.maximumCapacityParticipants || undefined);
                setIsPublic(placeToEdit.isPublic);
            } else {
                clearForm();
            }
        }, [placeToEdit]);

        return (
            <Modal visible={visible}
                animationType="slide"
                transparent={true}
                onRequestClose={()=>{}}
            >
                <ScrollView>
                    <ThemedView style={styles.modalContainer}>
                        <ThemedText style={styles.title}>{placeToEdit ? 'Editar Local' :'Adicionar novo Local'}</ThemedText>
                        
                        <TextInput 
                            style={styles.input}
                            placeholder="Nome do local"
                            value={name}
                            onChangeText={setName}
                        />

                        <TextInput 
                            style={styles.input}
                            placeholder="Referência (Opcional)"
                            value={reference}
                            onChangeText={setReference}
                        />

                        <TextInput 
                            style={styles.input}
                            placeholder="Capacidade Máxima (Opcional)"
                            keyboardType="numeric"
                            value={maximumCapacityParticipants?.toString() || ''}
                            onChangeText={(text) => setMaximumCapacityParticipants(Number(text))}
                        />

                        <ThemedView style={styles.switchContainer}>
                            <ThemedText>Público:</ThemedText>
                            <Switch value={isPublic} onValueChange={setIsPublic} />
                        </ThemedView>

                        <ThemedView style={styles.buttonContainer}>
                            <Button title="Cancelar" onPress={onCancel} color='red' />
                            <Button title="Confirmar" onPress={handleSave} color='green'/>
                        </ThemedView>

                    </ThemedView>

                </ScrollView>
            </Modal>
        )


    };

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 16,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 8,
        marginBottom: 16,
        backgroundColor: 'white'
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
},
});

