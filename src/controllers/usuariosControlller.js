const { Op } = require('sequelize');
const User = require('../models/Usuario');
const logger = require('../utils/logger');

// Obtener todos los usuarios (solo para admin)
const getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      search,
      active,
      role
    } = req.query;

    const offset = (page - 1) * limit;
    let whereClause = {};

    // Filtro por estado activo/inactivo
    if (active !== undefined) {
      whereClause.active = active === 'true';
    }

    // Filtro por rol
    if (role) {
      whereClause.role = role;
    }

    // Búsqueda por texto
    if (search) {
      whereClause[Op.or] = [
        { username: { [Op.like]: `%${search}%` } },
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { rows: users, count } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['full_name', 'ASC']]
    });

    res.json({
      users,
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

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);

  } catch (error) {
    logger.error('Error obteniendo usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Crear nuevo usuario (solo admin)
const createUser = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      full_name,
      role
    } = req.body;

    // Verificar que el username no exista
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    // Verificar que el email no exista
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const newUser = await User.create({
      username,
      email,
      password_hash: password,
      full_name,
      role
    });

    logger.info(`Nuevo usuario creado: ${username} (${email}) por admin ${req.user.email}`);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      user: newUser.toJSON()
    });

  } catch (error) {
    logger.error('Error creando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Actualizar usuario
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo permitir que el usuario edite su propio perfil o que sea admin
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para editar este usuario' });
    }

    // Verificar username único si se está actualizando
    if (updateData.username && updateData.username !== user.username) {
      const existingUsername = await User.findOne({
        where: {
          username: updateData.username,
          id: { [Op.ne]: id }
        }
      });
      if (existingUsername) {
        return res.status(400).json({ message: 'El nombre de usuario ya existe' });
      }
    }

    // Verificar email único si se está actualizando
    if (updateData.email && updateData.email !== user.email) {
      const existingEmail = await User.findOne({
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
    if (req.user.role !== 'admin') {
      delete updateData.role;
      delete updateData.active;
    }

    // No actualizar contraseña aquí (usar endpoint específico)
    delete updateData.password;
    delete updateData.password_hash;

    await user.update(updateData);

    logger.info(`Usuario actualizado: ${user.username} por ${req.user.email}`);

    res.json({
      message: 'Usuario actualizado exitosamente',
      user: user.toJSON()
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

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Solo permitir que el usuario cambie su propia contraseña o que sea admin
    if (req.user.id !== parseInt(id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No tienes permisos para cambiar esta contraseña' });
    }

    // Si no es admin, verificar contraseña actual
    if (req.user.role !== 'admin') {
      if (!current_password) {
        return res.status(400).json({ message: 'Contraseña actual requerida' });
      }

      const isValidPassword = await user.validatePassword(current_password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Contraseña actual incorrecta' });
      }
    }

    // Actualizar contraseña
    user.password_hash = new_password;
    await user.save();

    logger.info(`Contraseña cambiada para usuario: ${user.username} por ${req.user.email}`);

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

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir desactivar a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'No puedes desactivarte a ti mismo' });
    }

    user.active = false;
    await user.save();

    logger.info(`Usuario desactivado: ${user.username} por admin ${req.user.email}`);

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

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    user.active = true;
    await user.save();

    logger.info(`Usuario reactivado: ${user.username} por admin ${req.user.email}`);

    res.json({ message: 'Usuario reactivado exitosamente' });

  } catch (error) {
    logger.error('Error reactivando usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

// Obtener estadísticas de usuarios (solo admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { active: true } });
    const inactiveUsers = totalUsers - activeUsers;

    const usersByRole = await User.findAll({
      attributes: [
        'role',
        [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'count']
      ],
      where: { active: true },
      group: ['role']
    });

    const recentUsers = await User.findAll({
      where: {
        created_at: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Últimos 30 días
        }
      },
      attributes: { exclude: ['password_hash'] },
      order: [['created_at', 'DESC']],
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

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // No permitir eliminar a sí mismo
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
    }

    // Verificar que no tenga registros asociados
    const Inventory = require('../models/Inventory');
    const Reception = require('../models/Reception');
    const Delivery = require('../models/Delivery');

    const inventoryCount = await Inventory.count({ where: { updated_by: id } });
    const receptionsCount = await Reception.count({ where: { responsible_user_id: id } });
    const deliveriesCount = await Delivery.count({ where: { responsible_user_id: id } });

    if (inventoryCount > 0 || receptionsCount > 0 || deliveriesCount > 0) {
      return res.status(400).json({
        message: 'No se puede eliminar el usuario porque tiene registros asociados'
      });
    }

    await user.destroy();

    logger.info(`Usuario eliminado permanentemente: ${user.username} por admin ${req.user.email}`);

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