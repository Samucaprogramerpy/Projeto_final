import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import telaAluno from './screens/telaAluno';
import telaLogin from './screens/telaLogin';

const pilha = createNativeStackNavigator();


export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);



  return (
    <NavigationContainer>
      <pilha.Navigator initialRouteName='Home'>
        <pilha.Screen name='Tela de Login' options={{title: 'tela Login'}}>
          {(props) => <telaLogin {...props}/>}
        </pilha.Screen>
      </pilha.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
