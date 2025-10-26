const logger = require('../utils/logger');

const errorMiddleware = (err, req, res, next) => {
  // Log del error
  logger.error('Error capturado:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Errores de validación de Sequelize
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Error de validación',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message
      }))
    });
  }

  // Errores de restricción única de Sequelize
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      message: 'El registro ya existe',
      errors: err.errors.map(e => ({
        field: e.path,
        message: `${e.path} ya está en uso`
      }))
    });
  }

  // Errores de clave foránea de Sequelize
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      message: 'Referencia inválida',
      error: 'El registro referenciado no existe o no puede ser eliminado'
    });
  }

  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Token inválido'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Token expirado'
    });
  }

  // Error personalizado con statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || 'Error en el servidor'
    });
  }

  // Error genérico del servidor
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
};

module.exports = errorMiddleware;