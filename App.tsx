import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Image} from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'

const dimencaoLargura = Dimensions.get('window').width;
const dimencaoAltura = Dimensions.get('window').height

import { obterToken, removerToken } from './services/servicoTokken';
import api from './api/api';

import TelaColaborador from './screens/telaColaborador';
import TelaLogin from './screens/telaLogin';
import Settings from './screens/telaConfigurações';
import Admin from './screens/telaAdm';
import Salas from './screens/telaAdminSalas';
import Users from './screens/telaUsers';
import load from './screens/telaLoad';
import TelaDetalhesSalas from './screens/telaDetalhesSalas';


const tab = createBottomTabNavigator()


export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);





  useEffect(() => {
    const verificarAutenticacao = async () =>{
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const veriricacao = await api.get('accounts/current_user', {})
        const superUser =  veriricacao.data.is_superuser

        if (superUser === true) {
          setIsAdmin(true)
          setAutenticado(true)
        } else {
          setIsAdmin(false)
          setAutenticado(true)
        }

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
    <tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Sala') {
            iconName = focused ? 'home' : 'home-outline';
          }else if (route.name === 'adminSalas') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Configurações') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'Users') {
              iconName = focused ? 'person' : 'person-outline';
          }
          return (
                <Ionicons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: '#F7941D',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: { paddingBottom: 5, height: 60, backgroundColor: '#004A8D' },
      })}
    >
      {autenticado ? (
        isAdmin ? (
          // Telas para o usuário Admin
          <tab.Group>
            <tab.Screen name="Admin" options={{ title: 'Painel Admin',  headerStyle:{backgroundColor : '#004A8D', borderBottomWidth : 2, borderColor : '#F7941D'}, headerTitleStyle:{color : 'white'}, sceneStyle:{width : dimencaoLargura * 1, height : dimencaoAltura * 0.4}}}>
              {(props) => <Admin {...props} aoLogout={Logout} />}
            </tab.Screen>
            <tab.Screen name="adminSalas" component={Salas} options={{ title: 'Salas', headerStyle:{backgroundColor : '#004A8D', borderBottomWidth : 2, borderColor : '#F7941D'}, headerTitleStyle:{color : 'white'}}} />
            <tab.Screen name="Users" component={Users} options={{headerStyle:{backgroundColor : '#004A8D', borderBottomWidth : 2, borderColor : '#F7941D'}, headerTitleStyle:{color : 'white'}}} />
            <tab.Screen name="Configurações" options={{ title: 'Painel Admin',  headerStyle:{backgroundColor : '#004A8D', borderBottomWidth : 2, borderColor : '#F7941D'}, headerTitleStyle:{color : 'white'}}}>
              {(props) => <Settings {...props} aoLogout={Logout} />}
            </tab.Screen>
            <tab.Screen name="DetalhesSalas" component={TelaDetalhesSalas} options={{tabBarItemStyle : {display : 'none'}}}></tab.Screen>
          </tab.Group>
        ) : (
          // Telas para o usuário Colaborador
          <tab.Group>
            <tab.Screen name="Sala" options={{ title: 'Salas', headerStyle:{backgroundColor : '#004A8D', borderBottomWidth : 2, borderColor : '#F7941D'}, headerTitleStyle:{color : 'white' }}}>
              {(props) => <TelaColaborador {...props} />}
            </tab.Screen>
            <tab.Screen name="Configurações" options={{ headerStyle:{backgroundColor : '#004A8D', borderBottomWidth : 2, borderColor : '#F7941D'}, headerTitleStyle:{color : 'white' }}}>
              {(props) => <Settings {...props} aoLogout={Logout} />}
            </tab.Screen>
          </tab.Group>
        )
      ) : (
        // Tela de login para o usuário não autenticado
        <tab.Group>
          <tab.Screen name="Login" options={{ headerShown: false, tabBarButton: () => null,  tabBarStyle : {display : 'none'} }}>
            {(props) => <TelaLogin {...props} aoLoginSucesso={() => setAutenticado(true)} LoginAdmin={(eAdmin: boolean) => setIsAdmin(eAdmin)} />}
          </tab.Screen>
        </tab.Group>
      )}
    </tab.Navigator>
  </NavigationContainer>
);
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
    marginRight : 15,
  },

});


