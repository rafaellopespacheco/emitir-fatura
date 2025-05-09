
document.addEventListener("DOMContentLoaded", () => {
    const empresaInput = document.getElementById("empresa");
    const enderecoInput = document.getElementById("endereco");
    const clienteInput = document.getElementById("cliente");
    const telefoneInput = document.getElementById("telefone");
    const produtoInput = document.getElementById("produto");
    const valorInput = document.getElementById("valor");
    const tabela = document.getElementById("tabela-corpo");
    const adicionarBtn = document.getElementById("adicionar");
    const visualizarFaturaBtn = document.getElementById("visualizar-fatura");
    const popup = document.getElementById("popup");
    const fecharPopupBtn = document.getElementById("fechar-popup");
    const faturaContent = document.getElementById("fatura-content");

    // Inicialmente ocultar o popup
    popup.classList.add("hidden");

    adicionarBtn.addEventListener("click", () => {
        const produto = produtoInput.value.trim();
        const valor = parseFloat(valorInput.value.trim());

        if (produto && !isNaN(valor)) {
            const linha = document.createElement("tr");
            linha.innerHTML = `<td>${produto}</td><td>${valor.toFixed(2)}</td>`;
            tabela.appendChild(linha);

            produtoInput.value = "";
            valorInput.value = "";
        } else {
            alert("Por favor, preencha o nome do produto/serviço e o valor corretamente.");
        }
    });

    visualizarFaturaBtn.addEventListener("click", () => {
        if (!empresaInput.value || !enderecoInput.value || !clienteInput.value || !telefoneInput.value || !tabela.querySelector("tr")) {
            alert("Preencha todas as informações e adicione pelo menos um produto/serviço.");
            return;
        }

        const dataEmissao = new Date().toLocaleDateString();
        let tabelaHtml = "<table><thead><tr><th>Nome</th><th>Valor</th></tr></thead><tbody>";
        tabela.querySelectorAll("tr").forEach((linha) => {
            const nome = linha.querySelector("td:nth-child(1)").innerText;
            const valor = linha.querySelector("td:nth-child(2)").innerText;
            tabelaHtml += `<tr><td>${nome}</td><td>${valor}</td></tr>`;
        });
        tabelaHtml += "</tbody></table>";

        faturaContent.innerHTML = `
            <h2>Fatura</h2>
            <p class="info"><strong>Empresa:</strong> ${empresaInput.value}</p>
            <p class="info"><strong>Endereço:</strong> ${enderecoInput.value}</p>
            <p class="info"><strong>Cliente:</strong> ${clienteInput.value}</p>
            <p class="info"><strong>Telefone:</strong> ${telefoneInput.value}</p>
            ${tabelaHtml}
            <p class="date">Emitido em: ${dataEmissao}</p>
        `;

        popup.classList.remove("hidden");
    });

    fecharPopupBtn.addEventListener("click", () => {
        popup.classList.add("hidden");
    });
});
