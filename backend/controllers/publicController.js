const pool = require('../config/database_mysql');

// Consulta pública por hash (certificado ou declaração)
exports.consultaPorHash = async (req, res) => {
  const { hash } = req.query;
  if (!hash) {
    return res.status(400).json({ message: 'Hash é obrigatório.' });
  }
  try {
    // Busca em certificados
    const [certRows] = await pool.query('SELECT id, inscrito_id, tipo, emitido_em, hash FROM certificados WHERE hash = ?', [hash]);
    if (certRows.length > 0) {
      return res.json({ tipo: 'certificado', dados: certRows[0] });
    }
    // Busca em declarações
    const [decRows] = await pool.query('SELECT id, evento, inscrito_id, emitido_em, hash FROM declaracoes WHERE hash = ?', [hash]);
    if (decRows.length > 0) {
      return res.json({ tipo: 'declaracao', dados: decRows[0] });
    }
    return res.status(404).json({ message: 'Documento não encontrado para o hash informado.' });
  } catch (err) {
    return res.status(500).json({ message: 'Erro ao consultar documento.' });
  }
};
