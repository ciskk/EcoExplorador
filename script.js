document.addEventListener("DOMContentLoaded", () => {
  // --- Efeito do Header Fixo ---
  const stickyHeader = document.getElementById("stickyHeader");
  let lastScrollTop = 0;

  window.addEventListener("scroll", () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      // Rolando para baixo
      stickyHeader.style.transform = "translateY(-100%)";
    } else {
      // Rolando para cima
      stickyHeader.style.transform = "translateY(0)";
    }
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });

  // --- Menu Hamburger para Telas Pequenas ---
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      mainNav.classList.toggle("nav-open");
      document.body.style.overflow = mainNav.classList.contains("nav-open")
        ? "hidden"
        : "";
    });

    // Fechar menu ao clicar em um link
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (mainNav.classList.contains("nav-open")) {
          menuToggle.setAttribute("aria-expanded", "false");
          mainNav.classList.remove("nav-open");
          document.body.style.overflow = "";
        }
      });
    });
  }

  // --- Botão "Voltar ao Topo" ---
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    // Adiciona o ícone SVG dinamicamente para acessibilidade
    backToTopBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 4l-8 8h6v8h4v-8h6z"/>
      </svg>
    `;

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // --- Modal de Biomas ---
  const biomeModal = document.getElementById("biomeModal");
  const verDetalhesButtons = document.querySelectorAll(".ver-detalhes");

  const openModal = (biome, biomasData) => {
    const data = biomasData[biome];
    if (!data) return;

    biomeModal.innerHTML = `
      <div id="modalText">
        <button class="close" aria-label="Fechar modal">&times;</button>
        <h3 id="modalTitle">${data.title}</h3>
        <p>${data.text}</p>
        <h4>Fauna Destaque:</h4>
        <ul>${data.fauna.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h4>Flora Destaque:</h4>
        <ul>${data.flora.map((item) => `<li>${item}</li>`).join("")}</ul>
      </div>
    `;

    biomeModal.style.display = "block";
    setTimeout(() => biomeModal.classList.add("show"), 10);

    const closeBtn = biomeModal.querySelector(".close");
    closeBtn.focus();

    closeBtn.addEventListener("click", closeModal);
    biomeModal.addEventListener("click", (e) => {
      if (e.target === biomeModal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", handleEsc);
  };

  const closeModal = () => {
    biomeModal.classList.remove("show");
    setTimeout(() => {
      biomeModal.style.display = "none";
      biomeModal.innerHTML = "";
    }, 300);
    document.removeEventListener("keydown", handleEsc);
  };

  const handleEsc = (e) => {
    if (e.key === "Escape") {
      closeModal();
    }
  };

  if (verDetalhesButtons.length > 0) {
    fetch("../dados.json")
      .then((response) => response.json())
      .then((data) => {
        const biomasData = data.biomeDetails;
        verDetalhesButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            if (card) {
              const biome = card.dataset.biome;
              openModal(biome, biomasData);
            }
          });
        });
      })
      .catch((error) =>
        console.error("Erro ao carregar dados dos biomas:", error)
      );
  }
});
