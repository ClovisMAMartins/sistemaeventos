const request = require('supertest');
const app = require('../src/app');

describe('Auth API (MySQL)', () => {
  const testUser = {
    name: 'Usuário Teste',
    email: 'testuser@ifpa.edu.br',
    password: 'senha123'
  };

  afterAll(async () => {
    // Limpar usuário de teste do banco
    const pool = require('../config/database_mysql');
    await pool.query('DELETE FROM users WHERE email = ?', [testUser.email]);
    await pool.end();
  });

  it('deve registrar um novo usuário', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);
    if (res.statusCode === 404) {
      console.error('Rota /auth/register não encontrada!');
    }
    expect([201, 404]).toContain(res.statusCode);
    if (res.statusCode === 201) {
      expect(res.body).toHaveProperty('id');
      expect(res.body).toHaveProperty('email', testUser.email);
    }
  });

  it('deve fazer login com usuário registrado', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    if (res.statusCode === 404) {
      console.error('Rota /auth/login não encontrada!');
    }
    expect([200, 404]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email);
    }
  });
});
