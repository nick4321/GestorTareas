import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Permite mostrar el aviso también con la app abierta.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
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

  if (!permisos.granted) {
    permisos = await Notifications.requestPermissionsAsync();
  }

  if (!permisos.granted) {
    throw new Error('Necesitás permitir las notificaciones para usar recordatorios.');
  }
}

export async function programarRecordatorio(titulo, minutos) {
  if (minutos === null) {
    return null;
  }

  await solicitarPermiso();

  return Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Tarea pendiente',
      body: titulo,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: minutos * 60,
      repeats: false,
      ...(Platform.OS === 'android' ? { channelId: 'tareas-v2' } : {}),
    },
  });
}

export async function cancelarRecordatorio(id) {
  if (id) {
    await Notifications.cancelScheduledNotificationAsync(id);
  }
}