function calcular() {
    const forms = document.querySelectorAll('.cerveja-form');
    const tipoCalculo = parseFloat(document.getElementById("calculo").value);
    const resultados = [];

    const thPreco = document.getElementById('th-preco-calculado');
    thPreco.textContent = `Preço por ${tipoCalculo === 1000 ? 'Litro' : tipoCalculo + 'ml'} (R$)`;

    forms.forEach((form, index) => {
        const volumeSelect = form.querySelector(".volume-input");
        let volume;

        // Verifica se a opção "Outro" foi selecionada
        if (volumeSelect.value === 'outro') {
            const customVolumeInput = form.querySelector(".volume-custom-input");
            volume = parseFloat(customVolumeInput.value);
        } else {
            volume = parseFloat(volumeSelect.value);
        }
        
        const preco = parseFloat(form.querySelector(".preco-input").value);
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
        
        const labelPreco = `Preço por ${tipoCalculo === 1000 ? 'Litro' : tipoCalculo + 'ml'}`;

        row.innerHTML = `
            <td data-label="Cerveja">${resultado.nome}</td>
            <td data-label="${labelPreco}">${typeof resultado.precoCalculado === 'number' ? `R$ ${resultado.precoCalculado.toFixed(2)}` : resultado.precoCalculado}</td>
        `;
        tabelaBody.appendChild(row);
    });
}

// Adiciona os listeners depois que o DOM carregar
document.addEventListener('DOMContentLoaded', () => {
    // Listener para os seletores de volume
    document.querySelectorAll('.volume-input').forEach(selectElement => {
        selectElement.addEventListener('change', (event) => {
            // Encontra o input customizado correspondente dentro do mesmo form
            const form = event.target.closest('.cerveja-form');
            const customInput = form.querySelector('.volume-custom-input');
            
            if (event.target.value === 'outro') {
                customInput.style.display = 'block';
                customInput.focus();
            } else {
                customInput.style.display = 'none';
            }
        });
    });

    // Chama a função calcular ao carregar a página para inicializar a tabela
    calcular();
});


// REGISTRO DO SERVICE WORKER
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js').then(function(registration) {
      console.log('Service Worker registrado com sucesso no escopo: ', registration.scope);
    }).catch(function(err) {
      console.log('Registro do Service Worker falhou: ', err);
    });
  });
}
