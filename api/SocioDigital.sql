create database sociodigital;

use sociodigital;

CREATE TABLE churrasqueira (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50),
  disponibilidade BOOLEAN DEFAULT TRUE
);

CREATE TABLE quadra (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50),
  tipo VARCHAR(30),
  disponibilidade BOOLEAN DEFAULT TRUE
);

CREATE TABLE salao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(50),
  capacidade INT,
  disponibilidade BOOLEAN DEFAULT TRUE
);

CREATE TABLE reserva (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario VARCHAR(100),
  tipo_local VARCHAR(20),
  id_local INT,
  data_reserva DATE,
  horario_inicio TIME,
  horario_fim TIME
);

select * from salao;
select * from quadra;
select * from churrasqueira;
select * from reserva;
