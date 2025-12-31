# 🚀 Sistema de Gestión de Inventario - Backend API

## 🎯 Descripción del Proyecto

API RESTful desarrollada para **Envasadora Ancestral**, empresa dedicada al envasado de mezcal. Este backend proporciona todos los servicios necesarios para gestionar inventarios, usuarios, recepciones, entregas y alertas del sistema.

## 🛠️ Tecnologías Utilizadas

### Core
- **Node.js** 18.x - Entorno de ejecución
- **Express.js** 4.x - Framework web
- **MySQL** 8.x - Base de datos relacional
- **Sequelize** 6.x - ORM para MySQL

### Seguridad
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Autenticación JWT
- **cors** - Control de acceso CORS
- **helmet** - Seguridad HTTP headers
- **express-rate-limit** - Limitación de peticiones

### Utilidades
- **dotenv** - Variables de entorno
- **morgan** - Logger HTTP
- **nodemon** - Auto-restart en desarrollo

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuración de Sequelize
│   │   └── config.js            # Variables de entorno
│   │
│   ├── models/                  # Modelos de Sequelize
│   │   ├── Usuario.js
│   │   ├── Cliente.js
│   │   ├── Marca.js
│   │   ├── Presentacion.js
│   │   ├── CategoriaInsumo.js
│   │   ├── VariedadAgave.js
│   │   ├── Proveedor.js
│   │   ├── Inventario.js
│   │   ├── Recepcion.js
│   │   ├── DetalleRecepcion.js
│   │   ├── Entrega.js
│   │   ├── DetalleEntrega.js
│   │   ├── MovimientoInventario.js
│   │   ├── LoteProduccion.js
│   │   ├── AlertaInventario.js
│   │   └── index.js             # Asociaciones y relaciones
│   │
│   ├── controllers/             # Controladores
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── clienteController.js
│   │   ├── inventarioController.js
│   │   ├── recepcionController.js
│   │   ├── entregaController.js
│   │   └── alertaController.js
│   │
│   ├── routes/                  # Rutas de API
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── clienteRoutes.js
│   │   ├── inventarioRoutes.js
│   │   ├── recepcionRoutes.js
│   │   ├── entregaRoutes.js
│   │   └── alertaRoutes.js
│   │
│   ├── middleware/              # Middlewares
│   │   ├── auth.js             # Verificación JWT
│   │   ├── roleCheck.js        # Validación de roles
│   │   ├── errorHandler.js     # Manejo de errores
│   │   └── validator.js        # Validación de datos
│   │
│   ├── utils/                   # Utilidades
│   │   ├── generateToken.js    # Generación de JWT
│   │   ├── hashPassword.js     # Hash de contraseñas
│   │   └── logger.js           # Sistema de logs
│   │
│   └── app.js                   # Configuración de Express
│
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de variables
├── package.json                 # Dependencias
└── server.js                    # Punto de entrada
```

## 🗄️ Modelo de Base de Datos

### Tablas Principales

#### 👤 USUARIO
Gestión de usuarios del sistema con roles y autenticación.

#### 🏢 CLIENTE
Clientes de la envasadora que tienen marcas de mezcal.

#### 🏷️ MARCA
Marcas de mezcal que pertenecen a clientes.

#### 📏 PRESENTACION
Tamaños de botellas disponibles.

#### 📦 CATEGORIA_INSUMO
Categorías de insumos (Botellas, Tapones, Etiquetas, etc.).

#### 🌵 VARIEDADES_AGAVE
Tipos de agave para mezcal.

#### 🏭 PROVEEDOR
Proveedores de insumos.

#### 📊 INVENTARIO
Control de stock de insumos.

#### 📥 RECEPCION
Registro de recepciones de insumos.

#### 📥 DETALLE_RECEPCION
Detalles de cada recepción.

#### 📤 ENTREGA
Registro de entregas de insumos.

#### 📤 DETALLE_ENTREGA
Detalles de cada entrega.

#### 📋 MOVIMIENTOS_INVENTARIO
Historial de todos los movimientos de inventario.

#### 🍾 LOTES_PRODUCCION
Lotes de producción de mezcal.

#### 🔔 ALERTAS_INVENTARIO
Alertas automáticas de stock bajo.

### Relaciones Principales

## 🔌 API Endpoints

### 🔐 Autenticación

#### POST `/api/auth/login`
Login de usuario.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@example.com",
    "rol": "admin"
  }
}
```

