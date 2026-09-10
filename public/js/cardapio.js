const produtosDiv = document.getElementById("produtos");
const contador = document.getElementById("contador");


// ===============================
// CARREGAR PRODUTOS
// ===============================

async function carregarProdutos() {

    try {

        const resposta = await fetch("/api/produtos");

        const produtos = await resposta.json();

        produtosDiv.innerHTML = "";


        produtos.forEach(produto => {

            const card = document.createElement("div");

            card.classList.add("produto");


            card.innerHTML = `

            

                <div class="produto-info">

                    <h3>
                        ${produto.nome}
                    </h3>

                    <p class="produto-descricao">
                        ${produto.descricao || "Deliciosa pizza da nossa pizzaria."}
                    </p>

                    <p class="produto-preco">
                        R$ ${Number(produto.preco).toFixed(2).replace(".", ",")}
                    </p>

                    <button
                        class="btn-adicionar"
                        onclick='adicionarCarrinho(${JSON.stringify(produto)})'
                    >
                        🛒 Adicionar ao carrinho
                    </button>

                </div>
            `;


            produtosDiv.appendChild(card);

        });


        atualizarContador();

    } catch (erro) {

        console.error(erro);

        produtosDiv.innerHTML = `
            <p>
                ❌ Não foi possível carregar o cardápio.
            </p>
        `;
    }
}


// ===============================
// ADICIONAR AO CARRINHO
// ===============================

function adicionarCarrinho(produto) {

    let carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    const existente =
        carrinho.find(item => item.id === produto.id);


    if (existente) {

        existente.quantidade++;

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


    atualizarContador();


    alert("🍕 Pizza adicionada ao carrinho!");
}


// ===============================
// CONTADOR
// ===============================

function atualizarContador() {

    const carrinho =
        JSON.parse(localStorage.getItem("carrinho")) || [];


    const quantidade =
        carrinho.reduce(
            (total, item) =>
                total + item.quantidade,
            0
        );


    contador.textContent = quantidade;
}


carregarProdutos();