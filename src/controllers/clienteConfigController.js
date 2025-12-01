// controllers/clienteConfigController.js
// Controlador para manejar la configuración de clientes (variedades, presentaciones, tipos)

const { 
  Cliente, 
  VariedadesAgave, 
  Presentacion,
  ClienteVariedad, 
  ClientePresentacion, 
  ClienteTipo 
} = require('../models');
const { Op } = require('sequelize');

/**
 * Obtener la configuración completa de un cliente
 * GET /api/clientes/:id/configuracion
 */
const obtenerConfiguracionCliente = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener variedades del cliente
    const variedades = await ClienteVariedad.findAll({
      where: { cliente_id: id, activo: true },
      include: [{
        model: VariedadesAgave,
        as: 'variedad',
        attributes: ['id', 'nombre']
      }]
    });

    // Obtener presentaciones del cliente
    const presentaciones = await ClientePresentacion.findAll({
      where: { cliente_id: id, activo: true },
      include: [{
        model: Presentacion,
        as: 'presentacion',
        attributes: ['id', 'volumen']
      }]
    });

    // Obtener tipos del cliente
    const tipos = await ClienteTipo.findAll({
      where: { cliente_id: id, activo: true },
      attributes: ['tipo']
    });

    res.json({
      success: true,
      data: {
        cliente_id: parseInt(id),
        variedades: variedades.map(v => ({
          id: v.variedad.id,
          nombre: v.variedad.nombre
        })),
        presentaciones: presentaciones.map(p => ({
          id: p.presentacion.id,
          volumen: p.presentacion.volumen
        })),
        tipos: tipos.map(t => t.tipo)
      }
    });
  } catch (error) {
    console.error('Error obteniendo configuración del cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la configuración del cliente',
      error: error.message
    });
  }
};

/**
 * Obtener configuración de todos los clientes
 * GET /api/clientes/configuracion
 */
const obtenerTodasConfiguraciones = async (req, res) => {
  try {
    const clientes = await Cliente.findAll({
      where: { activo: true },
      attributes: ['id', 'nombre']
    });

    const configuraciones = {};

    for (const cliente of clientes) {
      const variedades = await ClienteVariedad.findAll({
        where: { cliente_id: cliente.id, activo: true },
        include: [{
          model: VariedadesAgave,
          as: 'variedad',
          attributes: ['id', 'nombre']
        }]
      });

      const presentaciones = await ClientePresentacion.findAll({
        where: { cliente_id: cliente.id, activo: true },
        include: [{
          model: Presentacion,
          as: 'presentacion',
          attributes: ['id', 'volumen']
        }]
      });

      const tipos = await ClienteTipo.findAll({
        where: { cliente_id: cliente.id, activo: true },
        attributes: ['tipo']
      });

      configuraciones[cliente.nombre] = {
        id: cliente.id,
        variedades: variedades.map(v => v.variedad.nombre),
        presentaciones: presentaciones.map(p => p.presentacion.volumen),
        tipos: tipos.map(t => t.tipo)
      };
    }

    res.json({
      success: true,
      data: configuraciones
    });
  } catch (error) {
    console.error('Error obteniendo configuraciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las configuraciones',
      error: error.message
    });
  }
};

/**
 * Actualizar variedades de un cliente
 * PUT /api/clientes/:id/variedades
 * Body: { variedades: [1, 2, 3] } // IDs de variedades
 */
const actualizarVariedadesCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { variedades } = req.body; // Array de IDs de variedades

    if (!Array.isArray(variedades)) {
      return res.status(400).json({
        success: false,
        message: 'El campo variedades debe ser un array de IDs'
      });
    }

    // Desactivar todas las variedades actuales
    await ClienteVariedad.update(
      { activo: false },
      { where: { cliente_id: id } }
    );

    // Insertar o reactivar las nuevas variedades
    for (const variedadId of variedades) {
      await ClienteVariedad.upsert({
        cliente_id: id,
        variedad_agave_id: variedadId,
        activo: true
      });
    }

    res.json({
      success: true,
      message: 'Variedades actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error actualizando variedades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar las variedades',
      error: error.message
    });
  }
};

/**
 * Actualizar presentaciones de un cliente
 * PUT /api/clientes/:id/presentaciones
 * Body: { presentaciones: [1, 2, 3] } // IDs de presentaciones
 */
const actualizarPresentacionesCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { presentaciones } = req.body;

    if (!Array.isArray(presentaciones)) {
      return res.status(400).json({
        success: false,
        message: 'El campo presentaciones debe ser un array de IDs'
      });
    }

    // Desactivar todas las presentaciones actuales
    await ClientePresentacion.update(
      { activo: false },
      { where: { cliente_id: id } }
    );

    // Insertar o reactivar las nuevas presentaciones
    for (const presentacionId of presentaciones) {
      await ClientePresentacion.upsert({
        cliente_id: id,
        presentacion_id: presentacionId,
        activo: true
      });
    }

    res.json({
      success: true,
      message: 'Presentaciones actualizadas correctamente'
    });
  } catch (error) {
    console.error('Error actualizando presentaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar las presentaciones',
      error: error.message
    });
  }
};

