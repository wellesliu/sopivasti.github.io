// Load shared header component
async function loadHeader() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('components/header.html');
            const html = await response.text();
            headerPlaceholder.outerHTML = html;
        } catch (e) {
            console.error('Failed to load header:', e);
        }
    }
}

// Initialize app after header loads
async function init() {
    await loadHeader();

    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', currentTheme);

    // Toggle theme
    themeToggle.addEventListener('click', () => {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Mobile menu toggle
    const toggleMobileMenu = () => {
        const isOpen = nav.classList.toggle('open');
        mobileOverlay.classList.toggle('active');
        mobileMenuToggle.setAttribute('aria-expanded', isOpen);
        mobileMenuToggle.textContent = isOpen ? '✕' : '☰';

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking nav links
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });

    // Smooth scrolling for anchor links (handles both #section and index.html#section)
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Extract hash from href (handles both "#section" and "index.html#section")
            const hashIndex = href.indexOf('#');
            if (hashIndex === -1) return;

            const hash = href.substring(hashIndex);
            if (hash === '#') return;

            // Check if this is a same-page link
            const isIndexPage = window.location.pathname.endsWith('index.html') ||
                               window.location.pathname.endsWith('/');
            const isLinkToIndex = href.startsWith('index.html#') || href.startsWith('#');

            if (isIndexPage && isLinkToIndex) {
                e.preventDefault();
                const target = document.querySelector(hash);

                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Update active nav link
                    document.querySelectorAll('nav a').forEach(link => {
                        link.classList.remove('active');
                    });
                    this.classList.add('active');

                    // Update URL hash without jumping
                    history.pushState(null, null, hash);
                }
            }
        });
    });

    // Highlight active section in navigation on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkHash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
            link.classList.remove('active');
            if (linkHash === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // App category filtering
    const filterChips = document.querySelectorAll('.filter-chip');
    const appCards = document.querySelectorAll('.app-card');

    // Update filter chip counts
    filterChips.forEach(chip => {
        const filter = chip.dataset.filter;
        let count;
        if (filter === 'all') {
            count = appCards.length;
        } else if (filter === 'coming-soon') {
            count = document.querySelectorAll('.app-card .coming-soon').length;
        } else {
            count = document.querySelectorAll(`.app-card[data-category="${filter}"]`).length;
        }

        // Append count to existing text (preserving the dot span for category chips)
        const dotSpan = chip.querySelector('.chip-dot');
        const label = filter === 'coming-soon' ? 'Coming Soon' : filter.charAt(0).toUpperCase() + filter.slice(1);
        chip.innerHTML = dotSpan ? `<span class="chip-dot ${filter}"></span>${label} (${count})` : `${label} (${count})`;
    });

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const filter = chip.dataset.filter;

            // Update active chip
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            // Filter cards
            appCards.forEach(card => {
                const isComingSoon = card.querySelector('.coming-soon') !== null;
                const matchesFilter = filter === 'all' ||
                    (filter === 'coming-soon' && isComingSoon) ||
                    (filter !== 'coming-soon' && card.dataset.category === filter);

                if (matchesFilter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

}

// Start the app
document.addEventListener('DOMContentLoaded', init);
