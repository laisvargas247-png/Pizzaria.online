const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = 3000;

// CONEXÃO COM O POSTGRESQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "pizzaria",
    password: "lais",
    port: 5432
});

app.use(express.json());

// Abrir o site
app.use(express.static(path.join(__dirname, "public")));


// ==========================
// LISTAR PRODUTOS
// ==========================

app.get("/api/produtos", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM produtos WHERE disponivel = TRUE ORDER BY id"
        );

        res.json(resultado.rows);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao buscar produtos"
        });
    }
});


// ==========================
// CRIAR PEDIDO
// ==========================

app.post("/api/pedidos", async (req, res) => {

    const { cliente, itens, total } = req.body;

    try {

        // Cadastra cliente
        const clienteResult = await pool.query(
            `INSERT INTO clientes (nome, telefone, endereco)
             VALUES ($1, $2, $3)
             RETURNING id`,
            [
                cliente.nome,
                cliente.telefone,
                cliente.endereco
            ]
        );

        const clienteId = clienteResult.rows[0].id;


        // Cria pedido
        const pedidoResult = await pool.query(
            `INSERT INTO pedidos (cliente_id, total)
             VALUES ($1, $2)
             RETURNING id`,
            [clienteId, total]
        );

        const pedidoId = pedidoResult.rows[0].id;


        // Adiciona os itens
        for (const item of itens) {

            await pool.query(
                `INSERT INTO itens_pedido
                (pedido_id, produto_id, quantidade, preco)
                VALUES ($1, $2, $3, $4)`,
                [
                    pedidoId,
                    item.id,
                    item.quantidade,
                    item.preco
                ]
            );
        }


        res.json({
            sucesso: true,
            pedido: pedidoId
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false,
            erro: "Erro ao criar pedido"
        });
    }
});


// ==========================
// PEDIDOS DA COZINHA
// ==========================

app.get("/api/cozinha", async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT
                p.id AS pedido_id,
                p.data_pedido,
                p.total,
                p.status,
                c.nome AS cliente,
                c.telefone,
                c.endereco,
                pr.nome AS produto,
                ip.quantidade,
                ip.preco
            FROM pedidos p
            JOIN clientes c
                ON p.cliente_id = c.id
            JOIN itens_pedido ip
                ON p.id = ip.pedido_id
            JOIN produtos pr
                ON ip.produto_id = pr.id
            ORDER BY p.id DESC
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao buscar pedidos"
        });
    }
});


// ==========================
// ALTERAR STATUS
// ==========================

app.put("/api/pedidos/:id/status", async (req, res) => {

    const { status } = req.body;
    const { id } = req.params;

    try {

        await pool.query(
            "UPDATE pedidos SET status = $1 WHERE id = $2",
            [status, id]
        );

        res.json({
            sucesso: true
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            erro: "Erro ao atualizar pedido"
        });
    }
});


// ==========================
// INICIAR SERVIDOR
// ==========================

app.listen(PORT, () => {

    console.log(`🍕 Pizzaria funcionando em http://localhost:${PORT}`);

});