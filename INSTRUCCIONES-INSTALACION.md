# 🚀 INSTRUCCIONES DE INSTALACIÓN - TechStore

## Proyecto E-commerce Profesional con React + Node.js

---

## 📦 Contenido del Proyecto

Has descargado un proyecto full-stack completo y profesional que incluye:

### Backend (Node.js + Express + MongoDB)
- ✅ API REST completamente modular
- ✅ Autenticación JWT con refresh tokens
- ✅ Modelos de datos (User, Producto, Pedido)
- ✅ Controladores separados por funcionalidad
- ✅ Middlewares de seguridad
- ✅ Validación de datos con Joi
- ✅ Integración con Stripe (pagos)
- ✅ Sistema de emails
- ✅ Rate limiting y protección DDoS

### Frontend (React 18 + Context API)
- ✅ Arquitectura de componentes modular
- ✅ Context API para estado global
- ✅ Custom hooks reutilizables
- ✅ Servicios API con Axios
- ✅ Rutas protegidas
- ✅ Tailwind CSS para estilos
- ✅ Animaciones con Framer Motion

---

## 🛠️ PASO 1: Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

```bash
# Node.js (versión 18 o superior)
node --version
# Debe mostrar: v18.x.x o superior

# NPM
npm --version
# Debe mostrar: 9.x.x o superior

# MongoDB (opción 1: local)
mongod --version
# O usar MongoDB Atlas (cloud) - recomendado
```

### Instalar Node.js
- **Windows/Mac**: https://nodejs.org/
- **Linux**: `sudo apt install nodejs npm`

### Instalar MongoDB

**Opción 1 - MongoDB Local:**
```bash
# Ubuntu/Debian
sudo apt install mongodb

# Windows/Mac
# Descargar de: https://www.mongodb.com/try/download/community
```

**Opción 2 - MongoDB Atlas (Cloud) - RECOMENDADO:**
1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear un cluster gratuito
3. Obtener connection string
4. Usar en archivo .env del backend

---

## 🚀 PASO 2: Descomprimir y Configurar

### 2.1 Extraer archivos

```bash
# Extraer el archivo comprimido
tar -xzf techstore-proyecto-completo.tar.gz

# Navegar al directorio
cd ecommerce-pro
```

### 2.2 Instalar dependencias del BACKEND

```bash
# Ir a la carpeta backend
cd backend

# Instalar todas las dependencias
npm install

# Esto instalará: express, mongoose, jwt, bcrypt, etc.
```

### 2.3 Configurar variables de entorno del BACKEND

```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar el archivo .env
nano .env
# O usar tu editor favorito: code .env, vim .env, etc.
```

**Configuración mínima del .env:**

```env
# Servidor
NODE_ENV=development
PORT=5000

# Base de datos - MONGODB ATLAS (RECOMENDADO)
MONGODB_URI=mongodb+srv://usuario:password@cluster.xxxxx.mongodb.net/techstore?retryWrites=true&w=majority

# O MongoDB Local
# MONGODB_URI=mongodb://localhost:27017/techstore

# JWT - GENERA CLAVES SEGURAS
JWT_SECRET=tu_clave_secreta_minimo_32_caracteres_aleatorios
JWT_REFRESH_SECRET=otra_clave_diferente_minimo_32_caracteres

# CORS
FRONTEND_URL=http://localhost:3000

# Email (Gmail - Opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# Stripe (Opcional para pagos)
STRIPE_SECRET_KEY=sk_test_tu_clave
```

**🔐 GENERAR CLAVES SEGURAS:**

```bash
# En terminal, ejecutar:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copiar el resultado en JWT_SECRET

# Ejecutar de nuevo para JWT_REFRESH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2.4 Instalar dependencias del FRONTEND

```bash
# Volver al directorio raíz
cd ..

# Ir a la carpeta frontend
cd frontend

# Instalar dependencias
npm install
```

### 2.5 Configurar variables de entorno del FRONTEND

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar
nano .env
```

**Contenido del .env del frontend:**

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_tu_clave_publica
```

---

## ▶️ PASO 3: Ejecutar el Proyecto

### Opción 1: Dos terminales separadas (RECOMENDADO)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev

# Deberías ver:
# 🚀 ==========================================
#    TechStore API corriendo en puerto 5000
#    Ambiente: development
#    URL: http://localhost:5000
# ========================================== 🚀
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start

# Se abrirá automáticamente en http://localhost:3000
```

### Opción 2: Terminal única con concurrently

