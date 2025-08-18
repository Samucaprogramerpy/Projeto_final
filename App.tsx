import 'react-native-gesture-handler';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { obterToken, removerToken } from './services/servicoTokken';
import api from './api/api';

import telaAluno from './screens/telaAluno';
import TelaLogin from './screens/telaLogin';
import telaProfessor from './screens/telaProfessor';

const pilha = createNativeStackNavigator();




export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);

  useEffect(() => {
    const verificarAutenticacao = async () =>{
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        setAutenticado(true);
      } else {
        setAutenticado(false)
      }
      setCarregandoInicial(false);
    };
    verificarAutenticacao();
  }, [])

  const Logout = async () => {
    await removerToken();
    delete api.defaults.headers.common["Authorization"];
    setAutenticado(false);
  }

  if (carregandoInicial){
    return(
      <View>
        <ActivityIndicator/>
      </View>
    )
  }

  return (
    <NavigationContainer>
      <pilha.Navigator>
      {autenticado ? (
        <pilha.Group>
          <pilha.Screen name='Aluno' component={telaAluno}></pilha.Screen>
          <pilha.Screen name='Professor' component={telaProfessor}></pilha.Screen>
        </pilha.Group>
      ) : (
        <pilha.Group>
          <pilha.Screen name='Login' options={{title : 'login'}}> 
            {(props) => <TelaLogin {...props} aoLoginSucesso={() => setAutenticado(true)} />}
          </pilha.Screen>
        </pilha.Group>
      )}
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
