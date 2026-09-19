  // Header on scroll
  const header = document.getElementById('siteHeader');
  const isStaticHeader = header.dataset.static === 'true';
  const onScroll = () => {
    if (isStaticHeader) { header.classList.add('scrolled'); return; }
    if(window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll);
  onScroll();

  // Mobile menu
  const burgerBtn = document.getElementById('burgerBtn');
  const menuCloseBtn = document.getElementById('menuCloseBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuOverlay = document.getElementById('menuOverlay');

  const openMenu = () => { mobileMenu.classList.add('is-open'); menuOverlay.classList.add('is-open'); };
  const closeMenu = () => { mobileMenu.classList.remove('is-open'); menuOverlay.classList.remove('is-open'); };

  burgerBtn.addEventListener('click', openMenu);
  menuCloseBtn.addEventListener('click', closeMenu);
  menuOverlay.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  // Line-by-line text reveal — splits on existing <br> tags so it respects
  // the line breaks already authored in the markup, wraps each line in a
  // mask so it can slide up from underneath, staggered per line.
  document.querySelectorAll('.reveal-lines').forEach(el => {
    const lines = el.innerHTML.split(/<br\s*\/?>/i);
    el.innerHTML = lines.map((line, i) =>
      `<span class="line-mask"><span class="line-inner" style="--i:${i}">${line}</span></span>`
    ).join('');
  });

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal, .reveal-lines');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el => io.observe(el));

  // Favorite buttons (event delegation — works for cards rendered dynamically too)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-fav-id]');
    if (!btn) return;
    e.preventDefault();
    if (typeof toggleFavorite === 'function'){
      toggleFavorite(btn.getAttribute('data-fav-id'));
    }
  });

  // Homepage featured vitrine — rendered from PRODUCTS instead of hand-written
  // per-card HTML, so a price/tag change only has to happen in one place.
  const featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid && typeof PRODUCTS !== 'undefined' && typeof renderProductCard === 'function'){
    featuredGrid.innerHTML = PRODUCTS.slice(0, 4).map(renderProductCard).join('');
    if (typeof updateFavoriteButtonsState === 'function') updateFavoriteButtonsState();
  }
