(() => {
  'use strict';
  const tabs = [...document.querySelectorAll('[data-game]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  if (!tabs.length || tabs.length !== panels.length) return;
  const tabList = document.querySelector('.game-tabs');
  tabList.setAttribute('role', 'tablist');
  tabs.forEach((tab) => {
    const id = tab.dataset.game;
    tab.id = `tab-${id}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', `game-${id}`);
    const panel = panels.find((item) => item.dataset.panel === id);
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
  });
  function select(id, focus = false) {
    const selected = tabs.find((tab) => tab.dataset.game === id);
    if (!selected) return;
    tabs.forEach((tab) => {
      const active = tab === selected;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== id; });
    if (focus) selected.focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      select(tab.dataset.game);
    });
    tab.addEventListener('keydown', (event) => {
      let next;
      // The tab list is RTL: the next item is visually to the left.
      if (event.key === 'ArrowLeft') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowRight') next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next].dataset.game, true);
    });
  });
  function fromHash() {
    const candidate = location.hash.replace('#game-', '');
    if (tabs.some((tab) => tab.dataset.game === candidate)) select(candidate);
  }
  document.documentElement.classList.add('js-enabled');
  select('holdem');
  fromHash();
  window.addEventListener('hashchange', fromHash);
})();
