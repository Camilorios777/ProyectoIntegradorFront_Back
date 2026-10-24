# Gestión académica - Frontend del proyecto integrador

React + Vite + Tailwind. Se conecta al backend Spring Boot (puerto 8081), que guarda todo en MySQL.

## Para ejecutarlo
1. En esta carpeta, en la terminal:

       npm install
       npm run dev

2. Abre la direccion que muestre la terminal (normalmente http://localhost:5173).
   Requiere Node 20.19 o superior (22.12 o superior tambien sirve).
3. Para ver los datos, el backend (`AcademicManagementApplication`) debe estar corriendo en el puerto 8081
   con la clase `WebConfig` de CORS.

## Login
Las rutas /estudiantes, /programas, /periodos, /grupos y /matriculas exigen sesion. Sin sesion llevan a /login
y, despues de entrar, regresan a la pagina que se queria abrir. El menu lateral muestra el usuario y el boton
"Cerrar sesion". Si la sesion vence (por tiempo o porque el backend responde 401), se vuelve al login.

El modo se elige en el archivo `.env`, con la variable `VITE_AUTH_MODE`:

| Modo | Que hace | Cuando usarlo |
|------|----------|---------------|
| `demo` | El login se valida solo en el navegador con el usuario `admin` / `admin123`. | Probar la pantalla sin el login del backend. No es seguridad real: los datos siguen sin protegerse. |
| `api`  | El login llama a `POST /api/auth/login` del backend, guarda el token y lo envia en cada peticion (`Authorization: Bearer`). | Cuando el backend ya tenga el login (lote 4). |

Para pasar a `api`: aplica el lote 4 del backend, cambia `VITE_AUTH_MODE=api` en `.env` y reinicia `npm run dev`
(Vite solo lee el `.env` al arrancar).

El backend responde con: { token, tokenType, expiresInSeconds, user, roles }.

## Que incluye
- Portada (`/`) con acceso al sistema y un aviso que indica si el servidor esta conectado.
- Estudiantes, Programas, Periodos, Grupos y Matriculas: lista, busqueda, crear, editar y eliminar.
  En Matriculas tambien se puede completar y cancelar.
- Los mensajes de error (404, 409, 400, 401) vienen del backend y se muestran tal cual en pantalla.

## Orden para cargar datos
Programa, Periodo, Grupo, Estudiante y por ultimo Matricula.

## Donde cambiar cosas
- Colores: `src/index.css`, bloque `@theme`.
- URL del backend y modo de login: archivo `.env`.
- Sesion (guardado, vencimiento): `src/config/auth.js`.
- Peticiones y manejo del 401: `src/config/api.js`.
- Login: `src/pages/Login.jsx` y `src/services/authService.js`.

## Estructura
    src/config      conexion a la API (axios), sesion y formato de fechas
    src/services    una funcion por cada peticion al backend (y el login)
    src/components  piezas reutilizables (formularios, tabla, menu lateral, ruta protegida)
    src/pages       portada, login y las 5 paginas de administracion
    src/routes      rutas de la aplicacion
