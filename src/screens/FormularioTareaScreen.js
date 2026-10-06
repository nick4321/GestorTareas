import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePreventRemove } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotonAccion from '../components/BotonAccion';
import { colores } from '../theme/tema';
import { useSesion } from '../context/SesionContext';

const opcionesRecordatorio = [
  { etiqueta: 'Sin recordatorio', minutos: null },
  { etiqueta: '15 Segundos (demo)', minutos: 0.25 },
  { etiqueta: '2 minutos', minutos: 2 },
  { etiqueta: '15 minutos', minutos: 15 },
  { etiqueta: '30 minutos', minutos: 30 },
  { etiqueta: '1 hora', minutos: 60 },
  { etiqueta: '2 horas', minutos: 120 },
  { etiqueta: '6 horas', minutos: 360 },
  { etiqueta: '12 horas', minutos: 720 },
  { etiqueta: '1 día', minutos: 1440 },
  { etiqueta: '2 días', minutos: 2880 },
  { etiqueta: '1 semana', minutos: 10080 },
  { etiqueta: '2 semanas', minutos: 20160 },
];

export default function FormularioTareaScreen({ navigation, route }) {
  const { tareas, ocupado: guardando, guardarTarea: guardarEnSesion } = useSesion();
  const tareaId = route.params?.tareaId;
  const tareaEnEdicion = tareas.find((tarea) => tarea.id === tareaId);
  const [titulo, setTitulo] = useState(tareaEnEdicion?.titulo ?? '');
  const [recordatorioMinutos, setRecordatorioMinutos] = useState(tareaEnEdicion?.recordatorioMinutos ?? null);
  const [terminada, setTerminada] = useState(false);
  const bloqueo = useRef(false);

  usePreventRemove(guardando && !terminada, () => {
    Alert.alert('Guardando tarea', 'Esperá a que termine el guardado.');
  });

  useEffect(() => {
    if (terminada) navigation.goBack();
  }, [terminada, navigation]);

  async function guardarTarea() {
    if (guardando || bloqueo.current) return;
    if (tareaId && !tareaEnEdicion) {
      Alert.alert('Tarea inexistente', 'Volvé al listado e intentá nuevamente.');
      return;
    }

    const tituloLimpio = titulo.trim();

    if (!tituloLimpio) {
      Alert.alert('Falta el título', 'Ingresá un título para la tarea.');
      return;
    }

    const opcion = opcionesRecordatorio.find(
      (item) => item.minutos === recordatorioMinutos
    );

    if (!opcion) {
      Alert.alert('Recordatorio inválido', 'Seleccioná una opción de la lista.');
      return;
    }

    bloqueo.current = true;
    try {
      await guardarEnSesion({
        id: tareaEnEdicion?.id,
        titulo: tituloLimpio,
        minutos: recordatorioMinutos,
        etiqueta: opcion.etiqueta,
      });
      setTerminada(true);
    } catch (error) {
      Alert.alert('No se pudo guardar', error.message || 'Intentá nuevamente.');
    } finally {
      bloqueo.current = false;
    }
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1, backgroundColor: colores.fondo }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
          <View style={styles.formulario}>
            <Text style={styles.marca}>{tareaId ? 'AJUSTÁ TU PENDIENTE' : 'UN NUEVO PENDIENTE'}</Text>
            <Text style={styles.subtitulo}>Dale un título y elegí tu recordatorio.</Text>
            <Text style={styles.etiqueta}>Título</Text>

            <TextInput
              style={styles.input}
              placeholderTextColor={colores.tenue}
              selectionColor={colores.coral}
              value={titulo}
              onChangeText={setTitulo}
              placeholder="Por ejemplo: estudiar React Native"
              accessibilityLabel="Título de la tarea"
              editable={!guardando}
              autoFocus
            />

            <Text style={styles.etiqueta}>Recordarme dentro de</Text>

            <View style={styles.selector}>
              <Picker
                style={{ color: colores.texto }}
                dropdownIconColor={colores.coral}
                selectedValue={recordatorioMinutos}
                onValueChange={setRecordatorioMinutos}
                mode="dropdown"
                enabled={!guardando}
                accessibilityLabel="Tiempo del recordatorio"
              >
                {opcionesRecordatorio.map((opcion) => (
                  <Picker.Item
                    key={String(opcion.minutos)}
                    label={opcion.etiqueta}
                    value={opcion.minutos}
                    color={colores.texto}
                    style={{ backgroundColor: colores.superficie }}
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.aclaracion}>
              Para tareas pendientes, el recordatorio se programa desde
              el momento en que guardás.
            </Text>

            <View style={styles.acciones}>
              <View style={{ flex: 1 }}><BotonAccion
                secundario
                title="Cancelar"
                onPress={() => navigation.goBack()}
                disabled={guardando}
              /></View>

              <View style={{ flex: 1 }}><BotonAccion
                title={guardando ? 'Guardando...' : 'Guardar'}
                onPress={guardarTarea}
                disabled={guardando}
              /></View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: { flexGrow: 1, padding: 20, backgroundColor: colores.fondo },
  formulario: { backgroundColor: colores.superficie, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colores.borde },
  marca: { color: colores.magenta, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  subtitulo: { color: colores.secundario, fontSize: 16, lineHeight: 24, marginBottom: 26 },
  etiqueta: { marginBottom: 8, color: colores.secundario, fontWeight: '600' },
  input: { color: colores.texto, backgroundColor: colores.fondo, borderWidth: 1, borderColor: colores.borde, borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 24 },
  selector: { backgroundColor: colores.elevado, borderWidth: 1, borderColor: colores.borde, borderRadius: 14, marginBottom: 16, overflow: 'hidden' },
  aclaracion: { fontSize: 13, color: colores.secundario, lineHeight: 21, marginBottom: 28 },
  acciones: { flexDirection: 'row', gap: 12 },
});
