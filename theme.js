const themeStorageKey = 'gacha-bravery-theme';

try {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    document.documentElement.dataset.theme = savedTheme;
  }
} catch (error) {
  console.error('Unable to read the saved color theme.', error);
}

if (!document.documentElement.dataset.theme) {
  document.documentElement.dataset.theme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;

  const updateThemeToggle = theme => {
    const targetTheme = theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${targetTheme} mode`);
    themeToggle.setAttribute('title', `Switch to ${targetTheme} mode`);
    themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
  };

  const currentTheme = () => document.documentElement.dataset.theme
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  updateThemeToggle(currentTheme());
  themeToggle.addEventListener('click', () => {
    const theme = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    updateThemeToggle(theme);

    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      console.error('Unable to save the selected color theme.', error);
    }
  });
});