#### GET `/api/auth/me`
Obtener usuario autenticado actual.

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "nombre": "Admin",
  "email": "admin@example.com",
  "rol": "admin",
  "activo": true
}
```

### 👥 Usuarios

#### GET `/api/usuarios`
Listar usuarios con filtros y paginación.

**Query Params:**
- `page`: Número de página (default: 1)
- `limit`: Resultados por página (default: 10)
- `rol`: Filtrar por rol (admin, operador, visualizador)
- `activo`: Filtrar por estado (true/false)
- `search`: Buscar por nombre o email

**Response:**
```json
{
  "usuarios": [...],
  "pagination": {
    "total": 50,
    "pages": 5,
    "currentPage": 1,
    "perPage": 10
  }
}
```

#### GET `/api/usuarios/:id`
Obtener un usuario específico.

#### POST `/api/usuarios`
Crear nuevo usuario.

**Request Body:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "rol": "operador"
}
```

#### PUT `/api/usuarios/:id`
Actualizar usuario.

**Request Body:**
```json
{
  "nombre": "Juan Pérez Updated",
  "email": "juan.updated@example.com",
  "rol": "admin"
}
```

#### PATCH `/api/usuarios/:id/password`
Cambiar contraseña de usuario.

**Request Body:**
```json
{
  "current_password": "oldpassword",
  "new_password": "newpassword123"
}
```

#### PATCH `/api/usuarios/:id/toggle`
Activar/Desactivar usuario.

**Response:**
```json
{
  "success": true,
  "message": "Usuario desactivado exitosamente",
  "activo": false
}
```

#### DELETE `/api/usuarios/:id`
Eliminar usuario permanentemente.

#### GET `/api/usuarios/estadisticas`
Obtener estadísticas de usuarios.

**Response:**
```json
{
  "totalUsers": 8,
  "activeUsers": 7,
  "usersByRole": [
    { "rol": "admin", "count": 3 },
    { "rol": "operador", "count": 2 },
    { "rol": "visualizador", "count": 3 }
  ]
}
```

### 🏢 Clientes

#### GET `/api/clientes`
Listar todos los clientes activos.

#### GET `/api/clientes/:id`
Obtener cliente específico con sus marcas.

#### POST `/api/clientes`
Crear nuevo cliente.

**Request Body:**
```json
{
  "nombre": "Mezcales Premium SA",
  "persona_contacto": "Carlos López",
  "direccion": "Calle Principal 123",
  "telefono": "9511234567",
  "email": "contacto@mezcalespremium.com"
}
```

#### PUT `/api/clientes/:id`
Actualizar cliente.

#### PATCH `/api/clientes/:id/toggle`
Activar/Desactivar cliente.

#### DELETE `/api/clientes/:id`
Eliminar cliente (soft delete).

### 📦 Inventario

#### GET `/api/inventario`
Listar inventario con filtros.

**Query Params:**
- `cliente_id`: Filtrar por cliente
- `categoria_id`: Filtrar por categoría
- `tipo`: Filtrar por tipo (Nacional/Exportación)
- `search`: Buscar por código de lote

**Response:**
```json
{
  "inventario": [
    {
      "id": 1,
      "codigo_lote": "BOT-750-ESP-001",
      "stock": 5000,
      "stock_minimo": 1000,
      "categoria": {
        "nombre": "Botellas",
        "unidad_medida": "piezas"
      },
      "cliente": {
        "nombre": "The Producer"
      },
      "presentacion": {
        "volumen": "750ml"
      }
    }
  ]
}
```

