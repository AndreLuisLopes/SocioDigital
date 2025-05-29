import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@socio_digital_user';
const RESERVAS_KEY = '@socio_digital_reservas';

export const salvarUsuario = async (usuario) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const buscarUsuario = async () => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const adicionarReserva = async (reserva) => {
  const data = await AsyncStorage.getItem(RESERVAS_KEY);
  const reservas = data ? JSON.parse(data) : [];
  reservas.push(reserva);
  await AsyncStorage.setItem(RESERVAS_KEY, JSON.stringify(reservas));
};

export const listarReservas = async () => {
  const data = await AsyncStorage.getItem(RESERVAS_KEY);
  return data ? JSON.parse(data) : [];
};
