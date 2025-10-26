const { 
  Recepcion, 
  DetalleRecepcion, 
  Inventario,
  Proveedor,
  Cliente,
  Usuario,
  MovimientosInventario,
  CategoriaInsumo,
  Marca,
  VariedadesAgave,
  Presentacion
} = require('../models');
const { sequelize } = require('../config/database');

// Obtener todas las recepciones
exports.obtenerRecepciones = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, cliente_id, estado } = req.query;

    const where = {};
    
    if (fecha_inicio && fecha_fin) {
      where.fecha_recepcion = {
        [Op.between]: [fecha_inicio, fecha_fin]
      };
    }

    if (cliente_id) where.cliente_id = cliente_id;
    if (estado) where.estado = estado;

    const recepciones = await Recepcion.findAll({
      where,
      include: [
        { 
          model: Proveedor, 
          as: 'proveedor',
          attributes: ['id', 'nombre', 'contacto', 'telefono']
        },
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
          model: DetalleRecepcion,
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
      order: [['fecha_recepcion', 'DESC'], ['creado_en', 'DESC']]
    });

    res.json({ 
      success: true, 
      data: recepciones 
    });
  } catch (error) {
    console.error('Error al obtener recepciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener las recepciones',
      error: error.message 
    });
  }
};

// Obtener una recepción específica
exports.obtenerRecepcion = async (req, res) => {
  try {
    const { id } = req.params;

    const recepcion = await Recepcion.findByPk(id, {
      include: [
        { model: Proveedor, as: 'proveedor' },
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        {
          model: DetalleRecepcion,
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

    if (!recepcion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recepción no encontrada' 
      });
    }

    res.json({ 
      success: true, 
      data: recepcion 
    });
  } catch (error) {
    console.error('Error al obtener recepción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener la recepción',
      error: error.message 
    });
  }
};

// Crear nueva recepción con detalles y actualización de inventario
exports.crearRecepcion = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { 
      fecha_recepcion,
      orden_compra,
      factura,
      proveedor_id,
      cliente_id,
      entregado_por,
      recibido_por,
      notas_adicionales,
      usuario_id,
      detalles // Array de { inventario_id, cantidad, unidad, notas }
    } = req.body;

    // Validar datos requeridos
    if (!fecha_recepcion || !proveedor_id || !usuario_id || !detalles || detalles.length === 0) {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'Faltan datos requeridos' 
      });
    }

    // Generar número de recepción único
    const ultimaRecepcion = await Recepcion.findOne({
      order: [['creado_en', 'DESC']],
      attributes: ['numero_recepcion']
    });

    let numeroRecepcion;
    if (ultimaRecepcion && ultimaRecepcion.numero_recepcion) {
      const ultimoNumero = parseInt(ultimaRecepcion.numero_recepcion.split('-')[1]) || 0;
      numeroRecepcion = `REC-${String(ultimoNumero + 1).padStart(6, '0')}`;
    } else {
      numeroRecepcion = `REC-000001`;
    }

    // Crear recepción
    const recepcion = await Recepcion.create({
      numero_recepcion: numeroRecepcion,
      fecha_recepcion,
      orden_compra,
      factura,
      proveedor_id,
      cliente_id,
      entregado_por,
      recibido_por,
      notas_adicionales,
      estado: 'completado',
      usuario_id
    }, { transaction });

    // Procesar cada detalle
    for (const detalle of detalles) {
      // Crear detalle de recepción
      await DetalleRecepcion.create({
        recepcion_id: recepcion.id,
        inventario_id: detalle.inventario_id,
        cantidad: detalle.cantidad,
        unidad: detalle.unidad,
        notas: detalle.notas
      }, { transaction });

      // Actualizar stock del inventario
      const item = await Inventario.findByPk(detalle.inventario_id, { transaction });
      if (!item) {
        await transaction.rollback();
        return res.status(404).json({ 
          success: false, 
          message: `Item de inventario ${detalle.inventario_id} no encontrado` 
        });
      }

      const stockAnterior = item.stock;
      const stockNuevo = stockAnterior + parseInt(detalle.cantidad);

      await item.update({ 
        stock: stockNuevo 
      }, { transaction });

      // Registrar movimiento de inventario
      await MovimientosInventario.create({
        inventario_id: detalle.inventario_id,
        usuario_id,
        tipo_movimiento: 'entrada',
        cantidad: parseInt(detalle.cantidad),
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
        recepcion_id: recepcion.id,
        referencia: numeroRecepcion,
        razon: `Recepción de insumos - ${numeroRecepcion}`
      }, { transaction });
    }

    await transaction.commit();

    // Obtener recepción completa con relaciones
    const recepcionCompleta = await Recepcion.findByPk(recepcion.id, {
      include: [
        { model: Proveedor, as: 'proveedor' },
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        {
          model: DetalleRecepcion,
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
      message: 'Recepción creada exitosamente',
      data: recepcionCompleta 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear recepción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear la recepción',
      error: error.message 
    });
  }
};

// Actualizar recepción
exports.actualizarRecepcion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const recepcion = await Recepcion.findByPk(id);
    if (!recepcion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Recepción no encontrada' 
      });
    }

    // No permitir editar recepciones completadas (solo cambiar estado o notas)
    const { estado, notas_adicionales } = req.body;

    await recepcion.update({
      estado,
      notas_adicionales
    });

    const recepcionActualizada = await Recepcion.findByPk(id, {
      include: [
        { model: Proveedor, as: 'proveedor' },
        { model: Cliente, as: 'cliente' },
        { model: Usuario, as: 'usuario' },
        {
          model: DetalleRecepcion,
          as: 'detalles',
          include: [{ model: Inventario, as: 'inventario' }]
        }
      ]
    });

    res.json({ 
      success: true, 
      message: 'Recepción actualizada exitosamente',
      data: recepcionActualizada 
    });
  } catch (error) {
    console.error('Error al actualizar recepción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al actualizar la recepción',
      error: error.message 
    });
  }
};

// Eliminar recepción (solo si está en estado pendiente)
exports.eliminarRecepcion = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { id } = req.params;

    const recepcion = await Recepcion.findByPk(id, { transaction });
    if (!recepcion) {
      await transaction.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Recepción no encontrada' 
      });
    }

    if (recepcion.estado === 'completado') {
      await transaction.rollback();
      return res.status(400).json({ 
        success: false, 
        message: 'No se puede eliminar una recepción completada' 
      });
    }

    // Eliminar detalles (cascade debería hacerlo automáticamente)
    await DetalleRecepcion.destroy({
      where: { recepcion_id: id },
      transaction
    });

    // Eliminar recepción
    await recepcion.destroy({ transaction });

    await transaction.commit();

    res.json({ 
      success: true, 
      message: 'Recepción eliminada exitosamente' 
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Error al eliminar recepción:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar la recepción',
      error: error.message 
    });
  }
};

// Obtener datos para formulario (proveedores, clientes, inventario)
exports.obtenerDatosFormulario = async (req, res) => {
  try {
    const proveedores = await Proveedor.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'contacto', 'telefono'],
      order: [['nombre', 'ASC']]
    });

    const clientes = await Cliente.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre', 'persona_contacto'],
      order: [['nombre', 'ASC']]
    });

    const inventario = await Inventario.findAll({
      where: { activo: true },
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
        proveedores,
        clientes,
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