#### GET `/api/inventario/:id`
Obtener detalle de insumo con historial.

#### POST `/api/inventario`
Crear nuevo insumo.

**Request Body:**
```json
{
  "categoria_insumo_id": 1,
  "cliente_id": 1,
  "marca_id": 1,
  "variedad_agave_id": 1,
  "presentacion_id": 5,
  "proveedor_id": 1,
  "tipo": "Exportación",
  "codigo_lote": "BOT-750-ESP-001",
  "stock": 5000,
  "stock_minimo": 1000,
  "unidad": "piezas"
}
```

#### PUT `/api/inventario/:id`
Actualizar insumo.

#### DELETE `/api/inventario/:id`
Eliminar insumo (soft delete).

#### GET `/api/inventario/estadisticas`
Obtener estadísticas de inventario.

**Response:**
```json
{
  "totalInsumos": 45,
  "valorTotal": 1250000,
  "stockPorCategoria": [
    { "categoria": "Botellas", "total": 15000 },
    { "categoria": "Tapones", "total": 18000 }
  ],
  "alertasCriticas": 5
}
```

### 📥 Recepciones

#### GET `/api/recepciones`
Listar recepciones.

**Query Params:**
- `cliente_id`: Filtrar por cliente
- `proveedor_id`: Filtrar por proveedor
- `estado`: Filtrar por estado
- `fecha_desde`: Desde fecha
- `fecha_hasta`: Hasta fecha

#### GET `/api/recepciones/:id`
Obtener recepción con detalles.

**Response:**
```json
{
  "id": 1,
  "numero_recepcion": "REC-2025-001",
  "fecha_recepcion": "2025-01-15",
  "proveedor": {
    "nombre": "Vidriería del Sur"
  },
  "cliente": {
    "nombre": "The Producer"
  },
  "detalles": [
    {
      "inventario": {
        "codigo_lote": "BOT-750-ESP-001"
      },
      "cantidad": 1000,
      "unidad": "piezas"
    }
  ],
  "estado": "completado"
}
```

#### POST `/api/recepciones`
Crear nueva recepción.

**Request Body:**
```json
{
  "fecha_recepcion": "2025-01-15",
  "orden_compra": "OC-2025-001",
  "factura": "FACT-12345",
  "proveedor_id": 1,
  "cliente_id": 1,
  "entregado_por": "Carlos López",
  "recibido_por": "María García",
  "detalles": [
    {
      "inventario_id": 1,
      "cantidad": 1000,
      "unidad": "piezas"
    }
  ]
}
```

**Proceso automático:**
1. Genera número de recepción automático
2. Crea registro de recepción
3. Crea detalles de recepción
4. Actualiza stock en inventario (suma)
5. Registra movimiento en historial
6. Verifica y actualiza alertas

#### PUT `/api/recepciones/:id`
Actualizar recepción.

#### PATCH `/api/recepciones/:id/estado`
Cambiar estado de recepción.

**Request Body:**
```json
{
  "estado": "cancelado"
}
```

### 📤 Entregas

#### GET `/api/entregas`
Listar entregas.

#### GET `/api/entregas/:id`
Obtener entrega con detalles.

#### POST `/api/entregas`
Crear nueva entrega.

**Request Body:**
```json
{
  "fecha_entrega": "2025-01-20",
  "orden_produccion": "OP-2025-005",
  "lote_produccion_id": 1,
  "cliente_id": 1,
  "entregado_por": "Juan Pérez",
  "recibido_por": "Ana Martínez",
  "detalles": [
    {
      "inventario_id": 1,
      "cantidad": 500,
      "cantidad_desperdicio": 10,
      "unidad": "piezas"
    }
  ]
}
```

**Proceso automático:**
1. Genera número de entrega automático
2. Crea registro de entrega
3. Crea detalles de entrega
4. Actualiza stock en inventario (resta)
5. Registra desperdicios si existen
6. Registra movimiento en historial
7. Genera alertas si stock es bajo

