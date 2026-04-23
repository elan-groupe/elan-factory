// ELAN Factory — theme switcher (runs early, before stylesheets complete)
// Reads localStorage, applies data-theme attribute on <html>
// Provides global setTheme() + wires up buttons after DOM ready

(function() {
  var saved = null;
  try { saved = localStorage.getItem('elan-theme'); } catch(e) {}
  var theme = saved || 'noir';
  if (['noir', 'porcelain', 'atelier'].indexOf(theme) === -1) theme = 'noir';
  document.documentElement.setAttribute('data-theme', theme);
  window.ELAN_THEME = theme;
})();

function setTheme(name) {
  if (['noir', 'porcelain', 'atelier'].indexOf(name) === -1) return;
  try { localStorage.setItem('elan-theme', name); } catch(e) {}
  // Reload so charts pick up new CSS-var colors
  window.location.reload();
}

// Wire up switcher buttons after DOM ready
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.theme-switcher button').forEach(function(btn) {
    var name = btn.getAttribute('data-theme-name');
    if (!name) return;
    if (name === window.ELAN_THEME) btn.classList.add('active');
    btn.addEventListener('click', function() { setTheme(name); });
  });
});