/**
 * Actualizar tipos de un cliente
 * PUT /api/clientes/:id/tipos
 * Body: { tipos: ['Nacional', 'Exportación'] }
 */
const actualizarTiposCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipos } = req.body;

    if (!Array.isArray(tipos)) {
      return res.status(400).json({
        success: false,
        message: 'El campo tipos debe ser un array'
      });
    }

    // Validar tipos
    const tiposValidos = ['Nacional', 'Exportación'];
    for (const tipo of tipos) {
      if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
          success: false,
          message: `Tipo inválido: ${tipo}. Valores permitidos: ${tiposValidos.join(', ')}`
        });
      }
    }

    // Desactivar todos los tipos actuales
    await ClienteTipo.update(
      { activo: false },
      { where: { cliente_id: id } }
    );

    // Insertar o reactivar los nuevos tipos
    for (const tipo of tipos) {
      await ClienteTipo.upsert({
        cliente_id: id,
        tipo: tipo,
        activo: true
      });
    }

    res.json({
      success: true,
      message: 'Tipos actualizados correctamente'
    });
  } catch (error) {
    console.error('Error actualizando tipos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar los tipos',
      error: error.message
    });
  }
};

/**
 * Actualizar toda la configuración de un cliente de una vez
 * PUT /api/clientes/:id/configuracion
 * Body: { 
 *   variedades: [1, 2, 3], 
 *   presentaciones: [1, 2], 
 *   tipos: ['Nacional', 'Exportación'] 
 * }
 */
const actualizarConfiguracionCompleta = async (req, res) => {
  try {
    const { id } = req.params;
    const { variedades, presentaciones, tipos } = req.body;

    // Verificar que el cliente existe
    const cliente = await Cliente.findByPk(id);
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }

    // Actualizar variedades si se proporcionan
    if (Array.isArray(variedades)) {
      await ClienteVariedad.update(
        { activo: false },
        { where: { cliente_id: id } }
      );

      for (const variedadId of variedades) {
        await ClienteVariedad.upsert({
          cliente_id: id,
          variedad_agave_id: variedadId,
          activo: true
        });
      }
    }

    // Actualizar presentaciones si se proporcionan
    if (Array.isArray(presentaciones)) {
      await ClientePresentacion.update(
        { activo: false },
        { where: { cliente_id: id } }
      );

      for (const presentacionId of presentaciones) {
        await ClientePresentacion.upsert({
          cliente_id: id,
          presentacion_id: presentacionId,
          activo: true
        });
      }
    }

    // Actualizar tipos si se proporcionan
    if (Array.isArray(tipos)) {
      await ClienteTipo.update(
        { activo: false },
        { where: { cliente_id: id } }
      );

      for (const tipo of tipos) {
        await ClienteTipo.upsert({
          cliente_id: id,
          tipo: tipo,
          activo: true
        });
      }
    }

    // Obtener la configuración actualizada
    const configActualizada = await obtenerConfiguracionClienteInterno(id);

    res.json({
      success: true,
      message: 'Configuración actualizada correctamente',
      data: configActualizada
    });
  } catch (error) {
    console.error('Error actualizando configuración:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la configuración',
      error: error.message
    });
  }
};

// Función interna para obtener configuración
const obtenerConfiguracionClienteInterno = async (clienteId) => {
  const variedades = await ClienteVariedad.findAll({
    where: { cliente_id: clienteId, activo: true },
    include: [{
      model: VariedadesAgave,
      as: 'variedad',
      attributes: ['id', 'nombre']
    }]
  });

  const presentaciones = await ClientePresentacion.findAll({
    where: { cliente_id: clienteId, activo: true },
    include: [{
      model: Presentacion,
      as: 'presentacion',
      attributes: ['id', 'volumen']
    }]
  });

  const tipos = await ClienteTipo.findAll({
    where: { cliente_id: clienteId, activo: true },
    attributes: ['tipo']
  });

  return {
    cliente_id: clienteId,
    variedades: variedades.map(v => ({
      id: v.variedad.id,
      nombre: v.variedad.nombre
    })),
    presentaciones: presentaciones.map(p => ({
      id: p.presentacion.id,
      volumen: p.presentacion.volumen
    })),
    tipos: tipos.map(t => t.tipo)
  };
};

module.exports = {
  obtenerConfiguracionCliente,
  obtenerTodasConfiguraciones,
  actualizarVariedadesCliente,
  actualizarPresentacionesCliente,
  actualizarTiposCliente,
  actualizarConfiguracionCompleta
};