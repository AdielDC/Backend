const { 
  Inventario, 
  CategoriaInsumo, 
  Cliente, 
  Marca, 
  VariedadesAgave, 
  Presentacion, 
  Proveedor,
  MovimientosInventario,
  AlertasInventario,
  Usuario
} = require('../models');
const { Op } = require('sequelize');

// Obtener todo el inventario con filtros y búsqueda
exports.obtenerInventario = async (req, res) => {
  try {
    const { 
      categoria, 
      cliente, 
      variedad, 
      presentacion, 
      tipo, 
      search 
    } = req.query;

    // Construir filtros dinámicos
    const where = { activo: true };
    
    if (categoria && categoria !== 'all') {
      const categoriaObj = await CategoriaInsumo.findOne({ 
        where: { nombre: categoria } 
      });
      if (categoriaObj) where.categoria_insumo_id = categoriaObj.id;
    }

    if (cliente && cliente !== 'all') {
      const clienteObj = await Cliente.findOne({ 
        where: { nombre: cliente } 
      });
      if (clienteObj) where.cliente_id = clienteObj.id;
    }

    if (tipo && tipo !== 'all') {
      where.tipo = tipo;
    }

    // Búsqueda por texto
    let searchWhere = {};
    if (search) {
      searchWhere = {
        [Op.or]: [
          { codigo_lote: { [Op.like]: `%${search}%` } },
          { unidad: { [Op.like]: `%${search}%` } }
        ]
      };
    }

    const inventario = await Inventario.findAll({
      where: { ...where, ...searchWhere },
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' },
        { model: VariedadesAgave, as: 'variedad' },
        { model: Presentacion, as: 'presentacion' },
        { model: Proveedor, as: 'proveedor' }
      ],
      order: [['ultima_actualizacion', 'DESC']]
    });

    // Detectar items con stock bajo o crítico
    const itemsConAlerta = inventario.filter(item => {
      if (item.stock_minimo) {
        return item.stock < item.stock_minimo;
      }
      return false;
    });

    res.json({
      success: true,
      data: inventario,
      alertas: {
        stockBajo: itemsConAlerta.filter(i => i.stock > i.stock_minimo * 0.3).length,
        stockCritico: itemsConAlerta.filter(i => i.stock <= i.stock_minimo * 0.3).length
      }
    });
  } catch (error) {
    console.error('Error al obtener inventario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el inventario',
      error: error.message 
    });
  }
};

// Obtener un item específico del inventario
exports.obtenerItemInventario = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await Inventario.findByPk(id, {
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' },
        { model: VariedadesAgave, as: 'variedad' },
        { model: Presentacion, as: 'presentacion' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item de inventario no encontrado' 
      });
    }

    res.json({ success: true, data: item });
  } catch (error) {
    console.error('Error al obtener item:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el item',
      error: error.message 
    });
  }
};

// Crear nuevo item de inventario
exports.crearItemInventario = async (req, res) => {
  try {
    const nuevoItem = await Inventario.create(req.body);
    
    const itemCompleto = await Inventario.findByPk(nuevoItem.id, {
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' },
        { model: VariedadesAgave, as: 'variedad' },
        { model: Presentacion, as: 'presentacion' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Item de inventario creado exitosamente',
      data: itemCompleto 
    });
  } catch (error) {
    console.error('Error al crear item:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear el item de inventario',
      error: error.message 
    });
  }
};

// Actualizar item de inventario
exports.actualizarItemInventario = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventario.findByPk(id);

    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item de inventario no encontrado' 
      });
    }

    await item.update(req.body);

    const itemActualizado = await Inventario.findByPk(id, {
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' },
        { model: VariedadesAgave, as: 'variedad' },
        { model: Presentacion, as: 'presentacion' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    res.json({ 
      success: true, 
      message: 'Item actualizado exitosamente',
      data: itemActualizado 
    });
  } catch (error) {
    console.error('Error al actualizar item:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar el item',
      error: error.message 
    });
  }
};

