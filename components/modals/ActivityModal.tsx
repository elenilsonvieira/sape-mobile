import React, { useState, useEffect } from 'react';
import { TextInput, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import IActivity from '@/interfaces/IActivity';
import { ISport } from '@/interfaces/ISport';
import IPlace from '@/interfaces/IPlace';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';


export type ActivityModalProps = {
    visible: boolean;
    onCancel: () => void;
    onAdd: (activity: IActivity) => void;
    onDelete?: () => void;
    activityToEdit?: IActivity | null;
    sports: ISport[];
    places: IPlace[];
}

export default function ActivityModal({
    visible, onAdd, onCancel, onDelete, activityToEdit, sports, places
    }: ActivityModalProps){
        const [selectedSport, setSelectedSport] = useState('');
        const [selectedPlace, setSelectedPlace] = useState('');
        
        const [titulo, setTitulo] = useState('');
        const [dateAtividade, setDateAtividade] = useState(new Date());
        const [timeStart, setTimeStart] = useState(new Date());
        const [timeFinish, setTimeFinish] = useState(new Date());
        const [showDatePicker, setShowDatePicker] = useState(false);
        const [showTimeStartPicker, setShowTimeStartPicker] = useState(false);
        const [showTimeFinishPicker, setShowTimeFinishPicker] = useState(false);

        useEffect(()=>{
            if(activityToEdit){
                setTitulo(activityToEdit.titulo);
                
                // Parse da data
                let parsedDate: Date;
                const storedDate = activityToEdit.dataAtividade;
                parsedDate = new Date(storedDate);
                
                if (isNaN(parsedDate.getTime())) {
                    const dateParts = storedDate.split('/');
                    if (dateParts.length === 3) {
                        const day = parseInt(dateParts[0], 10);
                        const month = parseInt(dateParts[1], 10) - 1;
                        const year = parseInt(dateParts[2], 10);
                        parsedDate = new Date(year, month, day);
                    } else {
                        parsedDate = new Date();
                    }
                }
                setDateAtividade(parsedDate);

                // Parse dos horários
                const [startHours, startMinutes] = activityToEdit.atividadeStartTime.split(':');
                const parsedStartTime = new Date();
                parsedStartTime.setHours(parseInt(startHours, 10));
                parsedStartTime.setMinutes(parseInt(startMinutes, 10));
                setTimeStart(parsedStartTime);

                const [finishHours, finishMinutes] = activityToEdit.atividadeFinishTime.split(':');
                const parsedFinishTime = new Date();
                parsedFinishTime.setHours(parseInt(finishHours, 10));
                parsedFinishTime.setMinutes(parseInt(finishMinutes, 10));
                setTimeFinish(parsedFinishTime);

                setSelectedPlace(activityToEdit.placeId);
                setSelectedSport(activityToEdit.sportId);
            } else {
                clearForm();
            }
        }, [activityToEdit])

        const clearForm = () => {
            setTitulo('');
            setSelectedPlace('');
            setSelectedSport('');
            setDateAtividade(new Date());
            setTimeStart(new Date());
            setTimeFinish(new Date());
        }

        const handleSaveActivity = () => {
            const newActivity: IActivity = {
                id: activityToEdit ? activityToEdit.id : (Math.random() * 1000).toString(),
                titulo,
                sportId: selectedSport,
                placeId: selectedPlace,
                dataAtividade: dateAtividade.toISOString(),
                atividadeStartTime: `${timeStart.getHours().toString().padStart(2, '0')}:${timeStart.getMinutes().toString().padStart(2, '0')}`,
                atividadeFinishTime: `${timeFinish.getHours().toString().padStart(2, '0')}:${timeFinish.getMinutes().toString().padStart(2, '0')}`
            };

            onAdd(newActivity);
            onCancel();
        }

        const handleDelete = () => {
            if(onDelete){
                onDelete();
                onCancel();
            }
        }

        return (
            <Modal visible={visible}
                animationType='slide'
                transparent={true}
                onRequestClose={()=>{}}
            >
                <ThemedView style={styles.container}>
                    <ThemedText style={styles.title}>{ activityToEdit ? 'Editar Ativididade' : 'Nova Atividade' }</ThemedText>

                    <TextInput 
                        style={styles.input}
                        placeholder='Título da atividade'
                        value={titulo}
                        onChangeText={setTitulo}
                    />

                    <ThemedView style={styles.pickerContainer}>
                        <Picker 
                            selectedValue={selectedSport}
                            onValueChange={(itemValue) => setSelectedSport(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione um esporte" value="" />
                            {sports.map((sport) => (
                                <Picker.Item 
                                    key={sport.id}
                                    label={sport.name}
                                    value={sport.id}
                                />
                            ))}
                        </Picker>
                    </ThemedView>

                    <ThemedView style={styles.pickerContainer}>
                        <Picker 
                            selectedValue={selectedPlace}
                            onValueChange={setSelectedPlace}
                            style={styles.picker}
                        >
                            <Picker.Item label="Selecione um local" value="" />
                            {places.map((place) => (
                                <Picker.Item 
                                    key={place.id}
                                    label={place.name}
                                    value={place.id}
                                />
                            ))}
                        </Picker>
                    </ThemedView>

                    <ThemedView style={styles.datetimeContainer}>
                        <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowDatePicker(true)}>
                            <ThemedText>
                                {`📅 Data Atividade: ${dateAtividade.toLocaleDateString()}`}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView style={styles.datetimeContainer}>
                        <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowTimeStartPicker(true)}>
                            <ThemedText>
                                {`⏰ Hora de Inicio: ${timeStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    <ThemedView style={styles.datetimeContainer}>
                        <TouchableOpacity style={styles.datetimeButton} onPress={() => setShowTimeFinishPicker(true)}>
                            <ThemedText>
                                {`⏰ Hora de Fim: ${timeFinish.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>

                    {showDatePicker && (
                        <DateTimePicker
                            value={dateAtividade}
                            mode='date'
                            display='default'
                            onChange={(_, selectedDate) => {
                                setShowDatePicker(false);
                                selectedDate && setDateAtividade(selectedDate);
                            }}
                        />
                    )}

                    {showTimeStartPicker && (
                        <DateTimePicker
                            value={timeStart}
                            mode='time'
                            display='default'
                            onChange={(_, selectedTime) => {
                                setShowTimeStartPicker(false);
                                selectedTime && setTimeStart(selectedTime);
                            }}
                        />
                    )}

                    {showTimeFinishPicker && (
                        <DateTimePicker
                            value={timeFinish}
                            mode='time'
                            display='default'
                            onChange={(_, selectedTime) => {
                                setShowTimeFinishPicker(false);
                                selectedTime && setTimeFinish(selectedTime);
                            }}
                        />
                    )}

                    <ThemedView style={styles.buttonContainer}>
                        <Button title="Cancelar" onPress={onCancel} color='darkorange' />
                        {activityToEdit && (
                            <Button 
                                title="Deletar" 
                                onPress={handleDelete} 
                                color="red" 
                            />
                        )}
                        <Button title="Confirmar" onPress={handleSaveActivity} color='green'/>
                    </ThemedView>
                </ThemedView>
            </Modal>
        )
    }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50,
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
    backgroundColor: 'white'
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
  buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
  },
  datetimeButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 4,
  },
});