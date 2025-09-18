const request = require('supertest');
const app = require('../../src/app');
const pool = require('../../config/database_mysql');

describe('Frequência API', () => {
  let inscritoId;
  let freqId;
  const testInscrito = {
    nome: 'Frequencia Teste',
    email: 'freq@ifpa.edu.br',
    telefone: '91999999998'
  };

  beforeAll(async () => {
    // Cria um inscrito para testar frequência
    const [result] = await pool.query(
      'INSERT INTO inscritos (nome, email, telefone) VALUES (?, ?, ?)',
      [testInscrito.nome, testInscrito.email, testInscrito.telefone]
    );
    inscritoId = result.insertId;
  });

  afterAll(async () => {
    await pool.query('DELETE FROM frequencias WHERE inscrito_id = ?', [inscritoId]);
    await pool.query('DELETE FROM inscritos WHERE id = ?', [inscritoId]);
    await pool.end();
  });

  it('deve registrar frequência', async () => {
    const res = await request(app)
      .post('/api/frequencias')
      .send({ inscrito_id: inscritoId, data: '2025-09-17', presente: true });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    freqId = res.body.id;
  });

  it('deve listar frequências por inscrito', async () => {
    const res = await request(app).get(`/api/frequencias/${inscritoId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      expect(res.body[0]).toHaveProperty('inscrito_id', inscritoId);
    }
  });

  it('deve listar todas as frequências', async () => {
    const res = await request(app).get('/api/frequencias');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
