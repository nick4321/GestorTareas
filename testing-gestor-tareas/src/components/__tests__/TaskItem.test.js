import { render, fireEvent } from '@testing-library/react-native';
import TaskItem from '../TaskItem';

const tarea = {
  id: 'tarea-1', titulo: 'Estudiar React Native',
  completada: false, recordatorio: 'Dentro de 2 minutos',
};

function mostrar(item = tarea) {
  const callbacks = {
    onCompletar: jest.fn(), onEditar: jest.fn(), onEliminar: jest.fn(),
  };
  return { callbacks, vista: render(<TaskItem tarea={item} {...callbacks} />) };
}

afterEach(() => jest.clearAllMocks());

describe('TaskItem', () => {
  it('muestra el título y el recordatorio', async () => {
    const { vista } = mostrar();
    const { getByText } = await vista;
    expect(getByText('○ Estudiar React Native')).toBeTruthy();
    expect(getByText('Recordatorio: Dentro de 2 minutos')).toBeTruthy();
  });
  it('llama onCompletar con el identificador', async () => {
    const { vista, callbacks } = mostrar();
    const { getByRole } = await vista;
    await fireEvent.press(getByRole('button', { name: 'Completar Estudiar React Native' }));
    expect(callbacks.onCompletar).toHaveBeenCalledTimes(1);
    expect(callbacks.onCompletar).toHaveBeenCalledWith('tarea-1');
  });
  it('llama onEditar con la tarea completa', async () => {
    const { vista, callbacks } = mostrar();
    const { getByRole } = await vista;
    await fireEvent.press(getByRole('button', { name: 'Editar Estudiar React Native' }));
    expect(callbacks.onEditar).toHaveBeenCalledWith(tarea);
    expect(callbacks.onEliminar).not.toHaveBeenCalled();
  });
  it('llama onEliminar con el identificador', async () => {
    const { vista, callbacks } = mostrar();
    const { getByRole } = await vista;
    await fireEvent.press(getByRole('button', { name: 'Eliminar Estudiar React Native' }));
    expect(callbacks.onEliminar).toHaveBeenCalledWith('tarea-1');
    expect(callbacks.onEditar).not.toHaveBeenCalled();
  });
  it('permite volver a pendiente una tarea completada', async () => {
    const { vista, callbacks } = mostrar({ ...tarea, completada: true, recordatorio: null });
    const { getByRole, getByText } = await vista;
    expect(getByText('Recordatorio: Sin recordatorio')).toBeTruthy();
    await fireEvent.press(getByRole('button', { name: 'Marcar Estudiar React Native como pendiente' }));
    expect(callbacks.onCompletar).toHaveBeenCalledWith('tarea-1');
  });
});
