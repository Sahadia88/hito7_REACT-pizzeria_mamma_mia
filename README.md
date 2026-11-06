# Pizzería Mamma Mía – Hito 7 (Frontend + Backend)

Séptima etapa del proyecto **Pizzería Mamma Mía**, desarrollado con **React**. En este hito se completa **React Router II**: el detalle de cada pizza se obtiene con **`useParams`**, se crea un **`UserContext`** con el token (simulado) de sesión y se implementan **rutas protegidas**.

Este repositorio incluye **las dos partes necesarias para ver la aplicación funcionando**:

| Carpeta | Contenido |
|---|---|
| [`hito7-pizzeria_mamma_mia/`](./hito7-pizzeria_mamma_mia) | **Frontend**: la aplicación React (Vite + Bootstrap + React Router). Es el trabajo de este hito. |
| [`backend-pizzas/`](./backend-pizzas) | **Backend**: la API de pizzas entregada como *Material de apoyo*. No fue modificado. |

> La aplicación necesita que el backend esté corriendo en `http://localhost:5000` para mostrar las pizzas (`Home` y `Pizza`), por eso no tiene demo en línea.

## Qué se implementó en este hito

- **`useParams`** en `Pizza`: la ruta pasó a ser `/pizza/:id`; el `id` de la URL se usa para consultar `GET /api/pizzas/:id`. En `CardPizza`, el botón **Ver Más** es un `Link` a `/pizza/<id>`.
- **`UserContext`** (`src/context/UserContext.jsx`): guarda el `token` (por defecto `true`) y expone `logout` (lo pasa a `false`) y `login` (lo pasa a `true`).
- **`Navbar`**: con `token = true` muestra **Profile** y **Logout** (que ejecuta `logout`); con `token = false`, **Login** y **Register**. **Home** y **Total** siempre se ven.
- **`Cart`**: el botón **Pagar** queda deshabilitado si el token es `false`.
- **Rutas protegidas** en `App`: `/profile` redirige a `/login` si no hay sesión; `/login` y `/register` redirigen al Home si hay sesión.
- Se mantiene todo lo construido en los Hitos 1 a 6 (formularios, consumo de la API, rutas, carrito global con `CartContext`).

### Rutas de la aplicación

| Ruta | Componente |
|---|---|
| `/` | `Home` |
| `/register` | `Register` (con sesión iniciada redirige a `/`) |
| `/login` | `Login` (con sesión iniciada redirige a `/`) |
| `/cart` | `Cart` |
| `/pizza/:id` | `Pizza` (por ejemplo `/pizza/p001`) |
| `/profile` | `Profile` (**protegida**: sin sesión redirige a `/login`) |
| `/404` | `NotFound` |
| cualquier otra | redirige a `/404` |

El detalle de cada componente y los conceptos aplicados están en el [README del frontend](./hito7-pizzeria_mamma_mia/README.md).

## Requisitos

- [Node.js](https://nodejs.org/) (versión LTS recomendada) y npm.
- Git.

## Cómo ejecutar el proyecto

Se necesitan **dos terminales abiertas al mismo tiempo**.

### 1. Clonar el repositorio

```bash
git clone https://github.com/Sahadia88/hito7_REACT-pizzeria_mamma_mia.git
cd hito7_REACT-pizzeria_mamma_mia
```

### 2. Terminal 1: levantar el backend

```bash
cd backend-pizzas
npm install
npm start
```

Debe aparecer el mensaje `Server is running on port http://localhost:5000`. Deja esta terminal abierta.

### 3. Terminal 2: levantar el frontend

```bash
cd hito7-pizzeria_mamma_mia
npm install
npm run dev
```

Abre en el navegador la dirección que muestra la terminal (normalmente `http://localhost:5173`).

> Si la página muestra el mensaje *"No pudimos cargar las pizzas"*, el backend no está corriendo. Revisa que la Terminal 1 siga abierta y sin errores.

## Endpoints utilizados

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `http://localhost:5000/api/pizzas` | Devuelve un arreglo con todas las pizzas (usado en `Home`) |
| GET | `http://localhost:5000/api/pizzas/:id` | Devuelve una pizza según su id, por ejemplo `p001` (usado en `Pizza`). Si no existe responde `404` |

Cada pizza incluye: `id`, `name`, `price`, `ingredients`, `img` y `desc`.

## Estructura del repositorio

```
hito7_REACT-pizzeria_mamma_mia/
├── README.md                      → este archivo
├── backend-pizzas/                → API de pizzas (Node.js + Express), sin modificar
│   ├── db/pizzas.json
│   ├── routes/ controllers/ models/
│   └── index.js
└── hito7-pizzeria_mamma_mia/      → aplicación React
    ├── src/
    │   ├── components/            → Navbar, Header, Footer, CardPizza
    │   ├── context/               → CartContext.jsx (carrito) y UserContext.jsx (token de sesión)
    │   ├── pages/                 → Home, Register, Login, Cart, Pizza, Profile, NotFound
    │   └── utils/                 → formatNumber.js, imagenRespaldo.js
    └── README.md                  → detalle del frontend
```

## Tecnologías utilizadas

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/) v6, [Bootstrap 5](https://getbootstrap.com/), JavaScript (ES6+).
- **Backend (material de apoyo):** Node.js y Express.

## Conceptos de React aplicados en este hito

- **Parámetros de ruta** (`/pizza/:id`) y el hook **`useParams()`**, que devuelve un objeto con los parámetros de la URL.
- **Rutas protegidas**: según el valor del token se renderiza el componente o se redirige con **`Navigate`**.
- **Context API** con un segundo contexto (`UserContext`) que convive con `CartContext`.
- **`Link`** con una ruta dinámica construida con plantilla de texto.
- `useEffect` con **`[id]`** como dependencia: vuelve a consultar la API cuando cambia el parámetro.
- Botón controlado con **`disabled`** según un valor del contexto.

> El token es **simulado** y vive solo en memoria: al recargar la página vuelve a `true`.
