# INVESTIGACION: FUNDAMENTOS DE REACT PARA FRONTEND DE INVENTARIO

## 1. SPA (Single Page Application)
Una SPA es una aplicacion web que carga una sola pagina HTML y luego actualiza el contenido desde JavaScript sin recargar todo el sitio en cada cambio de vista. En React esto ocurre porque la interfaz se divide en componentes que se renderizan de forma dinamica segun el estado de la aplicacion y la ruta activa.

En un sistema tradicional, cada vez que el usuario cambia de modulo el navegador solicita una pagina completa al servidor. En cambio, en una SPA el backend expone datos mediante una API REST y el frontend decide como mostrarlos. Esto encaja muy bien con nuestro proyecto porque ya contamos con un backend en Node.js, Express, MySQL y JWT.

La utilidad de una SPA para el sistema de inventario es clara:
- Permite navegar entre login, dashboard, items y usuarios sin recargar toda la pagina.
- Hace mas rapida la experiencia de consulta y gestion del inventario.
- Facilita mostrar mensajes, validaciones y cambios de estado en tiempo real de forma visual.
- Se integra naturalmente con autenticacion por token y control de roles.

**Aplicacion en nuestro proyecto:** el usuario inicia sesion una sola vez, React guarda la sesion actual, consulta los endpoints protegidos con JWT y muestra vistas segun el rol (`usuario`, `admin`, `super_admin`). Asi se logra una experiencia mas fluida para listar productos, crear items o administrar usuarios sin saltos de pagina.

## 2. Estructura de Proyectos React
Un proyecto React moderno suele organizarse por responsabilidades. Aunque existen varias formas validas de estructurarlo, lo recomendable es separar componentes visuales, paginas, servicios, contexto global, rutas y estilos. Esta organizacion facilita el mantenimiento, el trabajo en equipo y el crecimiento del sistema.

En React actual es comun iniciar el proyecto con Vite por su rapidez, simplicidad y buen soporte para desarrollo moderno. A partir de ahi, la carpeta `src` concentra la mayor parte del codigo.

**Estructura propuesta:**

