GESTOR DE TAREAS

Aplicación móvil desarrollada con React Native y Expo para organizar tareas y recibir recordatorios. Los datos se guardan localmente en el dispositivo, sin necesidad de un servidor.

ENLACES

Repositorio Git:
https://github.com/nick4321/GestorTareas

Video de YouTube - Demo:
https://youtu.be/VcnQE_FQiC0

FUNCIONALIDADES REALIZADAS

- Registro e inicio de sesión con usuario y contraseña.
- Opción para mantener la sesión iniciada.
- Tareas independientes para cada usuario.
- Creación y edición de tareas con título y recordatorio.
- Listado, búsqueda y filtros de tareas: todas, pendientes y completadas.
- Marcar tareas como completadas o volver a marcarlas como pendientes.
- Guardado de usuarios y tareas mediante AsyncStorage, conservando los datos al cerrar la aplicación.
- Notificaciones locales para recordar las tareas pendientes.
- Cancelación de recordatorios al completar o eliminar una tarea, o al cerrar sesión.
- Recuperación de recordatorios futuros al volver a iniciar sesión, conservando su fecha.
- Navegación entre Login, Registro, Home y la pantalla de creación o edición de tareas.
- Componentes reutilizables y estilos con StyleSheet.
- Diseño e icono con una paleta de colores inspirada en Gengar.
- Pruebas automáticas con Jest y React Native Testing Library: 20 tests de validación, autenticación y del componente de tarea.
- Generación de un APK y pruebas en un teléfono Android.

CÓMO USAR LA APLICACIÓN

1. Instalar el APK en un dispositivo Android.
2. Abrir la aplicación y seleccionar "Crear cuenta".
3. Registrar un usuario y una contraseña de al menos 4 caracteres.
4. Iniciar sesión. Si se desea, activar "Mantener sesión iniciada".
5. Seleccionar "Agregar tarea", escribir un título y elegir un recordatorio o "Sin recordatorio".
6. Guardar la tarea. Si Android solicita permiso para las notificaciones, concederlo para recibir los avisos.
7. Desde el listado, buscar, filtrar, editar, completar o eliminar las tareas.
8. Utilizar el icono de cierre de sesión para salir de la cuenta.

Los recordatorios pueden aparecer con la aplicación en segundo plano. Al cerrar sesión se cancelan los avisos pendientes de esa cuenta. Las tareas y los usuarios permanecen guardados.

Los datos pertenecen al dispositivo donde se utiliza la aplicación y no se sincronizan con otros teléfonos. No se incluye recuperación de contraseña ni eliminación individual de cuentas.

EJECUTAR EL PROYECTO DESDE EL CÓDIGO

Se necesita Node.js y, para compilar Android, Android Studio con el SDK configurado y Java 17.
Desde una terminal ubicada en la carpeta del proyecto:

npm install
npx expo run:android

Si la aplicación de desarrollo ya está instalada, iniciar el servidor con:

npx expo start --dev-client

EJECUTAR LAS PRUEBAS
Desde la carpeta del proyecto:
npm test

npm run test:coverage
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   97.22 |    96.87 |     100 |   97.05 |
 components        |     100 |      100 |     100 |     100 |
  TaskItem.js      |     100 |      100 |     100 |     100 |
 services          |      96 |    92.85 |     100 |   95.65 |
  autenticacion.js |      96 |    92.85 |     100 |   95.65 | 11
 utils             |     100 |      100 |     100 |     100 |
  validators.js    |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        3.913 s, estimated 13 s