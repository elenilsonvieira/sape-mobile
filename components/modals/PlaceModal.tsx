import { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import IPlace from "../../interfaces/IPlace";

export type PlaceModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedPlace: IPlace | null;
  onSave: (place: IPlace) => void;
  onDelete: () => void;
  theme: "light" | "dark";
}

export default function PlaceModal({
  visible,
  onClose,
  selectedPlace,
  onSave,
  onDelete,
  theme,
}: PlaceModalProps){
  const [name, setName] = useState("");
  const [reference, setReference] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<number | undefined>(undefined);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (selectedPlace) {
      setName(selectedPlace.name);
      setReference(selectedPlace.reference || "");
      setMaxCapacity(selectedPlace.maximumCapacityParticipants);
      setIsPublic(selectedPlace.isPublic);
    } else {
      setName("");
      setReference("");
      setMaxCapacity(undefined);
      setIsPublic(false);
    }
  }, [selectedPlace]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Erro", "O nome do local não pode estar vazio.");
      return;
    }

    const updatedPlace: IPlace = {
      id: selectedPlace?.id || Math.floor(Math.random() * 1000).toString(),
      name: name.trim(),
      reference: reference.trim(),
      maximumCapacityParticipants: maxCapacity,
      isPublic,
    };

    onSave(updatedPlace);
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent={Platform.OS === "ios" || true}
    >
      <View
        style={[
          styles.modalContainer,
          {
            backgroundColor:
              theme === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.5)",
          },
        ]}
      >
        <View
          style={[
            styles.modalContent,
            { backgroundColor: theme === "dark" ? "#333" : "#fff" },
          ]}
        >
          <Text
            style={[
              styles.modalTitle,
              { color: theme === "dark" ? "#fff" : "#000" },
            ]}
          >
            {selectedPlace ? "Editar Local" : "Adicionar Novo Local"}
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === "dark" ? "#444" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Nome do Local"
            value={name}
            onChangeText={setName}
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === "dark" ? "#444" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Referência"
            value={reference}
            onChangeText={setReference}
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          />
          
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme === "dark" ? "#444" : "#fff",
                color: theme === "dark" ? "#fff" : "#000",
              },
            ]}
            placeholder="Capacidade Máxima"
            keyboardType="numeric"
            value={maxCapacity?.toString()}
            onChangeText={(text) => setMaxCapacity(Number(text))}
            placeholderTextColor={theme === "dark" ? "#ccc" : "#888"}
          />
          
          <View style={styles.switchContainer}>
            <Text
              style={[
                styles.switchLabel,
                { color: theme === "dark" ? "#fff" : "#000" },
              ]}
            >
              Local Público:
            </Text>
            <Switch value={isPublic} onValueChange={setIsPublic} />
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalCancelButton} onPress={onClose}>
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalConfirmButton}
              onPress={handleSave}
            >
              <Text style={styles.modalButtonText}>
                {selectedPlace ? "Atualizar" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedPlace && (
            <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Deletar Local</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
    borderRadius: 8,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalConfirmButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  modalCancelButton: {
    backgroundColor: "#FF9800",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 5,
    marginTop: 15,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});


// import IPlace from "@/interfaces/IPlace";
// import { useEffect, useState } from "react";
// import { Button, Modal, ScrollView, StyleSheet, Switch, TextInput } from "react-native";

// import { ThemedView } from "../ThemedView";
// import { ThemedText } from "../ThemedText";

// export type PlaceModalProps = {
//     visible: boolean;
//     onCancel: () => void;
//     onAdd: (place: IPlace) => void;
//     placeToEdit?: IPlace | null;
// }

// export default function PlaceModal({
//     visible, onAdd, onCancel, placeToEdit,
//     }: PlaceModalProps){
//         const [name, setName] = useState('');
//         const [reference, setReference] = useState('');
//         const [maximumCapacityParticipants, setMaximumCapacityParticipants] = useState<number | undefined>(undefined);
//         const [isPublic, setIsPublic] = useState(false);
//         const [validates, setValidates] = useState<{ [key:string]: string} >({});

//         const clearForm = () => {
//             setName('');
//             setReference('');
//             setMaximumCapacityParticipants(undefined);
//             setIsPublic(false);
//             setValidates({});
//         }

//         const validateForm = () => {
//             const newErrors: { [key: string]: string} = {};

//             if (!name.trim()){
//                 newErrors.name = 'O nome do local é obrigatório!';
//             }

//             if (maximumCapacityParticipants !== undefined && isNaN(maximumCapacityParticipants)){
//                 newErrors.maximumCapacityParticipants = "A capacidade máxima deve ser um número válido!";
//             }

//             setValidates(newErrors);
//             return Object.keys(newErrors).length === 0;
//         }


//         const handleSave = () => {
//             if (!validateForm()){
//                 return;
//             }
            
//             const newPlace: IPlace ={
//                 id: placeToEdit ? placeToEdit.id : (Math.random() * 1000).toString(),
//                 name,
//                 reference: reference.trim() || undefined,
//                 maximumCapacityParticipants: maximumCapacityParticipants || undefined,
//                 isPublic,
//             };

//             onAdd(newPlace);
//             onCancel();
//             clearForm();
//         };

//         useEffect(()=> {
//             if(placeToEdit) {
//                 setName(placeToEdit.name);
//                 setReference(placeToEdit.reference || '');
//                 setMaximumCapacityParticipants(placeToEdit.maximumCapacityParticipants || undefined);
//                 setIsPublic(placeToEdit.isPublic);
//             } else {
//                 clearForm();
//             }
//         }, [placeToEdit]);

//         return (
//             <Modal visible={visible}
//                 animationType="slide"
//                 transparent={true}
//                 onRequestClose={()=>{}}
//             >
//                 <ScrollView>
//                     <ThemedView style={styles.modalContainer}>
//                         <ThemedText style={styles.title}>{placeToEdit ? 'Editar Local' :'Adicionar novo Local'}</ThemedText>
                        
//                         <TextInput 
//                             style={[styles.input, validates.name && styles.inputError]}
//                             placeholder="Nome do local"
//                             value={name}
//                             onChangeText={setName}
//                         />
//                         {validates.name && <ThemedText style={styles.errorText}>{validates.name}</ThemedText>}

//                         <TextInput 
//                             style={styles.input}
//                             placeholder="Referência (Opcional)"
//                             value={reference}
//                             onChangeText={setReference}
//                         />

//                         <TextInput 
//                             style={[styles.input, validates.maximumCapacityParticipants && styles.inputError]}
//                             placeholder="Capacidade Máxima (Opcional)"
//                             keyboardType="numeric"
//                             value={maximumCapacityParticipants?.toString() || ''}
//                             onChangeText={(text) => setMaximumCapacityParticipants(Number(text))}
//                         />
//                         {validates.maximumCapacityParticipants && <ThemedText style={styles.errorText}>{validates.maximumCapacityParticipants}</ThemedText>}

//                         <ThemedView style={styles.switchContainer}>
//                             <ThemedText>Público:</ThemedText>
//                             <Switch value={isPublic} onValueChange={setIsPublic} />
//                         </ThemedView>

//                         <ThemedView style={styles.buttonContainer}>
//                             <Button title="Cancelar" onPress={onCancel} color='red' />
//                             <Button title="Confirmar" onPress={handleSave} color='green'/>
//                         </ThemedView>

//                     </ThemedView>

//                 </ScrollView>
//             </Modal>
//         )


//     };

// const styles = StyleSheet.create({
//     modalContainer: {
//         flex: 1,
//         padding: 16,
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         marginBottom: 16,
//         textAlign: 'center',
//     },
//     input: {
//         height: 40,
//         borderColor: '#ccc',
//         borderWidth: 1,
//         borderRadius: 4,
//         paddingHorizontal: 8,
//         marginBottom: 16,
//         backgroundColor: 'white'
//     },
//     inputError: {
//         borderColor: 'red',
//     },
//     switchContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         marginBottom: 16,
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     errorText: {
//         color: 'red',
//         marginBottom: 8,
//     },
// });

