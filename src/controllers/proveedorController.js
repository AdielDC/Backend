const { Proveedor} = require('../models');
const { Op } = require('sequelize');

exports.obtenerProveedores = async (req, res) => {
  try {
    const { activo, search } = req.query;
    
    const where = {};
    if (activo !== undefined) where.activo = activo === 'true';
    
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { contacto: { [Op.like]: `%${search}%` } },
        { tipo_insumos: { [Op.like]: `%${search}%` } }
      ];
    }

    const proveedores = await Proveedor.findAll({
      where,
      order: [['nombre', 'ASC']]
    });

    res.json({ success: true, data: proveedores });
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener proveedores',
      error: error.message 
    });
  }
};

exports.crearProveedor = async (req, res) => {
  try {
    const proveedor = await Proveedor.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Proveedor creado exitosamente',
      data: proveedor 
    });
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear proveedor',
      error: error.message 
    });
  }
};

exports.actualizarProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const proveedor = await Proveedor.findByPk(id);
    if (!proveedor) {
      return res.status(404).json({ 
        success: false, 
        message: 'Proveedor no encontrado' 
      });
    }

    await proveedor.update(req.body);

    res.json({ 
      success: true, 
      message: 'Proveedor actualizado exitosamente',
      data: proveedor 
    });
  } catch (error) {
    console.error('Error al actualizar proveedor:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar proveedor',
      error: error.message 
    });
  }
};