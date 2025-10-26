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

// Debugging to catch invalid models
const models = {
  Usuario,
  Cliente,
  Marca,
  Presentacion,
  CategoriaInsumo,
  VariedadesAgave,
  Proveedor,
  Inventario,
  Recepcion,
  DetalleRecepcion,
  Entrega,
  DetalleEntrega,
  MovimientosInventario,
  LotesProduccion,
  AlertasInventario,
};

Object.entries(models).forEach(([name, Model]) => {
  if (!Model || typeof Model.hasMany !== 'function') {
    console.error(`${name} is not a valid Sequelize model`);
  }
});

// Asociaciones
Usuario.hasMany(Recepcion, { foreignKey: 'usuario_id' });
Usuario.hasMany(Entrega, { foreignKey: 'usuario_id' });
Usuario.hasMany(MovimientosInventario, { foreignKey: 'usuario_id' });
Usuario.hasMany(AlertasInventario, { foreignKey: 'resuelta_por', as: 'Resolver' });

Cliente.hasMany(Marca, { foreignKey: 'cliente_id' });
Cliente.hasMany(Inventario, { foreignKey: 'cliente_id' });
Cliente.hasMany(Recepcion, { foreignKey: 'cliente_id' });
Cliente.hasMany(Entrega, { foreignKey: 'cliente_id' });
Cliente.hasMany(LotesProduccion, { foreignKey: 'cliente_id' });

Marca.hasMany(Inventario, { foreignKey: 'marca_id' });
Marca.hasMany(LotesProduccion, { foreignKey: 'marca_id' });

Presentacion.hasMany(Inventario, { foreignKey: 'presentacion_id' });
Presentacion.hasMany(LotesProduccion, { foreignKey: 'presentacion_id' });

CategoriaInsumo.hasMany(Inventario, { foreignKey: 'categoria_insumo_id' });

VariedadesAgave.hasMany(Inventario, { foreignKey: 'variedad_agave_id' });
VariedadesAgave.hasMany(LotesProduccion, { foreignKey: 'variedad_agave_id' });

Proveedor.hasMany(Inventario, { foreignKey: 'proveedor_id' });
Proveedor.hasMany(Recepcion, { foreignKey: 'proveedor_id' });

Inventario.hasMany(DetalleRecepcion, { foreignKey: 'inventario_id' });
Inventario.hasMany(DetalleEntrega, { foreignKey: 'inventario_id' });
Inventario.hasMany(MovimientosInventario, { foreignKey: 'inventario_id' });
Inventario.hasMany(AlertasInventario, { foreignKey: 'inventario_id' });

Recepcion.hasMany(DetalleRecepcion, { foreignKey: 'recepcion_id' });
Recepcion.hasMany(MovimientosInventario, { foreignKey: 'recepcion_id' });

Entrega.hasMany(DetalleEntrega, { foreignKey: 'entrega_id' });
Entrega.hasMany(MovimientosInventario, { foreignKey: 'entrega_id' });
Entrega.belongsTo(LotesProduccion, { foreignKey: 'lote_produccion_id' });

LotesProduccion.hasMany(Entrega, { foreignKey: 'lote_produccion_id' });

// Sincronización de modelos
sequelize.sync({ alter: true }).then(() => {
  console.log('Modelos sincronizados con la base de datos');
}).catch(err => console.error('Error al sincronizar modelos:', err));

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  Marca,
  Presentacion,
  CategoriaInsumo,
  VariedadesAgave,
  Proveedor,
  Inventario,
  Recepcion,
  DetalleRecepcion,
  Entrega,
  DetalleEntrega,
  MovimientosInventario,
  LotesProduccion,
  AlertasInventario,
};