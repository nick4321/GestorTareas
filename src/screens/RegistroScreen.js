import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';

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
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Crear cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        accessibilityLabel="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!registrando}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña (mínimo 4 caracteres)"
        accessibilityLabel="Contraseña"
        value={contraseña}
        onChangeText={setContraseña}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        editable={!registrando}
      />

      <Button
        title={registrando ? 'Registrando...' : 'Registrarme'}
        onPress={registrar}
        disabled={registrando}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f2f2',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
});