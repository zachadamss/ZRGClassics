// ================================
// Dark Mode Toggle
// ================================
const themeToggle = document.getElementById('theme-toggle');

// Check for saved user preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// ================================
// Mobile Navigation
// ================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const nav = document.querySelector('nav');
let navBackdrop = null;

// Create backdrop element
function createBackdrop() {
    if (!navBackdrop) {
        navBackdrop = document.createElement('div');
        navBackdrop.className = 'nav-backdrop';
        document.body.appendChild(navBackdrop);

        // Close nav when backdrop is clicked
        navBackdrop.addEventListener('click', closeMobileNav);
    }
}

// Open mobile nav
function openMobileNav() {
    createBackdrop();
    nav.classList.add('active');
    navBackdrop.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent body scroll
}

// Close mobile nav
function closeMobileNav() {
    nav.classList.remove('active');
    if (navBackdrop) {
        navBackdrop.classList.remove('active');
    }
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Restore body scroll

    // Close all open dropdowns
    document.querySelectorAll('.dropdown.open').forEach(dropdown => {
        dropdown.classList.remove('open');
    });

    // Close all open nested submenus
    document.querySelectorAll('.has-submenu.open').forEach(submenu => {
        submenu.classList.remove('open');
    });
}

// Toggle mobile nav
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            closeMobileNav();
        } else {
            openMobileNav();
        }
    });
}

// Close nav on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
        closeMobileNav();
    }
});

// Close nav when window resizes to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav.classList.contains('active')) {
        closeMobileNav();
    }
});

// ================================
// Mobile Dropdown Handling
// ================================
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector(':scope > a');

    link.addEventListener('click', (e) => {
        // Check if we're in mobile view
        if (window.innerWidth <= 768) {
            e.preventDefault();

            // Close other open dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown && other.classList.contains('open')) {
                    other.classList.remove('open');
                    // Also close nested submenus in other dropdowns
                    other.querySelectorAll('.has-submenu.open').forEach(sub => {
                        sub.classList.remove('open');
                    });
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('open');
        }
    });
});

// ================================
// Nested Dropdown (Submenu) Handling - Mobile
// ================================
const nestedDropdowns = document.querySelectorAll('.dropdown-item.has-submenu');

nestedDropdowns.forEach(nestedDropdown => {
    const link = nestedDropdown.querySelector(':scope > a');

    link.addEventListener('click', (e) => {
        // Only for mobile view
        if (window.innerWidth <= 768) {
            e.preventDefault();
            e.stopPropagation();

            // Accordion behavior: close sibling submenus
            const siblings = nestedDropdown.parentElement.querySelectorAll('.has-submenu.open');
            siblings.forEach(sibling => {
                if (sibling !== nestedDropdown) {
                    sibling.classList.remove('open');
                }
            });

            // Toggle current submenu
            nestedDropdown.classList.toggle('open');
        }
    });
});

// ================================
// Touch-friendly Dropdowns (Desktop)
// ================================
// For desktop touch devices (tablets in landscape, etc.)
let touchDevice = false;

document.addEventListener('touchstart', () => {
    touchDevice = true;
}, { once: true });

dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector(':scope > a');

    link.addEventListener('touchend', (e) => {
        // Only for desktop-width touch devices
        if (window.innerWidth > 768 && touchDevice) {
            e.preventDefault();

            // Close other touch-opened dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown) {
                    other.classList.remove('touch-open');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('touch-open');
        }
    });
});

// Touch handling for nested dropdowns on desktop
nestedDropdowns.forEach(nestedDropdown => {
    const link = nestedDropdown.querySelector(':scope > a');

    link.addEventListener('touchend', (e) => {
        // Only for desktop-width touch devices
        if (window.innerWidth > 768 && touchDevice) {
            e.preventDefault();
            e.stopPropagation();

            // Close other touch-opened nested dropdowns
            nestedDropdowns.forEach(other => {
                if (other !== nestedDropdown) {
                    other.classList.remove('touch-open');
                }
            });

            // Toggle current nested dropdown
            nestedDropdown.classList.toggle('touch-open');
        }
    });
});

// Close touch-opened dropdowns when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('touch-open');
        });
        nestedDropdowns.forEach(nestedDropdown => {
            nestedDropdown.classList.remove('touch-open');
        });
    }
});

// ================================
// Invoice Table Mobile Labels
// ================================
function applyMobileLabels() {
    // Parts table labels
    const partsTable = document.getElementById('parts-table');
    if (partsTable) {
        const partsRows = partsTable.querySelectorAll('tbody tr');
        partsRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                cells[0].setAttribute('data-label', 'Part Name');
                cells[1].setAttribute('data-label', 'Qty');
                cells[2].setAttribute('data-label', 'Unit Price');
                cells[3].setAttribute('data-label', 'Total');
                // cells[4] is the remove button, no label needed
            }
        });
    }

    // Labor table labels
    const laborTable = document.getElementById('labor-table');
    if (laborTable) {
        const laborRows = laborTable.querySelectorAll('tbody tr');
        laborRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length >= 5) {
                cells[0].setAttribute('data-label', 'Description');
                cells[1].setAttribute('data-label', 'Hours');
                cells[2].setAttribute('data-label', 'Rate');
                cells[3].setAttribute('data-label', 'Total');
                // cells[4] is the remove button, no label needed
            }
        });
    }
}

// Apply labels on page load if invoice tables exist
document.addEventListener('DOMContentLoaded', () => {
    applyMobileLabels();
});

// Export for use by invoice.js
window.applyMobileLabels = applyMobileLabels;

