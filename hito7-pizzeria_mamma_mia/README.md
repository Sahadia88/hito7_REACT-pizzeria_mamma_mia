# Pizzería Mamma Mía – Hito 7

Séptima etapa del proyecto **Pizzería Mamma Mía**, desarrollado con **React**. En este hito se completa **React Router II**: el detalle de cada pizza se obtiene con el hook **`useParams`**, se crea un **`UserContext`** con el token (simulado) de sesión y se implementan **rutas protegidas**. Se mantiene todo lo construido en los Hitos 1, 2, 3, 4, 5 y 6.

> **Importante:** esta versión sigue necesitando el backend de pizzas corriendo en `http://localhost:5000` (para `Home` y `Pizza`). Por eso no tiene demo en línea (ver sección *Levantar el backend*). El backend viene incluido en la carpeta `backend-pizzas` de este repositorio.

## Descripción

La aplicación muestra una pizzería con:

- Una barra de navegación que cambia según la sesión (`token`): con sesión muestra **Profile** y **Logout**; sin sesión, **Login** y **Register**. **Home** y el botón con el **total real del carrito** (que lleva a `/cart`) siempre se ven.
- Un encabezado con imagen de fondo, título y descripción.
- Tarjetas de pizzas generadas dinámicamente a partir de los datos que entrega la **API de pizzas** (backend local).
- Una vista de detalle (`Pizza`) que lee el `id` de la URL con `useParams` y consulta a la API esa pizza. Se llega desde el botón **Ver Más** de cada tarjeta.
- Un carrito de compras global: las pizzas se agregan desde `Home` (y `Pizza`), y en `Cart` se puede aumentar o disminuir la cantidad de cada una y ver el total. El botón **Pagar** se deshabilita si no hay sesión.
- Formularios de Register y Login con validaciones.
- Una página de perfil (`Profile`), **protegida**: solo se puede ver con la sesión iniciada. Tiene un botón de cerrar sesión que funciona.
- Una página de error (`NotFound`) para las rutas que no existen.
- Un pie de página con los derechos reservados.

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home` | Página principal con las pizzas |
| `/register` | `Register` | Formulario de registro. Con sesión iniciada redirige a `/` |
| `/login` | `Login` | Formulario de inicio de sesión. Con sesión iniciada redirige a `/` |
| `/cart` | `Cart` | Carrito de compras |
| `/pizza/:id` | `Pizza` | Detalle de la pizza según el `id` de la URL (por ejemplo `/pizza/p001`) |
| `/profile` | `Profile` | Perfil del usuario. **Ruta protegida**: sin sesión redirige a `/login` |
| `/404` | `NotFound` | Página de error |
| `*` (cualquier otra) | — | Redirige a `/404` |

## Tecnologías utilizadas

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/) (`react-router-dom` v6)
- [Bootstrap 5](https://getbootstrap.com/)
- JavaScript (ES6+), JSX y CSS

## Estructura del proyecto

```
src/
├── assets/
│   └── img/              → imágenes locales (fondo del Header y pizzas)
├── components/           → piezas reutilizables
│   ├── CardPizza.jsx     → tarjeta reutilizable de una pizza
│   ├── Footer.jsx        → pie de página
│   ├── Header.jsx        → encabezado con imagen de fondo
│   └── Navbar.jsx        → barra de navegación (Link, total del CartContext y botones según el token del UserContext)
├── context/              → estado global (Hitos 6 y 7)
│   ├── CartContext.jsx   → contexto y Provider del carrito
│   └── UserContext.jsx   → contexto y Provider del token de sesión (Hito 7)
├── pages/                → una página por cada ruta (Hito 5)
│   ├── Cart.jsx          → carrito de compras; botón Pagar según el token (Hito 7)
│   ├── Home.jsx          → página principal (Header + CardPizza), consume la API (Hito 4)
│   ├── Login.jsx         → formulario de inicio de sesión (inicia la sesión con login del contexto)
│   ├── NotFound.jsx      → página 404 (Hito 5)
│   ├── Pizza.jsx         → detalle de una pizza; id con useParams (Hito 7)
│   ├── Profile.jsx       → perfil del usuario, ruta protegida (Hito 7)
│   └── Register.jsx      → formulario de registro
├── pizzas.js             → datos locales de respaldo (imágenes); pizzaCart ya no se usa
├── utils/
│   ├── formatNumber.js   → función para formatear números (separador de miles)
│   └── imagenRespaldo.js → imagen local de respaldo si falla la de la API
├── App.css               → estilos propios de la aplicación
├── App.jsx               → componente raíz con las rutas (incluye las protegidas)
├── index.css
└── main.jsx              → punto de entrada (BrowserRouter + UserProvider + CartProvider)
```

## Levantar el backend

El backend (**Material de apoyo - Backend Pizzas**) está incluido en este repositorio, en la carpeta `backend-pizzas` (al lado de este proyecto). **No se modifica**: solo se levanta.

1. Abre una terminal en la carpeta `backend-pizzas` e instala las dependencias:

   ```bash
   npm install
   ```

2. Inicia el servidor:

   ```bash
   npm start
   ```

El servidor queda disponible en el puerto **5000**. En este hito se usan estos endpoints (el `id` de la pizza ahora viene de la URL):

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `http://localhost:5000/api/pizzas` | Devuelve un arreglo con todas las pizzas |
| GET | `http://localhost:5000/api/pizzas/:id` | Devuelve una pizza según su id (por ejemplo `p001`). Si no existe responde `404` |

