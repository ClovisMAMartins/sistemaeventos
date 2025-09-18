const pool = require('../config/database_mysql');

exports.inscritos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inscritos');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar inscritos.' });
  }
};

exports.frequencia = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM frequencias');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar frequências.' });
  }
};

// Relatório de certificados e declarações será implementado após integração dos registros

// Relatório de certificados emitidos
exports.certificados = async (req, res) => {
  try {
    // Filtros opcionais: periodo (data inicial/final), tipo, inscrito_id
    const { dataInicio, dataFim, tipo, inscrito_id } = req.query;
    let query = 'SELECT * FROM certificados WHERE 1=1';
    const params = [];
    if (dataInicio) {
      query += ' AND emitido_em >= ?';
      params.push(dataInicio);
    }
    if (dataFim) {
      query += ' AND emitido_em <= ?';
      params.push(dataFim);
    }
    if (tipo) {
      query += ' AND tipo = ?';
      params.push(tipo);
    }
    if (inscrito_id) {
      query += ' AND inscrito_id = ?';
      params.push(inscrito_id);
    }
    query += ' ORDER BY emitido_em DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar certificados.' });
  }
};

// Relatório de declarações emitidas
exports.declaracoes = async (req, res) => {
  try {
    // Filtros opcionais: periodo (data inicial/final), inscrito_id
    const { dataInicio, dataFim, inscrito_id } = req.query;
    let query = 'SELECT * FROM declaracoes WHERE 1=1';
    const params = [];
    if (dataInicio) {
      query += ' AND emitido_em >= ?';
      params.push(dataInicio);
    }
    if (dataFim) {
      query += ' AND emitido_em <= ?';
      params.push(dataFim);
    }
    if (inscrito_id) {
      query += ' AND inscrito_id = ?';
      params.push(inscrito_id);
    }
    query += ' ORDER BY emitido_em DESC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar declarações.' });
  }
};
