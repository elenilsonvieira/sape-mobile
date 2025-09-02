import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define um tipo para os nomes dos ícones, para segurança de tipo.
type IconName = React.ComponentProps<typeof Ionicons>["name"];

// Cores específicas para os tipos de alerta
const alertColors = {
  delete: "#d32f2f", // Vermelho para exclusão
  default: "#2e7d32", // Verde para os demais tipos
};

// Configuração para cada tipo de alerta
const alertConfig = {
  success: {
    icon: "checkmark-circle" as IconName,
    color: alertColors.default,
  },
  warning: {
    icon: "warning" as IconName,
    color: alertColors.default,
  },
  error: {
    icon: "close-circle" as IconName,
    color: alertColors.default,
  },
  confirm: {
    icon: "help-circle" as IconName,
    color: alertColors.default,
  },
  delete: {
    icon: "trash-outline" as IconName,
    color: alertColors.delete,
  },
  logout: {
    icon: "log-out-outline" as IconName,
    color: alertColors.default,
  },
};

// Define os tipos para as props do componente
export type AlertType = keyof typeof alertConfig;

interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  type?: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  closeText?: string;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  type = "success",
  onClose,
  onConfirm,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  closeText = "OK",
}) => {
  const config = alertConfig[type];
  const isConfirmation = type === "confirm" || type === "delete" || type === "logout";

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertContainer}>
          {/* O ícone agora tem um tamanho padrão e usa a cor da configuração */}
          <Ionicons name={config.icon} size={50} color={config.color} />
          {/* O título agora usa a mesma cor do ícone */}
          <Text style={[styles.title, { color: config.color }]}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.buttonContainer}>
            {isConfirmation ? (
              <>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={onClose}
                >
                  <Text style={[styles.buttonText, styles.cancelButtonText]}>
                    {cancelText}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { backgroundColor: config.color }]}
                  onPress={onConfirm}
                >
                  <Text style={styles.buttonText}>{confirmText}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: config.color, flex: 0.8 }]}
                onPress={onClose}
              >
                <Text style={styles.buttonText}>{closeText}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  alertContainer: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666666", // Cor secundária para o texto da mensagem
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD", // Cor da borda
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButtonText: {
    color: "#666666", // Cor do texto para o botão de cancelar
  },
});

export default CustomAlert;
