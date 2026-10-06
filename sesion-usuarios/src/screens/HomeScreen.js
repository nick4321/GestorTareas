import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Modal,
  Alert,
  StyleSheet,
} from 'react-native';

import TaskItem from '../components/TaskItem';
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

export default function HomeScreen() {
  const { tareas, ocupado: guardando, guardarTarea: guardarEnSesion,
    cambiarEstado: cambiarEnSesion, eliminarTarea: eliminarEnSesion } = useSesion();
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [recordatorioMinutos, setRecordatorioMinutos] = useState(null);

  const pendientes = tareas.filter((tarea) => !tarea.completada).length;

  async function cambiarEstado(id) {
    try { await cambiarEnSesion(id); }
    catch (error) { Alert.alert('Error', error.message); }
  }

  function eliminarTarea(id) {
    if (guardando) return;
    Alert.alert('Eliminar tarea', '¿Querés eliminar esta tarea?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: async () => {
        try { await eliminarEnSesion(id); }
        catch (error) { Alert.alert('Error', error.message); }
      } },
    ]);
  }

  function abrirNuevaTarea() {
    if (guardando) return;
    setTareaEnEdicion(null);
    setTitulo('');
    setRecordatorioMinutos(null);
    setFormularioVisible(true);
  }

  function abrirEdicion(tarea) {
    if (guardando) return;
    setTareaEnEdicion(tarea);
    setTitulo(tarea.titulo);
    setRecordatorioMinutos(tarea.recordatorioMinutos ?? null);
    setFormularioVisible(true);
  }

  function cerrarFormulario() {
    setFormularioVisible(false);
    setTareaEnEdicion(null);
    setTitulo('');
    setRecordatorioMinutos(null);
  }

  async function guardarTarea() {
    if (guardando) return;

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

    try {
      await guardarEnSesion({
        id: tareaEnEdicion?.id,
        titulo: tituloLimpio,
        minutos: recordatorioMinutos,
        etiqueta: opcion.etiqueta,
      });
      cerrarFormulario();
    } catch (error) {
      Alert.alert('No se pudo guardar', error.message || 'Intentá nuevamente.');
    }
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Mis tareas</Text>

      <Text style={styles.resumen}>
        {pendientes === 1
          ? 'Tenés 1 tarea pendiente'
          : `Tenés ${pendientes} tareas pendientes`}
      </Text>

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={abrirNuevaTarea}
        accessibilityRole="button"
      >
        <Text style={styles.textoAgregar}>+ Agregar tarea</Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} pointerEvents={guardando ? 'none' : 'auto'}>
      <FlatList
        data={tareas}
        keyExtractor={(tarea) => tarea.id}
        renderItem={({ item }) => (
          <TaskItem
            tarea={item}
            onCompletar={cambiarEstado}
            onEliminar={eliminarTarea}
            onEditar={abrirEdicion}
          />
        )}
        contentContainerStyle={styles.lista}
        ListEmptyComponent={
          <Text style={styles.listaVacia}>
            No tenés tareas. ¡Agregá la primera!
          </Text>
        }
      />
      </View>

      <Modal
        visible={formularioVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!guardando) cerrarFormulario();
        }}
      >
        <View style={styles.fondoModal}>
          <View style={styles.formulario}>
            <Text style={styles.tituloFormulario}>
              {tareaEnEdicion ? 'Editar tarea' : 'Nueva tarea'}
            </Text>

            <Text style={styles.etiqueta}>Título</Text>

            <TextInput
              style={styles.input}
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
                  />
                ))}
              </Picker>
            </View>

            <Text style={styles.aclaracion}>
              Para tareas pendientes, el recordatorio se programa desde
              el momento en que guardás.
            </Text>

            <View style={styles.acciones}>
              <Button
                title="Cancelar"
                onPress={cerrarFormulario}
                disabled={guardando}
              />

              <Button
                title={guardando ? 'Guardando...' : 'Guardar'}
                onPress={guardarTarea}
                disabled={guardando}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222222',
  },
  resumen: {
    marginTop: 8,
    marginBottom: 20,
    color: '#666666',
  },
  botonAgregar: {
    alignSelf: 'center',
    backgroundColor: '#1565c0',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
  },
  textoAgregar: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lista: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  listaVacia: {
    marginTop: 40,
    textAlign: 'center',
    color: '#666666',
    fontSize: 16,
  },
  fondoModal: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  formulario: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
  },
  tituloFormulario: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  etiqueta: {
    marginBottom: 6,
    color: '#333333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbbbbb',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  aclaracion: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 16,
  },
  acciones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selector: {
    borderWidth: 1,
    borderColor: '#bbbbbb',
    borderRadius: 6,
    marginBottom: 16,
  },
});