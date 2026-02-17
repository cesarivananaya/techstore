# 🚀 TechStore - E-commerce Profesional

## Arquitectura Full-Stack: React + Node.js

**Proyecto modular, escalable y listo para producción**

---

## 📋 Tabla de Contenidos

1. [Estructura del Proyecto](#estructura)
2. [Tecnologías](#tecnologías)
3. [Instalación](#instalación)
4. [Configuración](#configuración)
5. [Características](#características)
6. [API Endpoints](#api-endpoints)
7. [Seguridad](#seguridad)
8. [Testing](#testing)
9. [Despliegue](#despliegue)

---

## 🏗️ Estructura del Proyecto <a name="estructura"></a>

```
ecommerce-pro/
├── backend/                      # API REST con Node.js + Express
│   ├── src/
│   │   ├── config/              # Configuraciones
│   │   │   ├── index.js         # Config principal
│   │   │   └── database.js      # Conexión MongoDB
│   │   ├── controllers/         # Lógica de negocio
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   └── userController.js
│   │   ├── models/              # Modelos de datos
│   │   │   ├── User.js
│   │   │   ├── Producto.js
│   │   │   ├── Pedido.js
│   │   │   └── Resena.js
│   │   ├── routes/              # Definición de rutas
│   │   │   ├── authRoutes.js
│   │   │   ├── productRoutes.js
│   │   │   ├── orderRoutes.js
│   │   │   └── userRoutes.js
│   │   ├── middlewares/         # Middlewares personalizados
│   │   │   ├── auth.js          # Autenticación JWT
│   │   │   ├── errorHandler.js  # Manejo de errores
│   │   │   ├── validator.js     # Validación de datos
│   │   │   └── rateLimit.js     # Rate limiting
│   │   ├── services/            # Servicios externos
│   │   │   ├── emailService.js
│   │   │   ├── paymentService.js
│   │   │   └── uploadService.js
│   │   ├── utils/               # Utilidades
│   │   │   ├── tokenUtils.js
│   │   │   ├── encryption.js
│   │   │   └── logger.js
│   │   ├── validators/          # Validadores Joi
│   │   │   ├── authValidators.js
│   │   │   ├── productValidators.js
│   │   │   └── orderValidators.js
│   │   └── server.js            # Punto de entrada
│   ├── tests/                   # Tests unitarios e integración
│   ├── package.json
│   └── .env.example
│
└── frontend/                    # React + Context API
    ├── public/
    │   ├── index.html
    │   └── manifest.json
    ├── src/
    │   ├── components/          # Componentes reutilizables
    │   │   ├── common/
    │   │   │   ├── Button.jsx
    │   │   │   ├── Input.jsx
    │   │   │   ├── Card.jsx
    │   │   │   ├── Modal.jsx
    │   │   │   └── Loading.jsx
    │   │   ├── layout/
    │   │   │   ├── Header.jsx
    │   │   │   ├── Footer.jsx
    │   │   │   ├── Navbar.jsx
    │   │   │   └── Sidebar.jsx
    │   │   ├── product/
    │   │   │   ├── ProductCard.jsx
    │   │   │   ├── ProductGrid.jsx
    │   │   │   ├── ProductDetail.jsx
    │   │   │   └── ProductFilters.jsx
    │   │   └── cart/
    │   │       ├── CartItem.jsx
    │   │       ├── CartSidebar.jsx
    │   │       └── CartSummary.jsx
    │   ├── pages/               # Páginas principales
    │   │   ├── Home.jsx
    │   │   ├── Shop.jsx
    │   │   ├── ProductPage.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── Admin/
    │   ├── context/             # Context API
    │   │   ├── AuthContext.jsx
    │   │   ├── CartContext.jsx
    │   │   ├── ProductContext.jsx
    │   │   └── ThemeContext.jsx
    │   ├── hooks/               # Custom Hooks
    │   │   ├── useAuth.js
    │   │   ├── useCart.js
    │   │   ├── useProducts.js
    │   │   └── useLocalStorage.js
    │   ├── services/            # Servicios API
    │   │   ├── api.js           # Configuración Axios
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── orderService.js
    │   │   └── userService.js
    │   ├── utils/               # Utilidades
    │   │   ├── validators.js
    │   │   ├── formatters.js
    │   │   ├── constants.js
    │   │   └── helpers.js
    │   ├── styles/              # Estilos globales
    │   │   ├── global.css
    │   │   ├── variables.css
    │   │   └── components/
    │   ├── assets/              # Recursos estáticos
    │   │   ├── images/
    │   │   └── icons/
    │   ├── App.jsx              # Componente principal
    │   ├── index.js             # Punto de entrada
    │   └── routes.js            # Configuración de rutas
    ├── package.json
    └── .env.example
```

---

## 🛠️ Tecnologías <a name="tecnologías"></a>

### Backend
- **Node.js** 18+ - Runtime de JavaScript
- **Express.js** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Hash de contraseñas
- **Joi** - Validación de datos
- **Helmet** - Seguridad HTTP
- **Express Rate Limit** - Protección DDoS
- **Stripe** - Procesamiento de pagos
- **Nodemailer** - Envío de emails
- **Multer** - Upload de archivos
- **Jest** - Testing

### Frontend
- **React 18** - Librería UI
- **React Router DOM** - Enrutamiento
- **Context API** - Gestión de estado
- **Axios** - Cliente HTTP
- **React Hook Form** - Formularios
- **React Query** - Cache y sincronización
- **Tailwind CSS** - Estilos
- **Framer Motion** - Animaciones
- **React Icons** - Iconos
- **React Toastify** - Notificaciones

---

## 📦 Instalación <a name="instalación"></a>

### Prerrequisitos
```bash
node >= 18.0.0
npm >= 9.0.0
MongoDB >= 6.0
```

### 1. Clonar e instalar Backend

```bash
# Navegar a backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar variables de entorno
nano .env
```

### 2. Instalar Frontend

```bash
# Navegar a frontend
cd ../frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

### 3. Iniciar MongoDB

```bash
# Opción 1: MongoDB local
mongod --dbpath /data/db

# Opción 2: Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Opción 3: MongoDB Atlas (cloud)
# Usar URI de conexión en .env
```

### 4. Seed de datos (Opcional)

```bash
cd backend
npm run seed
```

---

## ⚙️ Configuración <a name="configuración"></a>

### Backend (.env)

```env
# Servidor
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Base de datos
MONGODB_URI=mongodb://localhost:27017/techstore

# JWT
JWT_SECRET=tu_clave_super_secreta_min_32_caracteres
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=tu_refresh_secret_min_32_caracteres
JWT_REFRESH_EXPIRE=30d

# CORS
FRONTEND_URL=http://localhost:3000

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_tu_clave
STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave
```

### Frontend (.env)

```env
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_tu_clave
REACT_APP_CLOUDINARY_CLOUD_NAME=tu_cloud_name
```

---

## 🚀 Ejecutar el Proyecto

### Desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Producción

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npx serve -s build
```

---

## ✨ Características <a name="características"></a>

### Autenticación y Autorización
- ✅ Registro de usuarios con validación
- ✅ Login con JWT
- ✅ Refresh tokens
- ✅ Reset de contraseña por email
- ✅ Verificación de email
- ✅ Roles (user, admin, vendedor)
- ✅ Protección de rutas
- ✅ Rate limiting por IP

### Productos
- ✅ CRUD completo de productos
- ✅ Búsqueda avanzada con filtros
- ✅ Categorización multinivel
- ✅ Sistema de reseñas y ratings
- ✅ Gestión de stock
- ✅ Imágenes múltiples
- ✅ Especificaciones técnicas
- ✅ Sistema de descuentos

### Carrito de Compras
- ✅ Agregar/quitar productos
- ✅ Actualizar cantidades
- ✅ Persistencia en localStorage
- ✅ Sincronización con backend
- ✅ Validación de stock
- ✅ Cálculo automático de totales

### Proceso de Compra
- ✅ Checkout multi-paso
- ✅ Múltiples direcciones de envío
- ✅ Integración con Stripe
- ✅ Métodos de pago variados
- ✅ Cálculo de envío
- ✅ Aplicación de cupones
- ✅ Generación de factura

### Gestión de Pedidos
- ✅ Historial de pedidos
- ✅ Seguimiento de estado
- ✅ Números de rastreo
- ✅ Notificaciones por email
- ✅ Sistema de reembolsos
- ✅ Panel de administración

### Seguridad
- ✅ Hash de contraseñas (bcrypt)
- ✅ Validación de datos (Joi)
- ✅ Sanitización de inputs
- ✅ Protección CSRF
- ✅ Headers de seguridad (Helmet)
- ✅ Rate limiting
- ✅ Prevención XSS
- ✅ Prevención SQL Injection
- ✅ CORS configurado

### Performance
- ✅ Compresión gzip
- ✅ Caché de queries
- ✅ Lazy loading de imágenes
- ✅ Code splitting
- ✅ Índices en MongoDB
- ✅ Paginación

---

## 📡 API Endpoints <a name="api-endpoints"></a>

### Autenticación

```
POST   /api/v1/auth/register          - Registrar usuario
POST   /api/v1/auth/login             - Iniciar sesión
POST   /api/v1/auth/logout            - Cerrar sesión
GET    /api/v1/auth/me                - Obtener usuario actual
POST   /api/v1/auth/refresh           - Refrescar token
POST   /api/v1/auth/forgot-password   - Solicitar reset
PUT    /api/v1/auth/reset-password/:token - Reset contraseña
```

### Productos

```
GET    /api/v1/products               - Listar productos
GET    /api/v1/products/:id           - Obtener producto
POST   /api/v1/products               - Crear producto (Admin)
PUT    /api/v1/products/:id           - Actualizar producto (Admin)
DELETE /api/v1/products/:id           - Eliminar producto (Admin)
GET    /api/v1/products/search        - Buscar productos
GET    /api/v1/products/category/:cat - Por categoría
```

### Pedidos

```
GET    /api/v1/orders                 - Listar pedidos
GET    /api/v1/orders/:id             - Obtener pedido
POST   /api/v1/orders                 - Crear pedido
PUT    /api/v1/orders/:id/status      - Actualizar estado (Admin)
GET    /api/v1/orders/user/me         - Mis pedidos
```

### Usuarios

```
GET    /api/v1/users/profile          - Ver perfil
PUT    /api/v1/users/profile          - Actualizar perfil
PUT    /api/v1/users/password         - Cambiar contraseña
POST   /api/v1/users/address          - Agregar dirección
DELETE /api/v1/users/address/:id      - Eliminar dirección
```

---

## 🔒 Seguridad <a name="seguridad"></a>

### Implementaciones de Seguridad

1. **Autenticación JWT**
   - Tokens firmados con HS256
   - Expiración configurable
   - Refresh tokens para renovación

2. **Hash de Contraseñas**
   - Bcrypt con 12 rounds
   - Salt único por contraseña
   - Nunca se almacena en texto plano

3. **Validación de Datos**
   - Joi para validación de schemas
   - Sanitización de inputs
   - Prevención de inyección

4. **Rate Limiting**
   - 100 requests por 15 minutos
   - Por IP address
   - Endpoints críticos protegidos

5. **Headers de Seguridad**
   - Content Security Policy
   - X-Frame-Options
   - X-Content-Type-Options
   - HSTS

6. **CORS**
   - Whitelist de orígenes
   - Credentials habilitados
   - Métodos específicos permitidos

---

## 🧪 Testing <a name="testing"></a>

### Ejecutar Tests

```bash
# Backend - Todos los tests
cd backend
npm test

# Con coverage
npm run test:coverage

# Watch mode
npm run test:watch

# Frontend - Tests
cd frontend
npm test
```

### Estructura de Tests

```
backend/tests/
├── unit/
│   ├── models/
│   ├── controllers/
│   └── utils/
├── integration/
│   ├── auth.test.js
│   ├── products.test.js
│   └── orders.test.js
└── e2e/
    └── checkout.test.js
```

---

## 🚢 Despliegue <a name="despliegue"></a>

### Backend (Railway/Render/Heroku)

```bash
# Build
npm run build

# Variables de entorno en producción
NODE_ENV=production
MONGODB_URI=<tu_mongodb_atlas_uri>
JWT_SECRET=<generar_con_openssl>
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# La carpeta 'build' se despliega automáticamente
```

### Docker

```bash
# Backend
docker build -t techstore-backend ./backend
docker run -p 5000:5000 techstore-backend

# Frontend
docker build -t techstore-frontend ./frontend
docker run -p 3000:3000 techstore-frontend
```

---

## 📚 Documentación Adicional

### Convenciones de Código

- **ESLint** - Airbnb style guide
- **Prettier** - Formateo automático
- **Commits** - Conventional Commits
- **Branches** - GitFlow

### Estructura de Commits

```
feat: Agregar búsqueda de productos
fix: Corregir validación de email
docs: Actualizar README
style: Formatear código
refactor: Optimizar queries de MongoDB
test: Agregar tests de autenticación
chore: Actualizar dependencias
```

---

## 👥 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'feat: Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

---

## 📄 Licencia

MIT License - Ver [LICENSE](LICENSE) para más detalles

---

## 👨‍💻 Autor

**TechStore Team**

---

## 🙏 Agradecimientos

- React Team
- Express Team
- MongoDB Team
- Toda la comunidad open source

---

## 📞 Soporte

- Email: soporte@techstore.com
- Documentación: https://docs.techstore.com
- Issues: https://github.com/techstore/issues

---

**¡Gracias por usar TechStore!** 🚀