// Registrar movimiento de inventario (entrada/salida)
exports.registrarMovimiento = async (req, res) => {
  try {
    const { 
      inventario_id, 
      tipo_movimiento, 
      cantidad, 
      razon, 
      referencia,
      usuario_id 
    } = req.body;

    // Validar datos requeridos
    if (!inventario_id || !tipo_movimiento || !cantidad || !usuario_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos' 
      });
    }

    // Obtener item de inventario
    const item = await Inventario.findByPk(inventario_id);
    if (!item) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item de inventario no encontrado' 
      });
    }

    const stockAnterior = item.stock;
    let stockNuevo = stockAnterior;

    // Calcular nuevo stock según tipo de movimiento
    switch (tipo_movimiento) {
      case 'entrada':
        stockNuevo = stockAnterior + parseInt(cantidad);
        break;
      case 'salida':
      case 'desperdicio':
        stockNuevo = stockAnterior - parseInt(cantidad);
        if (stockNuevo < 0) {
          return res.status(400).json({ 
            success: false, 
            message: 'Stock insuficiente para realizar la operación' 
          });
        }
        break;
      case 'ajuste':
        stockNuevo = parseInt(cantidad);
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Tipo de movimiento inválido' 
        });
    }

    // Actualizar stock
    await item.update({ 
      stock: stockNuevo,
      ultima_actualizacion: new Date()
    });

    // Registrar movimiento
    const movimiento = await MovimientosInventario.create({
      inventario_id,
      usuario_id,
      tipo_movimiento,
      cantidad: parseInt(cantidad),
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
      razon,
      referencia
    });

    // Verificar alertas de stock
    await verificarAlertasStock(item);

    res.json({ 
      success: true, 
      message: `${tipo_movimiento.charAt(0).toUpperCase() + tipo_movimiento.slice(1)} registrada exitosamente`,
      data: {
        movimiento,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo
      }
    });
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar el movimiento',
      error: error.message 
    });
  }
};

// Obtener historial de movimientos de un item
exports.obtenerHistorialMovimientos = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const movimientos = await MovimientosInventario.findAll({
      where: { inventario_id: id },
      include: [
        { 
          model: Usuario, 
          as: 'usuario', 
          attributes: ['id', 'nombre', 'email'],
          required: false
        }
      ],
      order: [['fecha_movimiento', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({ 
      success: true, 
      data: movimientos 
    });
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener el historial',
      error: error.message 
    });
  }
};

// Obtener alertas de inventario
exports.obtenerAlertas = async (req, res) => {
  try {
    const { vista, resuelta } = req.query;

    const where = {};
    if (vista !== undefined) where.vista = vista === 'true';
    if (resuelta !== undefined) where.resuelta = resuelta === 'true';

    const alertas = await AlertasInventario.findAll({
      where,
      include: [
        {
          model: Inventario,
          as: 'inventario',
          include: [
            { model: CategoriaInsumo, as: 'categoria' },
            { model: Cliente, as: 'cliente' },
            { model: Marca, as: 'marca' }
          ]
        }
      ],
      order: [['fecha_alerta', 'DESC']]
    });

    res.json({ 
      success: true, 
      data: alertas 
    });
  } catch (error) {
    console.error('Error al obtener alertas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener alertas',
      error: error.message 
    });
  }
};

// Marcar alerta como vista
exports.marcarAlertaVista = async (req, res) => {
  try {
    const { id } = req.params;
    
    const alerta = await AlertasInventario.findByPk(id);
    if (!alerta) {
      return res.status(404).json({ 
        success: false, 
        message: 'Alerta no encontrada' 
      });
    }

    await alerta.update({ vista: true });

    res.json({ 
      success: true, 
      message: 'Alerta marcada como vista' 
    });
  } catch (error) {
    console.error('Error al marcar alerta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al marcar la alerta',
      error: error.message 
    });
  }
};

