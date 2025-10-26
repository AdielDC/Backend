const { 
  Entrega, 
  DetalleEntrega, 
  Inventario,
  Cliente,
  Usuario,
  LotesProduccion,
  MovimientosInventario,
  CategoriaInsumo,
  Marca,
  VariedadesAgave,
  Presentacion
} = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

// Obtener todas las entregas
exports.obtenerEntregas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, cliente_id, estado } = req.query;

    const where = {};
    
    if (fecha_inicio && fecha_fin) {
      where.fecha_entrega = {
        [Op.between]: [fecha_inicio, fecha_fin]
      };
    }

    if (cliente_id) where.cliente_id = cliente_id;
    if (estado) where.estado = estado;

    const entregas = await Entrega.findAll({
      where,
      include: [
        { 
          model: Cliente, 
          as: 'cliente',
          attributes: ['id', 'nombre', 'persona_contacto']
        },
        { 
          model: Usuario, 
          as: 'usuario',
          attributes: ['id', 'nombre', 'email']
        },
        {
          model: LotesProduccion,
          as: 'lote',
          attributes: ['id', 'codigo_lote', 'botellas_restantes']
        },
        {
          model: DetalleEntrega,
          as: 'detalles',
          include: [
            {
              model: Inventario,
              as: 'inventario',
              include: [
                { model: CategoriaInsumo, as: 'categoria' }
              ]
            }
          ]
        }
      ],
      order: [['fecha_entrega', 'DESC'], ['creado_en', 'DESC']]
    });

    res.json({ 
      success: true, 
      data: entregas 
    });
  } catch (error) {
    console.error('Error al obtener entregas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las entregas',
      error: error.message 
    });
  }
};

// Obtener una entrega específica
exports.obtenerEntrega = async (req, res) => {
  try {
    const { id } = req.params;

    const entrega = await Entrega.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        { 
          model: LotesProduccion, 
          as: 'lote',
          include: [
            { model: Marca, as: 'marca' },
            { model: VariedadesAgave, as: 'variedad' },
            { model: Presentacion, as: 'presentacion' }
          ]
        },
        {
          model: DetalleEntrega,
          as: 'detalles',
          include: [
            {
              model: Inventario,
              as: 'inventario',
              include: [
                { model: CategoriaInsumo, as: 'categoria' },
                { model: Marca, as: 'marca' },
                { model: VariedadesAgave, as: 'variedad' },
                { model: Presentacion, as: 'presentacion' }
              ]
            }
          ]
        }
      ]
    });

    if (!entrega) {
      return res.status(404).json({ 
        success: false, 
        message: 'Entrega no encontrada' 
      });
    }

    res.json({ 
      success: true, 
      data: entrega 
    });
  } catch (error) {
    console.error('Error al obtener entrega:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la entrega',
      error: error.message 
    });
  }
};

