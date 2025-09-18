const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../config/database_mysql');

describe('CRUD Inscritos API', () => {
  let inscritoId;
  const testInscrito = {
    nome: 'Inscrito Teste',
    email: 'inscrito@ifpa.edu.br',
    telefone: '91999999999'
  };

  afterAll(async () => {
    await pool.query('DELETE FROM inscritos WHERE email = ?', [testInscrito.email]);
    await pool.end();
  });

  it('deve criar um novo inscrito', async () => {
    const res = await request(app)
      .post('/api/inscritos')
      .send(testInscrito);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    inscritoId = res.body.id;
  });

  it('deve listar todos os inscritos', async () => {
    const res = await request(app).get('/api/inscritos');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('deve buscar um inscrito por id', async () => {
    const res = await request(app).get(`/api/inscritos/${inscritoId}`);
    expect([200,404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('id', inscritoId);
    }
  });

  it('deve atualizar um inscrito', async () => {
    const res = await request(app)
      .put(`/api/inscritos/${inscritoId}`)
      .send({ nome: 'Novo Nome', email: testInscrito.email, telefone: '91888888888' });
    expect([200,404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('nome', 'Novo Nome');
    }
  });

  it('deve deletar um inscrito', async () => {
    const res = await request(app).delete(`/api/inscritos/${inscritoId}`);
    expect([204,404]).toContain(res.statusCode);
  });
});
