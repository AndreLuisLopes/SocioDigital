import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { salvarUsuario } from '../database/bd';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
    const { nome, email, senha, confirmar } = form;

    if (!nome || !email || !senha || senha !== confirmar) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
      return;
    }

    await salvarUsuario({ nome, email, senha });
    Alert.alert('Cadastro realizado!', 'Você já pode fazer login.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Nome" onChangeText={v => handleChange('nome', v)} />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" onChangeText={v => handleChange('email', v)} />
      <TextInput style={styles.input} placeholder="Senha" secureTextEntry onChangeText={v => handleChange('senha', v)} />
      <TextInput style={styles.input} placeholder="Confirmar Senha" secureTextEntry onChangeText={v => handleChange('confirmar', v)} />
      <Button title="Cadastrar" onPress={handleRegister} />
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
