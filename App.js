import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/login';
import RegisterScreen from './screens/registro';
import MainScreen from './screens/main';
import LoginClube from './screens/loginClube';
import RegistroClube from './screens/registroClube';
import Clube from './screens/clube';
import CadastroEspaco from './screens/cadastroEspaco';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: '' }} />
        <Stack.Screen name="LoginClube" component={LoginClube} options={{ title: '' }} />
        <Stack.Screen name="Registro" component={RegisterScreen} options={{ title: '' }} />
        <Stack.Screen name="RegistroClube" component={RegistroClube} options={{ title: '' }} />
        <Stack.Screen name="Clube" component={Clube} options={{ title: '' }} />
        <Stack.Screen name="Main" component={MainScreen} options={{ title: '' }} />
        <Stack.Screen name="CadastroEspaco" component={CadastroEspaco} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
