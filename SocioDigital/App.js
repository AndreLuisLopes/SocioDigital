import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TelaLogin from './src/screens/TelaLogin';
import TelaRegistro from './src/screens/TelaRegistro';
import main from './src/screens/main';
import { initDatabase } from './db/bd';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    initDatabase();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={TelaLogin} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Registro" 
          component={TelaRegistro} 
          options={{ title: 'Cadastro' }} 
        />
        <Stack.Screen 
          name="Inicio" 
          component={main} 
          options={{ headerLeft: null }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}