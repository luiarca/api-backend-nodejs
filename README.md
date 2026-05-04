# API Backend con Node.js, Express, MySQL, JWT, Roles y Docker

Actividad academica del curso `PIAD-527_FULLSTACK DEVELOPER SOFTWARE`.

Esta API REST usa Node.js, Express y MySQL en linea con Aiven. Incluye autenticacion con JWT, sistema de roles (`super_admin`, `admin`, `usuario`), CRUD completo de items y configuracion para Docker.

## Objetivo cumplido

- API backend funcional
- MySQL en linea con Aiven
- Autenticacion JWT
- Sistema de roles
- CRUD completo
- Docker listo para usar
- README actualizado con las nuevas modificaciones

## Tecnologias

- Node.js
- Express
- MySQL con `mysql2`
- JWT con `jsonwebtoken`
- `bcryptjs`
- Docker
- Git / GitHub

## Estructura

```bash
.
|-- src
|   |-- config
|   |   `-- db.js
|   |-- controllers
|   |   |-- adminController.js
|   |   |-- authController.js
|   |   `-- itemController.js
|   |-- middlewares
|   |   |-- authMiddleware.js
|   |   `-- roleMiddleware.js
|   `-- routes
|       |-- adminRoutes.js
|       |-- authRoutes.js
|       `-- itemRoutes.js
|-- .env.example
|-- database.sql
|-- docker-compose.yml
|-- Dockerfile
|-- package.json
|-- README.md
`-- server.js
```

## Instalacion

```bash
npm init -y
npm install express dotenv mysql2 bcryptjs jsonwebtoken cors
npm install nodemon -D
```

## Variables de entorno

Copia `.env.example` a `.env` y completa los datos de Aiven:

```env
PORT=3002
DB_HOST=mysql-xxxxx.aivencloud.com
DB_PORT=17888
DB_USER=avnadmin
DB_PASSWORD=tu_password
DB_NAME=backend_api
DB_SSL=true
DB_SSL_MODE=REQUIRED
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA=
JWT_SECRET=super_clave_secreta_jwt
JWT_EXPIRES_IN=2h
SUPER_ADMIN_EMAIL=superadmin@correo.com
SUPER_ADMIN_PASSWORD=123456
```

`DB_SSL_CA` es opcional y sirve para pegar el certificado CA de Aiven en una sola linea usando `\n`.
`SUPER_ADMIN_EMAIL` y `SUPER_ADMIN_PASSWORD` son opcionales, pero recomendados para crear automaticamente el primer `super_admin`.

## Base de datos

Ejecuta [database.sql](/d:/API_BAKEND/database.sql:1) en tu servicio MySQL de Aiven.

Al iniciar la aplicacion, tambien se verifica que existan las tablas necesarias y, si definiste `SUPER_ADMIN_EMAIL` y `SUPER_ADMIN_PASSWORD`, se crea o actualiza automaticamente ese usuario con rol `super_admin`.

La tabla `usuarios` incluye el campo `rol` con estos valores:

- `super_admin`
- `admin`
- `usuario`

## Ejecutar la API

Modo desarrollo:

```bash
npm run dev
```

Modo produccion:

```bash
npm start
```

URL base:

```text
http://localhost:3002
```

## Docker

```bash
docker compose up --build
```

## Endpoint de prueba

`GET /`

Respuesta:

```json
{
  "mensaje": "API funcionando"
}
```

## Autenticacion

### Registro publico

`POST /register`

Crea usuarios con rol `usuario`.
Si envias `rol: "admin"` o cualquier rol distinto de `usuario`, la API respondera con error.

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

### Login

`POST /login`

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

Respuesta:

```json
{
  "mensaje": "Usuario ingreso correctamente",
  "token": "jwt_token",
  "usuario": {
    "id": 1,
    "email": "usuario@correo.com",
    "rol": "usuario"
  }
}
```

Si el correo no existe, responde:

```json
{
  "mensaje": "Usuario no encontrado"
}
```

Si la contrasena no coincide, responde:

```json
{
  "mensaje": "Contrasena incorrecta"
}
```

### Registro por admin o super_admin

`POST /register/admin`

Requiere Bearer Token.

- `admin` solo puede crear `usuario`
- `super_admin` puede crear `admin` o `usuario`

Ejemplo:

```json
{
  "email": "admin@correo.com",
  "password": "123456",
  "rol": "admin"
}
```

Usa esta ruta cuando quieras que un `super_admin` cree un `admin`.
No uses `POST /register` para eso, porque esa ruta es solo para registro publico.

## Roles del sistema

- `usuario`: puede listar y consultar items
- `admin`: puede listar, consultar, crear, actualizar y eliminar items
- `super_admin`: puede hacer todo lo de `admin` y ademas gestionar usuarios

## CRUD de items

Todas las rutas usan Bearer Token.

- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

Crear item:

```json
{
  "nombre": "Laptop",
  "descripcion": "Equipo de desarrollo",
  "estado": true
}
```

Actualizar item:

```json
{
  "nombre": "Laptop Pro",
  "descripcion": "Equipo actualizado",
  "estado": false
}
```

## Rutas de administracion

Solo `super_admin`.

- `POST /api/admin/users`
- `GET /api/admin/users`
- `PUT /api/admin/users/:id/role`
- `DELETE /api/admin/users/:id`

Crear usuario administrado:

```json
{
  "email": "nuevoadmin@correo.com",
  "password": "123456",
  "rol": "admin"
}
```

Desde esta ruta solo se permite crear usuarios con rol `admin` o `usuario`.

Cambiar rol:

```json
{
  "rol": "admin"
}
```

## Flujo sugerido para Postman

1. `GET /`
2. `POST /register`
3. `POST /login`
4. Probar `GET /api/items` con token
5. Probar CRUD completo con `admin` o `super_admin`
6. Probar rutas `/api/admin/users` con `super_admin`
7. Si configuraste `SUPER_ADMIN_EMAIL`, usa esas credenciales para probar las rutas administrativas

## Nuevas modificaciones

- Se agrego sistema de roles con `super_admin`, `admin` y `usuario`
- Se protegieron rutas segun el rol del usuario
- Se agregaron rutas administrativas para gestionar usuarios
- Se mantuvo compatibilidad con Aiven MySQL y SSL requerido
- Se actualizo `database.sql` para incluir el campo `rol`
- Se agrego bootstrap automatico para tablas y `super_admin` inicial opcional
- Se reorganizo la API para que `server.js`, middlewares y rutas queden consistentes
- Se cambio el puerto recomendado a `3002` para evitar conflicto local con `3001`

## GitHub

Para subir el proyecto:

```bash
git add .
git commit -m "feat: API backend con JWT, roles y CRUD completo"
git branch -M main
git remote add origin TU_REPOSITORIO
git push -u origin main
```
