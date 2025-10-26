const { Op, sequelize } = require('sequelize');
const Delivery = require('../models/Delivery');
const DeliveryDetail = require('../models/DeliveryDetail');
const Client = require('../models/Client');
const SupplyCategory = require('../models/SupplyCategory');
const Inventory = require('../models/Inventory');
const User = require('../models/User');
const logger = require('../utils/logger');

// Obtener todas las entregas
const getAllDeliveries = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      client_id,
      status,
      date_from,
      date_to,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = {};

    // Filtros
    if (client_id) whereClause.client_id = client_id;
    if (status) whereClause.status = status;

    if (date_from && date_to) {
      whereClause.delivery_date = {
        [Op.between]: [date_from, date_to]
      };
    } else if (date_from) {
      whereClause.delivery_date = {
        [Op.gte]: date_from
      };
    } else if (date_to) {
      whereClause.delivery_date = {
        [Op.lte]: date_to
      };
    }

    // Búsqueda
    if (search) {
      whereClause[Op.or] = [
        { delivery_number: { [Op.like]: `%${search}%` } },
        { shipping_order: { [Op.like]: `%${search}%` } },
        { batch_code: { [Op.like]: `%${search}%` } },
        { format: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: deliveries, count } = await Delivery.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'name']
        },
        {
          model: User,
          as: 'responsible_user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: DeliveryDetail,
          as: 'delivery_details',
          include: [
            {
              model: SupplyCategory,
              as: 'supply_category',
              attributes: ['id', 'name']
            }
          ]
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['delivery_date', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      deliveries,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + limit < count,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    logger.error('Error obteniendo entregas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener entrega específica
const getDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client'
        },
        {
          model: User,
          as: 'responsible_user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: DeliveryDetail,
          as: 'delivery_details',
          include: [
            {
              model: SupplyCategory,
              as: 'supply_category'
            },
            {
              model: Inventory,
              as: 'inventory'
            }
          ]
        }
      ]
    });

    if (!delivery) {
      return res.status(404).json({ message: 'Entrega no encontrada' });
    }

    res.json(delivery);

  } catch (error) {
    logger.error('Error obteniendo entrega:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nueva entrega
const createDelivery = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      client_id,
      delivery_date,
      shipping_order,
      batch_code,
      format,
      supplies,
      additional_notes,
      delivered_by,
      received_by
    } = req.body;

    // Verificar que el cliente exista
    const client = await Client.findByPk(client_id);
    if (!client || !client.active) {
      await transaction.rollback();
      return res.status(400).json({ message: 'Cliente no encontrado o inactivo' });
    }

    // Crear entrega
    const delivery = await Delivery.create({
      client_id,
      responsible_user_id: req.user.id,
      delivery_date,
      shipping_order,
      batch_code,
      format,
      additional_notes,
      delivered_by,
      received_by
    }, { transaction });

    // Crear detalles de entrega
    if (supplies && supplies.length > 0) {
      for (const supply of supplies) {
        // Crear detalle
        await DeliveryDetail.create({
          delivery_id: delivery.id,
          inventory_id: supply.inventory_id || null,
          supply_category_id: supply.supply_category_id,
          supply_name: supply.name,
          quantity: supply.quantity,
          waste_quantity: supply.waste || 0,
          unit: supply.unit || 'piezas',
          notes: supply.notes
        }, { transaction });

        // Actualizar inventario si se especifica
        if (supply.inventory_id) {
          const inventoryItem = await Inventory.findByPk(supply.inventory_id);
          if (inventoryItem) {
            await inventoryItem.updateStock(
              supply.quantity,
              'delivery',
              req.user.id,
              transaction
            );
          }
        }
      }
    }

    await transaction.commit();

    // Obtener entrega completa
    const newDelivery = await Delivery.findByPk(delivery.id, {
      include: [
        {
          model: Client,
          as: 'client'
        },
        {
          model: User,
          as: 'responsible_user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: DeliveryDetail,
          as: 'delivery_details',
          include: [
            {
              model: SupplyCategory,
              as: 'supply_category'
            },
            {
              model: Inventory,
              as: 'inventory'
            }
          ]
        }
      ]
    });

    logger.info(`Nueva entrega creada: ${delivery.delivery_number} por usuario ${req.user.email}`);

    res.status(201).json({
      message: 'Entrega creada exitosamente',
      delivery: newDelivery
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Error creando entrega:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar entrega
const updateDelivery = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      client_id,
      delivery_date,
      shipping_order,
      batch_code,
      format,
      supplies,
      additional_notes,
      delivered_by,
      received_by
    } = req.body;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Entrega no encontrada' });
    }

    // No permitir edición si está completada
    if (delivery.status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({ message: 'No se puede editar una entrega completada' });
    }

    // Verificar cliente si se está cambiando
    if (client_id && client_id !== delivery.client_id) {
      const client = await Client.findByPk(client_id);
      if (!client || !client.active) {
        await transaction.rollback();
        return res.status(400).json({ message: 'Cliente no encontrado o inactivo' });
      }
    }

    // Revertir movimientos de inventario anteriores
    const existingDetails = await DeliveryDetail.findAll({
      where: { delivery_id: id },
      transaction
    });

    for (const detail of existingDetails) {
      if (detail.inventory_id) {
        const inventoryItem = await Inventory.findByPk(detail.inventory_id);
        if (inventoryItem) {
          // Revertir el movimiento (sumar de vuelta)
          await inventoryItem.updateStock(
            detail.quantity,
            'reception', // Movimiento inverso
            req.user.id,
            transaction
          );
        }
      }
    }

    // Actualizar entrega
    await delivery.update({
      client_id: client_id || delivery.client_id,
      delivery_date: delivery_date || delivery.delivery_date,
      shipping_order: shipping_order || delivery.shipping_order,
      batch_code: batch_code || delivery.batch_code,
      format: format || delivery.format,
      additional_notes,
      delivered_by,
      received_by
    }, { transaction });

    // Eliminar detalles existentes
    await DeliveryDetail.destroy({
      where: { delivery_id: id },
      transaction
    });

    // Crear nuevos detalles y aplicar movimientos
    if (supplies && supplies.length > 0) {
      for (const supply of supplies) {
        await DeliveryDetail.create({
          delivery_id: id,
          inventory_id: supply.inventory_id || null,
          supply_category_id: supply.supply_category_id,
          supply_name: supply.name,
          quantity: supply.quantity,
          waste_quantity: supply.waste || 0,
          unit: supply.unit || 'piezas',
          notes: supply.notes
        }, { transaction });

        // Actualizar inventario si se especifica
        if (supply.inventory_id) {
          const inventoryItem = await Inventory.findByPk(supply.inventory_id);
          if (inventoryItem) {
            await inventoryItem.updateStock(
              supply.quantity,
              'delivery',
              req.user.id,
              transaction
            );
          }
        }
      }
    }

    await transaction.commit();

    // Obtener entrega actualizada
    const updatedDelivery = await Delivery.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client'
        },
        {
          model: User,
          as: 'responsible_user',
          attributes: ['id', 'full_name', 'email']
        },
        {
          model: DeliveryDetail,
          as: 'delivery_details',
          include: [
            {
              model: SupplyCategory,
              as: 'supply_category'
            },
            {
              model: Inventory,
              as: 'inventory'
            }
          ]
        }
      ]
    });

    logger.info(`Entrega actualizada: ${delivery.delivery_number} por usuario ${req.user.email}`);

    res.json({
      message: 'Entrega actualizada exitosamente',
      delivery: updatedDelivery
    });

  } catch (error) {
    await transaction.rollback();
    logger.error('Error actualizando entrega:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Completar entrega
const completeDelivery = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Entrega no encontrada' });
    }

    if (delivery.status === 'completed') {
      return res.status(400).json({ message: 'La entrega ya está completada' });
    }

    await delivery.complete();

    logger.info(`Entrega completada: ${delivery.delivery_number} por usuario ${req.user.email}`);

    res.json({ message: 'Entrega completada exitosamente' });

  } catch (error) {
    logger.error('Error completando entrega:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Cancelar entrega
const cancelDelivery = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Entrega no encontrada' });
    }

    if (delivery.status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({ message: 'No se puede cancelar una entrega completada' });
    }

    // Revertir movimientos de inventario
    const deliveryDetails = await DeliveryDetail.findAll({
      where: { delivery_id: id },
      transaction
    });

    for (const detail of deliveryDetails) {
      if (detail.inventory_id) {
        const inventoryItem = await Inventory.findByPk(detail.inventory_id);
        if (inventoryItem) {
          // Revertir el movimiento (sumar de vuelta al inventario)
          await inventoryItem.updateStock(
            detail.quantity,
            'reception', // Movimiento inverso
            req.user.id,
            transaction
          );
        }
      }
    }

    await delivery.cancel();
    await transaction.commit();

    logger.info(`Entrega cancelada: ${delivery.delivery_number} por usuario ${req.user.email}`);

    res.json({ message: 'Entrega cancelada exitosamente' });

  } catch (error) {
    await transaction.rollback();
    logger.error('Error cancelando entrega:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar entrega
const deleteDelivery = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;

    const delivery = await Delivery.findByPk(id);
    if (!delivery) {
      await transaction.rollback();
      return res.status(404).json({ message: 'Entrega no encontrada' });
    }

    if (delivery.status === 'completed') {
      await transaction.rollback();
      return res.status(400).json({ message: 'No se puede eliminar una entrega completada' });
    }

    // Revertir movimientos de inventario
    const deliveryDetails = await DeliveryDetail.findAll({
      where: { delivery_id: id },
      transaction
    });

    for (const detail of deliveryDetails) {
      if (detail.inventory_id) {
        const inventoryItem = await Inventory.findByPk(detail.inventory_id);
        if (inventoryItem) {
          await inventoryItem.updateStock(
            detail.quantity,
            'reception',
            req.user.id,
            transaction
          );
        }
      }
    }

    // Eliminar detalles primero
    await DeliveryDetail.destroy({
      where: { delivery_id: id },
      transaction
    });

    // Eliminar entrega
    await delivery.destroy({ transaction });

    await transaction.commit();

    logger.info(`Entrega eliminada: ${delivery.delivery_number} por usuario ${req.user.email}`);

    res.json({ message: 'Entrega eliminada exitosamente' });

  } catch (error) {
    await transaction.rollback();
    logger.error('Error eliminando entrega:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener reporte de mermas
const getWasteReport = async (req, res) => {
  try {
    const { date_from, date_to, client_id } = req.query;

    let whereClause = {};

    if (date_from && date_to) {
      whereClause.delivery_date = {
        [Op.between]: [date_from, date_to]
      };
    }

    if (client_id) {
      whereClause.client_id = client_id;
    }

    const wasteReport = await DeliveryDetail.findAll({
      attributes: [
        'supply_category_id',
        [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
        [sequelize.fn('SUM', sequelize.col('waste_quantity')), 'total_waste'],
        [sequelize.literal('(SUM(waste_quantity) / SUM(quantity) * 100)'), 'waste_percentage']
      ],
      include: [
        {
          model: SupplyCategory,
          as: 'supply_category',
          attributes: ['id', 'name']
        },
        {
          model: Delivery,
          as: 'delivery',
          where: whereClause,
          attributes: []
        }
      ],
      group: ['supply_category_id', 'supply_category.id'],
      having: sequelize.where(sequelize.fn('SUM', sequelize.col('waste_quantity')), '>', 0)
    });

    res.json(wasteReport);

  } catch (error) {
    logger.error('Error obteniendo reporte de mermas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllDeliveries,
  getDelivery,
  createDelivery,
  updateDelivery,
  completeDelivery,
  cancelDelivery,
  deleteDelivery,
  getWasteReport
};