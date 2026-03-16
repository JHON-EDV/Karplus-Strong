// Main application script - handles language toggle and global UI

document.addEventListener('DOMContentLoaded', () => {
    // Apply saved language on page load
    applyLanguage();

    // Wire up language toggle button
    const toggleBtn = document.getElementById('langToggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleLanguage);
    }
});
