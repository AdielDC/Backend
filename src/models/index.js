const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

const Usuario = require('./Usuario');
const Cliente = require('./Cliente');
const Marca = require('./Marca');
const Presentacion = require('./Presentacion');
const CategoriaInsumo = require('./CategoriaInsumo');
const VariedadesAgave = require('./VariedadesAgave');
const Proveedor = require('./Proveedor');
const Inventario = require('./Inventario');
const Recepcion = require('./Recepcion');
const DetalleRecepcion = require('./DetalleRecepcion');
const Entrega = require('./Entrega');
const DetalleEntrega = require('./DetalleEntrega');
const MovimientosInventario = require('./MovimientosInventario');
const LotesProduccion = require('./LotesProduccion');
const AlertasInventario = require('./AlertasInventario');
// Tablas intermedias creadas para clientes
const ClienteVariedad = require('./ClienteVariedad')(sequelize, DataTypes);
const ClientePresentacion = require('./ClientePresentacion')(sequelize, DataTypes);
const ClienteTipo = require('./ClienteTipo')(sequelize, DataTypes);
// ==================== RELACIONES ====================

// MARCA - CLIENTE
Marca.belongsTo(Cliente, { 
  foreignKey: 'cliente_id', 
  as: 'cliente' 
});
Cliente.hasMany(Marca, { 
  foreignKey: 'cliente_id', 
  as: 'marcas' 
});

// INVENTARIO - Relaciones múltiples
Inventario.belongsTo(CategoriaInsumo, { 
  foreignKey: 'categoria_insumo_id', 
  as: 'categoria' 
});

Inventario.belongsTo(Cliente, { 
  foreignKey: 'cliente_id', 
  as: 'cliente' 
});

Inventario.belongsTo(Marca, { 
  foreignKey: 'marca_id', 
  as: 'marca' 
});

Inventario.belongsTo(VariedadesAgave, { 
  foreignKey: 'variedad_agave_id', 
  as: 'variedad' 
});

Inventario.belongsTo(Presentacion, { 
  foreignKey: 'presentacion_id', 
  as: 'presentacion' 
});

Inventario.belongsTo(Proveedor, { 
  foreignKey: 'proveedor_id', 
  as: 'proveedor' 
});

// RECEPCION - Relaciones
Recepcion.belongsTo(Proveedor, { 
  foreignKey: 'proveedor_id', 
  as: 'proveedor' 
});

Recepcion.belongsTo(Cliente, { 
  foreignKey: 'cliente_id', 
  as: 'cliente' 
});

Recepcion.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

Recepcion.hasMany(DetalleRecepcion, { 
  foreignKey: 'recepcion_id', 
  as: 'detalles',
  onDelete: 'CASCADE'
});

// DETALLE_RECEPCION - Relaciones
DetalleRecepcion.belongsTo(Recepcion, { 
  foreignKey: 'recepcion_id', 
  as: 'recepcion' 
});

DetalleRecepcion.belongsTo(Inventario, { 
  foreignKey: 'inventario_id', 
  as: 'inventario' 
});

// ENTREGA - Relaciones
Entrega.belongsTo(LotesProduccion, { 
  foreignKey: 'lote_produccion_id', 
  as: 'lote' 
});

Entrega.belongsTo(Cliente, { 
  foreignKey: 'cliente_id', 
  as: 'cliente' 
});

Entrega.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

Entrega.hasMany(DetalleEntrega, { 
  foreignKey: 'entrega_id', 
  as: 'detalles',
  onDelete: 'CASCADE'
});

// DETALLE_ENTREGA - Relaciones
DetalleEntrega.belongsTo(Entrega, { 
  foreignKey: 'entrega_id', 
  as: 'entrega' 
});

DetalleEntrega.belongsTo(Inventario, { 
  foreignKey: 'inventario_id', 
  as: 'inventario' 
});

// MOVIMIENTOS_INVENTARIO - Relaciones
MovimientosInventario.belongsTo(Inventario, { 
  foreignKey: 'inventario_id', 
  as: 'inventario' 
});

MovimientosInventario.belongsTo(Usuario, { 
  foreignKey: 'usuario_id', 
  as: 'usuario' 
});

MovimientosInventario.belongsTo(Recepcion, { 
  foreignKey: 'recepcion_id', 
  as: 'recepcion' 
});

MovimientosInventario.belongsTo(Entrega, { 
  foreignKey: 'entrega_id', 
  as: 'entrega' 
});

// LOTES_PRODUCCION - Relaciones
LotesProduccion.belongsTo(Cliente, { 
  foreignKey: 'cliente_id', 
  as: 'cliente' 
});

LotesProduccion.belongsTo(Marca, { 
  foreignKey: 'marca_id', 
  as: 'marca' 
});

LotesProduccion.belongsTo(VariedadesAgave, { 
  foreignKey: 'variedad_agave_id', 
  as: 'variedad' 
});

LotesProduccion.belongsTo(Presentacion, { 
  foreignKey: 'presentacion_id', 
  as: 'presentacion' 
});

// ALERTAS_INVENTARIO - Relaciones
AlertasInventario.belongsTo(Inventario, { 
  foreignKey: 'inventario_id', 
  as: 'inventario' 
});

Inventario.hasMany(AlertasInventario, {
  foreignKey: 'inventario_id'
});

AlertasInventario.belongsTo(Usuario, { 
  foreignKey: 'resuelta_por', 
  as: 'resuelta_por_usuario' 
});

// ClienteVariedad -> VariedadesAgave
ClienteVariedad.belongsTo(VariedadesAgave, { 
  foreignKey: 'variedad_agave_id', 
  as: 'variedad'  // ← Este alias se usa en el controlador
});

// ClientePresentacion -> Presentacion  
ClientePresentacion.belongsTo(Presentacion, { 
  foreignKey: 'presentacion_id', 
  as: 'presentacion'  // ← Este alias se usa en el controlador
});

// Relaciones inversas (opcional pero útil)
VariedadesAgave.hasMany(ClienteVariedad, {
  foreignKey: 'variedad_agave_id',
  as: 'clientesVariedad'
});

Presentacion.hasMany(ClientePresentacion, {
  foreignKey: 'presentacion_id',
  as: 'clientesPresentacion'
});

// ClienteVariedad -> Cliente
ClienteVariedad.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// ClientePresentacion -> Cliente
ClientePresentacion.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// ClienteTipo -> Cliente
ClienteTipo.belongsTo(Cliente, {
  foreignKey: 'cliente_id',
  as: 'cliente'
});

// ==================== EXPORTAR ====================

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  Marca,
  Presentacion,
  CategoriaInsumo,
  VariedadesAgave,
  VariedadAgave: VariedadesAgave, 
  Proveedor,
  Inventario,
  Recepcion,
  DetalleRecepcion,
  Entrega,
  DetalleEntrega,
  MovimientosInventario,
  LotesProduccion,
  AlertasInventario,
  ClienteVariedad,
  ClientePresentacion,
  ClienteTipo
};