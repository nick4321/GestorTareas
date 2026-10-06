// Mock local como en la práctica: no accede al almacenamiento del emulador.
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn(),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { registrarUsuario, validarLogin } from '../autenticacion';

const CLAVE = '@gestorTareas:usuarios';
const usuario = { usuario: 'Nico', contraseña: '1234' };

beforeEach(() => {
  jest.resetAllMocks();
  AsyncStorage.getItem.mockResolvedValue(null);
  AsyncStorage.setItem.mockResolvedValue(undefined);
});
afterEach(() => jest.clearAllMocks());

describe('registrarUsuario', () => {
  it('guarda el usuario en AsyncStorage', async () => {
    await registrarUsuario(' Nico ', '1234');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CLAVE, JSON.stringify([usuario]));
  });
  it('rechaza una contraseña corta sin guardar datos', async () => {
    await expect(registrarUsuario('Nico', '123')).rejects.toThrow('al menos 4 caracteres');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
  it('rechaza usuarios duplicados aunque cambien las mayúsculas', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([usuario]));
    await expect(registrarUsuario('nico', 'abcd')).rejects.toThrow('ya está registrado');
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
  it('conserva los usuarios anteriores al registrar otro', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([usuario]));
    await registrarUsuario('Ana', 'abcd');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(CLAVE,
      JSON.stringify([usuario, { usuario: 'Ana', contraseña: 'abcd' }]));
  });
});

describe('validarLogin', () => {
  it('acepta credenciales guardadas e ignora mayúsculas en el usuario', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([usuario]));
    await expect(validarLogin(' NICO ', '1234')).resolves.toEqual({ usuario: 'Nico' });
    expect(AsyncStorage.getItem).toHaveBeenCalledWith(CLAVE);
  });
  it('rechaza una contraseña incorrecta', async () => {
    AsyncStorage.getItem.mockResolvedValue(JSON.stringify([usuario]));
    await expect(validarLogin('Nico', '9999')).rejects.toThrow('Usuario o contraseña incorrectos');
  });
  it('rechaza el ingreso si no hay usuarios registrados', async () => {
    await expect(validarLogin('Nico', '1234')).rejects.toThrow('Usuario o contraseña incorrectos');
  });
  it('rechaza campos vacíos sin consultar AsyncStorage', async () => {
    await expect(validarLogin('', '1234')).rejects.toThrow('Completá el usuario');
    expect(AsyncStorage.getItem).not.toHaveBeenCalled();
  });
});
