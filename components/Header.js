export default function Header() {
    const header = document.createElement('header');

    // Criação de um container para centralizar o conteúdo
    const container = document.createElement('div');
    container.className = 'container d-flex justify-content-between align-items-center py-4 position-relative';

    // Criação do link para o título
    const titleLink = document.createElement('a');
    titleLink.href = '../index.html'; // Define o link para a página inicial
    titleLink.style.textDecoration = 'none'; // Remove a linha embaixo
    titleLink.style.color = 'white'; 

    // Título
    const title = document.createElement('h1');
    title.textContent = 'Cine Explore';
    title.className = 'mb-0';

    // Coloca o título dentro do link
    titleLink.appendChild(title);

    // Barra de navegação
    const nav = document.createElement('nav');
    nav.className = 'navbar navbar-expand-lg navbar-dark w-auto';

    const button = document.createElement('button');
    button.className = 'navbar-toggler';
    button.type = 'button';
    button.setAttribute('data-bs-toggle', 'collapse');
    button.setAttribute('data-bs-target', '#navbarNav');
    button.setAttribute('aria-controls', 'navbarNav');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Toggle navigation');
    button.innerHTML = '<span class="navbar-toggler-icon"></span>';

    // Estilo para o botão de hambúrguer para mantê-lo fixo no topo
    button.style.position = 'absolute';
    button.style.top = '10px';  // Distância do topo
    button.style.right = '10px'; // Distância da direita
    button.style.zIndex = '100'; // Garante que o botão ficará acima do conteúdo

    const collapseDiv = document.createElement('div');
    collapseDiv.className = 'collapse navbar-collapse';
    collapseDiv.id = 'navbarNav';

    const navList = document.createElement('ul');
    navList.className = 'navbar-nav ml-auto';

    // Verifica se o usuário está logado
    const isLoggedIn = localStorage.getItem('user') !== null;

    // Links para convidados
    const guestLinks = [
        { text: 'Início', href: '../index.html', icon: 'bi-house' },
        { text: 'Login', href: '../pages/login.html', icon: 'bi-box-arrow-in-right' },
        { text: 'Registrar', href: '../pages/cadastro.html', icon: 'bi-person-plus' },
    ];

    // Links para usuários logados
    const userLinks = [
        { text: 'Início', href: '../index.html', icon: 'bi-house' },
        { text: 'Assistidos', href: '../pages/filmes_assistidos.html', icon: 'bi-film' },
        { text: 'Watchlist', href: '../pages/filmes_salvos.html', icon: 'bi-bookmark' },
        { text: 'Minha Conta', href: '../pages/configuracoes.html', icon: 'bi-gear' },
    ];

    const links = isLoggedIn ? userLinks : guestLinks;

    // Adiciona links ao menu
    links.forEach(link => {
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';
        const anchor = document.createElement('a');
        anchor.className = 'nav-link';
        anchor.href = link.href;
        
        // Criando o ícone e adicionando ao link
        const icon = document.createElement('i');
        icon.className = `bi ${link.icon} me-2`;
        anchor.appendChild(icon);
    
        // Adicionando o texto ao link
        anchor.appendChild(document.createTextNode(link.text));  // Adiciona o texto após o ícone
    
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
    container.appendChild(titleLink);
    container.appendChild(nav);

    // Adiciona o container ao header
    header.appendChild(container);

    return header;
}
