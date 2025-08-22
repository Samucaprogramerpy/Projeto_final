import 'react-native-gesture-handler';
import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Touchable, TouchableOpacity, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { obterToken, removerToken } from './services/servicoTokken';
import api from './api/api';

import TelaColaborador from './screens/telaColaborador';
import TelaLogin from './screens/telaLogin';
import Settings from './screens/telaConfigurações';
import Admin from './screens/telaAdm';
import Salas from './screens/telaAdminSalas';
import { Axios, AxiosError } from 'axios';

const pilha = createNativeStackNavigator();


export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);


  useEffect(() => {
    const verificarAutenticacao = async () =>{
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;


        setAutenticado(true)
      } else {
        setAutenticado(false);
        setIsAdmin(false)
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
          {isAdmin ? (
            <>
              <pilha.Screen name='Admin' options={({navigation}) => ({
                headerLeft : () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Configurações")}>
                    <Image style={styles.menu} source={require("./img/menu.png")}/>
                  </TouchableOpacity>
                )
              })}>
                {(props) => <Admin {...props} aoLogout={Logout} />}
              </pilha.Screen>
              <pilha.Screen name='Configurações'>
                {(props) => <Settings {...props} aoLogout={Logout} />}
              </pilha.Screen>
              <pilha.Screen name='adminSalas' component={Salas} options={{title : ('Salas')}}></pilha.Screen>
            </>
          ) : (
            <>
              <pilha.Screen name='Sala' options={({ navigation }) => ({
                title: 'Salas',
                headerRight : () => (
                  <TouchableOpacity onPress={() => navigation.navigate("Configurações")}>
                    <Image style={styles.settings} source={require("./img/settings.png")}></Image>
                  </TouchableOpacity>
                )
              })}>
                {(props) => <TelaColaborador {...props} />}
              </pilha.Screen>
              <pilha.Screen name='Configurações'>
                {(props) => <Settings {...props} aoLogout={Logout} />}
              </pilha.Screen>
            </>
          )}
          
        </pilha.Group>
      ) : (
        <pilha.Group>
          <pilha.Screen name='login'  options={{title : 'login'}}> 
            {(props) => <TelaLogin {...props} aoLoginSucesso={() => setAutenticado(true)} LoginAdmin={(eAdmin : boolean) => setIsAdmin(eAdmin)}/>}
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
  settings : {
    width : 25,
    height : 25,
    marginRight : 5
  },
  menu : {
    width : 25,
    height : 25,
    marginRight : 15
  }
});


