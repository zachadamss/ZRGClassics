console.log("Website is running!");

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