## Novedades del Hito 7

### `useParams` en `Pizza`
La ruta ahora tiene un **parámetro**: `<Route path="/pizza/:id" element={<Pizza />} />`. Antes era fija (`/pizza/p001`). Dentro de `Pizza`, el hook `useParams()` devuelve un objeto con los parámetros de la URL, y de ahí se saca el `id`:

```jsx
const { id } = useParams();
// ...
const response = await fetch(`http://localhost:5000/api/pizzas/${id}`);
```

- El `useEffect` ahora tiene `[id]` como dependencia: si el `id` cambia, se vuelve a consultar la API.
- Si el backend responde `404` (no existe ese id, por ejemplo `/pizza/xyz`), se muestra el mensaje *"No encontramos ninguna pizza con el id ..."*.
- En `CardPizza`, el botón **Ver Más** pasó de `<button>` a un **`Link`** que lleva a `/pizza/${id}`.

### `context/UserContext.jsx`
Mismo patrón del Hito 6 (**crear**, **proveer**, **consumir**). Guarda el **token simulado**:

| Valor | Qué hace |
|---|---|
| `token` | Estado booleano. **Por defecto es `true`** (sesión iniciada) |
| `logout()` | Cambia el token a `false` |
| `login()` | Cambia el token a `true`. Se agregó para poder volver a iniciar sesión después de hacer logout (el formulario de Login lo llama al validar bien los datos) |

`UserProvider` envuelve a `CartProvider` y `App` en `main.jsx`.

### `Navbar`
Lee `token` y `logout` del `UserContext`. Con un **operador ternario** muestra:

- `token = true` → **Profile** y **Logout**. El botón Logout ejecuta `logout`.
- `token = false` → **Login** y **Register**.
- **Home** y **Total** siempre están visibles.

Esto recupera la lógica con `token` del Hito 1, pero ahora el valor viene del contexto y no de una variable fija.

### `Cart`
Lee `token` del `UserContext`. El botón **Pagar** queda deshabilitado (`disabled={!token}`) cuando no hay sesión, y aparece un texto que avisa que hay que iniciar sesión.

### Rutas protegidas en `App`
`App` lee el `token` y decide qué renderizar en cada ruta, usando el componente **`Navigate`**:

```jsx
<Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
<Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
<Route path="/register" element={token ? <Navigate to="/" replace /> : <Register />} />
```

| Ruta | token `true` | token `false` |
|---|---|---|
| `/profile` | Muestra el perfil | Redirige a `/login` |
| `/login` | Redirige a `/` | Muestra el formulario |
| `/register` | Redirige a `/` | Muestra el formulario |

La redirección funciona también si se escribe la URL directamente en el navegador.

### `Profile` y `Login`
- El botón **Cerrar sesión** de `Profile` ahora ejecuta `logout`. Como `/profile` es protegida, la aplicación redirige sola a `/login`.
- `Login`, cuando los datos son válidos, llama a `login()`. Como con `token = true` la ruta `/login` redirige al Home, el usuario llega al Home con la sesión iniciada. Sigue siendo una sesión **simulada**: no se consulta al backend.

### Cómo probarlo
1. Al abrir la app el token es `true`: el Navbar muestra Profile y Logout, y `/login` y `/register` redirigen al Home.
2. Haz click en **Logout**: aparecen Login y Register, `/profile` redirige a `/login` y el botón **Pagar** del carrito queda deshabilitado.
3. Entra a `/login`, escribe un email y una contraseña de 6 o más caracteres y envía: vuelves al Home con la sesión iniciada.
4. Prueba `/pizza/p001`, `/pizza/p002` y `/pizza/xyz` (esta última muestra el mensaje de pizza no encontrada).

> **Nota:** el token vive solo en memoria. Si recargas la página (F5), vuelve a su valor por defecto (`true`).

### Conceptos aplicados
- **Parámetros de ruta** (`:id`) y el hook **`useParams()`**, que devuelve un objeto con los parámetros de la URL.
- **Rutas protegidas**: condicionar con una variable (el token) si se renderiza un componente o se redirige con **`Navigate`**.
- Un **segundo contexto** (`UserContext`) conviviendo con `CartContext`.
- **`Link`** con ruta dinámica construida con una plantilla de texto (`` `/pizza/${id}` ``).
- Atributo **`disabled`** de un botón controlado por un valor del contexto.
- Dependencia `[id]` en `useEffect` para volver a consultar cuando cambia el parámetro.

> Ejercicios de la guía que no se realizaron en esta entrega: `NavLink` con clase `active`, `useNavigate` y la vista de registro de usuarios real con backend.

## Novedades del Hito 6

### Los tres pasos de un contexto
Según la guía, trabajar con Context siempre implica **crear**, **proveer** y **consumir**:

1. **Crear** el contexto: `export const CartContext = createContext()`.
2. **Proveer**: `CartProvider` guarda el estado y envuelve a la aplicación en `main.jsx`.
3. **Consumir**: cualquier componente usa `useContext(CartContext)`.

### `context/CartContext.jsx`
Contiene el estado `cart` (arreglo que parte **vacío**) y entrega por `value`:

| Valor | Qué hace |
|---|---|
| `cart` | Arreglo de pizzas agregadas: `{ id, name, price, img, count }` |
| `total` | Suma de `price × count` de todas las pizzas, calculada con `reduce` |
| `agregarAlCarrito(pizza)` | Si la pizza ya está, suma 1 a `count`; si no, la agrega con `count: 1` |
| `aumentar(id)` | Suma 1 a la cantidad |
| `disminuir(id)` | Resta 1; si llega a 0, la elimina con `filter` |

```jsx
<CartContext.Provider value={{ cart, total, agregarAlCarrito, aumentar, disminuir }}>
  {children}
