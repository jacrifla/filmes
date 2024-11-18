export function createToast(message, type = 'success') {
    // Criando o conteúdo do Toast dinamicamente
    const toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        // Se o container do toast não existir, cria um
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        document.body.appendChild(container);
    }

    // Criando o elemento do toast
    const toastElement = document.createElement('div');
    toastElement.className = `toast align-items-center text-bg-${type} border-0`;
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');
    toastElement.setAttribute('data-bs-delay', '2000');

    toastElement.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    // Adiciona o toast ao container
    document.querySelector('.toast-container').appendChild(toastElement);

    // Inicializa e exibe o Toast usando o Bootstrap
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    // Remove o toast depois que ele desaparece (opcional)
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}
