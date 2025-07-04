import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { verificarLoginUsuarioAPI } from '../services/api';

export default function LoginScreen({ navigation }) {
  const [form, setForm] = useState({ email: '', senha: '' });

  const handleLogin = async () => {
      try {
        const res = await verificarLoginUsuarioAPI(form.email, form.senha);
        navigation.replace('Main', { usuario: res.usuario });
      } catch (error) {
        Alert.alert('Erro', error.message || 'Falha ao fazer login');
      }
    };

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        onChangeText={(v) => setForm({ ...form, email: v })}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        onChangeText={(v) => setForm({ ...form, senha: v })}
      />

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
  label: {
    fontWeight: 'bold',
    marginBottom: 5
  },
  picker: {
    marginBottom: 15
  }
});