</CartContext.Provider>
```

### `main.jsx`
`CartProvider` envuelve a `App` (dentro de `BrowserRouter`). Así el `Navbar` y todas las páginas quedan dentro del Provider.

### `Navbar`
Consume `total` del contexto y lo muestra en el botón **Total: $xxx**. Ya no usa un valor fijo.

### `CardPizza` (Home)
El botón **Añadir** llama a `agregarAlCarrito({ id, name, price, img })`. `Home` no cambió: las tarjetas ya recibían esos datos por props.

### `Pizza`
El botón **Añadir al carrito** también usa `agregarAlCarrito` con los datos de la pizza consultada a la API.

### `Cart`
Ya no tiene `useState` ni calcula nada por su cuenta: lee `cart`, `total`, `aumentar` y `disminuir` del contexto. Como **Navbar y Cart leen el mismo `total`**, siempre muestran el mismo valor. Si el carrito está vacío muestra *"Tu carrito está vacío."*.

### Conceptos aplicados
- **Estado local**: cada componente tiene sus propios estados y no se comparten solos.
- **Prop drilling**: pasar props por muchos componentes se vuelve incómodo; Context lo evita.
- **`createContext`**, **`Provider`** (con `value` y `children`) y **`useContext`**.
- Cuando cambia el valor del Provider, los **consumers se vuelven a renderizar**.
- **Estado derivado**: `total` no se guarda en un estado, se calcula desde `cart`.
- **Inmutabilidad**: se actualiza el carrito con `map`, `filter` y *spread*, sin modificar el arreglo original.

> Ejercicio opcional del hito (llevar el `fetch` de las pizzas a un Context): no se realizó en esta entrega.

## Novedades del Hito 5

### Instalación y configuración de React Router
Se instaló el paquete con:

```bash
npm install react-router-dom@6
```

En `main.jsx` la aplicación se envuelve con **`BrowserRouter`**, que mantiene la interfaz sincronizada con la URL del navegador:

```jsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

