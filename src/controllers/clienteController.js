const { Cliente, Marca } = require('../models');
const { Op } = require('sequelize');

exports.obtenerClientes = async (req, res) => {
  try {
    const { activo, search } = req.query;
    
    const where = {};
    if (activo !== undefined) where.activo = activo === 'true';
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { persona_contacto: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const clientes = await Cliente.findAll({
      where,
      include: [{ model: Marca, as: 'marcas' }],
      order: [['nombre', 'ASC']]
    });

    res.json({ success: true, data: clientes });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener clientes',
      error: error.message 
    });
  }
};

exports.obtenerCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id, {
      include: [{ model: Marca, as: 'marcas' }]
    });

    if (!cliente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cliente no encontrado' 
      });
    }

    res.json({ success: true, data: cliente });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener cliente',
      error: error.message 
    });
  }
};

exports.crearCliente = async (req, res) => {
  try {
    const cliente = await Cliente.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Cliente creado exitosamente',
      data: cliente 
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear cliente',
      error: error.message 
    });
  }
};

exports.actualizarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cliente no encontrado' 
      });
    }

    await cliente.update(req.body);

    res.json({ 
      success: true, 
      message: 'Cliente actualizado exitosamente',
      data: cliente 
    });
  } catch (error) {
    console.error('Error al actualizar cliente:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar cliente',
      error: error.message 
    });
  }
};

exports.eliminarCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cliente no encontrado' 
      });
    }

    // Soft delete
    await cliente.update({ activo: false });

    res.json({ 
      success: true, 
      message: 'Cliente desactivado exitosamente' 
    });
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar cliente',
      error: error.message 
    });
  }
};