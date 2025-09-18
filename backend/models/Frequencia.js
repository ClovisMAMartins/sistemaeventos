const pool = require('../config/database_mysql');

class Frequencia {
  static async registrar({ inscrito_id, data, presente }) {
    const [result] = await pool.query(
      'INSERT INTO frequencias (inscrito_id, data, presente) VALUES (?, ?, ?)',
      [inscrito_id, data, presente]
    );
    const [rows] = await pool.query('SELECT * FROM frequencias WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async listarPorInscrito(inscrito_id) {
    const [rows] = await pool.query('SELECT * FROM frequencias WHERE inscrito_id = ?', [inscrito_id]);
    return rows;
  }

  static async listarTodos() {
    const [rows] = await pool.query('SELECT * FROM frequencias');
    return rows;
  }
}

module.exports = Frequencia;
