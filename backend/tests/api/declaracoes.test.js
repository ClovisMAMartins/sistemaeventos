const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
const pool = require('../../config/database_mysql');

describe('Declarações API', () => {
  let inscritoId;
  const testData = {
    nome: 'Declaração Teste',
    documento: '12345678900',
    evento: 'Evento Teste',
    organizacao: 'IFPA',
    dataInicio: '2025-09-10',
    dataFim: '2025-09-17',
    objetivo: 'Promover integração acadêmica',
    local: 'Belém',
    data: '17 de setembro de 2025',
    email: 'declaracao@ifpa.edu.br'
  };
  let arquivo;

  beforeAll(async () => {
    // Criar um inscrito para associar à declaração
    const [result] = await pool.query(
      'INSERT INTO inscritos (nome, email, cpf) VALUES (?, ?, ?)',
      ['Participante Declaração', 'declaracao@ifpa.edu.br', '12345678900']
    );
    inscritoId = result.insertId;
  });

  afterAll(async () => {
    if (arquivo) {
      const filePath = path.join(__dirname, '../../certificados', arquivo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await pool.query('DELETE FROM declaracoes WHERE inscrito_id = ?', [inscritoId]);
    await pool.query('DELETE FROM inscritos WHERE id = ?', [inscritoId]);
    // Não feche o pool aqui se outros testes forem rodar
  });

  it('deve gerar uma declaração em PDF', async () => {
    const res = await request(app)
      .post('/api/declaracoes/gerar')
      .send({ ...testData, inscrito_id: inscritoId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('arquivo');
    expect(res.body).toHaveProperty('hash');
    arquivo = res.body.arquivo;
    const filePath = path.join(__dirname, '../../certificados', arquivo);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('deve retornar erro ao tentar enviar declaração sem arquivo', async () => {
    const res = await request(app)
      .post('/api/declaracoes/enviar')
      .send({ email: testData.email, arquivo: 'arquivo_inexistente.pdf' });
    expect(res.statusCode).toBe(404);
  });
});
