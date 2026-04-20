# API Backend con Node.js, Express, MySQL, JWT y Docker

Proyecto academico completo para implementar una API REST con autenticacion JWT y CRUD de items usando Node.js, Express y MySQL en linea con Aiven for MySQL.

## Tecnologias usadas

- Node.js
- Express
- MySQL (`mysql2`)
- JWT (`jsonwebtoken`)
- `bcryptjs`
- Docker
- Git / GitHub

## Estructura del proyecto

```bash
.
|-- src
|   |-- config
|   |   `-- db.js
|   |-- controllers
|   |   |-- authController.js
|   |   `-- itemController.js
|   |-- middlewares
|   |   `-- authMiddleware.js
|   `-- routes
|       |-- authRoutes.js
|       `-- itemRoutes.js
|-- .env.example
|-- .gitignore
|-- database.sql
|-- docker-compose.yml
|-- Dockerfile
|-- package.json
|-- README.md
`-- server.js
```

## 1. Crear proyecto e instalar dependencias

Si quieres repetir el proceso manualmente:

```bash
npm init -y
npm install express dotenv mysql2 bcryptjs jsonwebtoken cors
npm install nodemon -D
```

## 2. Configurar Aiven for MySQL

1. Ingresa a tu proyecto en Aiven Console.
2. Crea o usa un servicio de `MySQL`, no uno de Kafka.
3. Copia estos datos del servicio:
   - Host
   - Puerto
   - Usuario
   - Password
   - Nombre de la base de datos
4. Conectate con un cliente MySQL compatible y ejecuta el contenido de [database.sql](/d:/API_BAKEND/database.sql).
5. Si tu servicio usa `SSL mode = REQUIRED`, esta API ya incluye soporte para `mysql2` con SSL configurable por variables de entorno.

## 3. Configurar variables de entorno

1. Copia `.env.example` como `.env`
2. Completa tus credenciales reales:

```env
PORT=3001
DB_HOST=tu-host-mysql.aivencloud.com
DB_PORT=12345
DB_USER=avnadmin
DB_PASSWORD=tu_password
DB_NAME=defaultdb
DB_SSL=true
DB_SSL_MODE=REQUIRED
DB_SSL_REJECT_UNAUTHORIZED=true
DB_SSL_CA=
JWT_SECRET=super_clave_secreta_jwt
JWT_EXPIRES_IN=2h
```

`DB_SSL_CA` es opcional. Si Aiven te entrega un certificado CA, puedes pegarlo en una sola linea reemplazando los saltos de linea por `\n`.

## 4. Ejecutar el proyecto

### Modo desarrollo

```bash
npm install
npm run dev
```

### Modo produccion

```bash
npm install
npm start
```

El servidor debe quedar disponible en:

```bash
http://localhost:3001
```

## 5. Ejecutar con Docker

```bash
docker compose up --build
```

## 6. Endpoints disponibles

### Prueba

- `GET /`

Respuesta:

```json
{
  "mensaje": "API funcionando"
}
```

### Autenticacion

- `POST /register`
- `POST /login`

#### Registrar usuario

```http
POST /register
Content-Type: application/json
```

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

#### Login

```http
POST /login
Content-Type: application/json
```

```json
{
  "email": "usuario@correo.com",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "mensaje": "Login exitoso",
  "token": "jwt_token_aqui"
}
```

### CRUD protegido con Bearer Token

Incluye el token en el header:

```http
Authorization: Bearer TU_TOKEN
```

- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

#### Crear item

```json
{
  "nombre": "Laptop",
  "descripcion": "Equipo de desarrollo",
  "estado": true
}
```

#### Actualizar item

```json
{
  "nombre": "Laptop Pro",
  "descripcion": "Equipo actualizado",
  "estado": false
}
```

## 7. Flujo sugerido para Postman

1. `GET /`
2. `POST /register`
3. `POST /login`
4. Copiar el token
5. Probar el CRUD completo de `/api/items`

## 8. Subir a GitHub

```bash
git init
git add .
git commit -m "feat: API backend con autenticacion JWT y CRUD de items"
git branch -M main
git remote add origin TU_REPOSITORIO
git push -u origin main
```

## 9. Observaciones

- La autenticacion usa JWT con expiracion configurable.
- Las contrasenas se almacenan cifradas con `bcryptjs`.
- Todas las rutas de `/api/items` estan protegidas.
- `.env` no debe subirse al repositorio.
- La conexion de [src/config/db.js](/d:/API_BAKEND/src/config/db.js:1) ya soporta Aiven MySQL con `SSL mode = REQUIRED`.
- `mysql2` permite habilitar TLS con `ssl: {}` cuando la CA ya es confiable en el sistema, y tambien acepta `ssl.ca` si necesitas enviar el certificado por variable de entorno.
- Aiven recomienda configurar el certificado CA en algunos clientes MySQL. Si tu entorno no confia la CA automaticamente, deberas cargarla en `DB_SSL_CA`.
