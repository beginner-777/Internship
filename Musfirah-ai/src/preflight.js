try {
  localStorage.removeItem('musfirah-os-theme');
  sessionStorage.removeItem('musfirah-os-booted');
} catch {
  // Storage may be blocked in privacy-restricted browsers.
}

document.documentElement.style.colorScheme = 'dark';

