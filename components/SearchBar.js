import { fetchGenres } from '../services/apiservice.js';

export async function createSearchBar(onSearchByGenre, onSearchByText) {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'd-flex align-items-center w-100'; // Mantém o layout flexível

    // Seletor de gênero
    const genreSelect = document.createElement('select');
    genreSelect.className = 'form-control mr-3'; // Adiciona uma margem à direita

    genreSelect.innerHTML = `<option value="">Todos os Gêneros</option>`;

    // Carrega os gêneros e preenche o seletor
    const genres = await fetchGenres();
    genres.forEach(genre => {
        const option = document.createElement('option');
        option.value = genre.id;
        option.textContent = genre.name;
        genreSelect.appendChild(option);
    });

    // Função para buscar filmes por gênero ao selecionar um gênero
    genreSelect.addEventListener('change', () => {
        const genreId = genreSelect.value;
        if (genreId) {
            onSearchByGenre(genreId); // Chama a função de busca por gênero
        }
    });

    // Container para o campo de busca e o botão
    const searchInputContainer = document.createElement('div');
    searchInputContainer.className = 'd-flex col-7 col-md-8';
    // Campo de texto para a busca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.className = 'form-control flex-grow-1';
    searchInput.placeholder = 'Buscar filme...';

    // Botão de busca
    const searchButton = document.createElement('button');
    searchButton.className = 'btn btn-primary ml-2';
    searchButton.textContent = 'Buscar';
    searchButton.onclick = () => {
        const query = searchInput.value.trim();
        if (query) {
            onSearchByText(query); // Chama a função de busca por texto
        }
    };

    // Adiciona o evento de pressionar Enter
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) {
                onSearchByText(query); // Chama a função de busca por texto ao pressionar Enter
            }
        }
    });

    // Adiciona o campo de busca e botão ao container de busca
    searchInputContainer.appendChild(searchInput);
    searchInputContainer.appendChild(searchButton);

    // Adiciona os elementos ao container principal
    searchContainer.appendChild(genreSelect);
    searchContainer.appendChild(searchInputContainer);

    return searchContainer;
}
