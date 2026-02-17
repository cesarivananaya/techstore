'use strict';
require('dotenv').config();
const { sequelize, User, Producto } = require('../models');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

const usuarios = [
  {
    id: 'a1b2c3d4-0001-0001-0001-000000000001',
    nombre: 'Admin TechStore',
    email: 'admin@techstore.com',
    password: 'Admin1234',
    role: 'admin',
    verificado: true,
  },
  {
    id: 'a1b2c3d4-0002-0002-0002-000000000002',
    nombre: 'Usuario Demo',
    email: 'demo@techstore.com',
    password: 'Demo1234',
    role: 'user',
    verificado: true,
  },
];

const productos = [
  {
    nombre: 'iPhone 15 Pro Max',
    descripcion: 'El iPhone más avanzado con chip A17 Pro, sistema de cámara profesional de triple lente y pantalla Super Retina XDR de 6.7 pulgadas con ProMotion 120Hz.',
    precio: 1299.00, precioAnterior: 1499.00,
    categoria: 'smartphones', marca: 'Apple', modelo: '15 Pro Max',
    sku: 'APL-IPH15PM-256',
    stock: 50, destacado: true, nuevo: true,
    especificaciones: { pantalla: '6.7" Super Retina XDR', procesador: 'A17 Pro', camara: '48MP + 12MP + 12MP', bateria: '4422 mAh', almacenamiento: '256GB', os: 'iOS 17' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1696446702183-cbd80756d537?w=600&q=80', esPrincipal: true, alt: 'iPhone 15 Pro Max' }],
    etiquetas: ['apple', 'iphone', 'smartphone', '5g'],
    garantia: { duracion: 12, unidad: 'meses', descripcion: 'Garantía oficial Apple' },
  },
  {
    nombre: 'Samsung Galaxy S24 Ultra',
    descripcion: 'Potencia extrema con S Pen integrado, cámara de 200MP con zoom espacial y pantalla Dynamic AMOLED 2X de 6.8 pulgadas con 120Hz adaptativo.',
    precio: 1199.00, precioAnterior: 1399.00,
    categoria: 'smartphones', marca: 'Samsung', modelo: 'Galaxy S24 Ultra',
    sku: 'SAM-S24U-512',
    stock: 35, destacado: true,
    especificaciones: { pantalla: '6.8" Dynamic AMOLED 2X', procesador: 'Snapdragon 8 Gen 3', camara: '200MP + 50MP + 12MP + 10MP', bateria: '5000 mAh', almacenamiento: '512GB' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&q=80', esPrincipal: true, alt: 'Galaxy S24 Ultra' }],
    etiquetas: ['samsung', 'galaxy', 'android', '5g', 'spen'],
  },
  {
    nombre: 'MacBook Pro 14" M3 Pro',
    descripcion: 'El Mac portátil más potente con chip M3 Pro, pantalla Liquid Retina XDR de 14.2 pulgadas y hasta 22 horas de batería para profesionales exigentes.',
    precio: 2499.00,
    categoria: 'laptops', marca: 'Apple', modelo: 'MacBook Pro 14 M3 Pro',
    sku: 'APL-MBP14-M3P',
    stock: 20, destacado: true, nuevo: true,
    especificaciones: { pantalla: '14.2" Liquid Retina XDR', procesador: 'M3 Pro 12-core', memoria: '18GB RAM', almacenamiento: '512GB SSD', bateria: '22 horas', os: 'macOS Sonoma' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80', esPrincipal: true, alt: 'MacBook Pro M3' }],
    etiquetas: ['apple', 'macbook', 'laptop', 'profesional'],
    garantia: { duracion: 12, unidad: 'meses' },
  },
  {
    nombre: 'Sony WH-1000XM5',
    descripcion: 'Los auriculares inalámbricos con la mejor cancelación de ruido del mercado, 30 horas de batería y audio Hi-Res certificado.',
    precio: 349.00, precioAnterior: 399.00,
    categoria: 'audio', marca: 'Sony', modelo: 'WH-1000XM5',
    sku: 'SNY-WH1000XM5',
    stock: 80,
    especificaciones: { tipo: 'Over-ear', conectividad: 'Bluetooth 5.2', bateria: '30 horas', cancelacionRuido: 'ANC adaptativo', peso: '250g', codec: 'LDAC, aptX HD' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80', esPrincipal: true, alt: 'Sony WH-1000XM5' }],
    etiquetas: ['sony', 'audifonos', 'anc', 'bluetooth'],
  },
  {
    nombre: 'AirPods Pro (2ª Generación)',
    descripcion: 'Cancelación activa de ruido adaptativa, audio espacial personalizado con seguimiento dinámico de cabeza y hasta 6 horas de escucha.',
    precio: 249.00,
    categoria: 'audio', marca: 'Apple', modelo: 'AirPods Pro 2',
    sku: 'APL-APP2-USB',
    stock: 120, nuevo: true,
    especificaciones: { tipo: 'In-ear', conectividad: 'Bluetooth 5.3', bateria: '6h (30h con estuche)', resistencia: 'IPX4', chip: 'H2', cancelacionRuido: 'ANC adaptativo' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600&q=80', esPrincipal: true, alt: 'AirPods Pro 2' }],
    etiquetas: ['apple', 'airpods', 'auriculares', 'anc'],
  },
  {
    nombre: 'Apple Watch Series 9',
    descripcion: 'El Apple Watch más inteligente con chip S9, pantalla siempre activa 2000 nits y nuevo gesto de doble toque para manos libres.',
    precio: 429.00,
    categoria: 'wearables', marca: 'Apple', modelo: 'Watch Series 9 45mm',
    sku: 'APL-AWS9-45',
    stock: 65, destacado: true,
    especificaciones: { pantalla: '45mm Always-On Retina', chip: 'S9 SiP', bateria: '18 horas', resistencia: '50m WR', sensores: 'ECG, SpO2, temperatura', os: 'watchOS 10' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=600&q=80', esPrincipal: true, alt: 'Apple Watch S9' }],
    etiquetas: ['apple', 'smartwatch', 'wearable', 'salud'],
  },
  {
    nombre: 'iPad Pro 12.9" M2',
    descripcion: 'La tablet más potente del mundo con chip M2, pantalla Liquid Retina XDR con ProMotion 120Hz y compatible con Apple Pencil 2 y Magic Keyboard.',
    precio: 1099.00,
    categoria: 'tablets', marca: 'Apple', modelo: 'iPad Pro 12.9 M2',
    sku: 'APL-IPADPRO12-M2',
    stock: 40, destacado: true,
    especificaciones: { pantalla: '12.9" Liquid Retina XDR', procesador: 'M2', memoria: '8GB RAM', almacenamiento: '128GB', conectividad: 'Wi-Fi 6E + 5G', camara: '12MP + 10MP' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80', esPrincipal: true, alt: 'iPad Pro M2' }],
    etiquetas: ['apple', 'ipad', 'tablet', 'profesional'],
  },
  {
    nombre: 'Samsung Galaxy Buds2 Pro',
    descripcion: 'Sonido Hi-Fi de 24 bits con cancelación de ruido inteligente, diseño ergonómico y hasta 8 horas de reproducción continua.',
    precio: 199.00, precioAnterior: 229.00,
    categoria: 'audio', marca: 'Samsung', modelo: 'Galaxy Buds2 Pro',
    sku: 'SAM-BUDS2PRO',
    stock: 200,
    especificaciones: { tipo: 'In-ear', conectividad: 'Bluetooth 5.3', bateria: '8h (29h con estuche)', resistencia: 'IPX7', audio: '24-bit Hi-Fi', cancelacionRuido: 'ANC inteligente' },
    imagenes: [{ url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80', esPrincipal: true, alt: 'Galaxy Buds2 Pro' }],
    etiquetas: ['samsung', 'earbuds', 'anc', 'hifi'],
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Recrea todas las tablas
    logger.info('📐 Tablas recreadas');

    // Crear usuarios (el modelo se encarga de hashear la contraseña en beforeCreate)
    for (const u of usuarios) {
      await User.create(u);
    }
    logger.info(`✅ ${usuarios.length} usuarios creados`);

    await Producto.bulkCreate(productos);
    logger.info(`✅ ${productos.length} productos creados`);

    logger.info('🎉 Seed completado');
    logger.info('');
    logger.info('  Admin:  admin@techstore.com / Admin1234');
    logger.info('  Demo:   demo@techstore.com  / Demo1234');
    process.exit(0);
  } catch (err) {
    logger.error('❌ Error en seed:', err);
    process.exit(1);
  }
}

seed();
