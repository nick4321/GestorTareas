import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

import TaskItem from '../components/TaskItem';
import { useSesion } from '../context/SesionContext';

export default function HomeScreen({ navigation }) {
  const { tareas, ocupado: guardando,
    cambiarEstado: cambiarEnSesion, eliminarTarea: eliminarEnSesion } = useSesion();

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
    if (!guardando) navigation.navigate('FormularioTarea');
  }

  function abrirEdicion(tarea) {
    if (!guardando) navigation.navigate('FormularioTarea', { tareaId: tarea.id });
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
});