```bash
# Instalar concurrently globalmente
npm install -g concurrently

# En la raíz del proyecto, crear package.json:
{
  "scripts": {
    "dev": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm start\""
  }
}

# Ejecutar ambos:
npm run dev
```

---

## ✅ PASO 4: Verificar que funciona

### 1. Verificar Backend

Abrir en navegador o Postman:
```
http://localhost:5000/health
```

Deberías ver:
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2024-...",
  "environment": "development"
}
```

### 2. Verificar Frontend

Abrir navegador en:
```
http://localhost:3000
```

Deberías ver la página de inicio de TechStore.

### 3. Probar Registro de Usuario

```bash
# Usando curl:
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Usuario Prueba",
    "email": "prueba@test.com",
    "password": "Password123"
  }'
```

O usar Postman/Insomnia para hacer la petición.

---

## 📊 PASO 5: Cargar Datos de Prueba (Seed)

Para tener productos de ejemplo en la base de datos:

```bash
cd backend

# Crear archivo de seed
node src/utils/seed.js

# O manualmente insertar en MongoDB
```

**Script de seed básico (crear en `backend/src/utils/seed.js`):**

```javascript
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
require('dotenv').config();

const productos = [
  {
    nombre: "iPhone 15 Pro Max",
    descripcion: "El iPhone más avanzado",
    precio: 1299,
    categoria: "smartphones",
    marca: "Apple",
    stock: 50,
    sku: "IPH15PM256",
    imagenes: [{
      url: "https://images.unsplash.com/photo-1696446702183-cbd80756d537?w=500",
      esPrincipal: true
    }]
  },
  // ... más productos
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Producto.deleteMany({});
  await Producto.insertMany(productos);
  console.log('✅ Datos cargados');
  process.exit();
}

seed();
```

Ejecutar:
```bash
node src/utils/seed.js
```

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
npm install
```

### Error: "MongoDB connection failed"
```bash
# Verificar que MongoDB está corriendo:
mongod --version

# O verificar URI de MongoDB Atlas en .env
```

### Error: "Port 5000 already in use"
```bash
# Cambiar puerto en backend/.env
PORT=5001

# O matar proceso en puerto 5000:
# Linux/Mac:
lsof -ti:5000 | xargs kill -9

# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Error: "CORS policy"
```bash
# Verificar en backend/.env:
FRONTEND_URL=http://localhost:3000

# Y que en frontend/.env:
REACT_APP_API_URL=http://localhost:5000/api/v1
```

---

## 📚 Recursos Adicionales

### Documentación API
```
http://localhost:5000/api/v1/docs
```

### Endpoints Principales

**Autenticación:**
- POST `/api/v1/auth/register` - Registro
- POST `/api/v1/auth/login` - Login
- GET `/api/v1/auth/me` - Usuario actual

**Productos:**
- GET `/api/v1/products` - Listar productos
- GET `/api/v1/products/:id` - Detalle de producto
- POST `/api/v1/products` - Crear (Admin)

**Pedidos:**
- GET `/api/v1/orders` - Mis pedidos
- POST `/api/v1/orders` - Crear pedido
- GET `/api/v1/orders/:id` - Detalle de pedido

### Testing con Postman

1. Importar colección de Postman (si existe)
2. Configurar variables de entorno:
   - `baseURL`: http://localhost:5000/api/v1
   - `token`: (se genera al hacer login)

---

## 🎯 Próximos Pasos

1. ✅ Configurar email (Gmail App Password)
2. ✅ Configurar Stripe para pagos
3. ✅ Agregar más productos (seed)
4. ✅ Personalizar estilos en frontend
5. ✅ Agregar tests
6. ✅ Configurar CI/CD
7. ✅ Desplegar a producción

---

## 🚀 Desplegar a Producción

### Backend (Railway)
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Frontend (Vercel)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel
```

---

## 📞 Soporte

Si encuentras problemas:

1. Revisar logs del backend y frontend
2. Verificar variables de entorno
3. Consultar documentación
4. Abrir issue en GitHub

---

## ✨ Características Implementadas

- ✅ Autenticación completa (JWT)
- ✅ CRUD de productos
- ✅ Carrito de compras
- ✅ Proceso de checkout
- ✅ Gestión de pedidos
- ✅ Panel de administración
- ✅ Sistema de reseñas
- ✅ Búsqueda y filtros
- ✅ Responsive design
- ✅ Seguridad (rate limiting, CORS, helmet)
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ Logs estructurados

---

**¡Tu proyecto está listo para desarrollo!** 🎉

Para cualquier duda, revisa el README.md principal.
