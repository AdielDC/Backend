const { Cliente, Marca, Inventario } = require('../models');

const clienteController = {
  async getAll(req, res) {
    try {
      const { activo = true } = req.query;
      
      const clientes = await Cliente.findAll({
        where: { activo: activo === 'true' },
        include: [
          { 
            model: Marca, 
            as: 'marcas',
            attributes: ['id', 'nombre']
          }
        ],
        order: [['nombre', 'ASC']]
      });

      res.json({
        success: true,
        count: clientes.length,
        data: clientes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener clientes',
        error: error.message
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      
      const cliente = await Cliente.findByPk(id, {
        include: [
          { model: Marca, as: 'marcas' },
          { model: Inventario, as: 'inventarios', limit: 10 }
        ]
      });

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      res.json({
        success: true,
        data: cliente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cliente',
        error: error.message
      });
    }
  },

  async create(req, res) {
    try {
      const cliente = await Cliente.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Datos de validación incorrectos',
          errors: error.errors.map(e => ({ field: e.path, message: e.message }))
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al crear cliente',
        error: error.message
      });
    }
  },

  async update(req, res) {
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
      res.status(500).json({
        success: false,
        message: 'Error al actualizar cliente',
        error: error.message
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      
      const cliente = await Cliente.findByPk(id);

      if (!cliente) {
        return res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
      }

      await cliente.update({ activo: false });

      res.json({
        success: true,
        message: 'Cliente desactivado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar cliente',
        error: error.message
      });
    }
  }
};