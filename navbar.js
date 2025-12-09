function createNavbar() {
    // Identifica em qual página o usuário está para marcar o link como "active"
    const path = window.location.pathname;
    const page = path.split("/").pop(); // Pega apenas o nome do arquivo (ex: index.html)

    // Define os links do menu
    // Ajustamos os caminhos baseados se estamos na raiz (index) ou nas pastas (pages/)
    const isRoot = page === "index.html" || page === "";
    const basePath = isRoot ? "pages/" : "";
    const homePath = isRoot ? "index.html" : "../index.html";
    const imgPath = isRoot ? "images/layout/logo.ico" : "../images/layout/logo.ico";

    // Estrutura dos links
    const links = [
        { name: "Início", url: homePath, file: "index.html" },
        { name: "Definição da Fauna e Flora", url: basePath + "definicao-fauna-flora.html", file: "definicao-fauna-flora.html" },
        { name: "Fauna e Flora", url: basePath + "fauna_e_flora.html", file: "fauna_e_flora.html" },
        { name: "Importância", url: basePath + "importancia.html", file: "importancia.html" },
        { name: "Ameaças", url: basePath + "ameacas.html", file: "ameacas.html" },
        { name: "Sustentabilidade", url: basePath + "desenvolvimento.html", file: "desenvolvimento.html" },
        { name: "Biomas", url: basePath + "biomas.html", file: "biomas.html" },
        { name: "Como Ajudar", url: basePath + "como_ajudar.html", file: "como_ajudar.html" },
        { name: "Gráfico Interativo", url: basePath + "grafico-vegetacao.html", file: "grafico-vegetacao.html" },
        { name: "Comunidade", url: basePath + "comunidade.html", file: "comunidade.html" }, // Nova aba!
        { name: "Conclusão", url: basePath + "conclusao.html", file: "conclusao.html" }
    ];

    // Constrói o HTML da Navbar
    let navHtml = `
    <div class="header-container">
        <a href="${homePath}" aria-label="Página Inicial do EcoExplorador">
            <img src="${imgPath}" alt="Logo EcoExplorador" class="header-logo"/>
        </a>
        <h1>EcoExplorador - Biodiversidade Brasileira</h1>
    </div>
    `;

    // Constrói o menu de links
    let linksHtml = '';
    links.forEach(link => {
        // Verifica se é a página atual para adicionar a classe "active"
        // Para a home, verifica se é index.html ou vazio (raiz)
        const isActive = (page === link.file) || (link.file === "index.html" && (page === "" || page === "/"));
        const activeClass = isActive ? ' class="active"' : '';
        linksHtml += `<a href="${link.url}"${activeClass}>${link.name}</a>`;
    });

    navHtml += `
    <div class="nav-container">
        <a href="#" id="menu-toggle">☰ Menu</a>
        <nav id="main-nav">
            ${linksHtml}
        </nav>
    </div>
    `;

    // Insere o HTML no elemento placeholder
    const headerPlaceholder = document.getElementById("stickyHeader");
    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = navHtml;
    }

    // Reativa o menu mobile (hambúrguer) pois o elemento foi recriado
    const menuToggle = document.getElementById("menu-toggle");
    const mainNav = document.getElementById("main-nav");
    if (menuToggle && mainNav) {
        menuToggle.addEventListener("click", (e) => {
            e.preventDefault();
            mainNav.classList.toggle("nav-open");
        });
    }
}

// Executa a função quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", createNavbar);