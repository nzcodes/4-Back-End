// Check for saved 'darkMode' in localStorage
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Dark mode toggle
document.body.addEventListener('click', function(event) {
  if (event.target.id === 'moon' || event.target.id === 'sun') {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }
});

// keyboard shortcut 'l'
window.addEventListener('keydown', function(event) {
  if (event.altKey && event.key.toLowerCase() === 'l') {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }
});