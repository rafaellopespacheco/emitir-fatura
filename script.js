// Função para formatar valores em R$ 0,00
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

// Formatação ao digitar nos campos de preço
document.addEventListener('input', (event) => {
    if (event.target.classList.contains('productPrice') || event.target.id === 'discount') {
        let value = event.target.value.replace(/[^\d]/g, '').replace(/^0+/, '');
        value = parseFloat(value) / 100 || 0;
        event.target.value = formatCurrency(value);
    }
});

// Adicionar produto
document.getElementById('addProduct').addEventListener('click', () => {
    const productRow = document.createElement('div');
    productRow.classList.add('productRow');
    productRow.innerHTML = `
        <label>Produto:</label>
        <input type="text" class="productName" placeholder="Descrição do produto" required>

        <label>Quantidade:</label>
        <input type="number" class="productQuantity" min="1" required>

        <label>Valor:</label>
        <input type="text" class="productPrice" placeholder="R$ 0,00" required>
    `;
    document.getElementById('products').appendChild(productRow);
});

// Gerar Fatura
document.getElementById('generateInvoice').addEventListener('click', () => {
    const companyName = document.getElementById('companyName').value;
    const companyAddress = document.getElementById('companyAddress').value;
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const discount = parseFloat(document.getElementById('discount').value.replace(/[^\d]/g, '')) / 100 || 0;

    const products = [];
    let total = 0;

    document.querySelectorAll('.productRow').forEach(row => {
        const name = row.querySelector('.productName').value;
        const quantity = parseInt(row.querySelector('.productQuantity').value, 10);
        const price = parseFloat(
            row.querySelector('.productPrice').value.replace(/[^\d]/g, '')
        ) / 100 || 0;

        if (name && !isNaN(quantity) && !isNaN(price)) {
            const subtotal = quantity * price;
            total += subtotal;

            products.push({ name, quantity, price, subtotal });
        }
    });

    if (discount) total -= discount;

    // Preenche a prévia da fatura
    document.getElementById('previewCompanyName').textContent = companyName;
    document.getElementById('previewCompanyAddress').textContent = companyAddress;
    document.getElementById('previewClientName').textContent = clientName;
    document.getElementById('previewClientPhone').textContent = clientPhone;

    const productsTable = document.getElementById('invoiceProducts');
    productsTable.innerHTML = '';
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.quantity}</td>
            <td>${formatCurrency(product.price)}</td>
            <td>${formatCurrency(product.subtotal)}</td>
        `;
        productsTable.appendChild(row);
    });

    // Desconto
    const discountPreview = document.getElementById('previewDiscount');
    if (discount > 0) {
        discountPreview.textContent = formatCurrency(discount);
    } else {
        discountPreview.textContent = 'N/A';
    }

    // Total
    document.getElementById('previewTotal').textContent = formatCurrency(total);

    // Mostra a prévia
    document.getElementById('invoicePreview').style.display = 'block';
});
// Importação da biblioteca jsPDF
const { jsPDF } = window.jspdf;

// Geração da fatura em PDF
document.getElementById('generateInvoice').addEventListener('click', () => {
    const companyName = document.getElementById('companyName').value;
    const companyAddress = document.getElementById('companyAddress').value;
    const clientName = document.getElementById('clientName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const discount = parseFloat(document.getElementById('discount').value.replace(/[^\d]/g, '')) / 100 || 0;

    const products = [];
    let total = 0;

    document.querySelectorAll('.productRow').forEach(row => {
        const name = row.querySelector('.productName').value;
        const quantity = parseInt(row.querySelector('.productQuantity').value, 10);
        const price = parseFloat(
            row.querySelector('.productPrice').value.replace(/[^\d]/g, '')
        ) / 100 || 0;

        if (name && !isNaN(quantity) && !isNaN(price)) {
            const subtotal = quantity * price;
            total += subtotal;

            products.push({ name, quantity, price, subtotal });
        }
    });

    if (discount) total -= discount;

    // Criar o PDF
    const doc = new jsPDF();

    // Título e cabeçalho
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Fatura', 105, 15, null, null, 'center');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Empresa: ${companyName}`, 10, 30);
    doc.text(`Endereço: ${companyAddress}`, 10, 40);
    doc.text(`Cliente: ${clientName}`, 10, 50);
    doc.text(`Telefone: ${clientPhone}`, 10, 60);

    // Produtos
    doc.text('Produtos:', 10, 70);
    let y = 80;
    products.forEach(product => {
        doc.text(`${product.name} (Qtd: ${product.quantity}, Valor: ${formatCurrency(product.price)}, Subtotal: ${formatCurrency(product.subtotal)})`, 10, y);
        y += 10;
    });

    // Desconto e Total
    y += 10;
    doc.text(`Desconto: ${discount > 0 ? formatCurrency(discount) : 'N/A'}`, 10, y);
    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatCurrency(total)}`, 10, y);

    // Baixar o PDF
    doc.save('fatura.pdf');
});
