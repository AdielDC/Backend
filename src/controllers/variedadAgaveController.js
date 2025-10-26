const { VariedadesAgave} = require('../models');

exports.obtenerVariedades = async (req, res) => {
  try {
    const variedades = await VariedadesAgave.findAll({
      order: [['nombre', 'ASC']]
    });

    res.json({ success: true, data: variedades });
  } catch (error) {
    console.error('Error al obtener variedades:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener variedades',
      error: error.message 
    });
  }
};

exports.crearVariedad = async (req, res) => {
  try {
    const variedad = await VariedadesAgave.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Variedad creada exitosamente',
      data: variedad 
    });
  } catch (error) {
    console.error('Error al crear variedad:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear variedad',
      error: error.message 
    });
  }
};