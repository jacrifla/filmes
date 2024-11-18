// Função para carregar o header
function loadHeader() {
    fetch('./components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => console.error('Erro ao carregar o header:', error));
}

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', loadHeader);
