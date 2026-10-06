import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

import BotonAccion from '../components/BotonAccion';
import { colores } from '../theme/tema';

import TaskItem from '../components/TaskItem';
import { useSesion } from '../context/SesionContext';

export default function HomeScreen({ navigation }) {
  const { tareas, ocupado: guardando,
    cambiarEstado: cambiarEnSesion, eliminarTarea: eliminarEnSesion } = useSesion();

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('Todas');
  const visibles = tareas.filter((tarea) =>
    tarea.titulo.toLocaleLowerCase().includes(busqueda.trim().toLocaleLowerCase()) &&
    (filtro === 'Todas' || (filtro === 'Pendientes' ? !tarea.completada : tarea.completada))
  );

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
      <View style={styles.resumenTarjeta}>
        <Text style={styles.resumen}>
          {pendientes === 0 ? 'Todo al día.' : pendientes === 1 ? '1 pendiente por resolver.' : `${pendientes} pendientes por resolver.`}
        </Text>
      </View>
      <TextInput style={styles.buscador} value={busqueda} onChangeText={setBusqueda}
        placeholder="Buscar una tarea..." placeholderTextColor={colores.tenue}
        selectionColor={colores.coral} accessibilityLabel="Buscar tareas" autoCorrect={false} />
      <View style={styles.filtros}>
        {['Todas', 'Pendientes', 'Completadas'].map((nombre) => (
          <TouchableOpacity key={nombre} onPress={() => setFiltro(nombre)}
            accessibilityRole="button" accessibilityState={{ selected: filtro === nombre }}
            style={[styles.filtro, filtro === nombre && styles.filtroActivo]}>
            <Text style={[styles.textoFiltro, filtro === nombre && styles.textoFiltroActivo]}>{nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ flex: 1 }} pointerEvents={guardando ? 'none' : 'auto'}>
        <FlatList data={visibles} keyExtractor={(tarea) => tarea.id}
          keyboardShouldPersistTaps="handled" contentContainerStyle={styles.lista}
          renderItem={({ item }) => <TaskItem tarea={item} onCompletar={cambiarEstado} onEliminar={eliminarTarea} onEditar={abrirEdicion} />}
          ListEmptyComponent={
            <View style={styles.vacio}>
              <Text style={styles.vacioTitulo}>{tareas.length ? 'Sin coincidencias' : 'Un espacio por llenar'}</Text>
              <Text style={styles.vacioTexto}>{tareas.length ? 'Probá otra búsqueda o cambiá el filtro.' : 'Agregá tu primera tarea y elegí cuándo querés recordarla.'}</Text>
            </View>
          }
        />
      </View>
      <View style={styles.accion}>
        <BotonAccion title="＋ Agregar tarea" onPress={abrirNuevaTarea} disabled={guardando} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: { flex: 1, paddingHorizontal: 20, paddingTop: 14, backgroundColor: colores.fondo },
  resumenTarjeta: { padding: 22, borderRadius: 22, backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde, marginBottom: 20 },
  marca: { color: colores.magenta, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  resumen: { color: colores.texto, fontSize: 25, lineHeight: 32, fontWeight: '700' },
  detalle: { color: colores.secundario, marginTop: 10, fontSize: 13 },
  buscador: { backgroundColor: colores.superficie, borderWidth: 1, borderColor: colores.borde, borderRadius: 14, padding: 14, color: colores.texto, fontSize: 15, marginBottom: 14 },
  filtros: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  filtro: { paddingHorizontal: 14, paddingVertical: 12, minHeight: 44, backgroundColor: colores.elevado, borderRadius: 22 },
  filtroActivo: { backgroundColor: colores.magenta },
  textoFiltro: { color: colores.secundario, fontSize: 13, fontWeight: '600' },
  textoFiltroActivo: { color: colores.fondo },
  lista: { flexGrow: 1, paddingBottom: 12 },
  vacio: { padding: 28, marginTop: 20, alignItems: 'center' },
  vacioTitulo: { color: colores.texto, fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 10 },
  vacioTexto: { color: colores.secundario, textAlign: 'center', lineHeight: 23 },
  accion: { paddingTop: 12, paddingBottom: 16, alignSelf: 'center', width: '100%', maxWidth: 340 },
});
