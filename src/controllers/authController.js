const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');
const { validateEmail, validatePassword } = require('../utils/helpers');

const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET || 'default-secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
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

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: 'Formato de email inválido' 
      });
    }

    const user = await User.findOne({ 
      where: { 
        email: email.toLowerCase().trim(), 
        active: true 
      } 
    });

    if (!user) {
      logger.warn(`Intento de login fallido para email: ${email}`);
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      logger.warn(`Contraseña incorrecta para usuario: ${user.email}`);
      return res.status(401).json({ 
        message: 'Credenciales inválidas' 
      });
    }

    user.last_login = new Date();
    await user.save();

    const token = generateToken(user.id);

    logger.info(`Usuario ${user.email} inició sesión exitosamente desde IP: ${req.ip}`);

    res.json({
      message: 'Login exitoso',
      token,
      user: user.toJSON()
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
    const { username, email, password, full_name, role } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ 
        message: 'Todos los campos son requeridos' 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: 'Formato de email inválido' 
      });
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ 
        message: passwordValidation.message 
      });
    }

    const { Op } = require('sequelize');
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { email: email.toLowerCase().trim() },
          { username: username.toLowerCase().trim() }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'El usuario o email ya existe' 
      });
    }

    const user = await User.create({
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password_hash: password,
      full_name: full_name.trim(),
      role: role || 'operator'
    });

    const token = generateToken(user.id);

    logger.info(`Nuevo usuario registrado: ${user.email}`);

    res.status(201).json({
      message: 'Usuario creado exitosamente',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    logger.error('Error en registro:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        message: 'Datos de registro inválidos',
        errors: error.errors.map(e => e.message)
      });
    }

    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || !user.active) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    res.json({ 
      user: user.toJSON() 
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
    const { full_name, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    if (email && email !== user.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({ 
          message: 'Formato de email inválido' 
        });
      }

      const { Op } = require('sequelize');
      const emailExists = await User.findOne({
        where: { 
          email: email.toLowerCase().trim(),
          id: { [Op.ne]: user.id }
        }
      });

      if (emailExists) {
        return res.status(400).json({ 
          message: 'El email ya está en uso' 
        });
      }

      user.email = email.toLowerCase().trim();
    }

    if (full_name) {
      user.full_name = full_name.trim();
    }

    await user.save();

    logger.info(`Usuario ${user.email} actualizó su perfil`);

    res.json({
      message: 'Perfil actualizado exitosamente',
      user: user.toJSON()
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

    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: 'Usuario no encontrado' 
      });
    }

    const isValidPassword = await user.validatePassword(current_password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Contraseña actual incorrecta'
      });
    }

    const passwordValidation = validatePassword(new_password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: passwordValidation.message
      });
    }

    user.password_hash = new_password;
    await user.save();

    logger.info(`Usuario ${user.email} cambió su contraseña`);

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