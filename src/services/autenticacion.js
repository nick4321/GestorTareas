import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateLoginInput } from '../utils/validators';

const CLAVE_USUARIOS = '@gestorTareas:usuarios';

async function obtenerUsuarios() {
  const contenido = await AsyncStorage.getItem(CLAVE_USUARIOS);
  const usuarios = contenido ? JSON.parse(contenido) : [];

  if (!Array.isArray(usuarios)) {
    throw new Error('No se pudieron leer los usuarios guardados.');
  }

  return usuarios;
}

export async function registrarUsuario(usuario, contraseña) {
  const nombre = usuario.trim();

  const errores = validateLoginInput(usuario, contraseña, true);
  if (errores.length) throw new Error(errores[0]);

  const usuarios = await obtenerUsuarios();

  const existe = usuarios.some(
    (item) => item.usuario.toLowerCase() === nombre.toLowerCase()
  );

  if (existe) {
    throw new Error('Ese usuario ya está registrado.');
  }

  await AsyncStorage.setItem(
    CLAVE_USUARIOS,
    JSON.stringify([...usuarios, { usuario: nombre, contraseña }])
  );
}

export async function validarLogin(usuario, contraseña) {
  const errores = validateLoginInput(usuario, contraseña);
  if (errores.length) throw new Error(errores[0]);

  const usuarios = await obtenerUsuarios();

  const encontrado = usuarios.find(
    (item) =>
      item.usuario.toLowerCase() === usuario.trim().toLowerCase() &&
      item.contraseña === contraseña
  );

  if (!encontrado) {
    throw new Error('Usuario o contraseña incorrectos.');
  }

  return { usuario: encontrado.usuario };
}