const {CategoriaInsumo} = require('../models');

exports.obtenerCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaInsumo.findAll({
      order: [['nombre', 'ASC']]
    });

    res.json({ success: true, data: categorias });
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener categorías',
      error: error.message 
    });
  }
};

exports.crearCategoria = async (req, res) => {
  try {
    const categoria = await CategoriaInsumo.create(req.body);
    
    res.status(201).json({ 
      success: true, 
      message: 'Categoría creada exitosamente',
      data: categoria 
    });
  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(400).json({ 
      success: false, 
      message: 'Error al crear categoría',
      error: error.message 
    });
  }
};