### Carpeta `pages`
Los componentes `Home`, `Register`, `Login`, `Cart` y `Pizza` se trasladaron de `components/` a `pages/`, porque cada uno representa una **página completa** asociada a una ruta. En `components/` quedaron las piezas reutilizables (`Navbar`, `Header`, `Footer`, `CardPizza`).

### `App`
Se eliminó el estado `vista` y los renderizados condicionales. Ahora `App` define las rutas con **`Routes`** y **`Route`**: cada `Route` indica un `path` y el componente (`element`) que se muestra cuando la URL coincide. `Navbar` y `Footer` quedan fuera de `Routes`, por lo que se ven en todas las páginas.

```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/register" element={<Register />} />
  <Route path="/login" element={<Login />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/pizza/p001" element={<Pizza />} />
  <Route path="/profile" element={<Profile />} />
  <Route path="/404" element={<NotFound />} />
  <Route path="*" element={<Navigate to="/404" replace />} />
</Routes>
```

### `NotFound`
Página que se muestra cuando la ruta no existe. Incluye un mensaje temático y un enlace (`Link`) para volver a `/`. Se usa en dos casos: al entrar directamente a `/404` y como ruta por defecto: la ruta `path="*"` coincide con cualquier URL no definida y redirige a `/404` con `Navigate`.

### `Profile`
Muestra el email del usuario y un botón **Cerrar sesión**. Por ahora ambos son **estáticos**: la autenticación se trabajará en los próximos hitos.

### `Navbar`
Se reescribió usando **`Link`** en lugar de botones con `onClick`. Contiene enlaces a `/` (Home), `/login`, `/register` y `/profile`, y el botón **Total: $xxx** que lleva a `/cart`. Ya no recibe la prop `onNavegar`. Se retiró el botón *Pizza* del Navbar, porque la ruta `/pizza/p001` no se configura ahí.

> En el Hito 5 los enlaces de sesión (Login, Register, Profile) se mostraban todos a la vez para poder recorrer cada ruta. En el Hito 7 volvió la lógica con `token`.

### Conceptos aplicados
- **React Router** divide una aplicación en distintas URLs, mejorando la usabilidad.
- **`BrowserRouter`**: componente que mantiene la UI actualizada según la URL; todos los componentes van dentro de él.
- **`Routes` y `Route`**: `Routes` agrupa las rutas y `Route` asocia un `path` con un componente. Aunque se escriben varias, solo se renderiza una.
- **`Link`**: funciona como la etiqueta `<a>`, pero redirige con React Router **sin recargar el navegador**.
- **Ruta por defecto** con `path="*"` para URLs que no coinciden con ninguna ruta.
- **SPA** (*Single Page Application*): toda la aplicación se carga en un único HTML y solo se actualizan parcialmente los componentes según la ruta.

## Novedades del Hito 4

### `Home`
Ahora las pizzas **no se importan** desde `pizzas.js`. El componente tiene tres estados: `pizzas` (arreglo que parte vacío), `cargando` y `error`. Dentro de `useEffect(..., [])` se define y se llama la función `consultarApi`, que hace `fetch` al endpoint `/api/pizzas`, convierte la respuesta con `response.json()` y guarda el resultado con `setPizzas`. Luego renderiza un `CardPizza` por cada pizza con `map`.

