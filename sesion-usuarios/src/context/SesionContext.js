import { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { validarLogin } from '../services/autenticacion';
import { CLAVE_SESION, cargarTareas, guardarTareas } from '../services/datosUsuario';
import { cancelarTodos, cancelarRecordatorio, programarEnFecha } from '../services/notificaciones';

const SesionContext = createContext(null);
export const useSesion = () => useContext(SesionContext);

export function SesionProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [ocupado, setOcupado] = useState(false);
  const [errorInicio, setErrorInicio] = useState(null);
  const bloqueo = useRef(false);
  const actuales = useRef([]);

  async function publicar(usuario, lista) {
    await guardarTareas(usuario, lista);
    actuales.current = lista;
    setTareas(lista);
  }

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
      await publicar(usuario, preparada);
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
    setOcupado(true);
    try { return await operacion(); }
    finally { bloqueo.current = false; setOcupado(false); }
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
      actuales.current = [];
      setTareas([]);
      setSesion(null);
    });
  }

  function guardarTarea({ id, titulo, minutos, etiqueta }) {
    return ejecutar(async () => {
      if (!sesion) throw new Error('Iniciá sesión para guardar tareas.');
      const anterior = id ? actuales.current.find((t) => t.id === id) : null;
      if (id && !anterior) throw new Error('La tarea ya no existe.');
      const completada = anterior?.completada ?? false;
      const fecha = !completada && minutos !== null ? Date.now() + minutos * 60000 : null;
      let nuevaId = null;
      try {
        if (fecha) nuevaId = await programarEnFecha(titulo, fecha, sesion.usuario);
        const nueva = {
          ...anterior,
          id: id || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
          titulo, completada, recordatorioMinutos: minutos,
          recordatorio: minutos === null ? null : `Dentro de ${etiqueta.replace(' (demo)', '')}`,
          recordatorioFecha: fecha, notificacionId: nuevaId,
        };
        const lista = anterior
          ? actuales.current.map((t) => t.id === id ? nueva : t)
          : [...actuales.current, nueva];
        await publicar(sesion.usuario, lista);
      } catch (error) {
        await cancelarRecordatorio(nuevaId).catch(() => {});
        throw error;
      }
      // El dato nuevo ya está guardado: no lo revertimos por un fallo al cancelar el viejo.
      try { await cancelarRecordatorio(anterior?.notificacionId); }
      catch { Alert.alert('Recordatorio anterior', 'No se pudo cancelar el aviso anterior. Cerrá sesión y volvé a entrar para sincronizar los avisos.'); }
    });
  }

  function cambiarEstado(id) {
    return ejecutar(async () => {
      if (!sesion) throw new Error('Iniciá sesión.');
      const tarea = actuales.current.find((t) => t.id === id);
      if (!tarea) return;
      await cancelarRecordatorio(tarea.notificacionId);
      await publicar(sesion.usuario, actuales.current.map((t) => t.id === id ? {
        ...t, completada: !t.completada, notificacionId: null, recordatorioFecha: null,
      } : t));
    });
  }

  function eliminarTarea(id) {
    return ejecutar(async () => {
      if (!sesion) throw new Error('Iniciá sesión.');
      const tarea = actuales.current.find((t) => t.id === id);
      if (!tarea) return;
      await cancelarRecordatorio(tarea.notificacionId);
      await publicar(sesion.usuario, actuales.current.filter((t) => t.id !== id));
    });
  }

  return (
    <SesionContext.Provider value={{ sesion, tareas, cargando, ocupado, errorInicio,
      reintentar: iniciar, ingresar, salir, guardarTarea, cambiarEstado, eliminarTarea }}>
      {children}
    </SesionContext.Provider>
  );
}
