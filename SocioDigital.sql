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

CREATE TABLE usuario (
	id INT auto_increment primary KEY,
    nome varchar (100),
    email varchar(100),
    senha varchar(50)
);

CREATE TABLE clube (
	id int auto_increment primary key,
    nome varchar(100),
    email varchar(100),
	senha varchar(50)
);

select * from salao;
select * from quadra;
select * from churrasqueira;
select * from reserva;
select * from clube;
select * from usuario;

ALTER TABLE clube ADD COLUMN cep varchar(100);

ALTER TABLE churrasqueira
ADD COLUMN clube_id INT,
ADD FOREIGN KEY (clube_id) REFERENCES clube(id);

ALTER TABLE quadra
ADD COLUMN clube_id INT,
ADD FOREIGN KEY (clube_id) REFERENCES clube(id);

ALTER TABLE salao
ADD COLUMN clube_id INT,
ADD FOREIGN KEY (clube_id) REFERENCES clube(id);

ALTER TABLE reserva MODIFY tipo_local VARCHAR(100);