document.addEventListener("DOMContentLoaded", () => {
  // --- Efeito do Header Fixo ---
  const stickyHeader = document.getElementById("stickyHeader");
  if (stickyHeader) {
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        stickyHeader.style.transform = "translateY(-100%)";
      } else {
        stickyHeader.style.transform = "translateY(0)";
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

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
        ${data.clima ? `<h4>Clima:</h4><p>${data.clima}</p>` : ''}
        ${data.solo ? `<h4>Solo:</h4><p>${data.solo}</p>` : ''}
        ${data.curiosidades && data.curiosidades.length > 0 ? `<h4>Curiosidades:</h4><ul>${data.curiosidades.map((item) => `<li>${item}</li>`).join("")}</ul>` : ''}
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

  // --- Carregamento de Dados e Renderização --- 
  if (verDetalhesButtons.length > 0 || document.getElementById('clima-content') || document.querySelector('.solo-card-container') || document.querySelector('.curiosidades-slider')) {
    fetch("../dados.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na rede: " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        const biomasData = data.biomeDetails;
        
        // Renderizar detalhes do bioma no modal
        verDetalhesButtons.forEach((button) => {
          button.addEventListener("click", (e) => {
            const card = e.target.closest(".card");
            if (card) {
              const biome = card.dataset.biome;
              openModal(biome, biomasData);
            }
          });
        });

        // Renderizar seção de Clima
        const climaContentDiv = document.getElementById('clima-content');
        if (climaContentDiv) {
          let climaHtml = '';
          for (const biomeKey in biomasData) {
            const biome = biomasData[biomeKey];
            if (biome.clima) {
              climaHtml += `
                <div class="clima-item">
                  <h3>${biome.title}</h3>
                  <p>${biome.clima}</p>
                </div>
              `;
            }
          }
          climaContentDiv.innerHTML = climaHtml;
        }

        // Renderizar seção de Solos
        const soloCardContainer = document.querySelector('.solo-card-container');
        if (soloCardContainer) {
          let soloHtml = '';
          for (const biomeKey in biomasData) {
            const biome = biomasData[biomeKey];
            if (biome.solo) {
              soloHtml += `
                <div class="solo-card">
                  <h3>${biome.title}</h3>
                  <p>${biome.solo}</p>
                </div>
              `;
            }
          }
          soloCardContainer.innerHTML = soloHtml;
        }

        // Renderizar seção de Curiosidades (Slider)
        const curiosidadesSlider = document.querySelector('.curiosidades-slider');
        const prevButton = document.querySelector('.curiosidades-slider-container .prev');
        const nextButton = document.querySelector('.curiosidades-slider-container .next');
        let currentCuriosidadeIndex = 0;
        let allCuriosidades = [];

        if (curiosidadesSlider) {
          for (const biomeKey in biomasData) {
            const biome = biomasData[biomeKey];
            if (biome.curiosidades && biome.curiosidades.length > 0) {
              biome.curiosidades.forEach(curiosidade => {
                allCuriosidades.push({ biome: biome.title, text: curiosidade });
              });
            }
          }

          const renderCuriosidade = () => {
            if (allCuriosidades.length === 0) {
              curiosidadesSlider.innerHTML = '<p>Nenhuma curiosidade disponível.</p>';
              prevButton.style.display = 'none';
              nextButton.style.display = 'none';
              return;
            }
            const curiosidade = allCuriosidades[currentCuriosidadeIndex];
            curiosidadesSlider.innerHTML = `
              <div class="curiosidade-card">
                <h4>${curiosidade.biome}</h4>
                <p>${curiosidade.text}</p>
              </div>
            `;
            prevButton.style.display = allCuriosidades.length > 1 ? 'block' : 'none';
            nextButton.style.display = allCuriosidades.length > 1 ? 'block' : 'none';
          };

          const showNextCuriosidade = () => {
            currentCuriosidadeIndex = (currentCuriosidadeIndex + 1) % allCuriosidades.length;
            renderCuriosidade();
          };

          const showPrevCuriosidade = () => {
            currentCuriosidadeIndex = (currentCuriosidadeIndex - 1 + allCuriosidades.length) % allCuriosidades.length;
            renderCuriosidade();
          };

          prevButton.addEventListener('click', showPrevCuriosidade);
          nextButton.addEventListener('click', showNextCuriosidade);

          renderCuriosidade(); // Renderiza a primeira curiosidade ao carregar a página
        }

      })
      .catch((error) => console.error("Erro ao carregar dados dos biomas:", error));
  }
});

