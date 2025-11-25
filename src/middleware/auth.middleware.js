const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const logger = require('../utils/logger');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'Token de acceso requerido' 
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ 
        message: 'Formato de token inválido' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Buscar usuario
    const usuario = await Usuario.findByPk(decoded.userId);

    if (!usuario || !usuario.activo) {
      logger.warn(`Intento de acceso con token inválido para usuario ID: ${decoded.userId}`);
      return res.status(401).json({ 
        message: 'Token inválido o usuario inactivo' 
      });
    }

    // Añadir usuario a la request
    req.user = usuario;
    next();

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.warn(`Token JWT inválido: ${error.message}`);
      return res.status(401).json({ 
        message: 'Token inválido' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      logger.warn(`Token JWT expirado: ${error.message}`);
      return res.status(401).json({ 
        message: 'Token expirado' 
      });
    }

    logger.error('Error en middleware de autenticación:', error);
    res.status(500).json({ 
      message: 'Error interno del servidor' 
    });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Usuario no autenticado' 
      });
    }

    if (!Array.isArray(roles)) {
      roles = [roles];
    }

    if (!roles.includes(req.user.rol)) {
      logger.warn(`Usuario ${req.user.email} intentó acceder sin permisos suficientes. Rol requerido: ${roles.join(', ')}, Rol actual: ${req.user.rol}`);
      return res.status(403).json({ 
        message: 'Permisos insuficientes para esta acción' 
      });
    }

    next();
  };
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return next();
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    const usuario = await Usuario.findByPk(decoded.userId);

    if (usuario && usuario.activo) {
      req.user = usuario;
    }

    next();

  } catch (error) {
    // En caso de error, continuar sin usuario autenticado
    next();
  }
};

module.exports = { 
  authenticate, 
  authorize, 
  optionalAuth 
};