// Función auxiliar para verificar alertas de stock
async function verificarAlertasStock(item) {
  if (!item.stock_minimo) return;

  const stockCritico = item.stock <= item.stock_minimo * 0.3;
  const stockBajo = item.stock < item.stock_minimo && !stockCritico;

  if (stockCritico || stockBajo) {
    // Verificar si ya existe una alerta activa
    const alertaExistente = await AlertasInventario.findOne({
      where: {
        inventario_id: item.id,
        resuelta: false
      }
    });

    if (!alertaExistente) {
      await AlertasInventario.create({
        inventario_id: item.id,
        tipo_alerta: stockCritico ? 'stock_critico' : 'stock_bajo',
        mensaje: stockCritico 
          ? `Stock crítico: ${item.stock} ${item.unidad} (mínimo: ${item.stock_minimo})`
          : `Stock bajo: ${item.stock} ${item.unidad} (mínimo: ${item.stock_minimo})`
      });
    }
  } else {
    // Si el stock está bien, resolver alertas pendientes
    await AlertasInventario.update(
      { resuelta: true, fecha_resolucion: new Date() },
      {
        where: {
          inventario_id: item.id,
          resuelta: false
        }
      }
    );
  }
}

// Obtener opciones para filtros
exports.obtenerOpcionesFiltros = async (req, res) => {
  try {
    const categorias = await CategoriaInsumo.findAll({ 
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']]
    });

    const clientes = await Cliente.findAll({ 
      where: { activo: true },
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']]
    });

    const variedades = await VariedadesAgave.findAll({ 
      attributes: ['id', 'nombre'],
      order: [['nombre', 'ASC']]
    });

    const presentaciones = await Presentacion.findAll({ 
      where: { activo: true },
      attributes: ['id', 'volumen'],
      order: [['volumen', 'ASC']]
    });

    const tipos = ['Nacional', 'Exportación'];

    res.json({
      success: true,
      data: {
        categorias,
        clientes,
        variedades,
        presentaciones,
        tipos
      }
    });
  } catch (error) {
    console.error('Error al obtener opciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener opciones de filtros',
      error: error.message 
    });
  }
};

// ========== FUNCIONES ADICIONALES PARA COMPATIBILIDAD CON FRONTEND ==========

// Obtener items con stock bajo
exports.getStockBajo = async (req, res) => {
  try {
    const inventario = await Inventario.findAll({
      where: { activo: true },
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' },
        { model: VariedadesAgave, as: 'variedad' },
        { model: Presentacion, as: 'presentacion' },
        { model: Proveedor, as: 'proveedor' }
      ]
    });

    // Filtrar items con stock bajo
    const itemsStockBajo = inventario.filter(item => {
      if (item.stock_minimo) {
        return item.stock < item.stock_minimo;
      }
      return false;
    });

    // Ordenar por criticidad (los más críticos primero)
    itemsStockBajo.sort((a, b) => {
      const ratioA = a.stock / a.stock_minimo;
      const ratioB = b.stock / b.stock_minimo;
      return ratioA - ratioB;
    });

    res.json({
      success: true,
      count: itemsStockBajo.length,
      data: itemsStockBajo
    });
  } catch (error) {
    console.error('Error en getStockBajo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener items con stock bajo',
      error: error.message
    });
  }
};

// Eliminar item (soft delete)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Inventario.findByPk(id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item no encontrado'
      });
    }

    await item.update({ 
      activo: false,
      actualizado_en: new Date()
    });

    res.json({
      success: true,
      message: 'Item eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar item:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el item',
      error: error.message
    });
  }
};

// Alias para compatibilidad con el frontend
exports.getAll = exports.obtenerInventario;
exports.getById = exports.obtenerItemInventario;
exports.create = exports.crearItemInventario;
exports.update = exports.actualizarItemInventario;
exports.getAlertas = exports.obtenerAlertas;

module.exports = exports;