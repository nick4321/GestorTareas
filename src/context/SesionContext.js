import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { validarLogin } from '../services/autenticacion';
import { CLAVE_SESION, cargarTareas } from '../services/datosUsuario';
import { cancelarTodos, programarEnFecha } from '../services/notificaciones';
import { useTareasStore } from '../store/tareasStore';

const SesionContext = createContext(null);
export const useSesion = () => useContext(SesionContext);

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [ocupadoSesion, setOcupadoSesion] = useState(false);
  const [errorInicio, setErrorInicio] = useState(null);
  const bloqueo = useRef(false);
  const tareas = useTareasStore((state) => state.tareas);
  const ocupadoTareas = useTareasStore((state) => state.ocupado);
  const guardarTarea = useTareasStore((state) => state.guardarTarea);
  const cambiarEstado = useTareasStore((state) => state.cambiarEstado);
  const eliminarTarea = useTareasStore((state) => state.eliminarTarea);

  async function prepararUsuario(usuario) {
    const lista = await cargarTareas(usuario);
    await cancelarTodos();
    const preparada = [];
    let sinPermiso = false;
    try {
      for (const tarea of lista) {
        let notificacionId = null;
        if (!tarea.completada && tarea.recordatorioFecha > Date.now()) {
          try {
            notificacionId = await programarEnFecha(tarea.titulo, tarea.recordatorioFecha, usuario);
          } catch {
            sinPermiso = true;
          }
        }
        preparada.push({ ...tarea, notificacionId });
      }
      useTareasStore.getState().establecerTareas(usuario, preparada);
    } catch (error) {
      await cancelarTodos().catch(() => {});
      throw error;
    }
    if (sinPermiso) Alert.alert('Recordatorios', 'Se cargaron las tareas, pero no se pudieron activar algunos avisos. Revisá los permisos y volvé a iniciar sesión.');
  }

  async function iniciar() {
    setCargando(true);
    setErrorInicio(null);
    try {
      const contenido = await AsyncStorage.getItem(CLAVE_SESION);
      if (contenido) {
        const guardada = JSON.parse(contenido);
        if (typeof guardada.usuario !== 'string' || !guardada.usuario.trim()) {
          throw new Error('La sesión guardada no es válida.');
        }
        // Confirmamos que la cuenta todavía existe.
        const usuarios = JSON.parse(await AsyncStorage.getItem('@gestorTareas:usuarios') || '[]');
        if (!Array.isArray(usuarios) || !usuarios.some((u) => u.usuario === guardada.usuario)) {
          throw new Error('La cuenta de la sesión guardada no existe.');
        }
        await prepararUsuario(guardada.usuario);
        setSesion({ usuario: guardada.usuario });
      } else {
        await cancelarTodos();
      }
    } catch (error) {
      await cancelarTodos().catch(() => {});
      setErrorInicio(error.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { iniciar(); }, []);

  async function ejecutar(operacion) {
    if (bloqueo.current) throw new Error('Esperá a que termine la operación actual.');
    bloqueo.current = true;
    setOcupadoSesion(true);
    try { return await operacion(); }
    finally { bloqueo.current = false; setOcupadoSesion(false); }
  }

  function ingresar(usuario, contraseña, mantener) {
    return ejecutar(async () => {
      const validado = await validarLogin(usuario, contraseña);
      await prepararUsuario(validado.usuario);
      try {
        if (mantener) await AsyncStorage.setItem(CLAVE_SESION, JSON.stringify(validado));
        else await AsyncStorage.removeItem(CLAVE_SESION);
      } catch (error) {
        await cancelarTodos().catch(() => {});
        throw error;
      }
      setSesion(validado);
    });
  }

  function salir() {
    return ejecutar(async () => {
      await cancelarTodos();
      await AsyncStorage.removeItem(CLAVE_SESION);
      useTareasStore.getState().limpiar();
      setSesion(null);
    });
  }

  return (
    <SesionContext.Provider value={{ sesion, tareas, cargando,
      ocupado: ocupadoSesion || ocupadoTareas, errorInicio,
      reintentar: iniciar, ingresar, salir, guardarTarea, cambiarEstado, eliminarTarea }}>
      {children}
    </SesionContext.Provider>
  );
}
