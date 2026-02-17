# 🚀 TechStore — React + Node.js + **PostgreSQL**

E-commerce profesional 100% modular. Cada función en su propio archivo.

---

## 🏗️ Estructura del Proyecto

```
ecommerce-pro/
├── package.json               ← scripts para correr ambos servicios
│
├── backend/                   ← Node.js + Express + Sequelize + PostgreSQL
│   ├── src/
│   │   ├── config/
│   │   │   ├── index.js           ← variables de entorno centralizadas
│   │   │   ├── database.js        ← conexión Sequelize a PostgreSQL
│   │   │   └── database.config.js ← config Sequelize CLI (migraciones)
│   │   ├── models/
│   │   │   ├── index.js           ← registra modelos y asociaciones
│   │   │   ├── User.js            ← tabla users (UUID, roles, bcrypt)
│   │   │   ├── Producto.js        ← tabla productos (JSONB, arrays PG)
│   │   │   └── Pedido.js          ← tabla pedidos (snapshot JSONB)
│   │   ├── controllers/
│   │   │   ├── authController.js  ← register, login, refresh, reset
│   │   │   ├── productController.js ← CRUD + filtros + búsqueda
│   │   │   ├── orderController.js ← crear pedido con transacción
│   │   │   └── userController.js  ← perfil, contraseña
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middlewares/
│   │   │   ├── auth.js            ← protect + authorize (roles)
│   │   │   ├── errorHandler.js    ← manejo global de errores
│   │   │   └── rateLimit.js       ← general + auth estricto
│   │   ├── validators/
│   │   │   └── schemas.js         ← validación Joi para todos los endpoints
│   │   ├── utils/
│   │   │   ├── AppError.js        ← clase de error operacional
│   │   │   ├── apiResponse.js     ← respuestas estandarizadas
│   │   │   ├── tokenUtils.js      ← generateAccessToken / verifyToken
│   │   │   └── logger.js          ← Winston (consola + archivo)
│   │   ├── seeders/
│   │   │   └── seed.js            ← 8 productos + 2 usuarios demo
│   │   └── server.js              ← punto de entrada Express
│   ├── .env.example
│   └── package.json
│
└── frontend/                  ← React 18 + Zustand + React Query
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── common/index.jsx   ← Button, Input, Badge, Spinner, Card
    │   │   ├── layout/
    │   │   │   ├── Header.jsx     ← nav, búsqueda, carrito, auth
    │   │   │   └── Footer.jsx
    │   │   ├── product/index.jsx  ← ProductCard + ProductGrid
    │   │   └── cart/
    │   │       └── CartSidebar.jsx ← panel deslizante
    │   ├── pages/
    │   │   ├── Home.jsx           ← hero, categorías, destacados
    │   │   └── index.jsx          ← Shop, Login, Register, Profile
    │   ├── hooks/index.js         ← useProducts, useOrders, useAuth
    │   ├── services/
    │   │   ├── api.js             ← Axios + interceptor refresh token
    │   │   └── index.js           ← authService, productService, orderService
    │   ├── store/index.js         ← Zustand: useAuthStore + useCartStore
    │   ├── utils/index.js         ← formatPrice, calcDiscount, constantes
    │   ├── styles/global.css      ← Tailwind + scrollbar
    │   ├── App.jsx                ← Router, QueryClient, guards
    │   └── index.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── .env.example
    └── package.json
```

---

## ⚡ Instalación Rápida

### 1 · Requisitos
```
Node.js  >= 18
npm      >= 9
PostgreSQL >= 14  (local o en la nube)
```

### 2 · Descomprimir y entrar al proyecto
```bash
# Extrae el .tar.gz descargado
tar -xzf techstore-postgresql.tar.gz
cd ecommerce-pro
```

### 3 · Instalar todas las dependencias
```bash
npm run install:all
# equivale a: cd backend && npm install && cd ../frontend && npm install
```

### 4 · Configurar PostgreSQL

**Opción A — Local (más fácil):**
```bash
# Crear la base de datos
psql -U postgres -c "CREATE DATABASE techstore;"
```

**Opción B — Cloud gratuita (Supabase, Neon, Railway):**
- Crea un proyecto en https://supabase.com  (plan Free)
- Copia la *Connection string* que te dan

### 5 · Variables de entorno del backend
```bash
cd backend
cp .env.example .env
# Editar .env con tu editor favorito
```

Cambios mínimos obligatorios en `.env`:
```env
# Si usas PostgreSQL local:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=techstore
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_POSTGRES

# Si usas Supabase / Neon / Railway (URL completa):
DATABASE_URL=postgresql://user:pass@host:5432/techstore

# Genera estas claves con:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=GENERA_UNA_CLAVE_AQUI
JWT_REFRESH_SECRET=GENERA_OTRA_CLAVE_DIFERENTE
```

### 6 · Variables de entorno del frontend
```bash
cd ../frontend
cp .env.example .env
# El contenido por defecto ya apunta a http://localhost:5000
```

