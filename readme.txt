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
- Pruebas automáticas con Jest y React Native Testing Library: validación, autenticación, componente de tarea y store global.
- Estado global de tareas implementado con Zustand, incluyendo acciones para agregar, actualizar, completar y eliminar.
- Foto asociada a cada tarea desde la cámara o la galería del dispositivo.
- Ubicación actual asociada a la tarea, mostrando dirección aproximada o coordenadas.
- Contacto del dispositivo asociado como responsable de la tarea.
- Evento vinculado creado en el calendario del dispositivo.
- Solicitud de permisos al utilizar cámara, galería, ubicación, contactos y calendario, con mensajes si son rechazados.
- En total se ejecutan 24 pruebas automáticas.
- Generación de un APK y pruebas en un teléfono Android.

CÓMO USAR LA APLICACIÓN

1. Instalar el APK en un dispositivo Android.
2. Abrir la aplicación y seleccionar "Crear cuenta".
3. Registrar un usuario y una contraseña de al menos 4 caracteres.
4. Iniciar sesión. Si se desea, activar "Mantener sesión iniciada".
5. Seleccionar "Agregar tarea", escribir un título y elegir un recordatorio o "Sin recordatorio".
6. Guardar la tarea. Si Android solicita permiso para las notificaciones, concederlo para recibir los avisos.
7. Desde el listado, buscar, filtrar, editar, completar o eliminar las tareas.
8. Al crear o editar una tarea, usar los botones de recursos asociados para agregar una foto, ubicación, contacto o evento de calendario.
9. Utilizar el icono de cierre de sesión para salir de la cuenta.

La primera vez que se utiliza cada recurso, Android solicita el permiso correspondiente. Si se rechaza, la tarea puede seguir guardándose sin ese recurso.

Los recordatorios pueden aparecer con la aplicación en segundo plano. Al cerrar sesión se cancelan los avisos pendientes de esa cuenta. Las tareas y los usuarios permanecen guardados.

Los datos pertenecen al dispositivo donde se utiliza la aplicación y no se sincronizan con otros teléfonos. No se incluye recuperación de contraseña ni eliminación individual de cuentas.

EJECUTAR EL PROYECTO DESDE EL CÓDIGO

Se necesita Node.js y, para compilar Android, Android Studio con el SDK configurado y Java 17. Las funciones de cámara, ubicación, contactos y calendario requieren una compilación de desarrollo o un APK.
Desde una terminal ubicada en la carpeta del proyecto:

npm install
npx expo prebuild --platform android
npx expo run:android

Si la aplicación de desarrollo ya está instalada, iniciar el servidor con:

npx expo start --dev-client

EJECUTAR LAS PRUEBAS
Desde la carpeta del proyecto:
npm test

npm run test:coverage

Las pruebas actuales son 24, agrupadas en cuatro suites.
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   85.29 |    78.72 |   80.76 |   89.77 |
 components        |     100 |       60 |     100 |     100 | 32-37
 services          |      96 |    92.85 |     100 |   95.65 | 11
 store             |   78.78 |       78 |   68.75 |   85.18 | 16-18,27-28,67-72
 utils             |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------

Test Suites: 4 passed, 4 total
Tests:       24 passed, 24 total
Snapshots:   0 total
Time:        3.913 s, estimated 13 s
