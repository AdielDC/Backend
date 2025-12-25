const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRE || '30m' }
  );
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email y contraseña son requeridos' 
      });
    }

    const usuario = await Usuario.findOne({ 
      where: { 
        email: email.toLowerCase().trim(), 
        activo: true 
      } 
    });

    if (!usuario) {
      logger.warn(`Intento de login fallido para email: ${email}`);
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const isValidPassword = await usuario.validarPassword(password);
    if (!isValidPassword) {
      logger.warn(`Contraseña incorrecta para usuario: ${usuario.email}`);
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const token = generateToken(usuario.id);

    logger.info(`Usuario ${usuario.email} inició sesión exitosamente desde IP: ${req.ip}`);

    res.json({
      message: 'Login exitoso',
      token,
      user: usuario.toJSON()
    });

  } catch (error) {
    logger.error('Error en login:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ 
        message: 'Nombre, email y contraseña son requeridos' 
      });
    }

    // Validar longitud de contraseña
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener al menos 6 caracteres' 
      });
    }

    const { Op } = require('sequelize');
    const existingUser = await Usuario.findOne({
      where: {
        email: email.toLowerCase().trim()
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El email ya está registrado' 
      });
    }

    const usuario = await Usuario.create({
      nombre: nombre.trim(),
      email: email.toLowerCase().trim(),
      password: password, // Se encriptará automáticamente por el hook
      rol: rol || 'admin'
    });

    const token = generateToken(usuario.id);

    logger.info(`Nuevo usuario registrado: ${usuario.email}`);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: usuario.toJSON()
    });

  } catch (error) {
    logger.error('Error en registro:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Datos de registro inválidos',
        errors: error.errors.map(e => e.message)
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'El email ya está registrado'
      });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario || !usuario.activo) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({ 
      user: usuario.toJSON() 
    });

  } catch (error) {
    logger.error('Error al obtener perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { nombre, email } = req.body;
    const usuario = await Usuario.findByPk(req.user.id);

    if (!usuario) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    if (email && email !== usuario.email) {
      const { Op } = require('sequelize');
      const emailExists = await Usuario.findOne({
        where: { 
          email: email.toLowerCase().trim(),
          id: { [Op.ne]: usuario.id }
        }
      });

      if (emailExists) {
        return res.status(400).json({ 
          message: 'El email ya está en uso' 
        });
      }

      usuario.email = email.toLowerCase().trim();
    }

    if (nombre) {
      usuario.nombre = nombre.trim();
    }

    await usuario.save();

    logger.info(`Usuario ${usuario.email} actualizó su perfil`);

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: usuario.toJSON()
    });

  } catch (error) {
    logger.error('Error al actualizar perfil:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        message: 'Contraseña actual y nueva contraseña son requeridas'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const usuario = await Usuario.findByPk(req.user.id);
    
    if (!usuario) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    const isValidPassword = await usuario.validarPassword(current_password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Contraseña actual incorrecta'
      });
    }

    usuario.password = new_password; // Se encriptará automáticamente por el hook
    await usuario.save();

    logger.info(`Usuario ${usuario.email} cambió su contraseña`);

    res.json({
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    logger.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

const logout = async (req, res) => {
  try {
    logger.info(`Usuario ${req.user.email} cerró sesión`);
    
    res.json({
      message: 'Logout exitoso'
    });

  } catch (error) {
    logger.error('Error en logout:', error);
    res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  logout
};