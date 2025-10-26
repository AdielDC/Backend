const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');
const Insumo = require('../models/Insumo');
const Cliente = require('../models/Cliente');
const TipoEnvio = require('../models/TipoEnvio');
const Recepcion = require('../models/Recepcion');

beforeAll(async () => {
  await sequelize.sync({ force: true });
  await Cliente.create({ id_cliente: 1, nombre: 'The Producer', tipo: 'externo' });
  await TipoEnvio.create({ id_tipo_envio: 1, nombre: 'nacional' });
  await Insumo.create({
    id_insumo: 1,
    tipo: 'BOTELLA 750 ML Y CAJA',
    variedad: 'Espadín',
    presentacion: '750ml',
    id_cliente: 1,
    id_tipo_envio: 1,
    stock_actual: 100,
    stock_minimo: 20,
  });
  await Recepcion.create({
    id_insumo: 1,
    fecha: '2025-09-05',
    responsable: 'Juan Pérez',
    id_cliente: 1,
    orden: 'ORD001',
    lote: 'LOT001',
    cantidad: 100,
  });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Entregas API', () => {
  test('POST /api/entregas debería registrar una entrega con merma', async () => {
    const response = await request(app)
      .post('/api/entregas')
      .send({
        id_insumo: 1,
        fecha: '2025-09-06',
        responsable: 'María Gómez',
        id_cliente: 1,
        orden: 'ENT001',
        lote: 'LOT001',
        cantidad: 80,
        notas: 'Entrega para producción',
      });
    expect(response.status).toBe(201);
    expect(response.body.cantidad).toBe(80);
    expect(response.body.merma).toBe(20);

    const insumo = await Insumo.findByPk(1);
    expect(insumo.stock_actual).toBe(20);
  });
});