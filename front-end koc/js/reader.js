document.addEventListener("DOMContentLoaded", function () {
  // Elementos principais
  const bookContent = document.getElementById("book-content");
  const fontSizeDisplay = document.getElementById("font-size");
  const decreaseBtn = document.getElementById("font-decrease");
  const increaseBtn = document.getElementById("font-increase");
  const themeButtons = document.querySelectorAll(".theme-btn");
  const widthButtons = document.querySelectorAll(".width-btn");
  const prevChapterBtn = document.getElementById("prev-chapter");
  const nextChapterBtn = document.getElementById("next-chapter");
  const settingsToggle = document.getElementById("settings-toggle");
  const settingsMenu = document.getElementById("settings-menu");

  // Carregar configurações salvas
  let currentFontSize = parseInt(localStorage.getItem("fontSize")) || 16;
  let currentTheme = localStorage.getItem("theme") || "light";
  let currentWidth = localStorage.getItem("width") || "medium";

  // Aplicar configurações salvas
  updateFontSize();
  applyTheme(currentTheme);
  applyWidth(currentWidth);

  /** ============================== */
  /** 🔹 AJUSTE DE TAMANHO DA FONTE 🔹 */
  /** ============================== */
  decreaseBtn?.addEventListener("click", function () {
      if (currentFontSize > 14) {
          currentFontSize--;
          updateFontSize();
      }
  });

  increaseBtn?.addEventListener("click", function () {
      if (currentFontSize < 22) {
          currentFontSize++;
          updateFontSize();
      }
  });

  function updateFontSize() {
      bookContent.style.fontSize = `${currentFontSize}px`;
      if (fontSizeDisplay) fontSizeDisplay.textContent = `${currentFontSize}px`;
      localStorage.setItem("fontSize", currentFontSize);
  }

  /** ============================ */
  /** 🔹 APLICAÇÃO DE TEMAS 🔹 */
  /** ============================ */
  themeButtons.forEach(button => {
      button.addEventListener("click", function () {
          let selectedTheme = this.dataset.theme;
          applyTheme(selectedTheme);
      });
  });

  function applyTheme(theme) {
      document.body.classList.remove("dark-mode", "sepia-mode");
      bookContent.style.color = "";

      if (theme === "dark") {
          document.body.classList.add("dark-mode");
          bookContent.style.color = "#ffffff";
      } else if (theme === "sepia") {
          document.body.classList.add("sepia-mode");
          bookContent.style.color = "#000000";
      }

      // Atualiza botões ativos
      themeButtons.forEach(btn => btn.classList.remove("active"));
      document.querySelector(`[data-theme="${theme}"]`)?.classList.add("active");

      // Salva no localStorage
      localStorage.setItem("theme", theme);
  }

  /** ================================ */
  /** 🔹 AJUSTE DA LARGURA DO TEXTO 🔹 */
  /** ================================ */
  widthButtons.forEach(button => {
      button.addEventListener("click", function () {
          let selectedWidth = this.dataset.width;
          applyWidth(selectedWidth);
      });
  });

  function applyWidth(width) {
      document.body.classList.remove("narrow-width", "wide-width");

      if (width === "wide") {
          document.body.classList.add("wide-width");
      }

      // Atualiza botões ativos
      widthButtons.forEach(btn => btn.classList.remove("active"));
      document.querySelector(`[data-width="${width}"]`)?.classList.add("active");

      // Salva no localStorage
      localStorage.setItem("width", width);
  }

  /** =================================== */
  /** 🔹 NAVEGAÇÃO ENTRE CAPÍTULOS 🔹 */
  /** =================================== */
  prevChapterBtn?.addEventListener("click", function () {
      console.log("Carregar capítulo anterior");
      // TODO: Implementar carregamento real do capítulo anterior
  });

  nextChapterBtn?.addEventListener("click", function () {
      console.log("Carregar próximo capítulo");
      // TODO: Implementar carregamento real do próximo capítulo
  });

  /** ================================== */
  /** 🔹 MENU DE CONFIGURAÇÕES 🔹 */
  /** ================================== */
  settingsToggle?.addEventListener("click", function (event) {
      event.stopPropagation(); // Evita que o clique feche imediatamente
      settingsMenu?.classList.toggle("active");
  });

  // Fecha o menu ao clicar fora
  document.addEventListener("click", function (event) {
      if (!settingsMenu?.contains(event.target) && !settingsToggle?.contains(event.target)) {
          settingsMenu?.classList.remove("active");
      }
  });

  // Evita que o menu feche ao clicar dentro dele
  settingsMenu?.addEventListener("click", function (event) {
      event.stopPropagation();
  });
});
