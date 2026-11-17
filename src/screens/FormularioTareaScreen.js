import { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, ScrollView, KeyboardAvoidingView, Platform,
  Alert, StyleSheet, Image, Modal, FlatList, TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePreventRemove } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BotonAccion from '../components/BotonAccion';
import { colores } from '../theme/tema';
import { useTareasStore } from '../store/tareasStore';
import { elegirImagen, obtenerUbicacionActual, obtenerContactos } from '../services/recursosDispositivo';

const opcionesRecordatorio = [
  { etiqueta: 'Sin recordatorio', minutos: null },
  { etiqueta: '15 segundos', minutos: 0.25 },
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
  const tareas = useTareasStore((state) => state.tareas);
  const guardando = useTareasStore((state) => state.ocupado);
  const guardarEnStore = useTareasStore((state) => state.guardarTarea);
  const tareaId = route.params?.tareaId;
  const tareaEnEdicion = tareas.find((tarea) => tarea.id === tareaId);
  const [titulo, setTitulo] = useState(tareaEnEdicion?.titulo ?? '');
  const [recordatorioMinutos, setRecordatorioMinutos] = useState(tareaEnEdicion?.recordatorioMinutos ?? null);
  const [imagenUri, setImagenUri] = useState(tareaEnEdicion?.imagenUri ?? null);
  const [ubicacion, setUbicacion] = useState(tareaEnEdicion?.ubicacion ?? null);
  const [contacto, setContacto] = useState(tareaEnEdicion?.contacto ?? null);
  const [agendarCalendario, setAgendarCalendario] = useState(Boolean(tareaEnEdicion?.eventoCalendarioId));
  const [contactos, setContactos] = useState([]);
  const [mostrandoContactos, setMostrandoContactos] = useState(false);
  const [terminada, setTerminada] = useState(false);
  const bloqueo = useRef(false);

  usePreventRemove(guardando && !terminada, () => {
    Alert.alert('Guardando tarea', 'Esperá a que termine el guardado.');
  });

  useEffect(() => {
    if (terminada) navigation.goBack();
  }, [terminada, navigation]);

  async function capturar(origen) {
    try {
      const uri = await elegirImagen(origen);
      if (uri) setImagenUri(uri);
    } catch (error) {
      Alert.alert('No se pudo seleccionar la imagen', error.message);
    }
  }

  function elegirFoto() {
    Alert.alert('Adjuntar imagen', 'Elegí el origen de la foto.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cámara', onPress: () => capturar('camara') },
      { text: 'Galería', onPress: () => capturar('galeria') },
    ]);
  }

  async function tomarUbicacion() {
    try {
      setUbicacion(await obtenerUbicacionActual());
    } catch (error) {
      Alert.alert('No se pudo obtener la ubicación', error.message);
    }
  }

  async function abrirContactos() {
    try {
      const lista = await obtenerContactos();
      if (!lista.length) {
        Alert.alert('Contactos', 'No se encontraron contactos en el dispositivo.');
        return;
      }
      setContactos(lista);
      setMostrandoContactos(true);
    } catch (error) {
      Alert.alert('No se pudieron cargar los contactos', error.message);
    }
  }

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
    const opcion = opcionesRecordatorio.find((item) => item.minutos === recordatorioMinutos);
    if (!opcion) {
      Alert.alert('Recordatorio inválido', 'Seleccioná una opción de la lista.');
      return;
    }

    bloqueo.current = true;
    try {
      await guardarEnStore({
        id: tareaEnEdicion?.id, titulo: tituloLimpio, minutos: recordatorioMinutos,
        etiqueta: opcion.etiqueta, imagenUri, ubicacion, contacto, agendarCalendario,
      });
      setTerminada(true);
    } catch (error) {
      Alert.alert('No se pudo guardar', error.message || 'Intentá nuevamente.');
    } finally {
      bloqueo.current = false;
    }
  }

  return (
    <SafeAreaView edges={['left', 'right', 'bottom']} style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.contenedor} keyboardShouldPersistTaps="handled">
          <View style={styles.formulario}>
            <Text style={styles.etiqueta}>Título</Text>
            <TextInput
              style={styles.input} selectionColor={colores.coral} value={titulo}
              onChangeText={setTitulo} accessibilityLabel="Título de la tarea"
              editable={!guardando} autoFocus
            />
            <Text style={styles.etiqueta}>Recordarme dentro de</Text>
            <View style={styles.selector}>
              <Picker
                style={{ color: colores.texto }} dropdownIconColor={colores.coral}
                selectedValue={recordatorioMinutos} onValueChange={setRecordatorioMinutos}
                mode="dropdown" enabled={!guardando} accessibilityLabel="Tiempo del recordatorio"
              >
                {opcionesRecordatorio.map((opcion) => (
                  <Picker.Item key={String(opcion.minutos)} label={opcion.etiqueta} value={opcion.minutos} color={colores.texto} />
                ))}
              </Picker>
            </View>

            <Text style={styles.etiqueta}>Opcionales</Text>
            <View style={styles.recursos}>
              <BotonAccion secundario title={imagenUri ? 'Cambiar foto' : 'Adjuntar foto'} onPress={elegirFoto} disabled={guardando} />
              {imagenUri && <Image source={{ uri: imagenUri }} style={styles.preview} accessibilityLabel="Imagen asociada" />}
              <BotonAccion secundario title={ubicacion ? 'Actualizar ubicación' : 'Agregar ubicación'} onPress={tomarUbicacion} disabled={guardando} />
              {ubicacion && <Text style={styles.detalle}>{ubicacion.direccion || `${ubicacion.latitude.toFixed(5)}, ${ubicacion.longitude.toFixed(5)}`}</Text>}
              <BotonAccion secundario title={contacto ? 'Cambiar contacto' : 'Asociar contacto'} onPress={abrirContactos} disabled={guardando} />
              {contacto && <Text style={styles.detalle}>{contacto.nombre}{contacto.telefono ? ` · ${contacto.telefono}` : ''}</Text>}
              <BotonAccion secundario title={agendarCalendario ? 'Evento preparado' : 'Agregar al calendario'} onPress={() => setAgendarCalendario(true)} disabled={guardando || agendarCalendario} />
              {agendarCalendario && <Text style={styles.detalle}>Se creará un evento al guardar la tarea.</Text>}
            </View>

            <Text style={styles.aclaracion}>Los permisos se solicitan solamente cuando utilizás cada recurso.</Text>
            <View style={styles.acciones}>
              <View style={styles.accion}><BotonAccion secundario title="Cancelar" onPress={() => navigation.goBack()} disabled={guardando} /></View>
              <View style={styles.accion}><BotonAccion title={guardando ? 'Guardando...' : 'Guardar'} onPress={guardarTarea} disabled={guardando} /></View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={mostrandoContactos} transparent animationType="slide" onRequestClose={() => setMostrandoContactos(false)}>
        <View style={styles.modalFondo}>
          <View style={styles.modalTarjeta}>
            <Text style={styles.modalTitulo}>Seleccionar contacto</Text>
            <FlatList
              data={contactos} keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.contacto} onPress={() => { setContacto(item); setMostrandoContactos(false); }}>
                  <Text style={styles.contactoNombre}>{item.nombre}</Text>
                  {!!item.telefono && <Text style={styles.detalle}>{item.telefono}</Text>}
                </TouchableOpacity>
              )}
            />
            <BotonAccion secundario title="Cancelar" onPress={() => setMostrandoContactos(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colores.fondo },
  flex: { flex: 1 },
  contenedor: { flexGrow: 1, padding: 20, backgroundColor: colores.fondo },
  formulario: { backgroundColor: colores.superficie, borderRadius: 24, padding: 22, borderWidth: 1, borderColor: colores.borde },
  etiqueta: { marginBottom: 8, color: colores.secundario, fontWeight: '600' },
  input: { color: colores.texto, backgroundColor: colores.fondo, borderWidth: 1, borderColor: colores.borde, borderRadius: 14, padding: 14, fontSize: 16, marginBottom: 24 },
  selector: { backgroundColor: colores.elevado, borderWidth: 1, borderColor: colores.borde, borderRadius: 14, marginBottom: 20, overflow: 'hidden' },
  recursos: { gap: 10, marginBottom: 18 },
  preview: { width: 120, height: 90, borderRadius: 12, alignSelf: 'center', backgroundColor: colores.fondo },
  detalle: { color: colores.secundario, fontSize: 13, lineHeight: 19 },
  aclaracion: { fontSize: 13, color: colores.secundario, lineHeight: 21, marginBottom: 28 },
  acciones: { flexDirection: 'row', gap: 12 },
  accion: { flex: 1 },
  modalFondo: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  modalTarjeta: { maxHeight: '80%', backgroundColor: colores.superficie, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, gap: 12 },
  modalTitulo: { color: colores.texto, fontSize: 20, fontWeight: '700', marginBottom: 6 },
  contacto: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colores.borde },
  contactoNombre: { color: colores.texto, fontSize: 16, fontWeight: '600' },
});
