const request = require('supertest');
const app = require('../src/app');

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Teste', email: 'teste@email.com', password: '123456' });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'teste@email.com');
  });

  it('should not register with existing email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Teste', email: 'teste@email.com', password: '123456' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Teste', email: 'teste@email.com', password: '123456' });
    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login', email: 'login@email.com', password: 'senha123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@email.com', password: 'senha123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Login', email: 'login@email.com', password: 'senha123' });
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@email.com', password: 'errada' });
    expect(res.statusCode).toBe(401);
  });
});
