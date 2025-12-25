const { VariedadesAgave } = require('../models');

exports.obtenerVariedades = async (req, res) => {
  try {
    const variedades = await VariedadesAgave.findAll({
      // ✅ Mostrar todas (activas e inactivas) para el panel de administración
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
    // ✅ Asegurar que activo sea true por defecto
    const variedadData = {
      ...req.body,
      activo: req.body.activo !== undefined ? req.body.activo : true
    };
    
    const variedad = await VariedadesAgave.create(variedadData);
    
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

exports.actualizarVariedad = async (req, res) => {
  try {
    const { id } = req.params;
    
    const variedad = await VariedadesAgave.findByPk(id);
    if (!variedad) {
      return res.status(404).json({ 
        success: false, 
        message: 'Variedad no encontrada' 
      });
    }

    await variedad.update(req.body);

    res.json({ 
      success: true, 
      message: 'Variedad actualizada exitosamente',
      data: variedad 
    });
  } catch (error) {
    console.error('Error al actualizar variedad:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar variedad',
      error: error.message 
    });
  }
};

exports.eliminarVariedad = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Desactivando variedad con ID:', id);
    
    const variedad = await VariedadesAgave.findByPk(id);
    if (!variedad) {
      return res.status(404).json({ 
        success: false, 
        message: 'Variedad no encontrada' 
      });
    }

    // 🎯 SOFT DELETE - Marcar como inactivo
    await variedad.update({ activo: false });

    console.log('✅ Variedad desactivada exitosamente');

    res.json({ 
      success: true, 
      message: `Variedad "${variedad.nombre}" desactivada exitosamente`,
      data: variedad 
    });
  } catch (error) {
    console.error('💥 Error al desactivar variedad:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al desactivar variedad',
      error: error.message 
    });
  }
};