(() => {
  const track = document.getElementById('track');
  const slides = [...document.querySelectorAll('.slide')];
  const current = document.getElementById('current');
  const total = document.getElementById('total');
  const progress = document.getElementById('progressBar');
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  const tocBtn = document.getElementById('tocBtn');
  const tocOverlay = document.getElementById('tocOverlay');
  const tocClose = document.getElementById('tocClose');
  const tocList = document.getElementById('tocList');
  const fullBtn = document.getElementById('fullBtn');
  let index = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  total.textContent = String(slides.length).padStart(2,'0');

  slides.forEach((slide, i) => {
    const btn = document.createElement('button');
    btn.className = 'toc-item';
    btn.innerHTML = `<small>${String(i+1).padStart(2,'0')}</small><span>${slide.dataset.title || 'Slide'}</span>`;
    btn.addEventListener('click', () => { go(i); closeToc(); });
    tocList.appendChild(btn);
  });

  function go(n) {
    index = Math.max(0, Math.min(slides.length - 1, n));
    track.style.transform = `translate3d(${-index * 100}%,0,0)`;
    current.textContent = String(index + 1).padStart(2,'0');
    progress.style.width = `${((index + 1) / slides.length) * 100}%`;
    prev.style.opacity = index === 0 ? '.28' : '1';
    next.style.opacity = index === slides.length - 1 ? '.28' : '1';
    [...tocList.children].forEach((el, i) => el.classList.toggle('active', i === index));
    slides.forEach((s, i) => s.classList.toggle('is-current', i === index));
    history.replaceState(null, '', `#${index+1}`);
  }
  function openToc(){ tocOverlay.classList.add('open'); tocOverlay.setAttribute('aria-hidden','false'); }
  function closeToc(){ tocOverlay.classList.remove('open'); tocOverlay.setAttribute('aria-hidden','true'); }

  prev.addEventListener('click', () => go(index - 1));
  next.addEventListener('click', () => go(index + 1));
  tocBtn.addEventListener('click', openToc);
  tocClose.addEventListener('click', closeToc);
  tocOverlay.addEventListener('click', e => { if (e.target === tocOverlay) closeToc(); });

  document.addEventListener('keydown', e => {
    if (['ArrowRight','PageDown',' '].includes(e.key)) { e.preventDefault(); go(index + 1); }
    if (['ArrowLeft','PageUp'].includes(e.key)) { e.preventDefault(); go(index - 1); }
    if (e.key === 'Home') go(0);
    if (e.key === 'End') go(slides.length - 1);
    if (e.key === 'Escape') closeToc();
  });

  document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, {passive:true});
  document.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].screenX - touchStartX;
    const dy = e.changedTouches[0].screenY - touchStartY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  }, {passive:true});

  fullBtn.addEventListener('click', async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch(e) {}
  });

  const hash = Number(location.hash.replace('#',''));
  go(Number.isFinite(hash) && hash >= 1 ? hash - 1 : 0);
})();