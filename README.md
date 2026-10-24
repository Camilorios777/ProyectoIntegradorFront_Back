# Gestión académica - Frontend del proyecto integrador

React + Vite + Tailwind. Se conecta al backend Spring Boot (puerto 8081), que guarda todo en MySQL.

## Para ejecutarlo
1. Deja corriendo el backend (`AcademicManagementApplication`) en el puerto 8081.
   El backend debe tener la clase `WebConfig` de CORS que ya agregaste.
2. En esta carpeta, en la terminal:

       npm install
       npm run dev

3. Abre la direccion que muestre la terminal (normalmente http://localhost:5173).
   Requiere Node 20.19 o superior (22.12 o superior tambien sirve).

## Que incluye
- Portada (`/`) con acceso al sistema y un aviso que indica si el servidor esta conectado.
- Estudiantes, Programas, Periodos, Grupos y Matriculas: lista, busqueda, crear, editar y eliminar.
  En Matriculas tambien se puede completar y cancelar.
- Los mensajes de error (404, 409, 400) vienen del backend y se muestran tal cual en pantalla.

## Orden para cargar datos
Programa, Periodo, Grupo, Estudiante y por ultimo Matricula. Un grupo necesita programa y periodo,
y una matricula necesita estudiante y grupo.

## Donde cambiar cosas
- Colores: `src/index.css`, bloque `@theme`. Cambiando esos valores cambia todo el sitio.
- URL del backend: archivo `.env` (`VITE_API_URL`).
- Textos de la portada: `src/pages/Landing.jsx`.

## Estructura
    src/config      conexion a la API (axios) y formato de fechas
    src/services    una funcion por cada peticion al backend
    src/components  piezas reutilizables (formularios, tabla, menu lateral)
    src/pages       portada y las 5 paginas de administracion
    src/routes      rutas de la aplicacion
