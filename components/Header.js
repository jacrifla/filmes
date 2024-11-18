export default function Header() {
    const header = document.createElement('header');
    header.className = 'bg-dark text-white';

    // Criação de um container para centralizar o conteúdo
    const container = document.createElement('div');
    container.className = 'container d-flex flex-column align-items-center py-4';

    // Criação do link para o título
    const titleLink = document.createElement('a');
    titleLink.href = '../index.html'; // Define o link para a página inicial
    titleLink.style.textDecoration = 'none'; // Remove a linha embaixo
    titleLink.style.color = 'white'; 

    // Título
    const title = document.createElement('h1');
    title.textContent = 'Cine Explore';
    title.className = 'mb-4 text-center';

    // Coloca o título dentro do link
    titleLink.appendChild(title);

    // Barra de navegação
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg navbar-dark w-100';

    const button = document.createElement('button');
    button.className = 'navbar-toggler';
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', '#navbarNav');
    button.setAttribute('aria-controls', 'navbarNav');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Toggle navigation');
    button.innerHTML = '<span class="navbar-toggler-icon"></span>';

    const collapseDiv = document.createElement('div');
    collapseDiv.className = 'collapse navbar-collapse';
    collapseDiv.id = 'navbarNav';

    const navList = document.createElement('ul');
    navList.className = 'navbar-nav ml-auto';

    // Verifica se o usuário está logado
    const isLoggedIn = localStorage.getItem('user') !== null;

    // Links para convidados
    const guestLinks = [
        { text: 'Início', href: '../index.html', icon: 'bi-house-door' },
        { text: 'Login', href: '../pages/login.html', icon: 'bi-box-arrow-in-right' },
        { text: 'Registrar', href: '../pages/cadastro.html', icon: 'bi-person-plus' },
    ];

    // Links para usuários logados
    const userLinks = [
        { text: 'Início', href: '../index.html', icon: 'bi-house-door' },
        { text: 'Filmes Assistidos', href: '../pages/filmes_assistidos.html', icon: 'bi-film' },
        { text: 'Filmes Salvos', href: '../pages/filmes_salvos.html', icon: 'bi-bookmark' },
        { text: 'Configurações', href: '../pages/configuracoes.html', icon: 'bi-gear' },
    ];

    const links = isLoggedIn ? userLinks : guestLinks;

    // Adiciona links ao menu
    links.forEach(link => {
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';
        const anchor = document.createElement('a');
        anchor.className = 'nav-link';
        anchor.href = link.href;
        
        // Ícone do link
        const icon = document.createElement('i');
        icon.className = `bi ${link.icon} me-2`;  // "me-2" adiciona margem à direita do ícone
        anchor.appendChild(icon);

        // Texto do link
        anchor.textContent = link.text;

        listItem.appendChild(anchor);
        navList.appendChild(listItem);
    });

    // Adiciona o botão de logout se o usuário estiver logado
    if (isLoggedIn) {
        const logoutItem = document.createElement('li');
        logoutItem.className = 'nav-item';

        const logoutButton = document.createElement('button');
        logoutButton.className = 'nav-link btn btn-link text-danger'; // botão vermelho para logout
        logoutButton.textContent = 'Sair';
        logoutButton.onclick = () => {
            const confirmation = confirm('Você tem certeza que deseja sair?');
            if (confirmation) {
                // Remover informações do localStorage
                localStorage.removeItem('user');
                localStorage.removeItem('filmesSalvos');
                localStorage.removeItem('watchedMovies');
                localStorage.removeItem('watchedMoviesCache'); // Remover o cache de filmes assistidos
                
                // Redirecionar para a página de login
                window.location.href = '../pages/login.html';
            }
        };

        logoutItem.appendChild(logoutButton);
        navList.appendChild(logoutItem);
    }

    // Estrutura da navegação
    collapseDiv.appendChild(navList);
    nav.appendChild(button);
    nav.appendChild(collapseDiv);

    // Adiciona o título e a barra de navegação ao container
    container.appendChild(titleLink);  // Agora o título é um link
    container.appendChild(nav);

    // Adiciona o container ao header
    header.appendChild(container);

    return header;
}
