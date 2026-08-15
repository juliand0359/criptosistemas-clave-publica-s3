import { setCurrentYear } from './ui.js';
import { createSectionTab, createListItem, createDetailView, createWelcomeView, bindListHandlers } from './components/sectionCard.js';
import { sections as SECTIONS } from './data/sections.js';

async function loadHome() {
  const resp = await fetch('./src/data/home.json');
  if (!resp.ok) throw new Error('No se pudo cargar home.json');
  const data = await resp.json();
  return data.home;
}

async function loadSections() {
  // Sections are now imported as an ES module for easier editing during development.
  return Promise.resolve(SECTIONS || []);
}

function renderSections(sections) {
  const sidebar = document.querySelector('.sidebar');
  const sectionsContainer = document.querySelector('#sections-container');
  if (!sidebar || !sectionsContainer) return;

  const h = document.createElement('h2');
  h.textContent = 'Entradas del blog';
  sidebar.appendChild(h);

  const tabs = document.createElement('ul');
  tabs.className = 'tabs';
  sections.forEach((s, i) => tabs.appendChild(createSectionTab(s, i)));
  sidebar.appendChild(tabs);

  const list = document.createElement('div');
  list.className = 'list';
  sections.forEach((s, i) => list.appendChild(createListItem(s, i)));
  sectionsContainer.appendChild(list);
  // Helper to set active tab by id
  function setActiveTabById(id) {
    const all = tabs.querySelectorAll('.tab');
    all.forEach(t => t.classList.toggle('active', t.dataset.id === id));
  }

  // Attach click handlers for tabs
  tabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if (!tab) return;
    const id = tab.dataset.id;
    const sec = sections.find(s => (s.id || '') === id || sections.indexOf(s).toString() === id);
    if (!sec) return;
    // Replace sectionsContainer content with detail view
    sectionsContainer.innerHTML = '';
    sectionsContainer.appendChild(createDetailView(sec));
    window.location.hash = `#${sec.id}`;
    setActiveTabById(id);
    // header is sticky; no floating scroll button
  });

  // Bind list handlers so clicking on list selects detail and activates tab
  bindListHandlers(sections, list, (sec) => {
    sectionsContainer.innerHTML = '';
    sectionsContainer.appendChild(createDetailView(sec));
    window.location.hash = `#${sec.id}`;
    setActiveTabById(sec.id || sections.indexOf(sec).toString());
    // header is sticky; no floating scroll button
  });

  // Handle back button clicks inside sectionsContainer (delegation)
  sectionsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.back-btn');
    if (!btn) return;
    // dispatch a custom event or call showHome if available globally
    const ev = new CustomEvent('navigate-home', { bubbles: true });
    sectionsContainer.dispatchEvent(ev);
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  setCurrentYear();
  // navigation removed; no menu toggle needed

  try {
    const sections = await loadSections();
    // load home first so we can show it on 'back' actions
    let home = null;
    try { home = await loadHome(); } catch (e) { console.warn('home.json not loaded', e); }

    renderSections(sections);

    const sectionsContainer = document.querySelector('#sections-container');
    function showHome() {
      if (!sectionsContainer) return;
      sectionsContainer.innerHTML = '';
      if (home) sectionsContainer.appendChild(createWelcomeView(home));
      // clear active on tabs
      const tabs = document.querySelectorAll('.tabs .tab');
      tabs.forEach(t => t.classList.remove('active'));
      window.location.hash = '';
      // header remains sticky; no floating button to hide
    }

    // initial show home
    showHome();

    // listen for navigate-home events from detail view
    sectionsContainer.addEventListener('navigate-home', () => showHome());
  } catch (err) {
    console.error(err);
  }
});

