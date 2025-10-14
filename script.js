document.addEventListener("DOMContentLoaded", () => {
  // --- EFEITOS GLOBAIS (HEADER E BOTÃO TOPO) ---
  const stickyHeader = document.getElementById("stickyHeader");
  if (stickyHeader) {
    let lastScrollTop = 0;
    window.addEventListener("scroll", () => {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop && scrollTop > 200) {
        stickyHeader.style.transform = "translateY(-100%)";
      } else {
        stickyHeader.style.transform = "translateY(0)";
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      mainNav.classList.toggle("nav-open");
    });
  }

  const backToTopBtn = document.getElementById("backToTopBtn");
  if (backToTopBtn) {
    backToTopBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 4l-8 8h6v8h4v-8h6z"/></svg>`;
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) backToTopBtn.classList.add("show");
      else backToTopBtn.classList.remove("show");
    });
    backToTopBtn.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  // --- FUNCIONALIDADE MODAL (PÁGINA BIOMAS) ---
  const biomeModal = document.getElementById("biomeModal");
  const openModal = (biome, biomasData) => {
    if (!biomeModal) return;
    const data = biomasData[biome];
    if (!data) return;
    biomeModal.innerHTML = `
      <div id="modalText">
        <button class="close" aria-label="Fechar modal">&times;</button>
        <h3>${data.title}</h3> <p>${data.text}</p>
        <h4>Fauna:</h4> <ul>${data.fauna
          .map((i) => `<li>${i}</li>`)
          .join("")}</ul>
        <h4>Flora:</h4> <ul>${data.flora
          .map((i) => `<li>${i}</li>`)
          .join("")}</ul>
        ${data.clima ? `<h4>Clima:</h4><p>${data.clima}</p>` : ""}
        ${data.solo ? `<h4>Solo:</h4><p>${data.solo}</p>` : ""}
        ${
          data.curiosidades && data.curiosidades.length > 0
            ? `<h4>Curiosidades:</h4><ul>${data.curiosidades
                .map((item) => `<li>${item}</li>`)
                .join("")}</ul>`
            : ""
        }
      </div>`;
    biomeModal.style.display = "block";
    setTimeout(() => biomeModal.classList.add("show"), 10);
    const closeBtn = biomeModal.querySelector(".close");
    closeBtn.focus();
    const closeModalFunc = () => {
      biomeModal.classList.remove("show");
      setTimeout(() => {
        biomeModal.style.display = "none";
        biomeModal.innerHTML = "";
      }, 300);
      document.removeEventListener("keydown", handleEsc);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModalFunc();
    };
    closeBtn.addEventListener("click", closeModalFunc);
    biomeModal.addEventListener("click", (e) => {
      if (e.target === biomeModal) closeModalFunc();
    });
    document.addEventListener("keydown", handleEsc);
  };

  // --- CARREGAMENTO DE DADOS (PÁGINAS BIOMAS E GRÁFICO) ---
  const precisaDeDados =
    document.querySelector(".ver-detalhes") ||
    document.getElementById("clima-content") ||
    document.querySelector(".solo-card-container") ||
    document.querySelector(".curiosidades-slider");
  if (precisaDeDados) {
    fetch("../dados.json")
      .then((response) => response.json())
      .then((data) => {
        const biomasData = data.biomeDetails;

        document.querySelectorAll(".ver-detalhes").forEach((button) => {
          button.addEventListener("click", (e) => {
            const biome = e.target.closest(".card").dataset.biome;
            openModal(biome, biomasData);
          });
        });

        const climaContentDiv = document.getElementById("clima-content");
        if (climaContentDiv) {
          let climaHtml = "";
          for (const biomeKey in biomasData) {
            const biome = biomasData[biomeKey];
            if (biome.clima) {
              climaHtml += `<div class="clima-item"><h3>${biome.title}</h3><p>${biome.clima}</p></div>`;
            }
          }
          climaContentDiv.innerHTML = climaHtml;
        }

        const soloCardContainer = document.querySelector(
          ".solo-card-container"
        );
        if (soloCardContainer) {
          let soloHtml = "";
          for (const biomeKey in biomasData) {
            const biome = biomasData[biomeKey];
            if (biome.solo) {
              soloHtml += `<div class="solo-card"><h3>${biome.title}</h3><p>${biome.solo}</p></div>`;
            }
          }
          soloCardContainer.innerHTML = soloHtml;
        }

        const curiosidadesSlider = document.querySelector(
          ".curiosidades-slider"
        );
        const prevButton = document.querySelector(
          ".curiosidades-slider-container .prev"
        );
        const nextButton = document.querySelector(
          ".curiosidades-slider-container .next"
        );
        if (curiosidadesSlider && prevButton && nextButton) {
          let currentCuriosidadeIndex = 0;
          let allCuriosidades = [];
          for (const biomeKey in biomasData) {
            const biome = biomasData[biomeKey];
            if (biome.curiosidades && biome.curiosidades.length > 0) {
              biome.curiosidades.forEach((curiosidade) => {
                allCuriosidades.push({ biome: biome.title, text: curiosidade });
              });
            }
          }

          const renderCuriosidade = () => {
            if (allCuriosidades.length === 0) {
              curiosidadesSlider.innerHTML =
                "<p>Nenhuma curiosidade disponível.</p>";
              prevButton.style.display = "none";
              nextButton.style.display = "none";
              return;
            }
            const curiosidade = allCuriosidades[currentCuriosidadeIndex];
            curiosidadesSlider.innerHTML = `<div class="curiosidade-card"><h4>${curiosidade.biome}</h4><p>${curiosidade.text}</p></div>`;
            prevButton.style.display =
              allCuriosidades.length > 1 ? "block" : "none";
            nextButton.style.display =
              allCuriosidades.length > 1 ? "block" : "none";
          };

          const showNextCuriosidade = () => {
            currentCuriosidadeIndex =
              (currentCuriosidadeIndex + 1) % allCuriosidades.length;
            renderCuriosidade();
          };

          const showPrevCuriosidade = () => {
            currentCuriosidadeIndex =
              (currentCuriosidadeIndex - 1 + allCuriosidades.length) %
              allCuriosidades.length;
            renderCuriosidade();
          };

          prevButton.addEventListener("click", showPrevCuriosidade);
          nextButton.addEventListener("click", showNextCuriosidade);
          renderCuriosidade();
        }
      })
      .catch((error) => console.error("Erro ao carregar dados:", error));
  }

  // --- PÁGINA: SUSTENTABILIDADE (ACORDIÃO E QUIZ) ---
  const accordionItems = document.querySelectorAll(".accordion-item");
  if (accordionItems.length > 0) {
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      header.addEventListener("click", () => {
        const content = item.querySelector(".accordion-content");
        content.classList.toggle("active");
        const icon = header.querySelector("i");
        icon.classList.toggle("fa-chevron-down");
        icon.classList.toggle("fa-chevron-up");
      });
    });
  }

  const quizOptions = document.querySelectorAll(".quiz-option");
  if (quizOptions.length > 0) {
    const feedback = document.querySelector(".quiz-feedback");
    quizOptions[0].dataset.answer = "correct";
    quizOptions.forEach((option) => {
      option.addEventListener("click", () => {
        if (option.dataset.answer === "correct") {
          feedback.textContent =
            "✓ Correto! 'Tecnológico' não é um dos três pilares do desenvolvimento sustentável.";
          feedback.className = "quiz-feedback show correct";
        } else {
          feedback.textContent =
            "✗ Incorreto. Tente novamente! Os três pilares são Ambiental, Econômico e Social.";
          feedback.className = "quiz-feedback show incorrect";
        }
      });
    });
  }

  // --- PÁGINA: COMO AJUDAR (BALÕES INTERATIVOS) ---
  const balloons = document.querySelectorAll(".balloon");
  if (balloons.length > 0) {
    balloons.forEach((balloon) => {
      balloon.addEventListener("click", function () {
        const info = this.getAttribute("data-info");
        alert(info);
      });
    });
  }

  // --- PÁGINA: GRÁFICO ---
  const chartCanvas = document.getElementById("graficoPizza");
  if (chartCanvas) {
    fetch("../dados.json")
      .then((response) => response.json())
      .then((data) => {
        const ctx = chartCanvas.getContext("2d");
        const chart = new Chart(ctx, {
          type: "doughnut",
          data: {
            labels: data.chartData.labels,
            datasets: [
              {
                data: data.chartData.values,
                backgroundColor: data.chartData.colors,
                borderColor: "#ffffff",
                borderWidth: 3,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: "65%",
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.label}: ${ctx.parsed}%`,
                },
              },
            },
          },
        });

        const detalheContainer = document.getElementById(
          "detalhe-card-container"
        );
        const detalheData = [
          {
            index: 0,
            titulo: "Mata Atlântica",
            cor: "#d90429",
            areas:
              "Principais áreas de desmatamento: Floresta de Araucárias, ecossistemas costeiros.",
            orgs: [
              { nome: "SOS Mata Atlântica", link: "https://www.sosma.org.br/" },
            ],
          },
          {
            index: 1,
            titulo: "Cerrado",
            cor: "#ef233c",
            areas:
              "Principais áreas de desmatamento: Formações savânicas para expansão agrícola.",
            orgs: [
              {
                nome: "Instituto Cerrado",
                link: "https://www.institutocerrado.org.br/",
              },
            ],
          },
          {
            index: 2,
            titulo: "Amazônia",
            cor: "#8d99ae",
            areas:
              "Principais áreas de desmatamento: Formações florestais para agropecuária e extração.",
            orgs: [
              {
                nome: "WWF Brasil",
                link: "https://www.wwf.org.br/participe/doe/",
              },
            ],
          },
          {
            index: 3,
            titulo: "Pampa",
            cor: "#43aa8b",
            areas:
              "Principais áreas de desmatamento: Campos nativos para agricultura.",
            orgs: [
              {
                nome: "The Nature Conservancy Brasil",
                link: "https://www.tnc.org.br/",
              },
            ],
          },
          {
            index: 4,
            titulo: "Pantanal",
            cor: "#2b9348",
            areas:
              "Principais áreas de desmatamento: Áreas úmidas afetadas por queimadas e pecuária.",
            orgs: [
              {
                nome: "WWF Brasil",
                link: "https://www.wwf.org.br/participe/doe/",
              },
            ],
          },
          {
            index: 5,
            titulo: "Caatinga",
            cor: "#f9c74f",
            areas:
              "Principais áreas de desmatamento: Vegetação nativa para lenha e agricultura.",
            orgs: [
              {
                nome: "Instituto Cerrado",
                link: "https://www.institutocerrado.org.br/",
              },
            ],
          },
        ];

        let cardAberto = null;
        document.querySelectorAll(".data-point").forEach((point) => {
          point.addEventListener("click", () => {
            const index = parseInt(point.dataset.index);
            chart.setActiveElements([{ datasetIndex: 0, index }]);
            chart.update();

            if (cardAberto === index) {
              detalheContainer.innerHTML = "";
              cardAberto = null;
              return;
            }

            const detalhe = detalheData.find((d) => d.index === index);
            if (detalhe) {
              let orgList = detalhe.orgs
                .map(
                  (org) =>
                    `<li><a href="${org.link}" target="_blank">${org.nome}</a></li>`
                )
                .join("");
              detalheContainer.innerHTML = `
                    <div class="detalhe-card" style="border-left-color: ${detalhe.cor};">
                      <h3>${detalhe.titulo}</h3>
                      <p>${detalhe.areas}</p>
                      <strong>Organizações que atuam na área:</strong>
                      <ul>${orgList}</ul>
                    </div>
                  `;
              cardAberto = index;
            }
          });
        });
      })
      .catch((error) =>
        console.error("Erro ao carregar dados do gráfico:", error)
      );
  }

  // --- FUNCIONALIDADES DA PÁGINA DE DEFINIÇÃO COMPLETA ---
  const galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length > 0) {
    // Scroll Reveal Animation
    const revealElements = document.querySelectorAll(".reveal");
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 150;
        if (elementTop < windowHeight - revealPoint) {
          element.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Initial check

    // Parallax effect for floating leaves
    window.addEventListener("scroll", function () {
      const scrolled = window.pageYOffset;
      const leaves = document.querySelectorAll(".leaf");
      leaves.forEach((leaf, index) => {
        const speed = 0.5 + index * 0.1;
        leaf.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });

    // Modal functionality
    const modals = document.querySelectorAll(".modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        const modalId = this.getAttribute("data-modal");
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    });

    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const modal = this.closest(".modal");
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
      });
    });

    modals.forEach((modal) => {
      modal.addEventListener("click", function (e) {
        if (e.target === this) {
          this.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        modals.forEach((modal) => {
          if (modal.classList.contains("active")) {
            modal.classList.remove("active");
            document.body.style.overflow = "auto";
          }
        });
      }
    });

    // Add particle effect on CTA buttons
    const buttons = document.querySelectorAll(".btn-primary, .btn-secondary");
    buttons.forEach((button) => {
      button.addEventListener("mouseenter", function (e) {
        // This is a simplified effect. The original CSS handles the main hover.
      });
    });
  }
});
