import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@socio_digital_user';

export const salvarUsuario = async (usuario) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(usuario));
};

export const buscarUsuario = async () => {
  const data = await AsyncStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};
