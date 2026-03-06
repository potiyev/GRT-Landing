// Theme toggle for Lights Out: Reaction & Reflex website
(function() {
    const STORAGE_KEY = 'gridreactiontimer-theme';

    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getStoredTheme() {
        try {
            return localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // localStorage not available
        }
    }

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        updateIcon(theme);
    }

    function updateIcon(theme) {
        var icon = document.getElementById('themeIcon');
        if (icon) {
            icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
        }
    }

    function getEffectiveTheme() {
        var stored = getStoredTheme();
        return stored || getSystemTheme();
    }

    // Apply theme immediately (before DOM ready) to prevent flash
    applyTheme(getEffectiveTheme());

    // Set up toggle and system listener after DOM is ready
    function setup() {
        var toggle = document.getElementById('themeToggle');
        if (toggle) {
            toggle.addEventListener('click', function() {
                var current = getEffectiveTheme();
                var next = current === 'dark' ? 'light' : 'dark';
                setStoredTheme(next);
                applyTheme(next);
            });
        }

        // Update icon in case it wasn't ready during initial applyTheme
        updateIcon(getEffectiveTheme());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }

    // Listen for system theme changes (only if user hasn't manually chosen)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        if (!getStoredTheme()) {
            applyTheme(getSystemTheme());
        }
    });
})();
