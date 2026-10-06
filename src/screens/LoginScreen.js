import { useState } from 'react';
import { View, Text, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import BotonAccion from '../components/BotonAccion';
import { colores, formularioStyles as styles } from '../theme/tema';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colores.fondo }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
          <View style={styles.tarjeta}>
            <Text style={styles.marca}>GESTOR DE TAREAS</Text>
            <Text style={styles.titulo}>Hola de nuevo.</Text>
            <Text style={styles.subtitulo}>Un lugar para tus pendientes y recordatorios.</Text>
            <Text style={styles.etiqueta}>Usuario</Text>
            <TextInput style={styles.input} placeholder="Tu usuario" placeholderTextColor={colores.tenue}
              selectionColor={colores.coral} accessibilityLabel="Usuario" value={usuario}
              onChangeText={setUsuario} autoCapitalize="none" autoCorrect={false} editable={!ocupado} />
            <Text style={styles.etiqueta}>Contraseña</Text>
            <TextInput style={styles.input} placeholder="Tu contraseña" placeholderTextColor={colores.tenue}
              selectionColor={colores.coral} accessibilityLabel="Contraseña" value={contraseña}
              onChangeText={setContraseña} secureTextEntry autoCapitalize="none" autoCorrect={false} editable={!ocupado} />
            <View style={styles.fila}>
              <Switch value={mantener} onValueChange={setMantener} disabled={ocupado}
                trackColor={{ false: colores.borde, true: colores.indigo }} thumbColor={mantener ? colores.coral : colores.secundario}
                accessibilityLabel="Mantener sesión iniciada" />
              <Text style={styles.texto}>Mantener sesión iniciada</Text>
            </View>
            <BotonAccion title={ocupado ? 'Ingresando...' : 'Ingresar'} onPress={entrar} disabled={ocupado} />
            <View style={{ marginTop: 12 }}>
              <BotonAccion title="Crear cuenta" secundario onPress={() => navigation.navigate('Registro')} disabled={ocupado} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
