let carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];


// ===============================
// MOSTRAR CARRINHO
// ===============================

function mostrarCarrinho() {

    const div =
        document.getElementById("carrinho");


    if (carrinho.length === 0) {

        div.innerHTML = `

            <div class="vazio">

                <h2>
                    🛒 Seu carrinho está vazio
                </h2>

                <p>
                    Escolha uma pizza deliciosa para começar!
                </p>

                <a href="cardapio.html">
                    Ver cardápio
                </a>

            </div>

        `;

        atualizarTotal();

        return;
    }


    div.innerHTML = "";


    carrinho.forEach((item, index) => {

        const subtotal =
            item.preco * item.quantidade;


        div.innerHTML += `

            <div class="item">

                <div class="item-info">

                    <h3>
                        🍕 ${item.nome}
                    </h3>

                    <p>
                        R$ ${item.preco.toFixed(2).replace(".", ",")}
                        cada
                    </p>

                </div>


                <div class="quantidade">

                    <button
                        onclick="diminuir(${index})"
                    >
                        −
                    </button>


                    <span>
                        ${item.quantidade}
                    </span>


                    <button
                        onclick="aumentar(${index})"
                    >
                        +
                    </button>

                </div>


                <div class="item-preco">

                    R$
                    ${subtotal.toFixed(2).replace(".", ",")}

                </div>


                <button
                    class="remover"
                    onclick="remover(${index})"
                >
                    🗑 Remover
                </button>

            </div>

        `;

    });


    atualizarTotal();
}


// ===============================
// AUMENTAR
// ===============================

function aumentar(index) {

    carrinho[index].quantidade++;

    salvar();

}


// ===============================
// DIMINUIR
// ===============================

function diminuir(index) {

    if (carrinho[index].quantidade > 1) {

        carrinho[index].quantidade--;

    } else {

        carrinho.splice(index, 1);

    }

    salvar();
}


// ===============================
// REMOVER
// ===============================

function remover(index) {

    carrinho.splice(index, 1);

    salvar();
}


// ===============================
// SALVAR
// ===============================

function salvar() {

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    mostrarCarrinho();
}


// ===============================
// TOTAL
// ===============================

function atualizarTotal() {

    const subtotal =
        carrinho.reduce(
            (total, item) =>
                total +
                item.preco *
                item.quantidade,
            0
        );


    const entrega =
        carrinho.length > 0 ? 5 : 0;


    const total =
        subtotal + entrega;


    document.getElementById("subtotal")
        .textContent =
        `R$ ${subtotal.toFixed(2).replace(".", ",")}`;


    document.getElementById("entrega")
        .textContent =
        `R$ ${entrega.toFixed(2).replace(".", ",")}`;


    document.getElementById("total")
        .textContent =
        `R$ ${total.toFixed(2).replace(".", ",")}`;
}


// ===============================
// FINALIZAR PEDIDO
// ===============================

async function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }


    const nome =
        document.getElementById("nome").value.trim();

    const telefone =
        document.getElementById("telefone").value.trim();

    const endereco =
        document.getElementById("endereco").value.trim();


    if (!nome || !telefone || !endereco) {

        alert(
            "Preencha nome, telefone e endereço!"
        );

        return;
    }


    const subtotal =
        carrinho.reduce(
            (total, item) =>
                total +
                item.preco *
                item.quantidade,
            0
        );


    const entrega = 5;

    const total = subtotal + entrega;


    try {

        const resposta =
            await fetch("/api/pedidos", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    cliente: {
                        nome: nome,
                        telefone: telefone,
                        endereco: endereco
                    },

                    itens: carrinho,

                    total: total

                })

            });


        const resultado =
            await resposta.json();


        if (resultado.sucesso) {

            alert(
                `🍕 Pedido #${resultado.pedido} enviado para a cozinha!`
            );


            localStorage.removeItem("carrinho");


            window.location.href =
                "index.html";

        } else {

            alert(
                "❌ Não foi possível enviar o pedido."
            );

        }

    } catch (erro) {

        console.error(erro);

        alert(
            "❌ Erro de conexão com o servidor."
        );

    }
}


mostrarCarrinho();