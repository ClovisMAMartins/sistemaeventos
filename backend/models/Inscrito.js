const pool = require('../config/database_mysql');

class Inscrito {
  static async findAll() {
    const [rows] = await pool.query('SELECT * FROM inscritos');
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.query('SELECT * FROM inscritos WHERE id = ?', [id]);
    return rows[0];
  }

  static async create({ nome, email, telefone }) {
    const [result] = await pool.query(
      'INSERT INTO inscritos (nome, email, telefone) VALUES (?, ?, ?)',
      [nome, email, telefone]
    );
    const [rows] = await pool.query('SELECT * FROM inscritos WHERE id = ?', [result.insertId]);
    return rows[0];
  }

  static async update(id, { nome, email, telefone }) {
    await pool.query(
      'UPDATE inscritos SET nome = ?, email = ?, telefone = ? WHERE id = ?',
      [nome, email, telefone, id]
    );
    return this.findById(id);
  }

  static async delete(id) {
    await pool.query('DELETE FROM inscritos WHERE id = ?', [id]);
    return true;
  }
}

module.exports = Inscrito;
