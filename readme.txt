GESTOR DE TAREAS

Aplicación móvil desarrollada con React Native y Expo para organizar tareas y recibir recordatorios. Los datos se guardan localmente en el dispositivo, sin necesidad de un servidor.

ENLACES
	Repositorio Git:
	https://github.com/nick4321/GestorTareas

	Video de YouTube - Demo:
	https://youtu.be/_qOXxyCRHRU

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
- Contacto opcional del dispositivo asociado como responsable de la tarea, con posibilidad de quitarlo.
- Evento opcional creado en el calendario del dispositivo, con acceso para abrirlo desde la tarea.
- Solicitud de permisos al utilizar cámara, galería, ubicación, contactos y calendario, con mensajes si son rechazados.
- Recordatorio de prueba configurable a partir de 5 segundos.
- En total se ejecutan 27 pruebas automáticas.
- Generación de un APK y pruebas en un teléfono Android.

CÓMO USAR LA APLICACIÓN

1. Instalar el APK en un dispositivo Android.
2. Abrir la aplicación y seleccionar "Crear cuenta".
3. Registrar un usuario y una contraseña de al menos 4 caracteres.
4. Iniciar sesión. Si se desea, activar "Mantener sesión iniciada".
5. Seleccionar "Agregar tarea", escribir un título y elegir un recordatorio o "Sin recordatorio".
6. Guardar la tarea. Si Android solicita permiso para las notificaciones, concederlo para recibir los avisos.
7. Desde el listado, buscar, filtrar, editar, completar o eliminar las tareas.
8. Al crear o editar una tarea, usar la sección "Opcionales" para agregar una foto, ubicación, contacto o evento de calendario.
9. Utilizar el icono de cierre de sesión para salir de la cuenta.

La primera vez que se utiliza cada recurso, Android solicita el permiso correspondiente. Los recursos son opcionales: si se cancela o rechaza un permiso, la tarea puede seguir guardándose sin ese recurso. Esto no representa una limitación funcional de la aplicación, sino un comportamiento esperado para respetar los permisos y la privacidad del dispositivo. Si se activa el calendario y se rechaza su permiso al guardar, la aplicación informa el motivo y permite volver a intentarlo sin perder la tarea.

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


PUNTO EXTRA: IA APLICADA AL DESARROLLO
Durante el desarrollo de esta versión se utilizó ChatGPT como asistente de programación y revisión técnica.

La IA se utilizó para:
- Analizar los requisitos del parcial.
- Proponer la integración de cámara, galería, ubicación, contactos y calendario.
- Generar y refactorizar componentes de React Native.
- Implementar un store global utilizando Zustand.
- Incorporar y ampliar pruebas automatizadas con Jest.
- Diagnosticar errores de Expo, Gradle y permisos del dispositivo.
- Mejorar las notificaciones y la experiencia de usuario.
- Revisar y limpiar comentarios y código innecesario.
Ejemplos de prompts utilizados
“Este es el repositorio de GestorTareas. Necesito ampliarlo para cumplir los requisitos del Parcial 2 incorporando permisos, cámara, galería, ubicación, contactos, calendario, Zustand y Jest.”

“Agregá a las tareas la posibilidad de adjuntar una foto, guardar la ubicación actual, asociar un contacto y crear un evento en el calendario del dispositivo.”

“Migrá el manejo de tareas a Zustand, incluyendo acciones para agregar, actualizar, completar y eliminar tareas.”

“La notificación debería mostrar el título de la tarea, la ubicación asociada y el contacto relacionado, si existen.”

“El contacto debe ser opcional y el calendario debe poder activarse o desactivarse mediante un Check bajo la leyenda 'Deseás agregar al calendario?'.”

“El botón para abrir el calendario no funciona en Android. Analizá el error y corregí la integración utilizando una API compatible con Expo SDK 57.”

“Revisá el proyecto, dejando el código limpio y eliminá comentarios innecesarios o generados por IA, conservando únicamente los emojis necesarios para la interfaz.”

Comparación entre el código generado y el código final
La IA se utilizó como apoyo para generar una primera propuesta de código y resolver problemas técnicos. Sin embargo, el código final fue revisado, adaptado e integrado manualmente al proyecto existente.

Durante la integración se realizaron ajustes en:
- Compatibilidad con Expo SDK 57.
- Uso de la API legacy de expo-calendar.
- Manejo de permisos rechazados.
- Persistencia de tareas mediante AsyncStorage.
- Integración entre Zustand y el contexto de sesión.
- Cancelación y actualización de notificaciones y eventos.
- Diseño visual y textos de la interfaz.
- Corrección de errores detectados durante las pruebas en un dispositivo Android real.
El resultado final no corresponde a una copia directa del código generado por la IA, sino a una implementación revisada, probada y adaptada a las necesidades específicas de la aplicación.