// ================================
// Expandable Guide Cards
// ================================
document.addEventListener('DOMContentLoaded', () => {
    const expandableHeaders = document.querySelectorAll('.guide-card-header.clickable');

    expandableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.guide-card');
            const details = card.querySelector('.guide-details');
            const isExpanded = header.getAttribute('aria-expanded') === 'true';

            // Toggle expanded state
            header.setAttribute('aria-expanded', !isExpanded);
            card.classList.toggle('expanded');

            // Toggle details visibility
            if (details) {
                details.hidden = isExpanded;
            }
        });

        // Keyboard accessibility
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
});

// ================================
// Sticky Header — Shadow on Scroll
// ================================
// Adds a deeper shadow when the user scrolls down, giving the sticky
// header a more grounded feel. Removed when scrolled back to top.
(function() {
    const header = document.querySelector('header');
    if (!header) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                header.classList.toggle('scrolled', window.scrollY > 10);
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// ================================
// Scroll-Triggered Animations
// ================================
// Uses IntersectionObserver to add .is-visible to elements with
// .animate-on-scroll when they enter the viewport. Each element
// animates once and is then unobserved to save resources.
// Respects prefers-reduced-motion — skips all animations if set.
(function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const targets = document.querySelectorAll('.animate-on-scroll');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Animate once only
            }
        });
    }, {
        threshold: 0.15,     // Trigger when 15% of element is visible
        rootMargin: '0px 0px -40px 0px'  // Slight offset so animation feels natural
    });

    targets.forEach(el => observer.observe(el));
})();

// ================================
// Stats Counter Animation
// ================================
// Animates stat numbers from 0 to their final value when the stats
// bar scrolls into view. Uses requestAnimationFrame for smooth 60fps
// counting. Only runs once per page load.
(function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const statsBar = document.querySelector('.stats-bar');
    if (!statsBar) return;

    const statNumbers = statsBar.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    // Parse the final values and store them before zeroing out
    const targets = [];
    statNumbers.forEach(el => {
        const text = el.textContent.trim();
        const num = parseInt(text.replace(/[^0-9]/g, ''), 10);
        const suffix = text.replace(/[0-9]/g, ''); // Preserve '+' or other suffixes
        if (!isNaN(num)) {
            targets.push({ el, num, suffix });
            el.textContent = '0' + suffix; // Start at zero
        }
    });

    let animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        const duration = 1200; // ms — total count-up duration
        const startTime = performance.now();

        function tick(now) {
            const elapsed = now - startTime;
            // Ease-out curve: fast start, gentle finish
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            targets.forEach(({ el, num, suffix }) => {
                el.textContent = Math.round(eased * num) + suffix;
            });

            if (progress < 1) {
                requestAnimationFrame(tick);
            }
        }

        requestAnimationFrame(tick);
    }

    // Observe the stats bar and trigger counting when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsBar);
})();

// ================================
// Quick Links — Sticky Positioning & Active Highlighting
// ================================
// Dynamically measures the header height so the quick-links bar sits
// directly beneath it without overlap. Also uses IntersectionObserver
// to highlight the active section link and add a .stuck shadow.
// Gracefully no-ops on non-vehicle pages where quick-links is absent.
(function() {
    const quickLinksNav = document.querySelector('nav.quick-links');
    if (!quickLinksNav) return;

    const header = document.querySelector('header');

    // --- Sticky positioning: measure header and set top dynamically ---
    function syncStickyOffsets() {
        const headerHeight = header ? header.offsetHeight : 0;
        quickLinksNav.style.top = headerHeight + 'px';
    }

    // Sync on load and on resize (header height can change at breakpoints)
    syncStickyOffsets();
    window.addEventListener('resize', syncStickyOffsets);

    // --- Stuck shadow via sentinel ---
    const sentinel = document.createElement('div');
    sentinel.style.height = '1px';
    sentinel.style.width = '100%';
    sentinel.style.pointerEvents = 'none';
    sentinel.setAttribute('aria-hidden', 'true');
    quickLinksNav.parentNode.insertBefore(sentinel, quickLinksNav);

    const stuckObserver = new IntersectionObserver(([entry]) => {
        quickLinksNav.classList.toggle('stuck', !entry.isIntersecting);
    }, {
        rootMargin: '-' + (header ? header.offsetHeight : 0) + 'px 0px 0px 0px',
        threshold: 0
    });
    stuckObserver.observe(sentinel);

    // --- Active section highlighting ---
    const links = quickLinksNav.querySelectorAll('a[href^="#"]');
    if (!links.length) return;

    const linkMap = {};
    links.forEach(link => {
        const id = link.getAttribute('href').slice(1);
        linkMap[id] = link;
    });

    const sections = [];
    Object.keys(linkMap).forEach(id => {
        const section = document.getElementById(id);
        if (section) sections.push(section);
    });
    if (!sections.length) return;

    let currentActive = null;

    function setActive(id) {
        if (currentActive === id) return;
        if (currentActive && linkMap[currentActive]) {
            linkMap[currentActive].classList.remove('active');
        }
        if (id && linkMap[id]) {
            linkMap[id].classList.add('active');
        }
        currentActive = id;
    }

    const visibleSections = new Map();

    // rootMargin top offset accounts for header + quick-links combined height
    const combinedHeight = (header ? header.offsetHeight : 0) + quickLinksNav.offsetHeight;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                visibleSections.set(entry.target.id, true);
            } else {
                visibleSections.delete(entry.target.id);
            }
        });

        if (visibleSections.size === 0) return;

        // Activate the topmost visible section (document order)
        for (const section of sections) {
            if (visibleSections.has(section.id)) {
                setActive(section.id);
                return;
            }
        }
    }, {
        rootMargin: '-' + combinedHeight + 'px 0px -40% 0px',
        threshold: 0
    });

    sections.forEach(section => sectionObserver.observe(section));
})();
