jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
  cancelScheduledNotificationAsync: jest.fn(),
  cancelAllScheduledNotificationsAsync: jest.fn(),
  dismissAllNotificationsAsync: jest.fn(),
  AndroidImportance: { MAX: 5 },
  SchedulableTriggerInputTypes: { DATE: 'date' },
}));

import { construirMensaje } from '../notificaciones';

describe('notificaciones', () => {
  it('describe la tarea con ubicación y contacto', () => {
    expect(construirMensaje('Reunirte', {
      ubicacion: { direccion: 'Av. Rivadavia 123' },
      contacto: { nombre: 'Katy' },
    })).toBe('Reunirte en Av. Rivadavia 123 con Katy');
  });

  it('mantiene un mensaje simple cuando no hay recursos asociados', () => {
    expect(construirMensaje('Comprar alimento')).toBe('Comprar alimento');
  });
});
