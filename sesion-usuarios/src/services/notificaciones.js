import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, shouldShowList: true,
    shouldPlaySound: true, shouldSetBadge: false,
  }),
});

async function solicitarPermiso() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('tareas-v2', {
      name: 'Recordatorios de tareas',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
  let permisos = await Notifications.getPermissionsAsync();
  if (!permisos.granted) permisos = await Notifications.requestPermissionsAsync();
  if (!permisos.granted) {
    throw new Error('Necesitás permitir las notificaciones para usar recordatorios.');
  }
}

export async function programarEnFecha(titulo, fecha, usuario) {
  if (!Number.isFinite(fecha) || fecha <= Date.now()) return null;
  await solicitarPermiso();
  // El permiso puede demorar: comprobamos la fecha otra vez.
  if (fecha <= Date.now()) return null;
  return Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Tarea pendiente', body: titulo,
      data: { usuario },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: new Date(fecha),
      ...(Platform.OS === 'android' ? { channelId: 'tareas-v2' } : {}),
    },
  });
}

export async function cancelarRecordatorio(id) {
  if (id) await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelarTodos() {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.dismissAllNotificationsAsync();
}
