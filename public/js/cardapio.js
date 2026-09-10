const produtosDiv = document.getElementById("produtos");

async function carregarProdutos() {

    try {

        const resposta = await fetch("/api/produtos");

        const produtos = await resposta.json();

        produtosDiv.innerHTML = "";

        produtos.forEach(produto => {

            const div = document.createElement("div");

            div.classList.add("produto");

            div.innerHTML = `
                <h3>${produto.nome}</h3>

                <p>${produto.descricao}</p>

                <strong>
                    R$ ${Number(produto.preco).toFixed(2)}
                </strong>

                <br>

                <button onclick='adicionarCarrinho(${JSON.stringify(produto)})'>
                    Adicionar ao carrinho
                </button>
            `;

            produtosDiv.appendChild(div);

        });

    } catch (erro) {

        console.error(erro);

        produtosDiv.innerHTML =
            "<p>Erro ao carregar o cardápio.</p>";
    }
}


function adicionarCarrinho(produto) {

    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];

    const itemExistente =
        carrinho.find(item => item.id === produto.id);

    if (itemExistente) {

        itemExistente.quantidade++;

    } else {

        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: Number(produto.preco),
            quantidade: 1
        });
    }

    localStorage.setItem(
        "carrinho",
        JSON.stringify(carrinho)
    );

    alert("Pizza adicionada ao carrinho! 🍕");
}


carregarProdutos();