### 7 · Cargar datos de prueba
```bash
# Desde la raíz del proyecto:
npm run seed

# Esto crea las tablas en PostgreSQL y carga:
# → 8 productos (iPhone, MacBook, Samsung, AirPods, Sony, Apple Watch…)
# → 2 usuarios de prueba
```

### 8 · Iniciar en modo desarrollo
```bash
# Desde la raíz — inicia backend Y frontend simultáneamente
npm run dev

# O por separado:
npm run backend    # → http://localhost:5000
npm run frontend   # → http://localhost:3000
```

---

## 🔑 Usuarios Demo

| Rol   | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@techstore.com      | Admin1234  |
| User  | demo@techstore.com       | Demo1234   |

---

## 📡 API Endpoints

```
# Base: http://localhost:5000/api/v1

GET    /health                       → estado de la API

# Auth
POST   /auth/register                → crear cuenta
POST   /auth/login                   → iniciar sesión
GET    /auth/me            🔒        → usuario actual
POST   /auth/logout        🔒        → cerrar sesión
POST   /auth/refresh                 → renovar access token
POST   /auth/forgot-password         → solicitar reset
PUT    /auth/reset-password/:token   → cambiar contraseña

# Productos
GET    /products                     → listar (filtros: search, categoria, precio, ordenar, page)
GET    /products/:id                 → detalle
GET    /products/slug/:slug          → por slug
GET    /products/categories/stats    → conteo por categoría
POST   /products           🔒👑     → crear (admin)
PUT    /products/:id        🔒👑    → editar (admin)
DELETE /products/:id        🔒👑   → eliminar soft (admin)

# Pedidos
POST   /orders             🔒        → crear (reduce stock con transacción)
GET    /orders/me          🔒        → mis pedidos
GET    /orders/:id         🔒        → detalle
GET    /orders             🔒👑     → todos (admin)
PATCH  /orders/:id/status  🔒👑    → cambiar estado (admin)
PATCH  /orders/:id/pay     🔒        → marcar como pagado

# Usuarios
GET    /users/profile      🔒        → ver perfil
PUT    /users/profile      🔒        → editar perfil
PUT    /users/password     🔒        → cambiar contraseña
GET    /users              🔒👑     → todos los usuarios (admin)
PATCH  /users/:id/toggle   🔒👑    → activar/desactivar (admin)

🔒 = requiere JWT     👑 = requiere rol admin
```

---

## 🔒 Seguridad Implementada

| Capa                   | Herramienta              | Detalle                                      |
|------------------------|--------------------------|----------------------------------------------|
| Hash contraseñas       | bcryptjs                 | 12 rounds de salt                            |
| Autenticación          | JWT (HS256)              | Access token 7d + Refresh token 30d          |
| Validación de datos    | Joi                      | Schemas para cada endpoint                   |
| Rate limiting          | express-rate-limit       | 100 req/15min general, 10 req/15min en auth  |
| Headers HTTP           | helmet                   | CSP, HSTS, XSS, noSniff…                    |
| CORS                   | cors                     | Whitelist de orígenes configurada            |
| Transacciones DB       | Sequelize transactions   | Pedidos: stock y registro atómicos           |
| Sanitización           | Joi stripUnknown         | Elimina campos no esperados                  |
| Roles                  | middleware authorize()   | user / admin / vendedor                      |
| Errores                | AppError + errorHandler  | Nunca expone stack en producción             |

---

## 🛠️ Tecnologías

### Backend
`Node.js 18` · `Express 4` · `PostgreSQL 14+` · `Sequelize 6` · `pg` · `JWT` · `bcryptjs` · `Joi` · `Helmet` · `Winston` · `Stripe` · `Nodemailer`

### Frontend
`React 18` · `React Router 6` · `Zustand` · `React Query (TanStack)` · `Axios` · `React Hook Form` · `Yup` · `Tailwind CSS` · `Framer Motion` · `React Icons` · `React Toastify`

---

## 🧩 Características de PostgreSQL Aprovechadas

- **`JSONB`** — especificaciones, imágenes, historial de estados (consultable e indexable)
- **`ARRAY`** — etiquetas y características de productos
- **`ENUM`** — roles, categorías, estados de pedido (validación a nivel BD)
- **`UUID`** — IDs únicos globales en todas las tablas
- **Transacciones** — pedidos crean registro y reducen stock atómicamente
- **Pool de conexiones** — configurable para producción
- **SSL** — activado automáticamente para bases de datos en la nube

---

## 🚀 Despliegue en Producción

### Backend → Railway / Render
```bash
# Variables requeridas en el dashboard:
NODE_ENV=production
DATABASE_URL=<tu_connection_string>
JWT_SECRET=<32+ chars aleatorios>
JWT_REFRESH_SECRET=<32+ chars aleatorios>
FRONTEND_URL=https://tu-frontend.vercel.app
```

### Frontend → Vercel
```bash
# Variable requerida:
REACT_APP_API_URL=https://tu-backend.railway.app/api/v1
```

---

*TechStore — Proyecto profesional con React + Node.js + PostgreSQL*
