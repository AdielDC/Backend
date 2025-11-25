const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { Usuario } = require('../models');

// ⚠️ RUTA SOLO PARA DESARROLLO - Eliminar en producción
// Crear usuario administrador inicial
router.post('/create-admin', async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Validar datos requeridos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        error: 'Todos los campos son requeridos: nombre, email, password'
      });
    }

    // Verificar si ya existe un admin
    const adminExistente = await Usuario.findOne({ 
      where: { email } 
    });

    if (adminExistente) {
      return res.status(400).json({
        error: 'Ya existe un usuario con este email'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario admin
    const nuevoAdmin = await Usuario.create({
      nombre,
      email,
      password: passwordHash,
      rol: 'admin', // Forzar rol admin
      activo: true
    });

    // Retornar usuario sin la contraseña
    const adminSinPassword = {
      id: nuevoAdmin.id,
      nombre: nuevoAdmin.nombre,
      email: nuevoAdmin.email,
      rol: nuevoAdmin.rol,
      activo: nuevoAdmin.activo,
      creado_en: nuevoAdmin.creado_en
    };

    res.status(201).json({
      message: 'Usuario administrador creado exitosamente',
      usuario: adminSinPassword
    });

  } catch (error) {
    console.error('Error al crear admin:', error);
    res.status(500).json({
      error: 'Error al crear usuario administrador',
      detalles: error.message
    });
  }
});

module.exports = router;