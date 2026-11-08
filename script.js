(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const loader = document.querySelector('.site-loader');
  let introTimeline;
  let loaderClosed = false;
  const wasLoading = root.classList.contains('is-loading');
  function closeLoader() {
    if (loaderClosed) return;
    loaderClosed = true;
    clearTimeout(window.arLivreLoaderGuard);
    root.classList.remove('is-loading');
    loader.setAttribute('aria-hidden', 'true');
    if (introTimeline) introTimeline.play(0);
  }
  window.arLivreCloseLoader = closeLoader;
  if (wasLoading) {
    const bar = loader.querySelector('.loader-progress');
    requestAnimationFrame(() => { bar.style.setProperty('--loader-progress', '1'); bar.setAttribute('aria-valuenow','100'); });
    const elapsed = performance.now() - (window.arLivreLoaderStart || performance.now());
    setTimeout(closeLoader, Math.max(0, 1150 - elapsed));
  } else { loader.setAttribute('aria-hidden','true'); root.classList.remove('intro-on'); }

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const progress = document.querySelector('.reading-progress span');
  const mobileCta = document.querySelector('.mobile-cta');
  let shellQueued = false;
  function updateShell() {
    const travel = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    header.classList.toggle('is-scrolled', scrollY > 25);
    progress.style.transform = `scaleX(${Math.min(1, scrollY / travel)})`;
    const quote = document.querySelector('#contato'); const footer = document.querySelector('.site-footer'); const nearEnd = quote.getBoundingClientRect().top < innerHeight * .8 || footer.getBoundingClientRect().top < innerHeight; mobileCta.classList.toggle('is-visible', scrollY > hero.offsetHeight * .72 && !nearEnd);
    shellQueued = false;
  }
  addEventListener('scroll', () => {
    if (!shellQueued) { shellQueued = true; requestAnimationFrame(updateShell); }
  }, { passive: true });
  addEventListener('resize', updateShell, { passive: true });
  updateShell();

  const menuButton = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  mobileMenu.inert = true;
  function closeMenu(restoreFocus = false) {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menu');
    mobileMenu.hidden = true;
    mobileMenu.inert = true;
    header.classList.remove('menu-open');
    if (restoreFocus) menuButton.focus();
  }
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.hidden = !open;
    mobileMenu.inert = !open;
    header.classList.toggle('menu-open', open);
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !mobileMenu.hidden) closeMenu(true);
  });
  addEventListener('resize', () => { if (innerWidth > 900 && !mobileMenu.hidden) closeMenu(); }, { passive: true });

  const quoteForm = document.querySelector('#quote-form');
  const quoteLink = document.querySelector('#quote-link');
  function updateQuote() {
    const service = quoteForm.querySelector('input[name="service"]:checked').value;
    const region = quoteForm.querySelector('#quote-region').value.trim();
    const detail = quoteForm.querySelector('#quote-detail').value.trim();
    const lines = [
      'Olá, encontrei a Ar Livre pelo site e gostaria de um orçamento.',
      `Serviço: ${service}.`,
      region ? `Bairro/região: ${region}.` : '',
      detail ? `Detalhes: ${detail}` : ''
    ].filter(Boolean);
    quoteLink.href = `https://wa.me/5511952296823?text=${encodeURIComponent(lines.join('\n'))}`;
    document.querySelector('#quote-preview').textContent = lines.join('\n');
  }
  quoteForm.addEventListener('input', updateQuote);
  quoteForm.addEventListener('change', updateQuote);
  quoteForm.addEventListener('submit', event => { event.preventDefault(); updateQuote(); quoteLink.click(); });
  updateQuote();
  document.querySelectorAll('[data-choose]').forEach(link => link.addEventListener('click', () => {
    const radio = [...quoteForm.querySelectorAll('input[name="service"]')].find(input => input.value === link.dataset.choose);
    if (radio) { radio.checked = true; updateQuote(); }
  }));

  const gsapReady = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  if (gsapReady) {
    gsap.registerPlugin(ScrollTrigger);
    if (root.classList.contains('intro-on') && !reduce.matches) {
      introTimeline = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' }, onComplete: () => root.classList.remove('intro-on') })
        .fromTo('.hero-product-stage', { scale: .96, opacity: .7 }, { scale: 1, opacity: 1, duration: .9 }, 0)
        
        .fromTo('.hero h1', { y: 38, opacity: 0 }, { y: 0, opacity: 1, duration: .85 }, .24)
        .fromTo('.hero-description', { y: 23, opacity: 0 }, { y: 0, opacity: 1, duration: .7 }, .52)
        .fromTo('.hero-actions', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: .66 }, .68)
        .fromTo('.hero-trust', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .58 }, .8);
    }
    const reveal = { rise: { y: 32 }, words: { y: 36 }, line: { clipPath: 'inset(0 0 100% 0)' } };
    document.querySelectorAll('[data-reveal]').forEach(element => {
      const from = reduce.matches ? { opacity: .7 } : { opacity: .25, ...(reveal[element.dataset.reveal] || reveal.rise) };
      gsap.fromTo(element, from, {
        opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: reduce.matches ? .22 : .85, ease: 'power3.out',
        scrollTrigger: { trigger: element, start: 'top 87%', once: true }
      });
    });
    if (!reduce.matches) {
      gsap.fromTo('.statement-art img', { scale: 1.05 }, { scale: 1, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: '.statement', start: 'top 78%', once: true } });
      gsap.fromTo('.services-visual img', { scale: 1.05 }, { scale: 1, duration: 1.1, ease: 'power2.out', scrollTrigger: { trigger: '.services-visual', start: 'top 78%', once: true } });
    }
  }
  if (!gsapReady || reduce.matches) root.classList.remove('intro-on');

  if ('IntersectionObserver' in window) {
    const motionObserver = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-offscreen', !entry.isIntersecting)), { threshold: 0 });
    document.querySelectorAll('.hero, .service-ribbon, .statement, .path').forEach(element => motionObserver.observe(element));
  }

  const reviewViewport = document.querySelector('.reviews-viewport');
  const reviewTrack = document.querySelector('.reviews-track');
  const originalCards = [...reviewTrack.querySelectorAll('.review-card')];
  const pauseButton = document.querySelector('[data-review-pause]');
  const pauseSymbol = pauseButton.querySelector('.pause-symbol');
  const pauseText = pauseButton.querySelector('.pause-text');
  const announcement = document.createElement('span');
  announcement.className = 'sr-only';
  announcement.setAttribute('aria-live', 'polite');
  document.querySelector('.review-controls').appendChild(announcement);
  let paused = reduce.matches;
  let hovered = false;
  let focused = false;
  let visible = false;
  let frame = 0;
  let lastFrame = 0;
  let offset = 0;
  const autoplayAt = performance.now() + 1600;
  let loopWidth = 0;
  let stepWidth = 0;
  let dragging = false;
  let lastX = 0;
  let lastMoveTime = 0;
  let inertia = 0;
  const nudge = { value: 0 };

  if (!reduce.matches) originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.inert = true;
    reviewTrack.appendChild(clone);
  });
  function measureReviews() {
    if (originalCards.length < 2) return;
    const before = loopWidth;
    const gap = parseFloat(getComputedStyle(reviewTrack).gap) || 0;
    stepWidth = originalCards[1].offsetLeft - originalCards[0].offsetLeft;
    loopWidth = originalCards.at(-1).offsetLeft + originalCards.at(-1).offsetWidth + gap - originalCards[0].offsetLeft;
    if (before > 0 && before !== loopWidth) offset *= loopWidth / before;
    renderReviews();
  }
  function renderReviews() {
    if (!loopWidth || reduce.matches) return;
    const position = ((offset + nudge.value) % loopWidth + loopWidth) % loopWidth;
    reviewTrack.style.transform = `translate3d(${-position}px,0,0)`;
  }
  function animationFrame(now) {
    const dt = Math.min(40, now - (lastFrame || now));
    lastFrame = now;
    if (!dragging && !focused) {
      if (!paused && performance.now() > autoplayAt) offset += (hovered ? .013 : .044) * dt;
      if (Math.abs(inertia) > .003) { offset += inertia * dt; inertia *= Math.pow(.9, dt / 16.7); }
      else inertia = 0;
    }
    renderReviews();
    frame = requestAnimationFrame(animationFrame);
  }
  function syncFrame() {
    if (!reduce.matches && visible && !document.hidden) {
      if (!frame) { lastFrame = 0; frame = requestAnimationFrame(animationFrame); }
    } else if (frame) { cancelAnimationFrame(frame); frame = 0; }
  }
  function updatePause() {
    if (reduce.matches) {
      pauseButton.disabled = true;
      pauseButton.setAttribute('aria-label', 'Movimento desativado pela preferência do sistema');
      pauseText.textContent = 'Sem animação';
      return;
    }
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Retomar movimento das avaliações' : 'Pausar movimento das avaliações');
    pauseSymbol.textContent = paused ? '▶' : 'Ⅱ';
    pauseText.textContent = paused ? 'Reproduzir' : 'Pausar';
  }
  function moveReview(direction) {
    const currentPosition = reduce.matches ? reviewViewport.scrollLeft : offset + nudge.value;
    const current = Math.round((((currentPosition % loopWidth) + loopWidth) % loopWidth) / stepWidth);
    const next = (current + direction + originalCards.length) % originalCards.length;
    announcement.textContent = `Avaliação de ${originalCards[next].querySelector('.review-by strong').textContent}`;
    if (reduce.matches) reviewViewport.scrollBy({ left: direction * stepWidth, behavior: 'instant' });
    else if (gsapReady) {
      gsap.killTweensOf(nudge);
      gsap.to(nudge, { value: nudge.value + direction * stepWidth, duration: .65, ease: 'power3.inOut', onUpdate: renderReviews });
    } else { offset += direction * stepWidth; renderReviews(); }
  }
  document.querySelector('[data-review-prev]').addEventListener('click', () => moveReview(-1));
  document.querySelector('[data-review-next]').addEventListener('click', () => moveReview(1));
  pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
  reviewViewport.addEventListener('mouseenter', () => { hovered = true; });
  reviewViewport.addEventListener('mouseleave', () => { hovered = false; });
  reviewViewport.addEventListener('focusin', () => { focused = true; });
  reviewViewport.addEventListener('focusout', () => { focused = false; });
  reviewViewport.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); moveReview(event.key === 'ArrowRight' ? 1 : -1); }
  });
  reviewViewport.addEventListener('pointerdown', event => {
    if (reduce.matches || event.button !== 0 || !loopWidth) return;
    dragging = true; inertia = 0; lastX = event.clientX; lastMoveTime = performance.now();
    reviewViewport.classList.add('is-dragging');
    reviewViewport.setPointerCapture(event.pointerId);
  });
  reviewViewport.addEventListener('pointermove', event => {
    if (!dragging) return;
    const now = performance.now();
    const dx = event.clientX - lastX;
    const dt = Math.max(1, now - lastMoveTime);
    offset -= dx;
    inertia = -dx / dt;
    lastX = event.clientX; lastMoveTime = now;
    renderReviews();
  });
  function endDrag(event) {
    if (!dragging) return;
    dragging = false;
    reviewViewport.classList.remove('is-dragging');
    if (reviewViewport.hasPointerCapture(event.pointerId)) reviewViewport.releasePointerCapture(event.pointerId);
  }
  reviewViewport.addEventListener('pointerup', endDrag);
  reviewViewport.addEventListener('pointercancel', endDrag);
  addEventListener('resize', measureReviews, { passive: true });
  document.addEventListener('visibilitychange', syncFrame);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; syncFrame(); }, { threshold: .08 });
    observer.observe(reviewViewport);
  } else { visible = true; syncFrame(); }
  measureReviews();
  updatePause();
})();

