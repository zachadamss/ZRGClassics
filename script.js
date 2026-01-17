console.log("Website is running!");

// ================================
// Dark Mode Toggle
// ================================
const themeToggle = document.getElementById('theme-toggle');

// Check for saved user preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateToggleIcon(savedTheme);
}

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateToggleIcon(newTheme);
});

// Update the toggle icon
function updateToggleIcon(theme) {
    themeToggle.textContent = theme === 'dark' ? '🌞' : '🌓';
}

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
    const link = dropdown.querySelector('a');

    link.addEventListener('click', (e) => {
        // Check if we're in mobile view
        if (window.innerWidth <= 768) {
            e.preventDefault();

            // Close other open dropdowns
            dropdowns.forEach(other => {
                if (other !== dropdown && other.classList.contains('open')) {
                    other.classList.remove('open');
                }
            });

            // Toggle current dropdown
            dropdown.classList.toggle('open');
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
    const link = dropdown.querySelector('a');

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

// Close touch-opened dropdowns when clicking elsewhere
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('touch-open');
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
