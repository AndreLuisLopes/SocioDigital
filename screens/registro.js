import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { salvarUsuarioAPI } from '../services/api';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', confirmar: '' });

  const handleChange = (key, value) => setForm({ ...form, [key]: value });

  const handleRegister = async () => {
      const { nome, email, senha, confirmar } = form;
  
      if (!nome || !email || !senha || senha !== confirmar) {
        Alert.alert('Erro', 'Preencha todos os campos corretamente.');
        return;
      }
  
      try {
        await salvarUsuarioAPI({ nome, email, senha });
        Alert.alert('Cadastro realizado!', 'Usuário registrado com sucesso.', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } catch (error) {
        Alert.alert('Erro', 'Erro ao registrar usuário. Verifique a conexão ou tente novamente.');
      }
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