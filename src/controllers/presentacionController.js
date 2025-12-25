const { Presentacion } = require('../models');

exports.obtenerPresentaciones = async (req, res) => {
  try {
    const presentaciones = await Presentacion.findAll({
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

exports.obtenerPresentacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const presentacion = await Presentacion.findByPk(id);

    if (!presentacion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Presentación no encontrada' 
      });
    }

    res.json({ success: true, data: presentacion });
  } catch (error) {
    console.error('Error al obtener presentación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener presentación',
      error: error.message 
    });
  }
};

exports.crearPresentacion = async (req, res) => {
  try {
    const presentacionData = {
      ...req.body,
      activo: req.body.activo !== undefined ? req.body.activo : true
    };
    
    const presentacion = await Presentacion.create(presentacionData);
    
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

exports.actualizarPresentacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    const presentacion = await Presentacion.findByPk(id);
    if (!presentacion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Presentación no encontrada' 
      });
    }

    await presentacion.update(req.body);

    res.json({ 
      success: true, 
      message: 'Presentación actualizada exitosamente',
      data: presentacion 
    });
  } catch (error) {
    console.error('Error al actualizar presentación:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar presentación',
      error: error.message 
    });
  }
};

exports.eliminarPresentacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Desactivando presentación con ID:', id);
    
    const presentacion = await Presentacion.findByPk(id);
    if (!presentacion) {
      return res.status(404).json({ 
        success: false, 
        message: 'Presentación no encontrada' 
      });
    }

    // 🎯 SOFT DELETE - Marcar como inactivo
    await presentacion.update({ activo: false });

    console.log('✅ Presentación desactivada exitosamente');

    res.json({ 
      success: true, 
      message: `Presentación "${presentacion.volumen}" desactivada exitosamente`,
      data: presentacion 
    });
  } catch (error) {
    console.error('💥 Error al desactivar presentación:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al desactivar presentación',
      error: error.message 
    });
  }
};