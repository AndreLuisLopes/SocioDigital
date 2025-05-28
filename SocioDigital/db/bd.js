import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USERS: '@sociodigital_users',
  SPACES: '@sociodigital_spaces',
  RESERVATIONS: '@sociodigital_reservations',
  CURRENT_USER: '@sociodigital_current_user'
};

export const initDatabase = async () => {
  try {
    const spaces = await AsyncStorage.getItem(STORAGE_KEYS.SPACES);
    if (!spaces) {
      const defaultSpaces = [
        { id: 1, name: 'Churrasqueira', description: 'Área para churrasco com capacidade para 20 pessoas', image: null },
        { id: 2, name: 'Quadra Poliesportiva', description: 'Quadra para futebol, vôlei e basquete', image: null },
        { id: 3, name: 'Salão de Festas', description: 'Salão climatizado com cozinha e área de serviço', image: null },
        { id: 4, name: 'Piscina', description: 'Piscina adulto e infantil com área de solarium', image: null },
        { id: 5, name: 'Sala de Jogos', description: 'Espaço com mesa de sinuca, ping-pong e jogos de tabuleiro', image: null }
      ];
      await AsyncStorage.setItem(STORAGE_KEYS.SPACES, JSON.stringify(defaultSpaces));
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export const userDB = {
  register: async (userData, callback) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = data ? JSON.parse(data) : [];
      
      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email já cadastrado');
      }
      
      const newUser = { 
        ...userData, 
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      
      if (callback) callback(newUser);
      return newUser;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  login: async (email, password, callback) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users = data ? JSON.parse(data) : [];
      
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }
      
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      
      if (callback) callback(user);
      return user;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  getCurrentUser: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
  
  logout: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
};

export const spaceDB = {
  getAll: async () => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SPACES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting spaces:', error);
      return [];
    }
  },
  
  getById: async (id) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SPACES);
      const spaces = data ? JSON.parse(data) : [];
      return spaces.find(space => space.id === id);
    } catch (error) {
      console.error('Error getting space by ID:', error);
      return null;
    }
  }
};

export const reservationDB = {
  create: async (reservationData, callback) => {
    try {
      const currentUser = await userDB.getCurrentUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      const reservations = data ? JSON.parse(data) : [];
      
      const newReservation = {
        ...reservationData,
        id: Date.now(),
        userId: currentUser.id,
        createdAt: new Date().toISOString(),
        status: 'confirmed'
      };
      
      reservations.push(newReservation);
      await AsyncStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
      
      if (callback) callback(newReservation);
      return newReservation;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },
  
  getUserReservations: async () => {
    try {
      const currentUser = await userDB.getCurrentUser();
      if (!currentUser) return [];
      
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      const reservations = data ? JSON.parse(data) : [];
      
      return reservations.filter(reservation => reservation.userId === currentUser.id);
    } catch (error) {
      console.error('Error getting user reservations:', error);
      return [];
    }
  },
  
  cancel: async (reservationId, callback) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.RESERVATIONS);
      const reservations = data ? JSON.parse(data) : [];
      
      const updatedReservations = reservations.map(reservation => {
        if (reservation.id === reservationId) {
          return { ...reservation, status: 'cancelled' };
        }
        return reservation;
      });
      
      await AsyncStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(updatedReservations));
      
      if (callback) callback();
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      throw error;
    }
  }
};

export default {
  initDatabase,
  userDB,
  spaceDB,
  reservationDB
};