### `Pizza`
Nuevo componente que muestra **una sola pizza**. Su estado parte en `null` (no en `[]`, porque es un objeto y no una lista). Con `useEffect` consulta `/api/pizzas/p001` (id fijo por ahora; será dinámico en el siguiente hito) y muestra:

- Nombre
- Precio (formateado con `formatNumber`)
- Ingredientes (con `map` y `key`)
- Imagen
- Descripción

El botón **Añadir al carrito** todavía no tiene funcionalidad.

### Imagen de respaldo (`utils/imagenRespaldo.js`)
Las imágenes que entrega la API son enlaces externos que pueden caducar. Si una imagen no carga, el evento `onError` del `<img>` la reemplaza por la imagen local de esa pizza (`assets/img`), buscándola por su id. Los datos (nombre, precio, ingredientes, descripción) siguen viniendo siempre de la API.

### `App` y `Navbar`
Se agrega la vista `pizza` al estado `vista`, y el `Navbar` suma un botón **Pizza** para llegar a ella. *(En el Hito 5 el estado `vista` se reemplaza por React Router.)*

### Conceptos aplicados
- **Efectos secundarios** (*side effects*): acciones que no ocurren durante el renderizado, como pedir datos a una API.
- Hook **`useEffect`** y sus tres fases del ciclo de vida: montaje, actualización y desmontaje.
- **Arreglo de dependencias**: sin arreglo el efecto corre en cada render; con `[]` solo al montar; con `[valor]` cuando ese valor cambia. Para consumir una API se usa `[]`.
- **`fetch` con `async/await`** y manejo de errores con `try/catch/finally`. La función que consulta se define **dentro** del efecto, como recomienda la regla de ESLint de React 19 para evitar `setState` síncrono dentro de un efecto.
- Estados de carga (`cargando`) y de error (`error`) para mejorar la experiencia mientras llega la respuesta.
- **Modo estricto** (`StrictMode`): en desarrollo React monta los componentes dos veces para detectar fallos, por eso la petición puede verse duplicada en la pestaña *Network*. En producción ocurre una sola vez.
- Diferencia entre **montaje** (el componente aparece por primera vez en el DOM) y **renderizado** (React calcula lo que se muestra; ocurre en el montaje y en cada actualización).
- Idea de **DOM virtual**: React registra los cambios en un objeto y los aplica de forma ordenada al DOM real, que es más costoso de manipular.
- Hook **`useRef`** (visto en la guía): guarda una referencia a un elemento del DOM o un valor mutable sin provocar nuevos renderizados.

## Novedades del Hito 3

### `pizzas.js`
Archivo de datos con dos arrays exportados: `pizzas` (6 pizzas con id, nombre, precio, ingredientes, descripción e imagen) y `pizzaCart` (carrito simulado con 3 pizzas y su cantidad). Las imágenes son archivos locales de `assets/img`, importados al inicio del archivo.

### `Home`
Importa `pizzas` y lo recorre con `map`, renderizando un `CardPizza` por cada pizza (6 tarjetas), con `key={pizza.id}`.

### `CardPizza`
Muestra los datos recibidos por props y recorre `ingredients` con `map` para renderizar un `<li>` por cada ingrediente.

### `Cart`
Usa `useState(pizzaCart)` para manejar el carrito. Muestra imagen, nombre, precio y cantidad de cada pizza, con botones **+** y **-** (si la cantidad llega a 0 la pizza se elimina), calcula el **total** con `reduce` e incluye un botón **Pagar** (sin funcionalidad por ahora).

### `App` y `Navbar`
Se agrega la vista `cart` al estado `vista`; el botón del total en el `Navbar` lleva al carrito.

### Conceptos aplicados
`map` con `key`, props, `useState` con arrays, copias inmutables (spread y `map`), `filter` para eliminar, `reduce` para sumar y renderizado condicional.

> En el Hito 4, `Home` dejó de usar el arreglo `pizzas` de `pizzas.js` y pasó a consumir la API; `Cart` sigue usando `pizzaCart`.

