import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useActivities } from "@/context/ActivitiesContext";

export default function ConfirmacaoPresenca() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { confirmPresence, cancelPresence, isConfirmed } = useActivities();
  const [status, setStatus] = useState<'pending' | 'confirmed' | 'cancelled'>(
    isConfirmed(params.activityId as string) ? 'confirmed' : 'pending'
  );

  const handleConfirm = () => {
  if (params.activityId) {
    confirmPresence(params.activityId as string);
    setStatus('confirmed');
    Alert.alert("Confirmado", "Sua presença foi registrada com sucesso!");
  }
};

const handleCancel = () => {
  if (params.activityId) {
    cancelPresence(params.activityId as string);
    setStatus('cancelled');
    Alert.alert("Cancelado", "Sua presença foi cancelada.");
  }
};

  const handleGoBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirmar Presença</Text>
      
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{params.activityTitle}</Text>
        <Text style={styles.eventDetail}>Data: {new Date(params.activityDate as string).toLocaleDateString()}</Text>
        <Text style={styles.eventDetail}>Horário: {params.activityTime}</Text>
        <Text style={styles.statusText}>
          Status: {status === 'confirmed' ? '✅ Confirmado' : status === 'cancelled' ? '❌ Cancelado' : '🔄 Pendente'}
        </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.confirmButton, status === 'confirmed' && styles.buttonDisabled]}
          onPress={handleConfirm}
          disabled={status === 'confirmed'}
        >
          <Text style={styles.buttonText}>Confirmar Presença</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.cancelButton, status === 'cancelled' && styles.buttonDisabled]}
          onPress={handleCancel}
          disabled={status === 'cancelled'}
        >
          <Text style={styles.buttonText}>Cancelar Presença</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.backButton]}
          onPress={handleGoBack}
        >
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  eventInfo: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  buttonsContainer: {
    gap: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  backButton: {
    backgroundColor: "#2196F3",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});