// Crear nueva entrega con detalles y actualización de inventario
exports.crearEntrega = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      fecha_entrega,
      orden_produccion,
      lote_produccion_id,
      cliente_id,
      entregado_por,
      recibido_por,
      notas_adicionales,
      usuario_id,
      detalles // Array de { inventario_id, cantidad, cantidad_desperdicio, unidad, notas }
    } = req.body;

    // Validar datos requeridos
    if (!fecha_entrega || !cliente_id || !usuario_id || !detalles || detalles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos' 
      });
    }

    // Generar número de entrega único
    const ultimaEntrega = await Entrega.findOne({
      order: [['creado_en', 'DESC']],
      attributes: ['numero_entrega']
    });

    let numeroEntrega;
    if (ultimaEntrega && ultimaEntrega.numero_entrega) {
      const ultimoNumero = parseInt(ultimaEntrega.numero_entrega.split('-')[1]) || 0;
      numeroEntrega = `ENT-${String(ultimoNumero + 1).padStart(6, '0')}`;
    } else {
      numeroEntrega = `ENT-000001`;
    }

    // Crear entrega
    const entrega = await Entrega.create({
      numero_entrega: numeroEntrega,
      fecha_entrega,
      orden_produccion,
      lote_produccion_id,
      cliente_id,
      entregado_por,
      recibido_por,
      notas_adicionales,
      estado: 'completado',
      usuario_id
    }, { transaction });

    // Procesar cada detalle
    for (const detalle of detalles) {
      // Crear detalle de entrega
      await DetalleEntrega.create({
        entrega_id: entrega.id,
        inventario_id: detalle.inventario_id,
        cantidad: detalle.cantidad,
        cantidad_desperdicio: detalle.cantidad_desperdicio || 0,
        unidad: detalle.unidad,
        notas: detalle.notas
      }, { transaction });

      // Actualizar stock del inventario (salida)
      const item = await Inventario.findByPk(detalle.inventario_id, { transaction });
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({ 
          success: false, 
          message: `Item de inventario ${detalle.inventario_id} no encontrado` 
        });
      }

      const stockAnterior = item.stock;
      const cantidadTotal = parseInt(detalle.cantidad) + parseInt(detalle.cantidad_desperdicio || 0);
      const stockNuevo = stockAnterior - cantidadTotal;

      if (stockNuevo < 0) {
        await transaction.rollback();
        return res.status(400).json({ 
          success: false, 
          message: `Stock insuficiente para el item ${item.codigo_lote}` 
        });
      }

      await item.update({ 
        stock: stockNuevo 
      }, { transaction });

      // Registrar movimiento de salida
      await MovimientosInventario.create({
        inventario_id: detalle.inventario_id,
        usuario_id,
        tipo_movimiento: 'salida',
        cantidad: parseInt(detalle.cantidad),
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        entrega_id: entrega.id,
        referencia: numeroEntrega,
        razon: `Entrega de insumos - ${numeroEntrega}`
      }, { transaction });

      // Si hay desperdicio, registrar movimiento adicional
      if (detalle.cantidad_desperdicio && parseInt(detalle.cantidad_desperdicio) > 0) {
        await MovimientosInventario.create({
          inventario_id: detalle.inventario_id,
          usuario_id,
          tipo_movimiento: 'desperdicio',
          cantidad: parseInt(detalle.cantidad_desperdicio),
          stock_anterior: stockNuevo,
          stock_nuevo: stockNuevo,
          entrega_id: entrega.id,
          referencia: numeroEntrega,
          razon: `Desperdicio en entrega - ${numeroEntrega}`
        }, { transaction });
      }
    }

    // Si hay lote de producción asociado, actualizar botellas restantes
    if (lote_produccion_id) {
      const lote = await LotesProduccion.findByPk(lote_produccion_id, { transaction });
      if (lote) {
        // Calcular cuántas botellas se entregaron (basado en el detalle principal)
        const botellasEntregadas = detalles.reduce((sum, d) => sum + parseInt(d.cantidad), 0);
        const nuevasRestantes = Math.max(0, lote.botellas_restantes - botellasEntregadas);
        
        await lote.update({
          botellas_restantes: nuevasRestantes,
          estado: nuevasRestantes === 0 ? 'completado' : lote.estado
        }, { transaction });
      }
    }

    await transaction.commit();

    // Obtener entrega completa con relaciones
    const entregaCompleta = await Entrega.findByPk(entrega.id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        { model: LotesProduccion, as: 'lote' },
        {
          model: DetalleEntrega,
          as: 'detalles',
          include: [
            {
              model: Inventario,
              as: 'inventario',
              include: [
                { model: CategoriaInsumo, as: 'categoria' }
              ]
            }
          ]
        }
      ]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Entrega creada exitosamente',
      data: entregaCompleta 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear entrega:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la entrega',
      error: error.message 
    });
  }
};

// Actualizar entrega
exports.actualizarEntrega = async (req, res) => {
  try {
    const { id } = req.params;
    
    const entrega = await Entrega.findByPk(id);
    if (!entrega) {
      return res.status(404).json({ 
        success: false, 
        message: 'Entrega no encontrada' 
      });
    }

    // No permitir editar entregas completadas (solo cambiar estado o notas)
    const { estado, notas_adicionales } = req.body;

    await entrega.update({
      estado,
      notas_adicionales
    });

    const entregaActualizada = await Entrega.findByPk(id, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        { model: LotesProduccion, as: 'lote' },
        {
          model: DetalleEntrega,
          as: 'detalles',
          include: [{ model: Inventario, as: 'inventario' }]
        }
      ]
    });

    res.json({ 
      success: true, 
      message: 'Entrega actualizada exitosamente',
      data: entregaActualizada 
    });
  } catch (error) {
    console.error('Error al actualizar entrega:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la entrega',
      error: error.message 
    });
  }
};

// Eliminar entrega (solo si está en estado pendiente)
exports.eliminarEntrega = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const entrega = await Entrega.findByPk(id, { transaction });
    if (!entrega) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Entrega no encontrada' 
      });
    }

    if (entrega.estado === 'completado') {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar una entrega completada' 
      });
    }

    // Eliminar detalles
    await DetalleEntrega.destroy({
      where: { entrega_id: id },
      transaction
    });

    // Eliminar entrega
    await entrega.destroy({ transaction });

    await transaction.commit();

    res.json({ 
      success: true, 
      message: 'Entrega eliminada exitosamente' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar entrega:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la entrega',
      error: error.message 
    });
  }
};

// Obtener datos para formulario (clientes, lotes, inventario)
exports.obtenerDatosFormulario = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'persona_contacto'],
      order: [['nombre', 'ASC']]
    });

    const lotes = await LotesProduccion.findAll({
      where: { 
        estado: { [Op.in]: ['activo', 'añejando'] },
        botellas_restantes: { [Op.gt]: 0 }
      },
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' }
      ],
      order: [['fecha_produccion', 'DESC']]
    });

    const inventario = await Inventario.findAll({
      where: { 
        activo: true,
        stock: { [Op.gt]: 0 }
      },
      include: [
        { model: CategoriaInsumo, as: 'categoria' },
        { model: Cliente, as: 'cliente' },
        { model: Marca, as: 'marca' }
      ],
      order: [['codigo_lote', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        clientes,
        lotes,
        inventario
      }
    });
  } catch (error) {
    console.error('Error al obtener datos del formulario:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener datos del formulario',
      error: error.message 
    });
  }
};