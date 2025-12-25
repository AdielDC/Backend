const { Cliente, Marca} = require('../models');

exports.obtenerMarcas = async (req, res) => {
  try {
    const { activo, cliente_id } = req.query;
    
    const where = {};
    if (activo !== undefined) where.activo = activo === 'true';
    if (cliente_id) where.cliente_id = cliente_id;

    const marcas = await Marca.findAll({
      where,
      include: [{ model: Cliente, as: 'cliente' }],
      order: [['nombre', 'ASC']]
    });

    res.json({ success: true, data: marcas });
  } catch (error) {
    console.error('Error al obtener marcas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener marcas',
      error: error.message 
    });
  }
};

exports.crearMarca = async (req, res) => {
  try {
    const marca = await Marca.create(req.body);
    
    const marcaCompleta = await Marca.findByPk(marca.id, {
      include: [{ model: Cliente, as: 'cliente' }]
    });

    res.status(201).json({ 
      success: true, 
      message: 'Marca creada exitosamente',
      data: marcaCompleta 
    });
  } catch (error) {
    console.error('Error al crear marca:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear marca',
      error: error.message 
    });
  }
};

exports.actualizarMarca = async (req, res) => {
  try {
    const { id } = req.params;
    
    const marca = await Marca.findByPk(id);
    if (!marca) {
      return res.status(404).json({ 
        success: false, 
        message: 'Marca no encontrada' 
      });
    }

    await marca.update(req.body);

    const marcaActualizada = await Marca.findByPk(id, {
      include: [{ model: Cliente, as: 'cliente' }]
    });

    res.json({ 
      success: true, 
      message: 'Marca actualizada exitosamente',
      data: marcaActualizada 
    });
  } catch (error) {
    console.error('Error al actualizar marca:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al actualizar marca',
      error: error.message 
    });
  }
};
exports.eliminarMarca = async (req, res) => {
  try {
    const { id } = req.params;
    
    const marca = await Marca.findByPk(id);
    if (!marca) {
      return res.status(404).json({ 
        success: false, 
        message: 'Marca no encontrada' 
      });
    }

    await marca.update({ activo: false });

    const marcaEliminada = await Marca.findByPk(id, {
      include: [{ model: Cliente, as: 'cliente' }]
    });

    res.json({ 
      success: true, 
      message: 'Marca eliminada exitosamente',
      data: marcaEliminada 
    });
  } catch (error) {
    console.error('Error al eliminar marca:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al eliminar marca',
      error: error.message 
    });
  }
};