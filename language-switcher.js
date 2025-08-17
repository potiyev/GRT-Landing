// Language switcher functionality for Grid Reaction Timer website
class LanguageSwitcher {
    constructor() {
        this.currentLanguage = this.getStoredLanguage() || 'en';
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createLanguageSelector();
        this.attachEventListeners();
        this.updateContent();
        this.updateDocumentLanguage();
    }

    getStoredLanguage() {
        try {
            return localStorage.getItem('gridreactiontimer-language');
        } catch (e) {
            return null;
        }
    }

    setStoredLanguage(language) {
        try {
            localStorage.setItem('gridreactiontimer-language', language);
        } catch (e) {
            // localStorage not available, continue without storage
        }
    }

    createLanguageSelector() {
        const navRight = document.querySelector('.nav-right');
        if (!navRight) return;

        // Check if selector already exists
        if (navRight.querySelector('.language-selector')) return;

        const languageSelector = document.createElement('div');
        languageSelector.className = 'language-selector';
        
        const dropdown = document.createElement('div');
        dropdown.className = 'language-dropdown';
        
        const button = document.createElement('button');
        button.className = 'language-button';
        button.setAttribute('aria-label', 'Select language');
        button.setAttribute('aria-expanded', 'false');
        
        const currentLang = this.getCurrentLanguageInfo();
        button.innerHTML = `
            <span class="flag ${this.currentLanguage}"></span>
            <span class="language-text">${currentLang.name}</span>
            <span class="arrow">▼</span>
        `;
        
        const menu = document.createElement('div');
        menu.className = 'language-menu';
        menu.setAttribute('role', 'menu');
        
        // Create options for all languages
        const languages = [
            { code: 'en', name: 'English' },
            { code: 'es', name: 'Español' },
            { code: 'ja', name: '日本語' },
            { code: 'de', name: 'Deutsch' },
            { code: 'fr', name: 'Français' },
            { code: 'pt', name: 'Português' }
        ];
        
        languages.forEach(lang => {
            const option = document.createElement('button');
            option.className = 'language-option';
            option.setAttribute('data-language', lang.code);
            option.setAttribute('role', 'menuitem');
            if (lang.code === this.currentLanguage) {
                option.classList.add('active');
            }
            
            option.innerHTML = `
                <span class="flag ${lang.code}"></span>
                <span class="language-name">${lang.name}</span>
            `;
            
            menu.appendChild(option);
        });
        
        dropdown.appendChild(button);
        dropdown.appendChild(menu);
        languageSelector.appendChild(dropdown);
        
        navRight.appendChild(languageSelector);
    }

