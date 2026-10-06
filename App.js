import { Button, Text, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import FormularioTareaScreen from './src/screens/FormularioTareaScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegistroScreen from './src/screens/RegistroScreen';
import BotonSalir from './src/components/BotonSalir';
import { colores } from './src/theme/tema';
import { SesionProvider, useSesion } from './src/context/SesionContext';

const Stack = createNativeStackNavigator();

function PantallaHome(props) {
  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colores.fondo }}>
      <HomeScreen {...props} />
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
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', padding: 24, backgroundColor: colores.fondo }}>
        <Text style={{ color: colores.texto }}>{cargando ? 'Cargando sesión...' : errorInicio}</Text>
        {!cargando && <Button title="Reintentar" onPress={reintentar} />}
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerStyle: { backgroundColor: colores.fondo },
        headerTintColor: colores.texto,
        headerTitleStyle: { fontWeight: '600' },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colores.fondo },
      }}>
        {sesion ? (
          <Stack.Group navigationKey={sesion.usuario}>
            <Stack.Screen name="Home" component={PantallaHome} options={{
              title: `Hola, ${sesion.usuario}`,
              headerRight: () => <BotonSalir onPress={cerrarSesion} disabled={ocupado} />,
            }} />
            <Stack.Screen
              name="FormularioTarea"
              component={FormularioTareaScreen}
              options={({ route }) => ({
                title: route.params?.tareaId ? 'Editar tarea' : 'Nueva tarea',
                gestureEnabled: false,
              })}
            />
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
      <StatusBar style="light" />
      <SesionProvider><Navegacion /></SesionProvider>
    </SafeAreaProvider>
  );
}