// Movimento guiado pela rolagem, sem alterar a rolagem nativa.
(() => {
  const items = [...document.querySelectorAll('.service-item')];
  const visual = document.querySelector('.services-visual');
  const cards = [...document.querySelectorAll('.path-card')];
  const care = document.querySelector('.care');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  function frame() {
    const center = innerHeight * .48;
    let active = 0, best = Infinity;
    items.forEach((item,i) => { const box=item.getBoundingClientRect(); const d=Math.abs(box.top+box.height/2-center); if(d<best){best=d;active=i} });
    items.forEach((item,i)=>item.classList.toggle('is-active',i===active));
    visual?.style.setProperty('--service-turn', `${(active-1.5)*2.4}deg`);
    if (visual && visual.dataset.active !== String(active)) {
      visual.dataset.active = String(active);
      visual.querySelector('.service-visual-copy').textContent = ['O ambiente vem primeiro.','Instalação planejada.','Cuidado preventivo.','Avaliação técnica.'][active];
      visual.querySelector('figcaption').firstChild.textContent = ['Escolha com orientação. ','Instalação com atenção. ','O cuidado está nos detalhes. ','Entenda a falha. '][active];
    }
    if (!reduce.matches) {
      cards.forEach(card => {const r=card.getBoundingClientRect(); const t=Math.max(-1,Math.min(1,(r.top+r.height/2-center)/innerHeight));card.style.setProperty('--card-turn',`${t*5}deg`)});
      if(care){const r=care.getBoundingClientRect(); const t=Math.max(0,Math.min(1,1-(r.top+r.height*.4)/innerHeight)); care.style.setProperty('--explode',t.toFixed(3))}
    }
  }
  let queued=false;function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{frame();queued=false})}
  addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule,{passive:true});frame();
})();

