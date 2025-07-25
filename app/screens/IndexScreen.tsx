import React from 'react';
import {View, Text, StyleSheet, ScrollView, StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActivities } from '../../context/ActivitiesContext';
import { useSubscriptions } from '../../context/SubscripitionContext';
import ActivityAgendaCard from "../../components/Activity/ActivityAgendaCard";

export default function HomePageScreen() {

  const { activities } = useActivities();
  const { inscricoes } = useSubscriptions();

  // Pegando apenas atividades onde estou inscrito
  const atividadesInscritas = activities.filter((a) => inscricoes.includes(a.id));

  // Pega a data de hoje (sem horário)
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Ordena as atividades inscritas pela data (do mais próximo para o mais distante)
  const proximasAtividades = atividadesInscritas
    .filter((a) => new Date(a.dataAtividade) >= hoje)
    .sort((a, b) => new Date(a.dataAtividade).getTime() - new Date(b.dataAtividade).getTime());

  const proximaData = proximasAtividades.length > 0 ? proximasAtividades[0].dataAtividade : null;

  const atividadesProximasDoDia = proximaData
    ? proximasAtividades.filter((a) => a.dataAtividade === proximaData)
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>SAPE</Text>
        <View style={styles.userSection}>
          <Text style={styles.userGreeting}>Olá, usuário</Text>
        </View>
      </View>

      {/* Location */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={20} color="#fff" />
        <Text style={styles.locationText}>IFPB - Campus Guarabira</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Anúncios */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          <View style={styles.bannerBox}><Text style={styles.bannerText}>1</Text></View>
          <View style={styles.bannerBox}><Text style={styles.bannerText}>2</Text></View>
          <View style={styles.bannerBox}><Text style={styles.bannerText}>3</Text></View>
        </ScrollView>

        {/* Próximo na agenda */}
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Próximo na sua agenda</Text>
        </View>

        <ActivityAgendaCard atividades={atividadesProximasDoDia} />
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  //... seus estilos da HomePageScreen aqui (copie os que já tem)
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32', // Verde escuro
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  userGreeting: {
    fontSize: 14,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2e7d32', // Verde institucional
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  locationText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  scrollContainer: {
    marginTop: 15,
    paddingBottom: 20,
  },
  sectionTitleContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  horizontalScroll: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  bannerBox: {
    width: 250,
    height: 140,
    backgroundColor: '#c8e6c9',
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
});
