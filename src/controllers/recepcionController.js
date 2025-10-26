const { Recepcion, DetalleRecepcion, Cliente, Proveedor, Usuario, Inventario } = require('../models');

exports.getAllReceptions = async (req, res) => {
  try {
    const recepciones = await Recepcion.findAll({
      include: [
        { model: Cliente, attributes: ['id', 'nombre'] },
        { model: Proveedor, attributes: ['id', 'nombre'] },
        { model: Usuario, attributes: ['id', 'nombre'] },
        { model: DetalleRecepcion, include: [{ model: Inventario, attributes: ['id', 'categoria_insumo_id', 'tipo', 'stock'] }] },
      ],
    });
    res.json(recepciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createReception = async (req, res) => {
  try {
    const { detalles, ...recepcionData } = req.body;
    const recepcion = await Recepcion.create(recepcionData);
    
    if (detalles && detalles.length > 0) {
      const detallesData = detalles.map(detalle => ({
        ...detalle,
        recepcion_id: recepcion.id,
      }));
      await DetalleRecepcion.bulkCreate(detallesData);
    }
    
    const newRecepcion = await Recepcion.findByPk(recepcion.id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre'] },
        { model: Proveedor, attributes: ['id', 'nombre'] },
        { model: Usuario, attributes: ['id', 'nombre'] },
        { model: DetalleRecepcion, include: [{ model: Inventario, attributes: ['id', 'categoria_insumo_id', 'tipo', 'stock'] }] },
      ],
    });
    
    res.status(201).json(newRecepcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateReception = async (req, res) => {
  try {
    const { id } = req.params;
    const { detalles, ...recepcionData } = req.body;
    
    const recepcion = await Recepcion.findByPk(id);
    if (!recepcion) return res.status(404).json({ error: 'Recepción no encontrada' });
    
    await recepcion.update(recepcionData);
    
    if (detalles) {
      await DetalleRecepcion.destroy({ where: { recepcion_id: id } });
      const detallesData = detalles.map(detalle => ({
        ...detalle,
        recepcion_id: id,
      }));
      await DetalleRecepcion.bulkCreate(detallesData);
    }
    
    const updatedRecepcion = await Recepcion.findByPk(id, {
      include: [
        { model: Cliente, attributes: ['id', 'nombre'] },
        { model: Proveedor, attributes: ['id', 'nombre'] },
        { model: Usuario, attributes: ['id', 'nombre'] },
        { model: DetalleRecepcion, include: [{ model: Inventario, attributes: ['id', 'categoria_insumo_id', 'tipo', 'stock'] }] },
      ],
    });
    
    res.json(updatedRecepcion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReception = async (req, res) => {
  try {
    const { id } = req.params;
    const recepcion = await Recepcion.findByPk(id);
    if (!recepcion) return res.status(404).json({ error: 'Recepción no encontrada' });
    
    await DetalleRecepcion.destroy({ where: { recepcion_id: id } });
    await recepcion.destroy();
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};