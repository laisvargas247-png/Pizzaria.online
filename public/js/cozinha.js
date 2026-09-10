async function carregarPedidos() {

    const resposta =
        await fetch("/api/cozinha");

    const pedidos =
        await resposta.json();

    const div =
        document.getElementById("pedidos");

    div.innerHTML = "";


    const pedidosAgrupados = {};


    pedidos.forEach(item => {

        if (!pedidosAgrupados[item.pedido_id]) {

            pedidosAgrupados[item.pedido_id] = {

                id: item.pedido_id,

                cliente: item.cliente,

                telefone: item.telefone,

                endereco: item.endereco,

                total: item.total,

                status: item.status,

                produtos: []

            };

        }


        pedidosAgrupados[item.pedido_id]
            .produtos.push(item);

    });


    Object.values(pedidosAgrupados)
        .forEach(pedido => {

            let produtosHTML = "";

            pedido.produtos.forEach(produto => {

                produtosHTML += `
                    <p>
                        ${produto.quantidade}x
                        ${produto.produto}
                    </p>
                `;

            });


            div.innerHTML += `

                <div class="pedido">

                    <h2>
                        Pedido #${pedido.id}
                    </h2>

                    <h3>
                        Cliente: ${pedido.cliente}
                    </h3>

                    <p>
                        Telefone: ${pedido.telefone}
                    </p>

                    <p>
                        Endereço: ${pedido.endereco}
                    </p>

                    <hr>

                    ${produtosHTML}

                    <strong>
                        Total: R$ ${Number(pedido.total).toFixed(2)}
                    </strong>

                    <p>
                        Status:
                        <strong>${pedido.status}</strong>
                    </p>

                    <button
                        onclick="alterarStatus(${pedido.id}, 'Aceito')">
                        Aceitar
                    </button>

                    <button
                        onclick="alterarStatus(${pedido.id}, 'Em preparo')">
                        Em preparo
                    </button>

                    <button
                        onclick="alterarStatus(${pedido.id}, 'Pronto')">
                        Pronto
                    </button>

                </div>

            `;

        });

}


async function alterarStatus(id, status) {

    await fetch(`/api/pedidos/${id}/status`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            status
        })

    });

    carregarPedidos();
}


carregarPedidos();


// Atualiza a tela a cada 5 segundos
setInterval(carregarPedidos, 5000);