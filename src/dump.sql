create database dindin

create table usuarios (
    id serial primary key,
    nome text not null,
    email text unique not null,
    senha text not null
);

create table categorias(
    id serial primary key,
    descricao text not null
);

create table transacoes(
    id serial primary key,
    tipo text not null,
    descricao text not null,
    valor integer not null,
    data date not null,
    usuario_id integer references usuarios(id),
    categoria_id integer references categorias(id)
);

insert into categorias (descricao) 
values
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');

