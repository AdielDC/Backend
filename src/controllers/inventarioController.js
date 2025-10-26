// controllers/inventarioController.js
const { 
  Inventario, 
  CategoriaInsumo, 
  Cliente, 
  Marca, 
  VariedadAgave, 
  Presentacion, 
  Proveedor,
  MovimientoInventario,
  Usuario,
  AlertaInventario
} = require('../models');
const { Op } = require('sequelize');

const inventarioController = {
  // Obtener todos los insumos con filtros opcionales
  async getAllInsumos(req, res) {
    try {
      const {
        categoriaId,
        clienteId,
        marcaId,
        variedadId,
        presentacionId,
        tipo,
        search,
        stockLevel,
        activo = true
      } = req.query;

      const whereClause = { activo };

      // Aplicar filtros
      if (categoriaId) whereClause.categoriaInsumoId = categoriaId;
      if (clienteId) whereClause.clienteId = clienteId;
      if (marcaId) whereClause.marcaId = marcaId;
      if (variedadId) whereClause.variedadAgaveId = variedadId;
      if (presentacionId) whereClause.presentacionId = presentacionId;
      if (tipo) whereClause.tipo = tipo;

      // Búsqueda por texto en código de lote
      if (search) {
        whereClause.codigoLote = { [Op.like]: `%${search}%` };
      }

      let insumos = await Inventario.findAll({
        where: whereClause,
        include: [
          { model: CategoriaInsumo, as: 'categoria', attributes: ['id', 'nombre', 'unidadMedida'] },
          { model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] },
          { model: Marca, as: 'marca', attributes: ['id', 'nombre'] },
          { model: VariedadAgave, as: 'variedad', attributes: ['id', 'nombre', 'region'] },
          { model: Presentacion, as: 'presentacion', attributes: ['id', 'volumen'] },
          { model: Proveedor, as: 'proveedor', attributes: ['id', 'nombre'] }
        ],
        order: [['categoria', 'nombre', 'ASC'], ['cliente', 'nombre', 'ASC']]
      });

      // Filtrar por nivel de stock si se especifica
      if (stockLevel) {
        insumos = insumos.filter(insumo => {
          if (stockLevel === 'critical') return insumo.isCriticalStock();
          if (stockLevel === 'low') return insumo.isLowStock() && !insumo.isCriticalStock();
          if (stockLevel === 'adequate') return !insumo.isLowStock();
          return true;
        });
      }

      // Agregar información de nivel de stock
      const insumosWithStockLevel = insumos.map(insumo => ({
        ...insumo.toJSON(),
        stockLevel: insumo.getStockLevel(),
        isLowStock: insumo.isLowStock(),
        isCriticalStock: insumo.isCriticalStock()
      }));

      res.json({
        success: true,
        count: insumosWithStockLevel.length,
        data: insumosWithStockLevel
      });
    } catch (error) {
      console.error('Error al obtener insumos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los insumos',
        error: error.message
      });
    }
  },

  // Obtener un insumo por ID
  async getInsumoById(req, res) {
    try {
      const { id } = req.params;
      
      const insumo = await Inventario.findByPk(id, {
        include: [
          { model: CategoriaInsumo, as: 'categoria' },
          { model: Cliente, as: 'cliente' },
          { model: Marca, as: 'marca' },
          { model: VariedadAgave, as: 'variedad' },
          { model: Presentacion, as: 'presentacion' },
          { model: Proveedor, as: 'proveedor' },
          {
            model: MovimientoInventario,
            as: 'movimientos',
            limit: 10,
            order: [['fechaMovimiento', 'DESC']],
            include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }]
          }
        ]
      });

      if (!insumo) {
        return res.status(404).json({
          success: false,
          message: 'Insumo no encontrado'
        });
      }

      res.json({
        success: true,
        data: {
          ...insumo.toJSON(),
          stockLevel: insumo.getStockLevel(),
          isLowStock: insumo.isLowStock(),
          isCriticalStock: insumo.isCriticalStock()
        }
      });
    } catch (error) {
      console.error('Error al obtener insumo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el insumo',
        error: error.message
      });
    }
  },

  // Crear un nuevo insumo
  async createInsumo(req, res) {
    try {
      const insumoData = req.body;
      
      // Validar que existan las relaciones
      const [categoria, cliente, marca, variedad, presentacion, proveedor] = await Promise.all([
        CategoriaInsumo.findByPk(insumoData.categoriaInsumoId),
        Cliente.findByPk(insumoData.clienteId),
        Marca.findByPk(insumoData.marcaId),
        VariedadAgave.findByPk(insumoData.variedadAgaveId),
        Presentacion.findByPk(insumoData.presentacionId),
        Proveedor.findByPk(insumoData.proveedorId)
      ]);

      if (!categoria || !cliente || !marca || !variedad || !presentacion || !proveedor) {
        return res.status(400).json({
          success: false,
          message: 'Una o más relaciones no existen',
          missing: {
            categoria: !categoria,
            cliente: !cliente,
            marca: !marca,
            variedad: !variedad,
            presentacion: !presentacion,
            proveedor: !proveedor
          }
        });
      }

      const newInsumo = await Inventario.create(insumoData);

      // Cargar las relaciones
      await newInsumo.reload({
        include: [
          { model: CategoriaInsumo, as: 'categoria' },
          { model: Cliente, as: 'cliente' },
          { model: Marca, as: 'marca' },
          { model: VariedadAgave, as: 'variedad' },
          { model: Presentacion, as: 'presentacion' },
          { model: Proveedor, as: 'proveedor' }
        ]
      });

      res.status(201).json({
        success: true,
        message: 'Insumo creado exitosamente',
        data: newInsumo
      });
    } catch (error) {
      console.error('Error al crear insumo:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }

      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({
          success: false,
          message: 'El código de lote ya existe en el sistema'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear el insumo',
        error: error.message
      });
    }
  },

  // Actualizar un insumo
  async updateInsumo(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const insumo = await Inventario.findByPk(id);

      if (!insumo) {
        return res.status(404).json({
          success: false,
          message: 'Insumo no encontrado'
        });
      }

      // No permitir actualizar el stock directamente
      delete updateData.stock;

      await insumo.update(updateData);

      // Recargar con relaciones
      await insumo.reload({
        include: [
          { model: CategoriaInsumo, as: 'categoria' },
          { model: Cliente, as: 'cliente' },
          { model: Marca, as: 'marca' },
          { model: VariedadAgave, as: 'variedad' },
          { model: Presentacion, as: 'presentacion' },
          { model: Proveedor, as: 'proveedor' }
        ]
      });

      res.json({
        success: true,
        message: 'Insumo actualizado exitosamente',
        data: insumo
      });
    } catch (error) {
      console.error('Error al actualizar insumo:', error);
      
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al actualizar el insumo',
        error: error.message
      });
    }
  },

  // Eliminar (desactivar) un insumo
  async deleteInsumo(req, res) {
    try {
      const { id } = req.params;

      const insumo = await Inventario.findByPk(id);

      if (!insumo) {
        return res.status(404).json({
          success: false,
          message: 'Insumo no encontrado'
        });
      }

      // Desactivar en lugar de eliminar
      await insumo.update({ activo: false });

      res.json({
        success: true,
        message: 'Insumo desactivado exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar insumo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar el insumo',
        error: error.message
      });
    }
  },

  // Registrar movimiento de inventario
  async registrarMovimiento(req, res) {
    try {
      const { id } = req.params;
      const { tipoMovimiento, cantidad, usuarioId, razon, referencia, recepcionId, entregaId } = req.body;

      if (!tipoMovimiento || !cantidad || !usuarioId) {
        return res.status(400).json({
          success: false,
          message: 'El tipo de movimiento, cantidad y usuario son requeridos'
        });
      }

      const insumo = await Inventario.findByPk(id);

      if (!insumo) {
        return res.status(404).json({
          success: false,
          message: 'Insumo no encontrado'
        });
      }

      const result = await insumo.updateStock(
        parseInt(cantidad),
        tipoMovimiento,
        parseInt(usuarioId),
        { razon, referencia, recepcionId, entregaId }
      );

      res.json({
        success: true,
        message: `${tipoMovimiento.charAt(0).toUpperCase() + tipoMovimiento.slice(1)} registrada exitosamente`,
        data: {
          inventario: {
            ...result.inventario.toJSON(),
            stockLevel: result.inventario.getStockLevel()
          },
          movimiento: result.movimiento
        }
      });
    } catch (error) {
      console.error('Error al registrar movimiento:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  },

  // Obtener alertas de stock bajo
  async getStockAlerts(req, res) {
    try {
      const { resuelta = false } = req.query;

      const alertas = await AlertaInventario.findAll({
        where: { resuelta: resuelta === 'true' },
        include: [
          {
            model: Inventario,
            as: 'inventario',
            include: [
              { model: CategoriaInsumo, as: 'categoria', attributes: ['nombre'] },
              { model: Cliente, as: 'cliente', attributes: ['nombre'] },
              { model: Marca, as: 'marca', attributes: ['nombre'] }
            ]
          },
          {
            model: Usuario,
            as: 'usuarioResolucion',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['fechaAlerta', 'DESC']]
      });

      const criticalAlertas = alertas.filter(a => a.tipoAlerta === 'stock_critico');
      const lowAlertas = alertas.filter(a => a.tipoAlerta === 'stock_bajo');

      res.json({
        success: true,
        data: {
          todas: alertas,
          criticas: criticalAlertas,
          bajas: lowAlertas,
          counts: {
            total: alertas.length,
            criticas: criticalAlertas.length,
            bajas: lowAlertas.length
          }
        }
      });
    } catch (error) {
      console.error('Error al obtener alertas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las alertas',
        error: error.message
      });
    }
  },

  // Obtener historial de movimientos
  async getMovimientos(req, res) {
    try {
      const { id } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const insumo = await Inventario.findByPk(id);

      if (!insumo) {
        return res.status(404).json({
          success: false,
          message: 'Insumo no encontrado'
        });
      }

      const movimientos = await MovimientoInventario.findAndCountAll({
        where: { inventarioId: id },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['fechaMovimiento', 'DESC']],
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre']
          }
        ]
      });

      res.json({
        success: true,
        data: {
          insumo: {
            id: insumo.id,
            codigoLote: insumo.codigoLote
          },
          movimientos: movimientos.rows,
          total: movimientos.count,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener los movimientos',
        error: error.message
      });
    }
  },

  // Obtener estadísticas generales
  async getEstadisticas(req, res) {
    try {
      const allInsumos = await Inventario.findAll({
        where: { activo: true },
        include: [
          { model: CategoriaInsumo, as: 'categoria', attributes: ['nombre'] },
          { model: Cliente, as: 'cliente', attributes: ['nombre'] }
        ]
      });

      const lowStockItems = allInsumos.filter(i => i.isLowStock());
      const criticalStockItems = allInsumos.filter(i => i.isCriticalStock());

      // Estadísticas por categoría
      const categorias = [...new Set(allInsumos.map(i => i.categoria.nombre))];
      const statsByCategory = categorias.map(categoria => {
        const items = allInsumos.filter(i => i.categoria.nombre === categoria);
        return {
          categoria,
          total: items.length,
          lowStock: items.filter(i => i.isLowStock()).length,
          critical: items.filter(i => i.isCriticalStock()).length
        };
      });

      // Estadísticas por cliente
      const clientes = [...new Set(allInsumos.map(i => i.cliente.nombre))];
      const statsByClient = clientes.map(cliente => {
        const items = allInsumos.filter(i => i.cliente.nombre === cliente);
        return {
          cliente,
          total: items.length,
          lowStock: items.filter(i => i.isLowStock()).length,
          critical: items.filter(i => i.isCriticalStock()).length
        };
      });

      res.json({
        success: true,
        data: {
          totals: {
            insumos: allInsumos.length,
            categorias: categorias.length,
            clientes: clientes.length,
            lowStock: lowStockItems.length,
            critical: criticalStockItems.length,
            adequate: allInsumos.length - lowStockItems.length
          },
          byCategory: statsByCategory,
          byClient: statsByClient
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las estadísticas',
        error: error.message
      });
    }
  },

  // Obtener opciones para filtros
  async getFilterOptions(req, res) {
    try {
      const [categorias, clientes, marcas, variedades, presentaciones] = await Promise.all([
        CategoriaInsumo.findAll({ attributes: ['id', 'nombre'], where: { activo: true } }),
        Cliente.findAll({ attributes: ['id', 'nombre'], where: { activo: true } }),
        Marca.findAll({ attributes: ['id', 'nombre'], where: { activo: true } }),
        VariedadAgave.findAll({ attributes: ['id', 'nombre'] }),
        Presentacion.findAll({ attributes: ['id', 'volumen'], where: { activo: true } })
      ]);

      res.json({
        success: true,
        data: {
          categorias,
          clientes,
          marcas,
          variedades,
          presentaciones,
          tipos: ['Nacional', 'Exportación']
        }
      });
    } catch (error) {
      console.error('Error al obtener opciones de filtros:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las opciones de filtros',
        error: error.message
      });
    }
  }
};

module.exports = inventarioController;