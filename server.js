const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();

const PORT = 3000;


// ==========================================
// CONEXÃO COM O POSTGRESQL
// ==========================================

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "pizzaria",
    password: "lais",
    port: 5432
});


// ==========================================
// CONFIGURAÇÕES
// ==========================================

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));


// ==========================================
// TESTAR CONEXÃO COM O BANCO
// ==========================================

pool.connect()
    .then(() => {
        console.log("✅ PostgreSQL conectado!");
    })
    .catch((erro) => {
        console.log("❌ Erro ao conectar ao PostgreSQL:");
        console.log(erro.message);
    });


// ==========================================
// BUSCAR PRODUTOS
// ==========================================

app.get("/api/produtos", async (req, res) => {

    try {

        const resultado = await pool.query(`
            SELECT *
            FROM produtos
            WHERE disponivel = TRUE
            ORDER BY id
        `);

        res.json(resultado.rows);

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: "Erro ao buscar produtos"
        });
    }
});


// ==========================================
// CRIAR PEDIDO
// ==========================================

app.post("/api/pedidos", async (req, res) => {

    const { cliente, itens, total } = req.body;

    try {

        // Cadastrar cliente
        const clienteResult = await pool.query(`
            INSERT INTO clientes
            (nome, telefone, endereco)
            VALUES ($1, $2, $3)
            RETURNING id
        `, [
            cliente.nome,
            cliente.telefone,
            cliente.endereco
        ]);

        const clienteId = clienteResult.rows[0].id;


        // Criar pedido
        const pedidoResult = await pool.query(`
            INSERT INTO pedidos
            (cliente_id, total)
            VALUES ($1, $2)
            RETURNING id
        `, [
            clienteId,
            total
        ]);

        const pedidoId = pedidoResult.rows[0].id;


        // Cadastrar produtos do pedido
        for (const item of itens) {

            await pool.query(`
                INSERT INTO itens_pedido
                (pedido_id, produto_id, quantidade, preco)
                VALUES ($1, $2, $3, $4)
            `, [
                pedidoId,
                item.id,
                item.quantidade,
                item.preco
            ]);
        }


        console.log(`🍕 Novo pedido recebido: #${pedidoId}`);


        res.json({
            sucesso: true,
            pedido: pedidoId
        });


    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            sucesso: false,
            erro: "Erro ao criar pedido"
        });
    }
});


// ==========================================
// BUSCAR PEDIDOS PARA A COZINHA
// ==========================================

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

        console.log(erro);

        res.status(500).json({
            erro: "Erro ao buscar pedidos"
        });
    }
});


// ==========================================
// ALTERAR STATUS DO PEDIDO
// ==========================================

app.put("/api/pedidos/:id/status", async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    try {

        await pool.query(`
            UPDATE pedidos
            SET status = $1
            WHERE id = $2
        `, [
            status,
            id
        ]);

        console.log(`Pedido #${id}: ${status}`);


        res.json({
            sucesso: true
        });

    } catch (erro) {

        console.log(erro);

        res.status(500).json({
            erro: "Erro ao atualizar status"
        });
    }
});


// ==========================================
// INICIAR SERVIDOR
// ==========================================

app.listen(PORT, () => {

    console.log("");
    console.log("🍕 =============================");
    console.log("🍕  PIZZARIA ONLINE");
    console.log("🍕 =============================");
    console.log(`🍕  Site: http://localhost:${PORT}`);
    console.log("🍕 =============================");
    console.log("");

});