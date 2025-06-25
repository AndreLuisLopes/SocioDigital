
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function Clube({ navigation, route }) {
  const clube = route?.params?.clube;

  return (
    <View style={styles.container}>
      {clube?.nome && (
        <Text style={{ textAlign: 'center', marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>
          Bem-vindo(a), {clube.nome}!
        </Text>
      )}
      <Text style={styles.subtitle}>Gerencie seus espaços aqui:</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Cadastrar Espaço"
          onPress={() => navigation.navigate('CadastroEspaco')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '80%',
  },
});
