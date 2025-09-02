import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, StatusBar, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useActivities } from '../../context/ActivitiesContext';
import { useSubscriptions } from '../../context/SubscripitionContext';
import { useAuth } from '../../context/AuthContext';
import { useMenu } from '../../context/MenuContext';
import ActivityCard from '../../components/Activity/ActivityCard';

export default function HomePageScreen() {
  const { toggleMenu } = useMenu();
  const { activities } = useActivities();
  const { inscrever, desinscrever, estaInscrito } = useSubscriptions();
  const { user } = useAuth();

  const [search, setSearch] = useState('');
  const [atividadesFiltradas, setAtividadesFiltradas] = useState(activities);

  // Filtrar atividades conforme pesquisa
  useEffect(() => {
    const filtered = activities.filter((atividade) =>
      atividade.titulo.toLowerCase().includes(search.toLowerCase())
    );
    setAtividadesFiltradas(filtered);
  }, [search, activities]);

  function handleInscrever(id: string) {
    if (estaInscrito(id)) {
      desinscrever(id);
    } else {
      inscrever(id);
    }
  }

  const getFirstName = () => {
    if (!user?.name) return 'usuário';
    return user.name.split(' ')[0];
  };

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={{ marginTop: 10, fontSize: 16 }}>Carregando usuário...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={28}
          color="#2e7d32"
          onPress={toggleMenu}
        />
        <View style={styles.userSection}>
          <Text style={styles.userGreeting}>Olá, {getFirstName()}</Text>
        </View>
      </View>

      {/* Localização */}
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={20} color="#fff" />
        <Text style={styles.locationText}>IFPB - Campus Guarabira</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Anúncios */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          <View style={styles.bannerBox}><Text style={styles.bannerText}>1</Text></View>
          <View style={styles.bannerBox}><Text style={styles.bannerText}>2</Text></View>
          <View style={styles.bannerBox}><Text style={styles.bannerText}>3</Text></View>
        </ScrollView>

        <View style={styles.searchContainer}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Buscar Atividades</Text>
          </View>

          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color="#888" />
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {atividadesFiltradas.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma atividade encontrada.</Text>
          ) : (
            atividadesFiltradas.map((item) => (
              <ActivityCard
                key={item.id}
                item={item}
                showInscrever={true}
                onInscrever={() => handleInscrever(item.id)}
                inscrito={estaInscrito(item.id)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  appName: { fontSize: 22, fontWeight: 'bold', color: '#2e7d32' },
  userSection: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  userGreeting: { fontSize: 14, color: '#333' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2e7d32', paddingVertical: 8, paddingHorizontal: 20 },
  locationText: { color: '#fff', fontSize: 14, marginLeft: 8 },
  scrollContainer: { marginTop: 15, paddingBottom: 20 },
  searchContainer: { paddingHorizontal: 20 },
  horizontalScroll: { paddingHorizontal: 10, marginTop: 10 },
  bannerBox: { width: 250, height: 140, backgroundColor: '#c8e6c9', borderRadius: 12, marginRight: 10, alignItems: 'center', justifyContent: 'center' },
  bannerText: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32' },
  sectionTitleContainer: { marginTop: 30, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', paddingHorizontal: 12, borderRadius: 20, height: 40, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: '#555' },
  emptyText: { fontSize: 16, color: '#999', textAlign: 'center', marginTop: 20 },
});
