import { useState } from 'react';
import { View, Text, TextInput, Button, Switch, Alert, StyleSheet } from 'react-native';
import { useSesion } from '../context/SesionContext';

export default function LoginScreen({ navigation }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [mantener, setMantener] = useState(false);
  const { ingresar, ocupado } = useSesion();

  async function entrar() {
    try { await ingresar(usuario, contraseña, mantener); }
    catch (error) { Alert.alert('No se pudo ingresar', error.message); }
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Gestor de tareas</Text>
      <TextInput style={styles.input} placeholder="Usuario" accessibilityLabel="Usuario"
        value={usuario} onChangeText={setUsuario} autoCapitalize="none"
        autoCorrect={false} editable={!ocupado} />
      <TextInput style={styles.input} placeholder="Contraseña" accessibilityLabel="Contraseña"
        value={contraseña} onChangeText={setContraseña} secureTextEntry
        autoCapitalize="none" autoCorrect={false} editable={!ocupado} />
      <View style={styles.fila}>
        <Switch value={mantener} onValueChange={setMantener} disabled={ocupado}
          accessibilityLabel="Mantener sesión iniciada" />
        <Text>Mantener sesión iniciada</Text>
      </View>
      <Button title={ocupado ? 'Ingresando...' : 'Ingresar'} onPress={entrar} disabled={ocupado} />
      <View style={{ marginTop: 16 }}>
        <Button title="Crear cuenta" onPress={() => navigation.navigate('Registro')} disabled={ocupado} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#f2f2f2' },
  titulo: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 24 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 16 },
  fila: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
});
