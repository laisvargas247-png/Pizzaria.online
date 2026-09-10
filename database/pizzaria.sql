-- ==========================================
-- BANCO DE DADOS DA PIZZARIA
-- ==========================================

-- TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    endereco VARCHAR(200) NOT NULL
);


-- TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS produtos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10,2) NOT NULL,
    imagem VARCHAR(255),
    disponivel BOOLEAN DEFAULT TRUE
);


-- TABELA DE PEDIDOS
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    data_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Pendente',

    CONSTRAINT fk_cliente
        FOREIGN KEY (cliente_id)
        REFERENCES clientes(id)
);


-- TABELA DOS ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS itens_pedido (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    produto_id INTEGER NOT NULL,
    quantidade INTEGER NOT NULL,
    preco DECIMAL(10,2) NOT NULL,

    CONSTRAINT fk_pedido
        FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id),

    CONSTRAINT fk_produto
        FOREIGN KEY (produto_id)
        REFERENCES produtos(id)
);


-- ==========================================
-- PRODUTOS DO CARDÁPIO
-- ==========================================

INSERT INTO produtos
(nome, descricao, preco)
VALUES
('Pizza Calabresa', 'Molho, queijo, calabresa e cebola', 39.90),

('Pizza Frango com Catupiry', 'Molho, queijo, frango e catupiry', 42.90),

('Pizza 4 Queijos', 'Mussarela, provolone, parmesão e catupiry', 44.90),

('Pizza Portuguesa', 'Queijo, presunto, ovo, cebola, milho e ervilha', 43.90);