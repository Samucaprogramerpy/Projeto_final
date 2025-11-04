import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import React from 'react';
import { useState, useEffect } from 'react';
import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { MenuProvider } from 'react-native-popup-menu';

import { obterToken, removerToken } from './services/servicoTokken';
import api from './api/api';

import TelaColaborador from './screens/telaColaborador';
import TelaLogin from './screens/telaLogin';
import Settings from './screens/telaConfigurações';
import Salas from './screens/telaAdminSalas';
import Users from './screens/telaUsers';
import TelaDetalhesSalas from './screens/telaDetalhesSalas';
import GraficoPizza from './screens/telaGrafico';
import { black } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

function AdminTabNavigator({Logout} : {Logout : () => Promise<void>}) {

  const insets = useSafeAreaInsets();

  return (
    <tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Salas') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Usuários') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          else if (route.name === 'Dados') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }
          return (
            <View style={{backgroundColor : focused ? '#F7941D' : 'transparent', padding : 8, width : 65, borderRadius : 10, alignItems : 'center'}}>
                <Ionicons name={iconName} size={22} color={color} />
                <Text style={{color: focused ? 'black' : 'rgba(65, 64, 64, 0.81)', fontSize : 12}}>{route.name}</Text>
            </View>

          );
        },
        tabBarShowLabel : false,
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
        tabBarIndicatorStyle:{backgroundColor : 'transparent'},
        tabBarStyle: { height: 80, backgroundColor: 'white', width : '100%', alignItems : 'center'},
        tabBarItemStyle : {borderWidth : 1, borderColor : 'transparent', alignItems : 'center'},
        swipeEnabled: true,
      })}
    >
      <tab.Screen name="Salas" component={Salas}/>
      <tab.Screen name="Usuários" component={Users} />
      <tab.Screen name='Dados' component={GraficoPizza}/>
      <tab.Screen name="Perfil">
        {(props) => <Settings {...props} aoLogout={Logout}/>}
      </tab.Screen>
      
    </tab.Navigator>
  );
}

function UserTabNavigator({Logout} : {Logout : () => Promise<void>}) {

  return (
    <tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon : ({focused, color, size}) => {
          let iconName;
          if (route.name === 'Sala') {
            iconName = focused ? 'school' : 'school-outline'
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return (
            <View style={{backgroundColor : focused ? '#F7941D' : 'transparent', padding : 10, borderRadius : 10, marginBottom : 5, alignItems : 'center', width : 75}}>
                <Ionicons name={iconName} size={size} color={'black'} />
                <Text style={{color: 'black', fontSize : 12}}>{route.name}</Text>
            </View>

          );
        },
        tabBarLabel : false,
        tabBarActiveTintColor: '#F7941D',
        tabBarInactiveTintColor: 'black',
        tabBarIndicatorStyle:{backgroundColor : 'transparent'},
        tabBarStyle: { paddingBottom: 5, height: 85, backgroundColor: 'white', borderTopWidth : 0.15, borderTopColor: 'black'},
        tabBarItemStyle : {borderWidth : 2, borderColor : 'transparent', borderRadius : 8, marginHorizontal : 6, flex : 1},
        swipeEnabled: true,
      })}
    >
      <tab.Screen name="Sala" component={TelaColaborador}/>
      <tab.Screen name="Perfil">
        {(props) => <Settings {...props} aoLogout={Logout}/>}
      </tab.Screen>
    </tab.Navigator>
  );
}

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const Logout = async () => {
      await removerToken();
      delete api.defaults.headers.common['Authorization'];
      setAutenticado(false);
  };

  useEffect(() => {
    const verificarAutenticacao = async () => {
      const token = await obterToken();
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const veriricacao = await api.get('accounts/current_user', {});
        const superUser = veriricacao.data.is_superuser;

        if (superUser === true) {
          setIsAdmin(true);
          setAutenticado(true);
        } else {
          setIsAdmin(false);
          setAutenticado(true);
        }
      } else {
        setAutenticado(false);
        setIsAdmin(false);
      }
      setCarregandoInicial(false);
    };
    verificarAutenticacao();
  }, []);



  if (carregandoInicial) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
      </View>
    );
  }

  return (
    <MenuProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {autenticado ? (
            isAdmin ? (
              <>
                <Stack.Screen name="AdminTabs">
                  {(props) => <AdminTabNavigator {...props} Logout={Logout}/>}
                </Stack.Screen>
                <Stack.Screen name="DetalhesSalas" component={TelaDetalhesSalas} />
              </>
            ) : (
              <>
                <Stack.Screen name="UserTabs">
                  {(props) => <UserTabNavigator {...props} Logout={Logout}/>}
                </Stack.Screen>
              </>
            )
          ) : (
            <Stack.Screen name="Login">
              {(props) => (
                <TelaLogin
                  {...props}
                  aoLoginSucesso={() => setAutenticado(true)}
                  LoginAdmin={(eAdmin: boolean) => setIsAdmin(eAdmin)}
                />
              )}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </MenuProvider>
  );
}



const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#aaa',
    padding: 8,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 8,
  },
  labelActive: {
    color: '#fff',
    borderColor: '#fff', // A borda branca aparece na aba ativa
  },
});