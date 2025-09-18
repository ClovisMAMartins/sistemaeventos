const request = require('supertest');
const app = require('../../src/app');
const fs = require('fs');
const path = require('path');
const pool = require('../../config/database_mysql');

describe('Certificados API', () => {
  let inscritoId;
  const testData = {
    nome: 'Certificado Teste',
    email: 'certificado@ifpa.edu.br',
    documento: '111.222.333-44',
    curso: 'Curso de Teste de API',
    data: '2025-09-17',
    dataInicio: '2025-09-01',
    dataFim: '2025-09-17',
    horas: 8,
    coordenador: 'Coordenador Teste',
    cargo: 'Gerente de Testes'
  };
  let arquivo;

  beforeAll(async () => {
    // Criar um inscrito para associar ao certificado
    const [result] = await pool.query(
      'INSERT INTO inscritos (nome, email, cpf) VALUES (?, ?, ?)',
      ['Participante Certificado', 'certificado@ifpa.edu.br', '111.222.333-44']
    );
    inscritoId = result.insertId;
  });

  afterAll(async () => {
    // Limpar o arquivo gerado
    if (arquivo) {
      const filePath = path.join(__dirname, '../../certificados', arquivo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    // Limpar dados do banco
    await pool.query('DELETE FROM certificados WHERE inscrito_id = ?', [inscritoId]);
    await pool.query('DELETE FROM inscritos WHERE id = ?', [inscritoId]);
    await pool.end();
  });

  it('deve gerar um certificado em PDF', async () => {
    const res = await request(app)
      .post('/api/certificados/gerar')
      .send({ ...testData, inscrito_id: inscritoId });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('arquivo');
    expect(res.body).toHaveProperty('hash');
    arquivo = res.body.arquivo;
    const filePath = path.join(__dirname, '../../certificados', arquivo);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  // O teste de envio depende de configuração real de e-mail
  it('deve retornar erro ao tentar enviar certificado sem arquivo', async () => {
    const res = await request(app)
      .post('/api/certificados/enviar')
      .send({ email: testData.email, arquivo: 'arquivo_inexistente.pdf' });
    expect(res.statusCode).toBe(404);
  });
});
