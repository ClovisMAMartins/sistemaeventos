-- Script para criar tabelas no MariaDB/MySQL para o sistema de eventos
CREATE DATABASE IF NOT EXISTS sistemaeventos;
USE sistemaeventos;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Adicione outras tabelas conforme necessário, por exemplo, inscritos, frequência, certificados, etc.
