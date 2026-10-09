const sidebarToggle = document.querySelector('.sidebar-toggle');
const gameSidebar = document.querySelector('.game-sidebar');

sidebarToggle?.addEventListener('click', () => {
  const isOpen = document.body.classList.toggle('sidebar-open');
  sidebarToggle.setAttribute('aria-expanded', String(isOpen));
  sidebarToggle.setAttribute('aria-label', isOpen ? 'Close game menu' : 'Open game menu');
  gameSidebar?.setAttribute('aria-hidden', String(!isOpen));
  if (gameSidebar) gameSidebar.inert = !isOpen;
});
