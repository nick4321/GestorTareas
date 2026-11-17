import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts/legacy';
import * as Calendar from 'expo-calendar/legacy';

function permisoRechazado(recurso) {
  throw new Error(`No se concedió permiso para acceder a ${recurso}. Podés habilitarlo desde los ajustes del teléfono.`);
}

export async function elegirImagen(origen) {
  const permiso = origen === 'camara'
    ? await ImagePicker.requestCameraPermissionsAsync()
    : await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permiso.granted) permisoRechazado(origen === 'camara' ? 'la cámara' : 'la galería');

  const resultado = origen === 'camara'
    ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true, aspect: [4, 3] })
    : await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

  return resultado.canceled ? null : resultado.assets?.[0]?.uri ?? null;
}

export async function obtenerUbicacionActual() {
  const permiso = await Location.requestForegroundPermissionsAsync();
  if (!permiso.granted) permisoRechazado('la ubicación');

  const posicion = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
  const { latitude, longitude } = posicion.coords;
  let direccion = null;
  try {
    const lugares = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (lugares[0]) {
      const lugar = lugares[0];
      direccion = [lugar.street, lugar.name, lugar.city].filter(Boolean).join(', ') || null;
    }
  } catch {
  }
  return { latitude, longitude, direccion };
}

export async function obtenerContactos() {
  const permiso = await Contacts.requestPermissionsAsync();
  if (permiso.status !== 'granted') permisoRechazado('los contactos');

  const respuesta = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    pageSize: 100,
  });

  return (respuesta.data || []).map((contacto) => ({
    id: contacto.id,
    nombre: contacto.name || 'Contacto sin nombre',
    telefono: contacto.phoneNumbers?.[0]?.number || null,
  }));
}

function fechaEvento(tarea, fecha) {
  const inicio = tarea.recordatorioFecha && tarea.recordatorioFecha > Date.now()
    ? new Date(tarea.recordatorioFecha)
    : new Date(Date.now() + 60 * 60 * 1000);
  const fin = new Date(inicio.getTime() + 30 * 60 * 1000);
  return { inicio: fecha || inicio, fin };
}

export async function crearEventoCalendario(tarea) {
  const permiso = await Calendar.requestCalendarPermissionsAsync();
  if (!permiso.granted) permisoRechazado('el calendario');

  const calendarios = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const calendario = calendarios
    .filter((item) => item.allowsModifications && item.isVisible !== false)
    .sort((a, b) => Number(Boolean(b.isPrimary)) - Number(Boolean(a.isPrimary)))[0]
    || calendarios.find((item) => item.allowsModifications);
  if (!calendario) throw new Error('No hay un calendario disponible para crear el evento.');

  const { inicio, fin } = fechaEvento(tarea);
  const ubicacion = tarea.ubicacion?.direccion
    || (tarea.ubicacion ? `${tarea.ubicacion.latitude}, ${tarea.ubicacion.longitude}` : null);
  const contacto = tarea.contacto?.nombre;
  const notas = [
    'Evento creado desde Gestor de Tareas.',
    contacto ? `Contacto: ${contacto}` : null,
  ].filter(Boolean).join('\n');

  return Calendar.createEventAsync(calendario.id, {
    title: `Tarea: ${tarea.titulo}`,
    notes: notas,
    location: ubicacion || undefined,
    startDate: inicio,
    endDate: fin,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
}

export async function eliminarEventoCalendario(eventoId) {
  if (eventoId) await Calendar.deleteEventAsync(eventoId);
}

export function abrirEventoCalendario(eventoId) {
  if (eventoId) Calendar.openEventInCalendar(eventoId);
}
