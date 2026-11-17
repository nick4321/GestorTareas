export function validateLoginInput(usuario, contraseña, esRegistro = false) {
  const errores = [];
  if (!usuario.trim() || !contraseña.trim()) {
    errores.push('Completá el usuario y la contraseña.');
  }
  if (esRegistro && contraseña.trim() && contraseña.length < 4) {
    errores.push('La contraseña debe tener al menos 4 caracteres.');
  }
  return errores;
}
