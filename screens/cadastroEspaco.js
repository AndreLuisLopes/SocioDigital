import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { cadastrarEspacoAPI } from '../services/api';

export default function CadastroEspaco() {
  const [tipo, setTipo] = useState('churrasqueira');
  const [nome, setNome] = useState('');
  const [capacidade, setCapacidade] = useState('');
  const [subtipo, setSubtipo] = useState('');

  const limparCampos = () => {
    setNome('');
    setCapacidade('');
    setSubtipo('');
  };

  const handleSalvar = async () => {
    let payload = { nome };

    if (tipo === 'quadra') {
      payload.tipo = subtipo;
    } else if (tipo === 'salao') {
      payload.capacidade = parseInt(capacidade);
    }

    try {
      const data = await cadastrarEspacoAPI(tipo, payload);
      Alert.alert('Sucesso', data.mensagem || 'Espaço cadastrado com sucesso!');
      limparCampos();
    } catch (error) {
      Alert.alert('Erro', error.message || 'Não foi possível cadastrar o espaço.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tipo de espaço:</Text>
      <Picker selectedValue={tipo} onValueChange={(itemValue) => setTipo(itemValue)}>
        <Picker.Item label="Churrasqueira" value="churrasqueira" />
        <Picker.Item label="Quadra" value="quadra" />
        <Picker.Item label="Salão" value="salao" />
      </Picker>

      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />

      {tipo === 'quadra' && (
        <TextInput
          style={styles.input}
          placeholder="Tipo da quadra (ex: futsal)"
          value={subtipo}
          onChangeText={setSubtipo}
        />
      )}

      {tipo === 'salao' && (
        <TextInput
          style={styles.input}
          placeholder="Capacidade"
          keyboardType="numeric"
          value={capacidade}
          onChangeText={setCapacidade}
        />
      )}

      <Button title="Cadastrar Espaço" onPress={handleSalvar} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { marginTop: 10, marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
