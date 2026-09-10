const carrinhoDiv =
    document.getElementById("carrinho");

const totalDiv =
    document.getElementById("total");

let carrinho =
    JSON.parse(localStorage.getItem("carrinho")) || [];


function mostrarCarrinho() {

    carrinhoDiv.innerHTML = "";

    let total = 0;

    carrinho.forEach(item => {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;

        carrinhoDiv.innerHTML += `
            <div>
                <h3>${item.nome}</h3>

                <p>
                    Quantidade: ${item.quantidade}
                </p>

                <p>
                    R$ ${subtotal.toFixed(2)}
                </p>
            </div>

            <hr>
        `;
    });

    totalDiv.innerText =
        `Total: R$ ${total.toFixed(2)}`;
}


async function finalizarPedido() {

    if (carrinho.length === 0) {

        alert("Seu carrinho está vazio!");

        return;
    }


    const nome =
        document.getElementById("nome").value;

    const telefone =
        document.getElementById("telefone").value;

    const endereco =
        document.getElementById("endereco").value;


    if (!nome || !telefone || !endereco) {

        alert("Preencha todos os seus dados!");

        return;
    }


    const total =
        carrinho.reduce(
            (soma, item) =>
                soma + item.preco * item.quantidade,
            0
        );


    const resposta = await fetch("/api/pedidos", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            cliente: {
                nome,
                telefone,
                endereco
            },

            itens: carrinho,

            total

        })

    });


    const resultado = await resposta.json();


    if (resultado.sucesso) {

        alert(
            `Pedido #${resultado.pedido} enviado para a cozinha! 🍕`
        );

        localStorage.removeItem("carrinho");

        window.location.href = "index.html";

    } else {

        alert("Erro ao fazer pedido.");

    }
}


mostrarCarrinho();