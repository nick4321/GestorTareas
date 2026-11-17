import { create } from 'zustand';
import { Alert } from 'react-native';
import { cancelarRecordatorio, programarEnFecha } from '../services/notificaciones';
import { guardarTareas } from '../services/datosUsuario';
import { crearEventoCalendario, eliminarEventoCalendario } from '../services/recursosDispositivo';

function crearId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useTareasStore = create((set, get) => ({
  usuario: null,
  tareas: [],
  ocupado: false,

  establecerTareas: (usuario, tareas) => set({ usuario, tareas }),

  limpiar: () => set({ usuario: null, tareas: [], ocupado: false }),

  guardarTarea: async ({ id, titulo, minutos, etiqueta, imagenUri, ubicacion, contacto, eventoCalendarioId, agendarCalendario }) => {
    const { usuario, tareas } = get();
    if (!usuario) throw new Error('Iniciá sesión para guardar tareas.');
    set({ ocupado: true });

    const anterior = id ? tareas.find((tarea) => tarea.id === id) : null;
    if (id && !anterior) {
      set({ ocupado: false });
      throw new Error('La tarea ya no existe.');
    }

    const completada = anterior?.completada ?? false;
    const fecha = !completada && minutos !== null ? Date.now() + minutos * 60000 : null;
    let nuevaNotificacion = null;
    let nuevoEvento = eventoCalendarioId ?? anterior?.eventoCalendarioId ?? null;

    try {
      if (fecha) nuevaNotificacion = await programarEnFecha(titulo, fecha, usuario);
      if (agendarCalendario && !nuevoEvento) {
        nuevoEvento = await crearEventoCalendario({ titulo, recordatorioFecha: fecha });
      }

      const nueva = {
        ...anterior,
        id: id || crearId(),
        titulo,
        completada,
        recordatorioMinutos: minutos,
        recordatorio: minutos === null ? null : `Dentro de ${etiqueta.replace(' (demo)', '')}`,
        recordatorioFecha: fecha,
        notificacionId: nuevaNotificacion,
        imagenUri: imagenUri ?? anterior?.imagenUri ?? null,
        ubicacion: ubicacion ?? anterior?.ubicacion ?? null,
        contacto: contacto ?? anterior?.contacto ?? null,
        eventoCalendarioId: nuevoEvento,
      };

      const lista = anterior
        ? tareas.map((tarea) => tarea.id === id ? nueva : tarea)
        : [...tareas, nueva];

      await guardarTareas(usuario, lista);
      set({ tareas: lista });

      try {
        await cancelarRecordatorio(anterior?.notificacionId);
      } catch {
        Alert.alert('Recordatorio anterior', 'No se pudo cancelar el aviso anterior. Cerrá sesión y volvé a entrar para sincronizar los avisos.');
      }
    } catch (error) {
      await cancelarRecordatorio(nuevaNotificacion).catch(() => {});
      await eliminarEventoCalendario(nuevoEvento).catch(() => {});
      throw error;
    } finally {
      set({ ocupado: false });
    }
  },

  cambiarEstado: async (id) => {
    const { usuario, tareas } = get();
    if (!usuario) throw new Error('Iniciá sesión.');
    const tarea = tareas.find((item) => item.id === id);
    if (!tarea) return;
    set({ ocupado: true });
    try {
      await cancelarRecordatorio(tarea.notificacionId);
      const lista = tareas.map((item) => item.id === id ? {
        ...item,
        completada: !item.completada,
        notificacionId: null,
        recordatorioFecha: null,
      } : item);
      await guardarTareas(usuario, lista);
      set({ tareas: lista });
    } finally {
      set({ ocupado: false });
    }
  },

  eliminarTarea: async (id) => {
    const { usuario, tareas } = get();
    if (!usuario) throw new Error('Iniciá sesión.');
    const tarea = tareas.find((item) => item.id === id);
    if (!tarea) return;
    set({ ocupado: true });
    try {
      await cancelarRecordatorio(tarea.notificacionId);
      await eliminarEventoCalendario(tarea.eventoCalendarioId).catch(() => {});
      const lista = tareas.filter((item) => item.id !== id);
      await guardarTareas(usuario, lista);
      set({ tareas: lista });
    } finally {
      set({ ocupado: false });
    }
  },
}));
