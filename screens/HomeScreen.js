import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  const irParaLoginUsuario = (tipo) => {
    navigation.navigate('Login', { tipo });
  };

  const irParaLoginClube = (tipo) => {
    navigation.navigate('LoginClube', { tipo });
  };
  return (
    <View style={styles.container}>
      < Image
        source={require('../assets/LogoSemFundo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.titulo}>Bem-vindo ao SocioDigital</Text>

      <TouchableOpacity style={styles.botao} onPress={() => irParaLoginUsuario('usuario')}>
        <Text style={styles.textoBotao}>Sou Usuário</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botao} onPress={() => irParaLoginClube('clube')}>
        <Text style={styles.textoBotao}>Sou Clube</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 30 },
  logo: { width: 200, height: 200, marginBottom: 40 },
  botao: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center'
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
