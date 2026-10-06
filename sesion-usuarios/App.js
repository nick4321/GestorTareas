import { Button, Text, View, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import { SesionProvider, useSesion } from './src/context/SesionContext';

const Stack = createNativeStackNavigator();

function PantallaHome() {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
      <HomeScreen />
    </SafeAreaView>
  );
}

function Navegacion() {
  const { sesion, cargando, ocupado, errorInicio, reintentar, salir } = useSesion();
  async function cerrarSesion() {
    try { await salir(); }
    catch (error) { Alert.alert('No se pudo cerrar sesión', error.message); }
  }

  if (cargando || errorInicio) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <Text>{cargando ? 'Cargando sesión...' : errorInicio}</Text>
        {!cargando && <Button title="Reintentar" onPress={reintentar} />}
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {sesion ? (
          <Stack.Group navigationKey={sesion.usuario}>
            <Stack.Screen name="Home" component={PantallaHome} options={{
              title: `Hola, ${sesion.usuario}`,
              headerRight: () => <Button title="Salir" onPress={cerrarSesion} disabled={ocupado} />,
            }} />
          </Stack.Group>
        ) : (
          <Stack.Group navigationKey="invitado">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Registro" component={RegistroScreen} options={{ title: 'Registro' }} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SesionProvider><Navegacion /></SesionProvider>
    </SafeAreaProvider>
  );
}
