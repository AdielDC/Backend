const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');
const Insumo = require('../models/Insumo');
const Cliente = require('../models/Cliente');
const TipoEnvio = require('../models/TipoEnvio');

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
});

afterAll(async () => {
  await sequelize.close();
});

describe('Recepciones API', () => {
  test('POST /api/recepciones debería registrar una recepción', async () => {
    const response = await request(app)
      .post('/api/recepciones')
      .send({
        id_insumo: 1,
        fecha: '2025-09-05',
        responsable: 'Juan Pérez',
        id_cliente: 1,
        orden: 'ORD001',
        lote: 'LOT001',
        cantidad: 50,
        requerimientos: 'Botellas de vidrio',
      });
    expect(response.status).toBe(201);
    expect(response.body.cantidad).toBe(50);

    const insumo = await Insumo.findByPk(1);
    expect(insumo.stock_actual).toBe(150);
  });
});