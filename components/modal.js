export default function createModal({ id, title, body, footer, dark = false }) {
    const modal = document.createElement('div');
    modal.className = `modal fade${dark ? ' modal-dark' : ''}`; // Adiciona a classe modal-dark, se o tema dark for ativado
    modal.id = id;
    modal.tabIndex = -1;
    modal.setAttribute('aria-labelledby', `${id}Label`);
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.className = 'modal-dialog';

    const modalContent = document.createElement('div');
    modalContent.className = `modal-content${dark ? ' bg-dark text-white' : ''}`; // Classes para tema dark

    // Header
    const modalHeader = document.createElement('div');
    modalHeader.className = `modal-header${dark ? ' border-secondary' : ''}`; // Ajusta borda para tema dark
    const modalTitle = document.createElement('h5');
    modalTitle.className = 'modal-title';
    modalTitle.id = `${id}Label`;
    modalTitle.textContent = title;
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'btn-close';
    closeButton.setAttribute('data-bs-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');
    if (dark) closeButton.classList.add('btn-close-white'); // Ajusta cor do botão de fechar para o tema dark
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);

    // Body
    const modalBody = document.createElement('div');
    modalBody.className = `modal-body${dark ? ' text-white' : ''}`; // Ajusta texto para tema dark
    modalBody.innerHTML = body;

    // Footer
    const modalFooter = document.createElement('div');
    modalFooter.className = `modal-footer${dark ? ' border-secondary' : ''}`; // Ajusta borda para tema dark
    if (footer) {
        modalFooter.innerHTML = footer;
    }

    // Estrutura
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    if (footer) modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    return modal;
}
