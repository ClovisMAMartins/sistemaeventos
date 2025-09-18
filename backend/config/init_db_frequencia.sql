-- Script para criar tabela de frequencia no MariaDB/MySQL
CREATE TABLE IF NOT EXISTS frequencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  inscrito_id INT NOT NULL,
  data DATE NOT NULL,
  presente BOOLEAN NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (inscrito_id) REFERENCES inscritos(id) ON DELETE CASCADE
);
