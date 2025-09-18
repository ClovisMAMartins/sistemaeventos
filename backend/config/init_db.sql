CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de declarações
CREATE TABLE IF NOT EXISTS declaracoes (
  id SERIAL PRIMARY KEY,
  evento VARCHAR(255) NOT NULL,
  inscrito_id INTEGER REFERENCES inscritos(id),
  emitido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hash VARCHAR(64) NOT NULL
);
-- Tabela de inscritos
CREATE TABLE IF NOT EXISTS inscritos (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) NOT NULL,
  telefone VARCHAR(20),
  nascimento DATE,
  escolaridade VARCHAR(50),
  turno VARCHAR(20),
  interesses TEXT,
  experiencia TEXT,
  expectativas TEXT,
  como_soube VARCHAR(50),
  disponibilidade BOOLEAN,
  voluntario BOOLEAN,
  atividades BOOLEAN,
  consentimento BOOLEAN,
  veracidade BOOLEAN,
  deficiencia BOOLEAN,
  necessidades TEXT,
  data_inscricao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de frequências
CREATE TABLE IF NOT EXISTS frequencias (
  id SERIAL PRIMARY KEY,
  inscrito_id INTEGER REFERENCES inscritos(id),
  data DATE NOT NULL,
  presente BOOLEAN NOT NULL
);

-- Tabela de certificados
CREATE TABLE IF NOT EXISTS certificados (
  id SERIAL PRIMARY KEY,
  inscrito_id INTEGER REFERENCES inscritos(id),
  hash VARCHAR(64) NOT NULL,
  coordenador VARCHAR(100),
  cargo_coordenador VARCHAR(100),
  assinatura TEXT,
  tipo VARCHAR(50),
  workload INTEGER,
  periodo VARCHAR(50),
  emitido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
