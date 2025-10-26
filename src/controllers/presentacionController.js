const { 
  Cliente, 
  Marca, 
  Proveedor,
  CategoriaInsumo,
  VariedadesAgave,
  Presentacion
} = require('../models');
const { Op } = require('sequelize');

exports.obtenerPresentaciones = async (req, res) => {
  try {
    const { activo } = req.query;
    
    const where = {};
    if (activo !== undefined) where.activo = activo === 'true';

    const presentaciones = await Presentacion.findAll({
      where,
      order: [['volumen', 'ASC']]
    });

    res.json({ success: true, data: presentaciones });
  } catch (error) {
    console.error('Error al obtener presentaciones:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener presentaciones',
      error: error.message 
    });
  }
};

exports.crearPresentacion = async (req, res) => {
  try {
    const presentacion = await Presentacion.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Presentación creada exitosamente',
      data: presentacion 
    });
  } catch (error) {
    console.error('Error al crear presentación:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear presentación',
      error: error.message 
    });
  }
};