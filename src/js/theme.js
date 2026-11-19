const THEME_STORAGE_KEY = "sleepoutside-theme";

function getSavedTheme() {
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return savedTheme === "dark" ? "dark" : "light";
}

function updateThemeButton() {
  const button = document.querySelector("#theme-toggle");

  if (!button) return;

  const theme = getSavedTheme();
  const isDark = theme === "dark";

  button.innerHTML = isDark
    ? `<svg viewBox="0 0 24 24" aria-hidden="true">
         <circle cx="12" cy="12" r="4"></circle>
         <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path>
       </svg>`
    : `<svg viewBox="0 0 24 24" aria-hidden="true">
         <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z"></path>
       </svg>`;

  button.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );

  button.setAttribute(
    "title",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
}

function applyTheme() {
  const theme = getSavedTheme();

  document.documentElement.setAttribute("data-theme", theme);
  updateThemeButton();
}

export function initTheme() {
  applyTheme();

  const button = document.querySelector("#theme-toggle");

  if (!button || button.dataset.initialized === "true") return;

  button.addEventListener("click", () => {
    const currentTheme = getSavedTheme();
    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    applyTheme();
  });

  button.dataset.initialized = "true";
}
