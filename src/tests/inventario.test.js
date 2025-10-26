const request = require('supertest');
const app = require('../server');
const sequelize = require('../config/database');

beforeAll(async () => {
  await sequelize.sync({ force: true }); // Reinicia DB de prueba
});

afterAll(async () => {
  await sequelize.close();
});

describe('Inventario API', () => {
  test('GET /api/inventario debería devolver lista de insumos', async () => {
    const response = await request(app).get('/api/inventario');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});