    attachEventListeners() {
        const dropdown = document.querySelector('.language-dropdown');
        const button = document.querySelector('.language-button');
        const menu = document.querySelector('.language-menu');
        const options = document.querySelectorAll('.language-option');

        if (!dropdown || !button || !menu) return;

        // Toggle dropdown
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.classList.contains('open');
            this.closeAllDropdowns();
            if (!isOpen) {
                dropdown.classList.add('open');
                button.setAttribute('aria-expanded', 'true');
                // Focus first option
                const firstOption = menu.querySelector('.language-option');
                if (firstOption) firstOption.focus();
            }
        });

        // Handle option selection
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                const language = e.currentTarget.getAttribute('data-language');
                this.changeLanguage(language);
                this.closeAllDropdowns();
            });

            // Keyboard navigation
            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const language = e.currentTarget.getAttribute('data-language');
                    this.changeLanguage(language);
                    this.closeAllDropdowns();
                }
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            this.closeAllDropdowns();
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllDropdowns();
                button.focus();
            }
        });
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('.language-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('open');
            const button = dropdown.querySelector('.language-button');
            if (button) button.setAttribute('aria-expanded', 'false');
        });
    }

    getCurrentLanguageInfo() {
        const languages = {
            en: { name: 'English', code: 'en' },
            es: { name: 'Español', code: 'es' },
            ja: { name: '日本語', code: 'ja' },
            de: { name: 'Deutsch', code: 'de' },
            fr: { name: 'Français', code: 'fr' },
            pt: { name: 'Português', code: 'pt' }
        };
        return languages[this.currentLanguage] || languages.en;
    }

    changeLanguage(newLanguage) {
        if (!translations[newLanguage]) {
            console.warn(`Language ${newLanguage} not supported`);
            return;
        }

        this.currentLanguage = newLanguage;
        this.setStoredLanguage(newLanguage);
        this.updateContent();
        this.updateLanguageSelector();
        this.updateDocumentLanguage();
    }

    updateLanguageSelector() {
        const button = document.querySelector('.language-button');
        const options = document.querySelectorAll('.language-option');
        
        if (button) {
            const currentLang = this.getCurrentLanguageInfo();
            button.innerHTML = `
                <span class="flag ${this.currentLanguage}"></span>
                <span class="language-text">${currentLang.name}</span>
                <span class="arrow">▼</span>
            `;
        }

        options.forEach(option => {
            const langCode = option.getAttribute('data-language');
            option.classList.toggle('active', langCode === this.currentLanguage);
        });
    }

    updateDocumentLanguage() {
        document.documentElement.lang = this.currentLanguage;
    }

    updateContent() {
        if (!translations[this.currentLanguage]) return;

        const t = translations[this.currentLanguage];

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            if (window.location.pathname.includes('privacy')) {
                titleElement.textContent = t.privacyTitle;
            } else {
                titleElement.textContent = t.title;
            }
        }

        // Update all elements with data-translate attributes
        const elementsToTranslate = document.querySelectorAll('[data-translate]');
        elementsToTranslate.forEach(element => {
            const key = element.getAttribute('data-translate');
            if (t[key]) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = t[key];
                } else {
                    element.textContent = t[key];
                }
            }
        });

        // Update elements with data-translate-html (for elements that need HTML content)
        const htmlElements = document.querySelectorAll('[data-translate-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-translate-html');
            if (t[key]) {
                element.innerHTML = t[key];
            }
        });

        // Update alt attributes
        const imgElements = document.querySelectorAll('[data-translate-alt]');
        imgElements.forEach(element => {
            const key = element.getAttribute('data-translate-alt');
            if (t[key]) {
                element.alt = t[key];
            }
        });

        // Update screenshot images based on language
        this.updateScreenshots();

        // Update links that need special handling
        this.updateSpecialLinks(t);
    }

    updateScreenshots() {
        // Map language codes to folder names
        const languageFolderMap = {
            'en': 'English',
            'es': 'Spanish', 
            'ja': 'Japanese',
            'de': 'German',
            'fr': 'French',
            'pt': 'Portuguese'
        };

        const folderName = languageFolderMap[this.currentLanguage] || 'English';
        
        // Update each screenshot image with smooth transition
        for (let i = 1; i <= 6; i++) {
            const screenshotImg = document.getElementById(`screenshot${i}`);
            if (screenshotImg) {
                const newSrc = `assets/images_for_website/${folderName}/Screen ${i}.png`;
                
                // Only update if the source is different to avoid unnecessary reloads
                if (screenshotImg.src !== newSrc && !screenshotImg.src.endsWith(newSrc)) {
                    // Fade out
                    screenshotImg.style.opacity = '0.5';
                    
                    // Change source after short delay
                    setTimeout(() => {
                        screenshotImg.src = newSrc;
                        
                        // Fade back in once image loads
                        screenshotImg.onload = () => {
                            screenshotImg.style.opacity = '1';
                        };
                    }, 150);
                }
            }
        }
    }

    updateSpecialLinks(t) {
        // Update privacy policy link
        const privacyLink = document.querySelector('[data-translate="privacyPolicyLink"]');
        if (privacyLink && !window.location.pathname.includes('privacy')) {
            privacyLink.href = 'privacy.html';
        }

        // Update contact links in privacy page
        const contactText = document.querySelector('.contact-info p');
        if (contactText && window.location.pathname.includes('privacy')) {
            contactText.innerHTML = `${t.questionsText} <a href="${t.contactWebsite}">${t.contactWebsite}</a> ${t.contactEmail}`;
        }
    }
}

// Initialize language switcher when script loads
const languageSwitcher = new LanguageSwitcher();