## Novedades del Hito 2

### `Register`
Formulario con **Email**, **Contraseña** y **Confirmar contraseña**. Al enviar valida que:

1. Ningún campo esté vacío.
2. La contraseña tenga al menos 6 caracteres.
3. La contraseña y su confirmación sean iguales.

Si algo falla muestra un mensaje de error; si todo está correcto, un mensaje de éxito.

### `Login`
Formulario con **Email** y **Contraseña**. Valida que no haya campos vacíos y que la contraseña tenga al menos 6 caracteres, mostrando mensaje de error o de éxito.

### `App` y `Navbar`
`App` guarda en un estado (`vista`) qué pantalla se muestra (`home`, `login` o `register`) y los botones del `Navbar` lo cambian mediante el evento `onClick`.

### Conceptos aplicados
`useState`, inputs controlados (`value` + `onChange`), `onSubmit` con `e.preventDefault()`, renderizado condicional (`&&`) y paso de funciones por props.

## Componentes del Hito 1

### `App`
Componente raíz. Muestra `Navbar`, `Home` y `Footer`, en ese orden.

### `Navbar`
Barra de navegación con Bootstrap. Contiene dos variables simuladas:

- `total`: número que representa el total de la compra. Se muestra con separador de miles (por ejemplo `25.000`).
- `token`: booleano que simula si el usuario inició sesión. Se usa un **operador ternario** para mostrar:
  - `token = true` → botones **Profile** y **Logout**
  - `token = false` → botones **Login** y **Register**

Los botones **Home** y **Total** se muestran siempre, sin importar el valor de `token`.

### `Home`
Página principal. Incluye el componente `Header` y utiliza `CardPizza` tres veces, pasándole los datos de cada pizza mediante props. Las tarjetas se distribuyen con la grilla de Bootstrap (tres por fila en pantallas medianas y grandes, una por fila en pantallas pequeñas).

### `Header`
Muestra un título y una descripción sobre una imagen de fondo con una capa oscura semitransparente para que el texto se lea bien.

### `CardPizza`
Tarjeta reutilizable que recibe las siguientes **props**:

| Prop | Tipo | Descripción |
|---|---|---|
| `name` | string | Nombre de la pizza |
| `price` | number | Precio de la pizza |
| `ingredients` | array | Lista de ingredientes |
| `img` | string | Imagen de la pizza |

Muestra la imagen, el nombre, los ingredientes, el precio formateado y los botones **Ver Más** y **Añadir** (sin funcionalidad por ahora).

### `Footer`
Pie de página con el texto: *© 2021 - Pizzería Mamma Mia! - Todos los derechos reservados*.

## Conceptos de React aplicados

- Creación de **componentes funcionales** y su composición (componentes dentro de componentes).
- **JSX** y uso de expresiones de JavaScript con `{ }`.
- Paso de datos entre componentes mediante **props** y desestructuración.
- **Renderizado condicional** con operador ternario.
- Importación de **imágenes locales** como módulos.
- Estilos con **Bootstrap** y CSS propio.
- Organización del código en carpetas (`components`, `utils`, `assets`).
- **Consumo de APIs** con `fetch`, `async/await` y el hook `useEffect`.
- **Enrutamiento** con React Router (`BrowserRouter`, `Routes`, `Route`, `Link`, `Navigate`).
- **Estado global** con Context API (`createContext`, `Provider`, `useContext`).
- **Parámetros de ruta** con `useParams` y **rutas protegidas** con `Navigate`.

## Instalación y uso

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Sahadia88/hito7_REACT-pizzeria_mamma_mia.git
   ```

2. Entra a la carpeta del frontend:

   ```bash
   cd hito7_REACT-pizzeria_mamma_mia/hito7-pizzeria_mamma_mia
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. **Levanta el backend de pizzas** en el puerto 5000, desde otra terminal (ver sección *Levantar el backend*).

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre en el navegador la dirección que aparece en la terminal (normalmente `http://localhost:5173`).

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo |
| `npm run build` | Genera la versión de producción |
| `npm run preview` | Previsualiza la versión de producción |
| `npm run lint` | Revisa el código con ESLint |
