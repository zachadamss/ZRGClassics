console.log("Website is running!");

//Darkmode toggle
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