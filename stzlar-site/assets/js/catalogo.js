// ---------- Catalog page: pill filters, no reload, URL stays shareable ----------

function getFilteredProducts(cat){
  if (!cat || cat.toLowerCase() === 'todas') return PRODUCTS;
  return getProductsByCategory(cat);
}

function renderCatalog(cat){
  const grid = document.getElementById('categoryGrid');
  const emptyState = document.getElementById('categoryEmpty');
  const countEl = document.getElementById('categoryCount');

  const items = getFilteredProducts(cat);

  document.title = (cat && cat.toLowerCase() !== 'todas')
    ? `${cat} — Catálogo — STZLAR`
    : 'Catálogo — STZLAR';

  if (items.length === 0){
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    countEl.textContent = '';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  countEl.textContent = `${items.length} peça${items.length > 1 ? 's' : ''}`;
  grid.innerHTML = items.map(renderProductCard).join('');

  if (typeof updateFavoriteButtonsState === 'function') updateFavoriteButtonsState();
}

function setActivePill(cat){
  const normalized = (cat || 'todas');
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.cat.toLowerCase() === normalized.toLowerCase());
  });
}

function initCatalog(){
  const params = new URLSearchParams(window.location.search);
  const initialCat = params.get('cat') || 'todas';

  setActivePill(initialCat);
  renderCatalog(initialCat);

  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.dataset.cat;
      setActivePill(cat);
      renderCatalog(cat);

      // Keep the URL shareable/bookmarkable without triggering a reload.
      const url = new URL(window.location);
      if (cat === 'todas'){
        url.searchParams.delete('cat');
      } else {
        url.searchParams.set('cat', cat);
      }
      window.history.replaceState({}, '', url);
    });
  });
}

initCatalog();
