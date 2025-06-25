import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { verificarLoginClubeAPI } from '../services/api';

export default function LoginClube({ navigation }) {
  const [form, setForm] = useState({ email: '', senha: '' });

  const handleLogin = async () => {
    try {
      const res = await verificarLoginClubeAPI(form.email, form.senha);
      navigation.replace('Clube', { clube: res.clube });
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
      <Button title="Registrar-se" onPress={() => navigation.navigate('RegistroClube')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 5,
    padding: 10, marginBottom: 10,
  }
});
