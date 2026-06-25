/**
 * BFF Grupo 1 - Servidor Principal (Compatible con Vercel)
 * Punto de entrada del Backend For Frontend
 * Puede ejecutarse como servidor Node.js o serverless en Vercel
 */
 
// ============================================================
// 1. CARGAR VARIABLES DE ENTORNO
// ============================================================
require('dotenv').config();
 
// ============================================================
// 2. IMPORTAR LIBRERÍAS PRINCIPALES
// ============================================================
const express = require('express');
const cors = require('cors');
const axios = require('axios');
 
// ============================================================
// 3. INICIALIZAR LA APLICACIÓN
// ============================================================
const app = express();
 
// ============================================================
// 4. CONFIGURAR MIDDLEWARE GLOBAL
// ============================================================
 
// Permitir peticiones desde el Frontend (CORS)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  process.env.FRONTEND_URL,
  'https://tu-frontend.vercel.app'
];
 
app.use(cors({
  origin: (origin, callback) => {
    // Para Postman y desarrollo, permitimos todo temporalmente
    if (process.env.NODE_ENV === 'development' || !origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
 
// Parsear JSON en las peticiones
app.use(express.json({ limit: '10mb' }));
 
// Parsear URL-encoded en las peticiones
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
 
// Middleware para logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});
 
// ============================================================
// 5. RUTAS DE HEALTH CHECK
// ============================================================
 
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'BFF Grupo 1',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    platform: 'Vercel'
  });
});
 
// ============================================================
// 6. RUTA RAÍZ
// ============================================================
 
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Bienvenido al BFF Grupo 1',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      checkout: '/api/checkout',
      orders: '/api/orders',
      notifications: '/api/notifications',
      health: '/health'
    },
    links: {
      docs: 'https://github.com/FranKix20/Bff-mock'
    }
  });
});
 
// ============================================================
// 7. IMPORTAR Y REGISTRAR RUTAS
// ============================================================
 
try {
  const authRoutes = require('./api/auth/routes');
  app.use('/api/auth', authRoutes);
  console.log('✅ Rutas de Auth cargadas');
} catch (err) {
  console.warn('⚠️ Rutas de Auth no encontradas:', err.message);
}
 
try {
  const productRoutes = require('./api/products/routes');
  app.use('/api/products', productRoutes);
  console.log('✅ Rutas de Productos cargadas');
} catch (err) {
  console.warn('⚠️ Rutas de Productos no encontradas:', err.message);
}
 
try {
  const cartRoutes = require('./api/cart/routes');
  app.use('/api/cart', cartRoutes);
  console.log('✅ Rutas de Carrito cargadas');
} catch (err) {
  console.warn('⚠️ Rutas de Carrito no encontradas:', err.message);
}

// ✅ BLOQUE CORREGIDO DE CHECKOUT
try {
  const checkoutRoutes = require('./api/checkout/routes');
  app.use('/api/checkout', checkoutRoutes);
  console.log('✅ Rutas de Checkout cargadas');
} catch (err) {
  console.warn('⚠️ Rutas de Checkout no encontradas:', err.message);
}
 
// ✅ BLOQUE CORREGIDO DE ÓRDENES
try {
  const orderRoutes = require('./api/orders/routes');
  app.use('/api/orders', orderRoutes);
  console.log('✅ Rutas de Órdenes cargadas');
} catch (err) {
  console.warn('⚠️ Rutas de Órdenes no encontradas:', err.message);
}

try {
  const notificationRoutes = require('./api/notifications/routes');
  app.use('/api/notifications', notificationRoutes);
  console.log('✅ Rutas de Notificaciones cargadas');
} catch (err) {
  console.warn('⚠️ Rutas de Notificaciones no encontradas:', err.message);
}
 
// ============================================================
// 8. MANEJO DE RUTAS NO ENCONTRADAS (404)
// ============================================================
 
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    hint: 'Revisa la documentación en GET /'
  });
});
 
// ============================================================
// 9. MANEJO GLOBAL DE ERRORES
// ============================================================
 
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  console.error('Stack:', err.stack);
  
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';
  
  res.status(status).json({
    error: message,
    status: status,
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
 
// ============================================================
// 10. INICIAR SERVIDOR (Para desarrollo local)
// ============================================================
 
// Solo iniciar si no está siendo ejecutado por Vercel
if (process.env.VERCEL_ENV === undefined) {
  const PORT = process.env.PORT || 3001;
  
  const server = app.listen(PORT, () => {
    console.log('');
    console.log('╔═══════════════════════════════════════════════════╗');
    console.log('║  🚀 BFF Grupo 1 está corriendo                     ║');
    console.log(`║  📍 http://localhost:${PORT}                              ║`);
    console.log(`║  🌍 Environment: ${(process.env.NODE_ENV || 'development').padEnd(32)}║`);
    console.log('║  ☁️  Platform: Vercel-compatible                   ║');
    console.log('║                                                   ║');
    console.log('║  Prueba:                                          ║');
    console.log(`║  • curl http://localhost:${PORT}/health              ║`);
    console.log('║                                                   ║');
    console.log('╚═══════════════════════════════════════════════════╝');
    console.log('');
  });
 
  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('📌 SIGTERM recibido: cerrando servidor');
    server.close(() => {
      console.log('✅ Servidor cerrado');
      process.exit(0);
    });
  });
}
 
// ============================================================
// 11. EXPORTAR PARA VERCEL Y TESTING
// ============================================================
 
module.exports = app;
 
// Para serverless en Vercel, también exportar como handler
module.exports.default = app;
