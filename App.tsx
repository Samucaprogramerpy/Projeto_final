import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import {
  createMaterialTopTabNavigator,
  MaterialTopTabBarProps,
  MaterialTopTabBar,
} from '@react-navigation/material-top-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { obterToken, removerToken } from './services/servicoTokken';
import api from './api/api';

import TelaColaborador from './screens/telaColaborador';
import TelaLogin from './screens/telaLogin';
import Settings from './screens/telaConfigurações';
import Admin from './screens/telaAdm';
import Salas from './screens/telaAdminSalas';
import Users from './screens/telaUsers';
import TelaDetalhesSalas from './screens/telaDetalhesSalas';

const tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();


function AdminTabNavigator() {
    const [autenticado, setAutenticado] = useState<boolean | null>(null);
    
    const Logout = async () => {
    await removerToken();
    delete api.defaults.headers.common['Authorization'];
    setAutenticado(false);
  };

  return (
    <tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Admin') {
            iconName = focused ? 'shield-checkmark' : 'shield-checkmark-outline';
          } else if (route.name === 'adminSalas') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Users') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Configurações') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F7941D',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: { paddingBottom: 5, height: 70, backgroundColor: '#004A8D' },
        swipeEnabled: true,
      })}
    >
      <tab.Screen name="Admin" component={Admin} />
      <tab.Screen name="Users" component={Users} />
      <tab.Screen name="Configurações">
        {(props) => <Settings {...props} aoLogout={Logout}/>}
      </tab.Screen>
    </tab.Navigator>
  );
}

function UserTabNavigator() {


  return (
    <tab.Navigator
      tabBarPosition="bottom"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Sala') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Configurações') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#F7941D',
        tabBarInactiveTintColor: 'white',
        tabBarStyle: { paddingBottom: 5, height: 70, backgroundColor: '#004A8D' },
        swipeEnabled: true,
      })}
    >
      <tab.Screen name="Sala" component={TelaColaborador} />
      <tab.Screen name="Configurações">
        {(props) => <Settings {...props} aoLogout={Logout}/>}
      </tab.Screen>
    </tab.Navigator>
  );
}

export default function App() {
  const [autenticado, setAutenticado] = useState<boolean | null>(null);
  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

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

  const Logout = async () => {
    await removerToken();
    delete api.defaults.headers.common['Authorization'];
    setAutenticado(false);
  };

  if (carregandoInicial) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#004A8D" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {autenticado ? (
          isAdmin ? (
            <>
              <Stack.Screen name="AdminTabs">
                {(props) => <AdminTabNavigator {...props}/>}
              </Stack.Screen>
              <Stack.Screen name="adminSalas" component={Salas} />
              <Stack.Screen name="DetalhesSalas" component={TelaDetalhesSalas} />
            </>
          ) : (
            <>
              <Stack.Screen name="UserTabs">
                {(props) => <UserTabNavigator {...props}/>}
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
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});