const marcaController = {
  async getAll(req, res) {
    try {
      const { clienteId, activo = true } = req.query;
      
      const whereClause = { activo: activo === 'true' };
      if (clienteId) whereClause.clienteId = clienteId;

      const marcas = await Marca.findAll({
        where: whereClause,
        include: [
          { 
            model: Cliente, 
            as: 'cliente',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        count: marcas.length,
        data: marcas
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener marcas',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const marca = await Marca.create(req.body);

      await marca.reload({
        include: [{ model: Cliente, as: 'cliente', attributes: ['id', 'nombre'] }]
      });

      res.status(201).json({
        success: true,
        message: 'Marca creada exitosamente',
        data: marca
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear marca',
        error: error.message
      });
    }
  },

  async update(req, res) {
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

      res.json({
        success: true,
        message: 'Marca actualizada exitosamente',
        data: marca
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar marca',
        error: error.message
      });
    }
  },

  async delete(req, res) {
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

      res.json({
        success: true,
        message: 'Marca desactivada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar marca',
        error: error.message
      });
    }
  }
};