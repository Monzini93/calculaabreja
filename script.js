// SEU CÓDIGO DE CÁLCULO QUE VOCÊ JÁ TINHA
function calcular() {
    const forms = document.querySelectorAll('.cerveja-form');
    const tipoCalculo = parseFloat(document.getElementById("calculo").value);
    const resultados = [];

    // Atualiza o cabeçalho da tabela
    const thPreco = document.getElementById('th-preco-calculado');
    thPreco.textContent = `Preço por ${tipoCalculo === 1000 ? 'Litro' : tipoCalculo + 'ml'} (R$)`;

    forms.forEach((form, index) => {
        const preco = parseFloat(form.querySelector(".preco-input").value);
        const volume = parseFloat(form.querySelector(".volume-input").value);
        const nome = form.querySelector(".nome-input").value || `Cerveja ${index + 1}`;

        if (isNaN(preco) || preco <= 0 || isNaN(volume) || volume <= 0) {
            resultados.push({ nome: nome, precoCalculado: "Inválido" });
            return;
        }

        const precoCalculado = (preco / volume) * tipoCalculo;
        resultados.push({ nome, precoCalculado });
    });

    const precosValidos = resultados
        .filter(r => typeof r.precoCalculado === "number")
        .map(r => r.precoCalculado);

    const menorPreco = precosValidos.length > 0 ? Math.min(...precosValidos) : Infinity;
    
    const tabelaBody = document.getElementById("tabela-resultados");
    tabelaBody.innerHTML = "";

    resultados.forEach(resultado => {
        const row = document.createElement("tr");
        const isHighlight = typeof resultado.precoCalculado === "number" && resultado.precoCalculado.toFixed(4) === menorPreco.toFixed(4);

        if (isHighlight && menorPreco !== Infinity) {
            row.classList.add("highlight");
        }
        
        // Adiciona o atributo data-label dinamicamente para a visualização mobile
        const labelPreco = `Preço por ${tipoCalculo === 1000 ? 'Litro' : tipoCalculo + 'ml'}`;

        row.innerHTML = `
            <td data-label="Cerveja">${resultado.nome}</td>
            <td data-label="${labelPreco}">${typeof resultado.precoCalculado === 'number' ? `R$ ${resultado.precoCalculado.toFixed(2)}` : resultado.precoCalculado}</td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Chama a função calcular ao carregar a página para inicializar a tabela com os valores padrão
window.onload = calcular;


// =========================================================
// CÓDIGO DE REGISTRO DO SERVICE WORKER (ADICIONAR ESTE BLOCO)
// =========================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      // Registro foi bem-sucedido
      console.log('Service Worker registrado com sucesso no escopo: ', registration.scope);
    }).catch(function(err) {
      // Registro falhou
      console.log('Registro do Service Worker falhou: ', err);
    });
  });
}
