// ---------- Favorites page: renders PRODUCTS matching the stored favorite ids ----------

function renderFavoritesPage(){
  const grid = document.getElementById('favGrid');
  const emptyState = document.getElementById('favEmpty');
  if (!grid) return;

  const favIds = getFavorites();
  const favProducts = favIds
    .map(id => getProductById(id))
    .filter(Boolean);

  if (favProducts.length === 0){
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';

  grid.innerHTML = favProducts.map(p => `
    <a href="produto.html?id=${escapeHTML(p.id)}" class="prod-card">
      <div class="prod-media">
        <button class="card-fav-btn active" data-fav-id="${escapeHTML(p.id)}" aria-label="Remover dos favoritos">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s-7.5-4.6-10-9.2C.5 8 2 4 6 4c2.2 0 3.8 1.4 6 4 2.2-2.6 3.8-4 6-4 4 0 5.5 4 4 7.8C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        ${p.tag ? `<span class="prod-tag ${escapeHTML(p.tag.classe)}">${escapeHTML(p.tag.label)}</span>` : ''}
        <img src="${escapeHTML(p.imagens[0])}" alt="${escapeHTML(p.nome)}" loading="lazy">
        <span class="prod-view">Ver produto</span>
      </div>
      <div class="prod-info"><span class="cat">${escapeHTML(p.categoria)}</span><h4>${escapeHTML(p.nome)}</h4><span class="price">${formatBRL(p.preco)}</span></div>
    </a>
  `).join('');
}

renderFavoritesPage();

// Re-render whenever a heart is toggled on this page (e.g. removing a favorite
// should make the card disappear immediately, not just lose its filled heart).
document.addEventListener('click', (e) => {
  if (e.target.closest('[data-fav-id]')){
    setTimeout(renderFavoritesPage, 0);
  }
});