```text
frontend/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- auth/
|   |   |-- items/
|   |   |-- layout/
|   |   `-- users/
|   |-- context/
|   |-- hooks/
|   |-- pages/
|   |-- routes/
|   |-- services/
|   |-- styles/
|   |-- App.jsx
|   `-- main.jsx
|-- .env.example
|-- package.json
`-- vite.config.js
```

Carpetas y archivos esenciales:
- `main.jsx`: punto de entrada de React.
- `App.jsx`: composicion principal de la app.
- `pages/`: vistas completas como login, dashboard o gestion de items.
- `components/`: piezas reutilizables como formularios, tablas, layout y tarjetas.
- `services/`: funciones para consumir la API REST.
- `context/`: estado global compartido, por ejemplo la autenticacion.
- `routes/`: configuracion de rutas publicas y protegidas.
- `.env.example`: variables para configurar la URL del backend.

**Aplicacion en nuestro proyecto:** esta estructura nos ayuda a separar la interfaz del inventario, la logica de autenticacion JWT, el consumo de endpoints y las reglas de acceso por rol sin mezclar responsabilidades.

## 3. Componentes
Los componentes son bloques reutilizables de interfaz. En React todo se construye a partir de componentes: una pagina completa, un formulario, un boton o una tabla pueden ser componentes. Su principal ventaja es que permiten reutilizar codigo, organizar la UI y mantener la aplicacion modular.

Se pueden clasificar de varias maneras:
- Componentes de presentacion: muestran informacion y reciben datos por props.
- Componentes contenedores o de pagina: coordinan estado, llamadas a la API y composicion de otros componentes.
- Componentes compartidos: se reutilizan en varias vistas, como botones, tablas, cabeceras o mensajes.

**Componentes para nuestro frontend:**
- `AppLayout`: estructura general con barra lateral, encabezado y area principal.
- `ProtectedRoute`: valida si hay sesion y si el rol tiene acceso.
- `RoleBadge`: muestra visualmente el rol del usuario autenticado.
- `LoginForm`: formulario para iniciar sesion.
- `RegisterForm`: formulario de registro publico.
- `ItemTable`: tabla de productos del inventario.
- `ItemForm`: formulario para crear o editar items.
- `ItemCard`: vista resumida de un item para dashboard o movil.
- `UserTable`: tabla de usuarios para `super_admin`.
- `UserRoleForm`: formulario para cambiar rol.
- `StatCard`: tarjetas con metricas del dashboard.

**Aplicacion en nuestro proyecto:** dividir el frontend en estos componentes permite que el listado de items, la autenticacion y la gestion de usuarios evolucionen de forma independiente, manteniendo una base clara para nuevas funcionalidades.

## 4. Estado (State)
El estado es la informacion que puede cambiar durante la vida de la aplicacion y que afecta lo que el usuario ve. Cuando el estado cambia, React vuelve a renderizar los componentes necesarios para reflejar la nueva situacion.

Hay dos tipos importantes:
- Estado local: pertenece a un componente y se usa solo dentro de esa parte de la interfaz.
- Estado global: se comparte entre varios componentes o paginas.

Ejemplos de estado local:
- Valores de un formulario de login.
- Estado de carga de una tabla.
- Texto de busqueda en el modulo de items.
- Modal abierto o cerrado.

Ejemplos de estado global:
- Usuario autenticado.
- Token JWT.
- Rol actual.
- Estado general de sesion.

**Estados necesarios en el inventario:**
- `authUser`: datos del usuario autenticado (`id`, `email`, `rol`).
- `token`: JWT para consumir la API protegida.
- `items`: lista de productos.
- `selectedItem`: item actual que se esta editando o consultando.
- `users`: listado de usuarios solo para `super_admin`.
- `loading`: indicador visual mientras llegan datos del backend.
- `error`: mensajes de error por validacion o respuesta del servidor.
- `filters`: texto de busqueda o filtros por estado.

**Aplicacion en nuestro proyecto:** React necesita manejar el estado de autenticacion para controlar rutas protegidas y el estado de datos para mostrar el inventario actualizado despues de crear, editar o eliminar registros.

## 5. Hooks
Los hooks son funciones especiales de React que permiten usar estado, efectos y otras capacidades sin escribir componentes de clase. En aplicaciones modernas son la base de la logica reutilizable.

### `useState`
Permite crear estado local dentro de un componente.

```jsx
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
```

En el inventario sirve para capturar datos de formularios, estados de carga o filtros de busqueda.

### `useEffect`
Se usa para ejecutar efectos secundarios, por ejemplo consultar la API cuando una pagina se monta.

```jsx
useEffect(() => {
  loadItems();
}, []);
```

En el inventario es util para cargar items al entrar al dashboard o consultar el detalle de un producto al abrir su pagina.

### `useContext`
Permite consumir informacion global creada con Context API, como la sesion del usuario.

```jsx
const { user, logout } = useContext(AuthContext);
```

En el inventario ayuda a evitar pasar props manualmente por muchos niveles cuando necesitamos saber si un usuario es `admin` o `super_admin`.

### `useParams`
Permite leer parametros dinamicos de la URL.

```jsx
const { id } = useParams();
```

En el inventario se usa para obtener el `id` del item cuando navegamos a una ruta como `/items/5`.

### `useNavigate`
Permite redirigir programaticamente al usuario.

```jsx
const navigate = useNavigate();

const handleSuccess = () => {
  navigate("/items");
};
```

En el inventario sirve para enviar al usuario al dashboard tras iniciar sesion o regresar al listado despues de guardar un item.

**Ejemplos practicos para el inventario:**

```jsx
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getItemById } from "../services/itemService";

