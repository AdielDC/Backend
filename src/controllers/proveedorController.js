const { Proveedor } = require('../models');

const proveedorController = {
  async getAll(req, res) {
    try {
      const { activo = true } = req.query;
      
      const proveedores = await Proveedor.findAll({
        where: { activo: activo === 'true' },
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        count: proveedores.length,
        data: proveedores
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener proveedores',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const proveedor = await Proveedor.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Proveedor creado exitosamente',
        data: proveedor
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear proveedor',
        error: error.message
      });
    }
  },

  async update(req, res) {
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
      res.status(500).json({
        success: false,
        message: 'Error al actualizar proveedor',
        error: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const proveedor = await Proveedor.findByPk(id);

      if (!proveedor) {
        return res.status(404).json({
          success: false,
          message: 'Proveedor no encontrado'
        });
      }

      await proveedor.update({ activo: false });

      res.json({
        success: true,
        message: 'Proveedor desactivado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar proveedor',
        error: error.message
      });
    }
  }
};

module.exports = {
  clienteController,
  marcaController,
  proveedorController
};