# Frontend React para Inventario

Base inicial del frontend para la actividad academica del curso `PIAD-527_FULLSTACK DEVELOPER SOFTWARE`.

## Objetivo

Consumir la API REST existente con:
- autenticacion JWT
- proteccion de rutas
- vistas condicionadas por rol
- modulos iniciales de items y usuarios

## Estructura implementada

```text
frontend/
|-- src/
|   |-- components/
|   |-- context/
|   |-- hooks/
|   |-- pages/
|   |-- routes/
|   |-- services/
|   `-- styles/
|-- .env.example
|-- index.html
|-- package.json
`-- vite.config.js
```

## Vistas incluidas

- `LoginPage`
- `RegisterPage`
- `DashboardPage`
- `ItemsPage`
- `ItemDetailPage`
- `ItemFormPage`
- `UsersPage`

## Roles contemplados

- `usuario`: puede consultar items
- `admin`: puede consultar y gestionar items
- `super_admin`: puede gestionar items y usuarios

## Pasos para ejecutar

1. Entrar a la carpeta `frontend`
2. Instalar dependencias con `npm install`
3. Copiar `.env.example` a `.env`
4. Ejecutar `npm run dev`

## Variable de entorno

```env
VITE_API_URL=http://localhost:3002
```
