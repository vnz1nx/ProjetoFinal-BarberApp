import React from 'react';
import { StatusBar} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from './components/LoginUsuario/SplashScreen';
import LoginUsuario from './components/LoginUsuario/LoginUsuario';
import CadastroUsuario from './components/LoginUsuario/CadastroUsuario';
import HomeApp from './components/Principal/HomeApp';
import Cortes from './components/Barbearia/Cortes';
import AgendarCortes from './components/Barbearia/AgendarCortes';
import Agendamentos from './components/Principal/Agendamentos';
import PerfilUsuario from './components/Principal/PerfilUsuario';
import SplashScreen2 from './components/Principal/SplashScreen2';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen 
          name="SplashScreen" 
          component={SplashScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="LoginUsuario" 
          component={LoginUsuario} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="CadastroUsuario" 
          component={CadastroUsuario} 
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen 
          name="HomeApp" 
          component={HomeApp} 
          options={{ 
            headerShown: false, 
            title: "",
          }}
        />
        <Stack.Screen 
          name="Cortes" 
          component={Cortes}
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen 
          name="AgendarCortes" 
          component={AgendarCortes}
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTransparent: true,
          }}
        />
        <Stack.Screen 
          name="SplashScreen2" 
          component={SplashScreen2}
          options={{ headerShown: false
          }}
        />
        <Stack.Screen 
          name="Agendamentos" 
          component={Agendamentos}
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTransparent:true,
          }}
        />
        <Stack.Screen 
          name="PerfilUsuario" 
          component={PerfilUsuario}
          options={{
            headerTitle: '',
            headerBackTitleVisible: false,
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
