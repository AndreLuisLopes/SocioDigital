import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { buscarUsuario } from '../database/bd';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', senha: '' });

  const handleLogin = async () => {
    const usuario = await buscarUsuario();
    if (!usuario) return Alert.alert('Erro', 'Usuário não encontrado.');

    if (form.email === usuario.email && form.senha === usuario.senha) {
      navigation.replace('Main');
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={v => setForm({ ...form, email: v })} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={v => setForm({ ...form, senha: v })} />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Registrar-se" onPress={() => navigation.navigate('Registro')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
    padding: 10, marginBottom: 10,
  },
});
