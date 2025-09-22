script.js
// script.js

// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {

  // === MELHORIA (Item 9): Carrega dados de um arquivo JSON externo ===
  fetch('dados.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Não foi possível carregar os dados.');
      }
      return response.json();
    })
    .then(data => {
      // Toda a lógica que depende dos dados é executada aqui
      initializePage(data);
    })
    .catch(error => {
      console.error('Erro ao carregar o arquivo de dados:', error);
      // Opcional: Exibir uma mensagem de erro para o usuário na página
    });

});

function initializePage(data) {
  const biomeDetails = data.biomeDetails;

  // === Seleção de elementos do DOM ===
  const buttons = document.querySelectorAll('.ver-detalhes');
  const modal = document.getElementById('biomeModal');
  const modalText = document.getElementById('modalText');
  const closeModalBtn = modal.querySelector('.close');
  const header = document.getElementById('stickyHeader');
  const menuToggleBtn = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const navLinks = mainNav.querySelectorAll('a');

  // === Funções de modal ===
  let lastFocusedElement;
  
  function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }

  function showModal(button) {
    lastFocusedElement = button;
    modal.style.display = 'block';
    setTimeout(() => modal.classList.add('show'), 10);
    closeModalBtn.focus();
    modal.addEventListener('keydown', handleFocusTrap);
  }

  function closeModal() {
    modal.classList.remove('show');
    modal.removeEventListener('keydown', handleFocusTrap);
    setTimeout(() => {
        modal.style.display = 'none';
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }, 300);
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const biome = btn.closest('.card').dataset.biome;
      if (biomeDetails[biome]) {
          modalText.innerHTML = `<h3 id="modalTitle">${biomeDetails[biome].title}</h3>${biomeDetails[biome].content}`;
      } else {
          modalText.innerHTML = '<p>Detalhes indisponíveis.</p>';
      }
      showModal(btn);
    });
  });

  closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', event => {
    if (event.target === modal) closeModal();
  });
  window.addEventListener('keydown', event => {
      if (event.key === 'Escape' && modal.style.display === 'block') closeModal();
  });

  // === Menu Hambúrguer ===
  menuToggleBtn.addEventListener('click', () => {
      const isExpanded = menuToggleBtn.getAttribute('aria-expanded') === 'true';
      menuToggleBtn.setAttribute('aria-expanded', !isExpanded);
      mainNav.classList.toggle('nav-open');
      const icon = menuToggleBtn.querySelector('i');
      if (mainNav.classList.contains('nav-open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
          menuToggleBtn.setAttribute('aria-label', 'Fechar menu');
      } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
          menuToggleBtn.setAttribute('aria-label', 'Abrir menu');
      }
  });

  navLinks.forEach(link => {
      link.addEventListener('click', () => {
          if (mainNav.classList.contains('nav-open')) menuToggleBtn.click();
      });
  });

  // === Função debounce ===
  function debounce(fn, delay = 20) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // === Controle do cabeçalho e Botão Voltar ao Topo ===
  let lastScrollY = window.pageYOffset;
  let isHeaderHidden = false;

  function handleScroll() {
      const currentY = window.pageYOffset;
      if (currentY > 300) backToTopBtn.classList.add('show');
      else backToTopBtn.classList.remove('show');
      if (mainNav.classList.contains('nav-open')) {
          showHeader();
          return;
      }
      if (currentY < lastScrollY || currentY <= 50) showHeader();
      else if (currentY > lastScrollY && currentY > header.offsetHeight && !isHeaderHidden) hideHeader();
      lastScrollY = currentY <= 0 ? 0 : currentY;
  }

  function showHeader() {
      if (isHeaderHidden) {
          header.style.transform = 'translateY(0)';
          isHeaderHidden = false;
      }
  }

  function hideHeader() {
      if (!isHeaderHidden) {
          header.style.transform = 'translateY(-100%)';
          isHeaderHidden = true;
      }
  }

  window.addEventListener('scroll', debounce(handleScroll, 50));

  const smoothScrollTo = (endY, duration) => {
    const startY = window.pageYOffset;
    const distanceY = endY - startY;
    let startTime = null;
    const easeInOutCubic = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t * t + b;
        t -= 2;
        return c / 2 * (t * t * t + 2) + b;
    };
    const animation = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const nextY = easeInOutCubic(timeElapsed, startY, distanceY, duration);
      window.scrollTo(0, nextY);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    };
    requestAnimationFrame(animation);
  };

  backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault(); 
      smoothScrollTo(0, 800);
  });

  document.addEventListener('mousemove', debounce(event => {
    if (!('ontouchstart' in window || navigator.msMaxTouchPoints) && event.clientY <= 5) showHeader();
  }, 50));

  // === Gráfico de Rosca de Vegetação Desmatada ===
  const ctx = document.getElementById('graficoPizza');
  if (ctx) {
    const chartData = data.chartData;
    const graficoPizza = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartData.labels,
        datasets: [{
          label: 'Tipos de Vegetação Desmatada',
          data: chartData.data,
          backgroundColor: ['#2d6a4f', '#4caf50', '#a9a9a9'],
          borderColor: '#f5f5f5',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        // === MELHORIA (Item 10): Gráfico Interativo ===
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const clickedElementIndex = elements[0].index;
                const label = chartData.labels[clickedElementIndex];
                const value = chartData.data[clickedElementIndex];
                const info = chartData.moreInfo[clickedElementIndex];
                alert(`${label} (${value}%):\n\n${info}`);
            }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                return `${label}: ${value}%`;
              }
            }
          },
          legend: {
            position: 'bottom',
            labels: {
              color: '#333',
              font: { size: 14, family: "'Poppins', sans-serif" },
              padding: 20
            }
          },
          title: { display: false }
        }
      }
    });
  }
}