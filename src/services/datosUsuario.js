import AsyncStorage from '@react-native-async-storage/async-storage';

export const CLAVE_SESION = '@gestorTareas:sesion';
const CLAVE_ANTIGUA = '@gestorTareas:tareas';
const CLAVE_DUENO = '@gestorTareas:duenoTareasAntiguas';

export function claveTareas(usuario) {
  return `@gestorTareas:tareas:${encodeURIComponent(usuario.trim().toLowerCase())}`;
}

function leerLista(contenido) {
  const lista = contenido === null ? [] : JSON.parse(contenido);
  if (!Array.isArray(lista)) throw new Error('El listado guardado no es válido.');
  return lista;
}

export async function cargarTareas(usuario) {
  const clave = claveTareas(usuario);
  const actual = await AsyncStorage.getItem(clave);
  if (actual !== null) return leerLista(actual);

  const antiguo = await AsyncStorage.getItem(CLAVE_ANTIGUA);
  const dueno = await AsyncStorage.getItem(CLAVE_DUENO);
  const identificador = usuario.trim().toLowerCase();
  if (antiguo !== null && (!dueno || dueno === identificador)) {
    const tareas = leerLista(antiguo).map((tarea) => ({
      ...tarea, recordatorioFecha: null, notificacionId: null,
    }));
    // Reservamos el dueño primero: un fallo no permite migrar a otra cuenta.
    await AsyncStorage.setItem(CLAVE_DUENO, identificador);
    await AsyncStorage.setItem(clave, JSON.stringify(tareas));
    await AsyncStorage.removeItem(CLAVE_ANTIGUA);
    return tareas;
  }
  return [];
}

export async function guardarTareas(usuario, tareas) {
  await AsyncStorage.setItem(claveTareas(usuario), JSON.stringify(tareas));
}
