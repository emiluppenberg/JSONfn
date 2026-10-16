const themeKey = "jsonfn-theme";
const systemTheme = matchMedia("(prefers-color-scheme: light)");

function storedTheme() {
    try {
        const theme = localStorage.getItem(themeKey);
        if (theme === "light" || theme === "dark") return theme;
    } catch { }
    return systemTheme.matches ? "light" : "dark";
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
        button.setAttribute("aria-pressed", String(theme === "light"));
        button.title = theme === "light" ? "Switch to dark mode" : "Switch to light mode";
    });
}

export function afterWebStarted(blazor) {
    applyTheme(storedTheme());

    document.addEventListener("click", event => {
        const button = event.target.closest("[data-theme-toggle]");
        if (!button) return;

        const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
        try {
            localStorage.setItem(themeKey, theme);
        } catch { }
        applyTheme(theme);
    });

    blazor.addEventListener("enhancedload", () => applyTheme(storedTheme()));
    window.addEventListener("storage", event => {
        if (event.key === themeKey || event.key === null) applyTheme(storedTheme());
    });
    systemTheme.addEventListener("change", () => applyTheme(storedTheme()));
}
