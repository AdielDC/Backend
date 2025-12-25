// alertaController.js - Controlador para gestión de alertas de inventario
// Ubicación: src/controllers/alertaController.js

const { AlertasInventario, Inventario, CategoriaInsumo, Cliente, Marca } = require('../models');
const { Op } = require('sequelize');

const alertaController = {
  // Obtener todas las alertas con filtros
  obtenerAlertas: async (req, res) => {
    try {
      const { vista, resuelta, tipo_alerta } = req.query;
      
      const whereClause = {};
      
      if (vista !== undefined) {
        whereClause.vista = vista === 'true';
      }
      
      if (resuelta !== undefined) {
        whereClause.resuelta = resuelta === 'true';
      }
      
      if (tipo_alerta) {
        whereClause.tipo_alerta = tipo_alerta;
      }

      const alertas = await AlertasInventario.findAll({
        where: whereClause,
        include: [
          {
            model: Inventario,
            include: [
              { model: CategoriaInsumo },
              { model: Cliente },
              { model: Marca }
            ]
          }
        ],
        order: [['fecha_alerta', 'DESC']]
      });

      res.json({
        success: true,
        data: alertas
      });
    } catch (error) {
      console.error('Error obteniendo alertas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las alertas',
        error: error.message
      });
    }
  },

  // Obtener contador de alertas no vistas
  obtenerCountNoVistas: async (req, res) => {
    try {
      const count = await AlertasInventario.count({
        where: {
          vista: false,
          resuelta: false
        }
      });

      res.json({
        success: true,
        count
      });
    } catch (error) {
      console.error('Error obteniendo contador:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el contador',
        error: error.message
      });
    }
  },

  // Marcar alerta como vista
  marcarComoVista: async (req, res) => {
    try {
      const { id } = req.params;

      const alerta = await AlertasInventario.findByPk(id);
      
      if (!alerta) {
        return res.status(404).json({
          success: false,
          message: 'Alerta no encontrada'
        });
      }

      await alerta.update({ vista: true });

      res.json({
        success: true,
        message: 'Alerta marcada como vista',
        data: alerta
      });
    } catch (error) {
      console.error('Error marcando alerta como vista:', error);
      res.status(500).json({
        success: false,
        message: 'Error al marcar la alerta',
        error: error.message
      });
    }
  },

  // Marcar todas las alertas como vistas
  marcarTodasComoVistas: async (req, res) => {
    try {
      await AlertasInventario.update(
        { vista: true },
        {
          where: {
            vista: false,
            resuelta: false
          }
        }
      );

      res.json({
        success: true,
        message: 'Todas las alertas marcadas como vistas'
      });
    } catch (error) {
      console.error('Error marcando todas como vistas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al marcar las alertas',
        error: error.message
      });
    }
  },

  // Resolver alerta
  resolverAlerta: async (req, res) => {
    try {
      const { id } = req.params;
      const { usuario_id } = req.body;

      const alerta = await AlertasInventario.findByPk(id);
      
      if (!alerta) {
        return res.status(404).json({
          success: false,
          message: 'Alerta no encontrada'
        });
      }

      await alerta.update({
        resuelta: true,
        resuelta_por: usuario_id,
        fecha_resolucion: new Date(),
        vista: true
      });

      res.json({
        success: true,
        message: 'Alerta resuelta exitosamente',
        data: alerta
      });
    } catch (error) {
      console.error('Error resolviendo alerta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al resolver la alerta',
        error: error.message
      });
    }
  },

  // Eliminar alerta
  eliminarAlerta: async (req, res) => {
    try {
      const { id } = req.params;

      const alerta = await AlertasInventario.findByPk(id);
      
      if (!alerta) {
        return res.status(404).json({
          success: false,
          message: 'Alerta no encontrada'
        });
      }

      await alerta.destroy();

      res.json({
        success: true,
        message: 'Alerta eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando alerta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la alerta',
        error: error.message
      });
    }
  },

  // Crear alerta manualmente (útil para pruebas o casos especiales)
  crearAlerta: async (req, res) => {
    try {
      const { inventario_id, tipo_alerta, mensaje } = req.body;

      if (!inventario_id || !tipo_alerta || !mensaje) {
        return res.status(400).json({
          success: false,
          message: 'Faltan campos requeridos'
        });
      }

      const alerta = await AlertasInventario.create({
        inventario_id,
        tipo_alerta,
        mensaje,
        fecha_alerta: new Date(),
        vista: false,
        resuelta: false
      });

      res.status(201).json({
        success: true,
        message: 'Alerta creada exitosamente',
        data: alerta
      });
    } catch (error) {
      console.error('Error creando alerta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear la alerta',
        error: error.message
      });
    }
  }
};

module.exports = alertaController;