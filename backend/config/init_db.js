require('dotenv').config({ path: path.join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const pool = require('./database_mysql'); // Corrigido para usar o pool do MySQL

async function initDb() {
  const sqlPath = path.join(__dirname, 'init_db.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  try {
    await pool.query(sql);
    console.log('Banco de dados inicializado com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao inicializar banco:', err);
    process.exit(1);
  }
}

initDb();
