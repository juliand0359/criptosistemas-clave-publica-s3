// Módulo UI: utilidades pequeñas y accesibilidad
export function setCurrentYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = new Date().getFullYear();
}
