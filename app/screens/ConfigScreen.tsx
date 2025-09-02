import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useMenu } from '../../context/MenuContext';
import CustomAlert, { type AlertType } from '../../components/alerts/CustumAlert';

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  type: AlertType;
  onClose: () => void;
  onConfirm?: () => void;
}

type ItemProps = {
  icon: React.ReactElement;
  title: string;
  subtitle?: string;
  onPress: () => void;
};

const Item: React.FC<ItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.item} onPress={onPress}>
    {icon}
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
    <MaterialIcons name="keyboard-arrow-right" size={24} color="#2e7d32" />
  </TouchableOpacity>
);

export default function ConfigScreen() {
  const router = useRouter();
  const { closeMenu } = useMenu();

  const [alertInfo, setAlertInfo] = useState<AlertState>({
    visible: false,
    title: "",
    message: "",
    type: "success",
    onClose: () => {},
  });

  const isAdmin = true;

  const handleCloseAlert = () => {
    setAlertInfo({ ...alertInfo, visible: false });
  };

  const performLogout = () => {
    try {
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao sair:', error);
      setAlertInfo({
        visible: true,
        title: "Erro",
        message: "Não foi possível fazer logout.",
        type: "error",
        onClose: handleCloseAlert,
      });
    }
  };

  const handleLogoutConfirmation = () => {
    closeMenu();
    setAlertInfo({
      visible: true,
      title: "Sair da Conta",
      message: "Você tem certeza que deseja sair?",
      type: "logout",
      onClose: handleCloseAlert,
      onConfirm: () => {
        handleCloseAlert();
        performLogout();
      },
    });
  };

  type RoutePaths =
    | "/screens/admin/EsportesScreen"
    | "/screens/admin/LocaisScreen"
    | "/screens/admin/HorariosScreen";

  const handleNavigation = (path: RoutePaths) => {
    closeMenu();
    router.push(path);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Configurações</Text>

      {isAdmin && (
        <>
          <Item
            icon={<FontAwesome5 name="futbol" size={22} color="#2e7d32" />}
            title="Gerenciar Esportes"
            onPress={() => handleNavigation("/screens/admin/EsportesScreen")}
          />

          <Item
            icon={<Ionicons name="location-outline" size={24} color="#2e7d32" />}
            title="Gerenciar Locais"
            onPress={() => handleNavigation("/screens/admin/LocaisScreen")}
          />

          <Item
            icon={<MaterialIcons name="schedule" size={24} color="#2e7d32" />}
            title="Gerenciar Horários"
            onPress={() => handleNavigation("/screens/admin/HorariosScreen")}
          />
        </>
      )}

      <Item
        icon={<MaterialIcons name="logout" size={24} color="#2e7d32" />}
        title="Sair da conta"
        onPress={handleLogoutConfirmation}
      />

      <CustomAlert
        visible={alertInfo.visible}
        title={alertInfo.title}
        message={alertInfo.message}
        type={alertInfo.type}
        onClose={alertInfo.onClose}
        onConfirm={alertInfo.onConfirm}
        confirmText="Sair"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#2e7d32',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});