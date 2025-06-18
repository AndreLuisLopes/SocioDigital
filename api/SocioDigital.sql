create database sociodigital;

use sociodigital;

create table reservas (
id int auto_increment not null primary key,
data date not null
);

create table churrasqueira (
id int auto_increment not null primary key,
endereco varchar(100) not null
);

create table quadra (
id int auto_increment not null primary key,
endereco varchar(100) not null,
tipo varchar(100)
);

create table salao (
id int auto_increment not null primary key,
endereco varchar(100)
);