jest.mock('../../services/datosUsuario', () => ({ guardarTareas: jest.fn().mockResolvedValue(undefined) }));
jest.mock('../../services/notificaciones', () => ({
  programarEnFecha: jest.fn().mockResolvedValue('notificacion-1'),
  cancelarRecordatorio: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('../../services/recursosDispositivo', () => ({
  crearEventoCalendario: jest.fn().mockResolvedValue('evento-1'),
  eliminarEventoCalendario: jest.fn().mockResolvedValue(undefined),
}));

import { useTareasStore } from '../tareasStore';
import { guardarTareas } from '../../services/datosUsuario';

describe('tareasStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTareasStore.setState({ usuario: 'nico', tareas: [], ocupado: false });
  });

  it('agrega una tarea y la persiste', async () => {
    await useTareasStore.getState().guardarTarea({
      titulo: 'Comprar alimento', minutos: null, etiqueta: 'Sin recordatorio',
    });

    expect(useTareasStore.getState().tareas).toHaveLength(1);
    expect(useTareasStore.getState().tareas[0].titulo).toBe('Comprar alimento');
    expect(guardarTareas).toHaveBeenCalledWith('nico', expect.any(Array));
  });

  it('actualiza una tarea con recursos asociados', async () => {
    useTareasStore.setState({ usuario: 'nico', tareas: [{ id: '1', titulo: 'Tarea', completada: false }] });

    await useTareasStore.getState().guardarTarea({
      id: '1', titulo: 'Tarea actualizada', minutos: null, etiqueta: 'Sin recordatorio',
      imagenUri: 'file:///foto.jpg', ubicacion: { latitude: -34.6, longitude: -58.5 },
      contacto: { id: 'c1', nombre: 'Katy' }, agendarCalendario: true,
    });

    const tarea = useTareasStore.getState().tareas[0];
    expect(tarea.titulo).toBe('Tarea actualizada');
    expect(tarea.imagenUri).toBe('file:///foto.jpg');
    expect(tarea.ubicacion.latitude).toBe(-34.6);
    expect(tarea.contacto.nombre).toBe('Katy');
    expect(tarea.eventoCalendarioId).toBe('evento-1');
  });

  it('cambia el estado y elimina el recordatorio', async () => {
    useTareasStore.setState({ usuario: 'nico', tareas: [{ id: '1', titulo: 'Tarea', completada: false, notificacionId: 'n1' }] });

    await useTareasStore.getState().cambiarEstado('1');

    expect(useTareasStore.getState().tareas[0].completada).toBe(true);
    expect(useTareasStore.getState().tareas[0].notificacionId).toBeNull();
  });

  it('elimina la tarea y su evento de calendario', async () => {
    useTareasStore.setState({ usuario: 'nico', tareas: [{ id: '1', titulo: 'Tarea', completada: false, eventoCalendarioId: 'e1' }] });

    await useTareasStore.getState().eliminarTarea('1');

    expect(useTareasStore.getState().tareas).toHaveLength(0);
  });
});
