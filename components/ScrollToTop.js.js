export function ScrollToTopButton() {
    // Cria o botão dinamicamente
    const button = document.createElement("button");
    button.id = "scrollToTopButton";
    button.className = "btn btn-primary position-fixed";
    button.style = "bottom: 20px; right: 20px; display: none; z-index: 1000;";
    button.innerHTML = `<i class="bi bi-arrow-up"></i>`;

    // Adiciona o comportamento de exibir/ocultar o botão
    window.addEventListener("scroll", () => {
        button.style.display = window.scrollY > 200 ? "block" : "none";
    });

    // Adiciona o comportamento de rolar ao topo
    button.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });

    return button;
}
