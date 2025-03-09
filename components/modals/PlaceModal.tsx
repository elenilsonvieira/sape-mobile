import IPlace from "@/interfaces/IPlace";
import { useEffect, useState } from "react";
import { Button, Modal, SafeAreaView, ScrollView, StyleSheet, Switch, TextInput } from "react-native";

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
        const [validates, setValidates] = useState<{ [key:string]: string} >({});

        const clearForm = () => {
            setName('');
            setReference('');
            setMaximumCapacityParticipants(undefined);
            setIsPublic(false);
            setValidates({});
        }

        const validateForm = () => {
            const newErrors: { [key: string]: string} = {};

            if (!name.trim()){
                newErrors.name = 'O nome do local é obrigatório!';
            }

            if (maximumCapacityParticipants !== undefined && isNaN(maximumCapacityParticipants)){
                newErrors.maximumCapacityParticipants = "A capacidade máxima deve ser um número válido!";
            }

            setValidates(newErrors);
            return Object.keys(newErrors).length === 0;
        }


        const handleSave = () => {
            if (!validateForm()){
                return;
            }
            
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
      <SafeAreaView>
        <Modal
          visible={visible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => {}}
        >
          <ScrollView>
            <ThemedView style={styles.modalContainer}>
              <ThemedText style={styles.title}>
                {placeToEdit ? "Editar Local" : "Adicionar novo Local"}
              </ThemedText>

              <TextInput
                style={[styles.input, validates.name && styles.inputError]}
                placeholder="Nome do local"
                value={name}
                onChangeText={setName}
              />
              {validates.name && (
                <ThemedText style={styles.errorText}>
                  {validates.name}
                </ThemedText>
              )}

              <TextInput
                style={styles.input}
                placeholder="Referência (Opcional)"
                value={reference}
                onChangeText={setReference}
              />

              <TextInput
                style={[
                  styles.input,
                  validates.maximumCapacityParticipants && styles.inputError,
                ]}
                placeholder="Capacidade Máxima (Opcional)"
                keyboardType="numeric"
                value={maximumCapacityParticipants?.toString() || ""}
                onChangeText={(text) =>
                  setMaximumCapacityParticipants(Number(text))
                }
              />
              {validates.maximumCapacityParticipants && (
                <ThemedText style={styles.errorText}>
                  {validates.maximumCapacityParticipants}
                </ThemedText>
              )}

              <ThemedView style={styles.switchContainer}>
                <ThemedText>Público:</ThemedText>
                <Switch value={isPublic} onValueChange={setIsPublic} />
              </ThemedView>

              <ThemedView style={styles.buttonContainer}>
                <Button title="Cancelar" onPress={onCancel} color="red" />
                <Button title="Confirmar" onPress={handleSave} color="green" />
              </ThemedView>
            </ThemedView>
          </ScrollView>
        </Modal>
      </SafeAreaView>
    );


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
    inputError: {
        borderColor: 'red',
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
    errorText: {
        color: 'red',
        marginBottom: 8,
    },
});