#### PUT `/api/entregas/:id`
Actualizar entrega.

#### PATCH `/api/entregas/:id/estado`
Cambiar estado de entrega.

### 🔔 Alertas

#### GET `/api/alertas`
Obtener todas las alertas.

**Query Params:**
- `vista`: Filtrar por vistas (true/false)
- `resuelta`: Filtrar por resueltas (true/false)
- `tipo_alerta`: Filtrar por tipo

**Response:**
```json
{
  "alertas": [
    {
      "id": 1,
      "tipo_alerta": "stock_critico",
      "mensaje": "Stock crítico: BOT-750-ESP-001",
      "inventario": {
        "codigo_lote": "BOT-750-ESP-001",
        "stock": 200,
        "stock_minimo": 1000
      },
      "vista": false,
      "resuelta": false,
      "fecha_alerta": "2025-01-20T10:30:00"
    }
  ],
  "count": 5
}
```

#### PATCH `/api/alertas/:id/marcar-vista`
Marcar alerta como vista.

#### PATCH `/api/alertas/:id/resolver`
Resolver alerta.

## 🔒 Seguridad

### Autenticación JWT

```javascript
// Generación de token
const token = jwt.sign(
  { 
    id: usuario.id, 
    email: usuario.email, 
    rol: usuario.rol 
  },
  process.env.JWT_SECRET,
  { expiresIn: '30m' }
);
```

### Hash de Contraseñas

```javascript
const bcrypt = require('bcryptjs');

// Hash al crear usuario
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar al login
const isValid = await bcrypt.compare(password, user.password);
```

### Middleware de Autenticación

```javascript
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token no proporcionado' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};
```

### Validación de Roles

```javascript
const roleCheck = (allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.rol)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para esta acción' 
      });
    }
    next();
  };
};

// Uso
router.delete('/usuarios/:id', 
  auth, 
  roleCheck(['admin']), 
  eliminarUsuario
);
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de 100 peticiones
  message: 'Demasiadas peticiones, intenta más tarde'
});

app.use('/api/', limiter);
```

### CORS Configuration

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

## 🚀 Instalación y Configuración

### Prerrequisitos
```bash
Node.js >= 16.x
MySQL >= 8.x
npm >= 8.x
```

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd backend
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar base de datos

Crear base de datos MySQL:
```sql
CREATE DATABASE envasadora_ancestral CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Ejecutar script SQL:
```bash
mysql -u root -p envasadora_ancestral < database/schema.sql
```

### 4. Configurar variables de entorno

Crear archivo `.env`:
```env
# Servidor
NODE_ENV=development
PORT=3000

# Base de datos
DB_HOST=localhost
DB_PORT=3306
DB_NAME=envasadora_ancestral
DB_USER=root
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=30m

# CORS
FRONTEND_URL=http://localhost:5173

# Logs
LOG_LEVEL=debug
```

### 5. Ejecutar migraciones (opcional)
```bash
npm run migrate
```

### 6. Ejecutar seeders (datos de prueba)
```bash
npm run seed
```

### 7. Iniciar servidor

**Desarrollo:**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📚 Scripts Disponibles

## 📊 Lógica de Negocio

### Sistema de Alertas Automáticas

### Generación de Números Automáticos

### Transacciones para Recepciones/Entregas

## 🔍 Manejo de Errores

### Error Handler Global

## 📈 Rendimiento y Optimización

### Índices de Base de Datos
- Índices únicos en campos clave (email, numero_recepcion, codigo_lote)
- Índices compuestos para búsquedas frecuentes
- Índices en foreign keys para joins rápidos

### Paginación

### Lazy Loading vs Eager Loading

## 🧪 Testing

## 📊 Logs y Monitoreo

## 🔄 Migraciones de Base de Datos

## 📄 Licencia

Copyright © 2025 Envasadora Ancestral. Todos los derechos reservados.

---

Desarrollado con ❤️ por Adiel Aldair Diaz Carmona y Perla Lopez Cruz para la industria del mezcal artesanal
