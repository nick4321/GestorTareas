import { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import {
  programarRecordatorio,
  cancelarRecordatorio,
} from '../services/notificaciones';

const CLAVE_TAREAS = '@gestorTareas:tareas';

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
  const [guardando, setGuardando] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);
  const [formularioVisible, setFormularioVisible] = useState(false);
  const [tareaEnEdicion, setTareaEnEdicion] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [recordatorioMinutos, setRecordatorioMinutos] = useState(null);

  const colaGuardado = useRef(Promise.resolve());

  const pendientes = tareas.filter((tarea) => !tarea.completada).length;

  // Carga los datos guardados al abrir la pantalla.
  useEffect(() => {
    let activo = true;

    async function cargarTareas() {
      try {
        const contenido = await AsyncStorage.getItem(CLAVE_TAREAS);
        const tareasGuardadas =
          contenido === null ? [] : JSON.parse(contenido);

        if (!Array.isArray(tareasGuardadas)) {
          throw new Error('El listado guardado no es válido.');
        }

        if (activo) {
          setTareas(tareasGuardadas);
        }
      } catch {
        if (activo) {
          setErrorCarga(true);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    cargarTareas();

    // El efecto solo devuelve su función de limpieza.
    return () => {
      activo = false;
    };
  }, []);

  // Guarda los cambios una vez terminada la carga inicial.
  useEffect(() => {
    if (cargando || errorCarga) return;

    const contenido = JSON.stringify(tareas);

    colaGuardado.current = colaGuardado.current
      .then(() => AsyncStorage.setItem(CLAVE_TAREAS, contenido))
      .catch(() => {
        Alert.alert(
          'No se pudieron guardar los cambios',
          'Las tareas siguen visibles, pero estos cambios podrían perderse al cerrar.'
        );
      });
  }, [tareas, cargando, errorCarga]);

  async function cambiarEstado(id) {
    const tarea = tareas.find((item) => item.id === id);

    if (!tarea) return;

    try {
      if (!tarea.completada) {
        await cancelarRecordatorio(tarea.notificacionId);
      }

      setTareas((actuales) =>
        actuales.map((item) =>
          item.id === id
            ? {
                ...item,
                completada: !item.completada,
                notificacionId: null,
              }
            : item
        )
      );
    } catch {
      Alert.alert('Error', 'No se pudo cambiar el estado de la tarea.');
    }
  }

  function eliminarTarea(id) {
    Alert.alert('Eliminar tarea', '¿Querés eliminar esta tarea?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          const tarea = tareas.find((item) => item.id === id);

          if (!tarea) return;

          try {
            await cancelarRecordatorio(tarea.notificacionId);

            setTareas((actuales) =>
              actuales.filter((item) => item.id !== id)
            );
          } catch {
            Alert.alert('Error', 'No se pudo eliminar la tarea.');
          }
        },
      },
    ]);
  }

  function abrirNuevaTarea() {
    setTareaEnEdicion(null);
    setTitulo('');
    setRecordatorioMinutos(null);
    setFormularioVisible(true);
  }

  function abrirEdicion(tarea) {
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

    setGuardando(true);

    let nuevaNotificacionId = null;

    try {
      const completada = tareaEnEdicion?.completada ?? false;

      if (!completada && recordatorioMinutos !== null) {
        nuevaNotificacionId = await programarRecordatorio(
          tituloLimpio,
          recordatorioMinutos
        );
      }

      await cancelarRecordatorio(tareaEnEdicion?.notificacionId);

      const datos = {
        titulo: tituloLimpio,
        recordatorioMinutos,
        recordatorio:
          recordatorioMinutos === null
            ? null
            : `Dentro de ${opcion.etiqueta.replace(' (demo)', '')}`,
        notificacionId: nuevaNotificacionId,
      };

      if (tareaEnEdicion) {
        setTareas((actuales) =>
          actuales.map((tarea) =>
            tarea.id === tareaEnEdicion.id
              ? { ...tarea, ...datos }
              : tarea
          )
        );
      } else {
        setTareas((actuales) => [
          ...actuales,
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            ...datos,
            completada: false,
          },
        ]);
      }

      cerrarFormulario();
    } catch (error) {
      if (nuevaNotificacionId) {
        await cancelarRecordatorio(nuevaNotificacionId).catch(() => {});
      }

      Alert.alert(
        'No se pudo guardar',
        error.message || 'Intentá nuevamente.'
      );
    } finally {
      setGuardando(false);
    }
  }

  // Estos retornos pertenecen al componente, fuera de useEffect.
  if (cargando) {
    return (
      <View style={styles.contenedor}>
        <Text>Cargando tareas...</Text>
      </View>
    );
  }

  if (errorCarga) {
    return (
      <View style={styles.contenedor}>
        <Text>
          No se pudieron leer las tareas guardadas. Recargá la aplicación
          para intentar nuevamente.
        </Text>
      </View>
    );
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