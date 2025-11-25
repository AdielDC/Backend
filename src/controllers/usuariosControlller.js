const { Op } = require('sequelize');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');

// Obtener todos los usuarios (solo para admin)
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      activo,
      rol
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = {};

    // Filtro por estado activo/inactivo
    if (activo !== undefined) {
      whereClause.activo = activo === 'true';
    }

    // Filtro por rol
    if (rol) {
      whereClause.rol = rol;
    }

    // Búsqueda por texto
    if (search) {
      whereClause[Op.or] = [
        { nombre: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: usuarios, count } = await Usuario.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['nombre', 'ASC']]
    });

    res.json({
      usuarios,
      pagination: {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        hasNext: offset + limit < count,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    logger.error('Error obteniendo usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener usuario específico
const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);

  } catch (error) {
    logger.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nuevo usuario (solo admin)
const createUser = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      rol
    } = req.body;

    // Validaciones
    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        message: 'Nombre, email y contraseña son requeridos' 
      });
    }

    // Verificar que el email no exista
    const existingEmail = await Usuario.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const nuevoUsuario = await Usuario.create({
      nombre,
      email: email.toLowerCase().trim(),
      password, // Se encriptará automáticamente
      rol: rol || 'visualizador'
    });

    logger.info(`Nuevo usuario creado: ${email} por admin ${req.user.email}`);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      usuario: nuevoUsuario.toJSON()
    });

  } catch (error) {
    logger.error('Error creando usuario:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: error.errors[0].message
      });
    }
    
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo permitir que el usuario edite su propio perfil o que sea admin
    if (req.user.id !== parseInt(id) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para editar este usuario' });
    }

    // Verificar email único si se está actualizando
    if (updateData.email && updateData.email !== usuario.email) {
      const existingEmail = await Usuario.findOne({
        where: {
          email: updateData.email,
          id: { [Op.ne]: id }
        }
      });
      if (existingEmail) {
        return res.status(400).json({ message: 'El email ya está registrado' });
      }
    }

    // Solo admin puede cambiar rol y estado
    if (req.user.rol !== 'admin') {
      delete updateData.rol;
      delete updateData.activo;
    }

    // No actualizar contraseña aquí (usar endpoint específico)
    delete updateData.password;

    await usuario.update(updateData);

    logger.info(`Usuario actualizado: ${usuario.email} por ${req.user.email}`);

    res.json({
      message: 'Usuario actualizado exitosamente',
      usuario: usuario.toJSON()
    });

  } catch (error) {
    logger.error('Error actualizando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Cambiar contraseña
const changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_password, new_password } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo permitir que el usuario cambie su propia contraseña o que sea admin
    if (req.user.id !== parseInt(id) && req.user.rol !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para cambiar esta contraseña' });
    }

    // Si no es admin, verificar contraseña actual
    if (req.user.rol !== 'admin') {
      if (!current_password) {
        return res.status(400).json({ message: 'Contraseña actual requerida' });
      }

      const isValidPassword = await usuario.validarPassword(current_password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }
    }

    // Actualizar contraseña
    usuario.password = new_password; // Se encriptará automáticamente
    await usuario.save();

    logger.info(`Contraseña cambiada para usuario: ${usuario.email} por ${req.user.email}`);

    res.json({ message: 'Contraseña actualizada exitosamente' });

  } catch (error) {
    logger.error('Error cambiando contraseña:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Desactivar usuario (solo admin)
const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir desactivar a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'No puedes desactivarte a ti mismo' });
    }

    usuario.activo = false;
    await usuario.save();

    logger.info(`Usuario desactivado: ${usuario.email} por admin ${req.user.email}`);

    res.json({ message: 'Usuario desactivado exitosamente' });

  } catch (error) {
    logger.error('Error desactivando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Reactivar usuario (solo admin)
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    usuario.activo = true;
    await usuario.save();

    logger.info(`Usuario reactivado: ${usuario.email} por admin ${req.user.email}`);

    res.json({ message: 'Usuario reactivado exitosamente' });

  } catch (error) {
    logger.error('Error reactivando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de usuarios (solo admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await Usuario.count();
    const activeUsers = await Usuario.count({ where: { activo: true } });
    const inactiveUsers = totalUsers - activeUsers;

    const usersByRole = await Usuario.findAll({
      attributes: [
        'rol',
        [Usuario.sequelize.fn('COUNT', Usuario.sequelize.col('id')), 'count']
      ],
      where: { activo: true },
      group: ['rol'],
      raw: true
    });

    const recentUsers = await Usuario.findAll({
      where: {
        creado_en: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
        }
      },
      attributes: { exclude: ['password'] },
      order: [['creado_en', 'DESC']],
      limit: 5
    });

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      usersByRole,
      recentUsers
    });

  } catch (error) {
    logger.error('Error obteniendo estadísticas de usuarios:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Eliminar usuario permanentemente (solo admin)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir eliminar a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }

    await usuario.destroy();

    logger.info(`Usuario eliminado permanentemente: ${usuario.email} por admin ${req.user.email}`);

    res.json({ message: 'Usuario eliminado exitosamente' });

  } catch (error) {
    logger.error('Error eliminando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  changeUserPassword,
  deactivateUser,
  activateUser,
  getUserStats,
  deleteUser
};