export function ItemDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItem() {
      try {
        const data = await getItemById(id, token);
        setItem(data);
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id, token]);

  if (loading) return <p>Cargando item...</p>;
  if (!item) return <p>No se encontro el item.</p>;

  return (
    <section>
      <h2>{item.nombre}</h2>
      <p>{item.descripcion}</p>
      <button onClick={() => navigate("/items")}>Volver</button>
    </section>
  );
}
```

## 6. Enrutamiento con React Router
El enrutamiento en React permite cambiar de vista segun la URL sin recargar toda la pagina. La libreria mas utilizada es React Router, que facilita definir rutas publicas, rutas privadas y parametros dinamicos.

En nuestro sistema conviene separar:
- Rutas publicas: accesibles sin iniciar sesion.
- Rutas protegidas: requieren token valido.
- Rutas por rol: requieren ademas un rol especifico.

Una ruta protegida suele envolverse en un componente como `ProtectedRoute`, que verifica si existe sesion. Si no existe, redirige al login. Si existe pero el rol no coincide, puede redirigir al dashboard o mostrar acceso denegado.

**Rutas del sistema:**

| Ruta | Componente | Proteccion | Uso |
|------|------------|------------|-----|
| `/login` | `LoginPage` | Publica | Iniciar sesion |
| `/register` | `RegisterPage` | Publica | Registro publico de usuarios |
| `/` | `DashboardPage` | Protegida | Resumen general del sistema |
| `/items` | `ItemsPage` | Protegida | Listar items |
| `/items/new` | `ItemCreatePage` | `admin` o `super_admin` | Crear item |
| `/items/:id` | `ItemDetailPage` | Protegida | Ver detalle de item |
| `/items/:id/edit` | `ItemEditPage` | `admin` o `super_admin` | Editar item |
| `/users` | `UsersPage` | `super_admin` | Listar usuarios |
| `/users/new` | `UserCreatePage` | `super_admin` | Crear usuarios administrados |

**Aplicacion en nuestro proyecto:** React Router es la pieza que conecta autenticacion, roles y navegacion. Gracias a el, un `usuario` puede consultar productos, un `admin` puede gestionarlos y un `super_admin` puede ademas administrar usuarios.

## 7. Formularios y Manejo de Eventos
React maneja formularios mediante componentes controlados. Esto significa que el valor de cada campo se vincula al estado del componente, y cada cambio del usuario actualiza ese estado con eventos como `onChange`.

Ventajas de los componentes controlados:
- Validan datos antes de enviarlos.
- Reflejan inmediatamente cambios en la interfaz.
- Facilitan limpiar formularios o mostrar errores.
- Permiten integrar reglas de negocio del backend.

Eventos comunes en React:
- `onChange`: se ejecuta cuando cambia el valor de un input.
- `onSubmit`: se usa al enviar un formulario.
- `onClick`: se usa en botones o acciones de tabla.
- `onBlur`: util para validar cuando el usuario sale de un campo.

**Formularios del inventario:**
- Login con `email` y `password`.
- Registro publico con `email` y `password`.
- Creacion y edicion de item con `nombre`, `descripcion` y `estado`.
- Cambio de rol y creacion de usuarios para `super_admin`.

Ejemplo de formulario controlado para producto:

```jsx
import { useState } from "react";

export function ItemForm({ onSubmit, initialValues }) {
  const [form, setForm] = useState(
    initialValues || {
      nombre: "",
      descripcion: "",
      estado: true
    }
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={form.nombre}
        onChange={handleChange}
        placeholder="Nombre del item"
      />
      <textarea
        name="descripcion"
        value={form.descripcion}
        onChange={handleChange}
        placeholder="Descripcion"
      />
      <label>
        <input
          type="checkbox"
          name="estado"
          checked={form.estado}
          onChange={handleChange}
        />
        Activo
      </label>
      <button type="submit">Guardar</button>
    </form>
  );
}
```

**Aplicacion en nuestro proyecto:** los formularios conectan directamente la experiencia del usuario con el backend REST. Cada envio puede transformarse en una solicitud `POST` o `PUT` hacia la API, mostrando errores o confirmaciones sin salir de la misma pagina.

## Conclusion
Todos estos conceptos se relacionan entre si para construir el frontend del inventario. La SPA define la experiencia general; la estructura del proyecto organiza el codigo; los componentes dividen la interfaz en piezas reutilizables; el estado controla los datos visibles; los hooks permiten manejar logica y efectos; React Router organiza la navegacion y la seguridad; y los formularios conectan la interfaz con las operaciones del backend.

En conjunto, React se convierte en la capa visual ideal para consumir nuestra API con Node.js, Express, MySQL, JWT y roles. Gracias a esta base, el sistema puede crecer hacia una aplicacion de inventario moderna, modular, segura y facil de mantener.
