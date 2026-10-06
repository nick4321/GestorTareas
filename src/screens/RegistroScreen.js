import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import BotonAccion from '../components/BotonAccion';
import { colores, formularioStyles as styles } from '../theme/tema';

import { registrarUsuario } from '../services/autenticacion';

export default function RegistroScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [registrando, setRegistrando] = useState(false);

  async function registrar() {
    if (registrando) return;

    setRegistrando(true);

    try {
      await registrarUsuario(usuario, contraseña);

      Alert.alert(
        'Cuenta creada',
        'Ya podés iniciar sesión con tu usuario.',
        [{ text: 'Ir al login', onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert('No se pudo registrar', error.message);
    } finally {
      setRegistrando(false);
    }
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colores.fondo }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
          <View style={styles.tarjeta}>
            <Text style={styles.marca}>TU ESPACIO</Text>
            <Text style={styles.titulo}>Empezá por acá.</Text>
            <Text style={styles.subtitulo}>Creá una cuenta para organizar tus tareas.</Text>
            <Text style={styles.etiqueta}>Usuario</Text>
            <TextInput style={styles.input} placeholder="Elegí un usuario" placeholderTextColor={colores.tenue}
              selectionColor={colores.coral} accessibilityLabel="Usuario" value={usuario}
              onChangeText={setUsuario} autoCapitalize="none" autoCorrect={false} editable={!registrando} />
            <Text style={styles.etiqueta}>Contraseña</Text>
            <TextInput style={styles.input} placeholder="Mínimo 4 caracteres" placeholderTextColor={colores.tenue}
              selectionColor={colores.coral} accessibilityLabel="Contraseña" value={contraseña}
              onChangeText={setContraseña} secureTextEntry autoCapitalize="none" autoCorrect={false} editable={!registrando} />
            <BotonAccion title={registrando ? 'Registrando...' : 'Crear mi cuenta'} onPress={registrar} disabled={registrando} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
