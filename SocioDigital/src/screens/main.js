import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, ActivityIndicator } from 'react-native';
import { userDB, spaceDB, reservationDB } from '../../db/bd';
import * as Calendar from 'expo-calendar';

const TelaInicio = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasCalendarPermission, setHasCalendarPermission] = useState(false);

  useEffect(() => {
    loadData();
    requestCalendarPermission();
  }, []);

  const loadData = async () => {
    try {
      const user = await userDB.getCurrentUser();
      if (user) setUserName(user.name);
      
      const spacesData = await spaceDB.getAll();
      setSpaces(spacesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      Alert.alert('Erro', 'Não foi possível carregar os espaços');
    } finally {
      setLoading(false);
    }
  };

  const requestCalendarPermission = async () => {
    try {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      setHasCalendarPermission(status === 'granted');
    } catch (error) {
      console.error('Erro ao solicitar permissão:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await userDB.logout();
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleReserveSpace = async (space) => {
    if (!hasCalendarPermission) {
      Alert.alert('Permissão necessária', 'Por favor, conceda permissão para acessar o calendário');
      return;
    }

    try {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();
      
      const eventDetails = {
        title: `Reserva: ${space.name}`,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 horas depois
        timeZone: 'America/Sao_Paulo',
        location: 'Condomínio SocioDigital',
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
      
      await reservationDB.create({
        spaceId: space.id,
        spaceName: space.name,
        startDate: eventDetails.startDate.toISOString(),
        endDate: eventDetails.endDate.toISOString()
      });
      
      Alert.alert('Sucesso', `Espaço ${space.name} reservado com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      Alert.alert('Erro', 'Não foi possível realizar a reserva');
    }
  };

  const renderSpaceItem = ({ item }) => (
    <View style={styles.spaceContainer}>
      <Text style={styles.spaceTitle}>{item.name}</Text>
      <Text style={styles.spaceDescription}>{item.description}</Text>
      <TouchableOpacity 
        style={styles.reserveButton} 
        onPress={() => handleReserveSpace(item)}
        disabled={loading}
      >
        <Text style={styles.reserveButtonText}>Reservar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.welcome}>Bem-vindo, {userName || 'Usuário'}!</Text>
      <Text style={styles.title}>Reserve espaços no condomínio</Text>
      
      <FlatList
        data={spaces}
        renderItem={renderSpaceItem}
        keyExtractor={item => item.id.toString()}
        scrollEnabled={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  spaceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spaceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6200ee',
  },
  spaceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  reserveButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  reserveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#ff4444',
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TelaInicio;