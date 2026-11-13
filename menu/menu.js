(() => {
  const arrival = document.querySelector('.arrival');
  const cover = document.querySelector('.cover');
  const paper = document.querySelector('.menu-paper');
  const controls = document.querySelector('.reveal-controls');
  const reveal = document.querySelector('.reveal');
  const afterword = document.querySelector('.afterword');
  const close = document.querySelector('.close');
  const title = document.querySelector('#menu-title');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finishTimer;

  paper.hidden = true;
  arrival.hidden = false;
  cover.hidden = false;
  controls.hidden = false;
  document.body.classList.add('is-ready');

  function finishOpening() {
    document.body.classList.remove('is-opening');
    cover.hidden = true;
  }

  function openMenu() {
    if (!paper.hidden) return;
    clearTimeout(finishTimer);
    const coverTop = cover.getBoundingClientRect().top + window.scrollY;
    paper.hidden = false;
    arrival.hidden = true;
    controls.hidden = true;
    afterword.hidden = false;
    reveal.setAttribute('aria-expanded', 'true');
    document.body.classList.add('is-open', 'is-opening');
    const paperTop = document.querySelector('.folio').getBoundingClientRect().top + window.scrollY;
    document.querySelector('.folio').style.setProperty('--cover-offset', `${Math.max(0, coverTop - paperTop)}px`);
    window.scrollTo({ top: 0, behavior: 'instant' });
    title.focus({ preventScroll: true });
    if (reducedMotion.matches) finishOpening();
    else finishTimer = setTimeout(finishOpening, 1700);
  }

  reveal.addEventListener('click', openMenu);

  document.addEventListener('click', (event) => {
    if (event.target instanceof Element && !event.target.closest('a, button')) {
      openMenu();
    }
  });

  close.addEventListener('click', () => {
    clearTimeout(finishTimer);
    cover.hidden = false;
    paper.hidden = true;
    arrival.hidden = false;
    controls.hidden = false;
    afterword.hidden = true;
    document.body.classList.remove('is-open', 'is-opening');
    reveal.setAttribute('aria-expanded', 'false');
    window.scrollTo({ top: 0, behavior: 'instant' });
    reveal.focus({ preventScroll: true });
  });
})();
