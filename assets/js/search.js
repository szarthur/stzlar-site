// ---------- Site search (client-side, over the PRODUCTS catalog) ----------

const searchOverlay = document.getElementById('searchOverlay');
const searchOpenBtn = document.getElementById('searchOpenBtn');
const searchCloseBtn = document.getElementById('searchCloseBtn');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

function openSearch(){
  if (!searchOverlay) return;
  searchOverlay.classList.add('is-open');
  setTimeout(() => searchInput && searchInput.focus(), 350);
}

function closeSearch(){
  if (!searchOverlay) return;
  searchOverlay.classList.remove('is-open');
  if (searchInput) searchInput.value = '';
  renderSearchResults('');
}

if (searchOpenBtn) searchOpenBtn.addEventListener('click', openSearch);
if (searchCloseBtn) searchCloseBtn.addEventListener('click', closeSearch);
if (searchOverlay){
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) closeSearch();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && searchOverlay && searchOverlay.classList.contains('is-open')) closeSearch();
});

function renderSearchResults(query){
  if (!searchResults) return;
  const term = query.trim().toLowerCase();

  if (term.length === 0){
    searchResults.innerHTML = '<p class="search-hint">Digite para buscar peças no catálogo.</p>';
    return;
  }

  if (typeof PRODUCTS === 'undefined'){
    searchResults.innerHTML = '<p class="search-empty">Busca indisponível nesta página.</p>';
    return;
  }

  const matches = PRODUCTS.filter(p =>
    p.nome.toLowerCase().includes(term) ||
    p.categoria.toLowerCase().includes(term) ||
    (p.descricao && p.descricao.toLowerCase().includes(term))
  );

  if (matches.length === 0){
    searchResults.innerHTML = `<p class="search-empty">Nenhuma peça encontrada para "${escapeHTML(query)}".</p>`;
    return;
  }

  searchResults.innerHTML = matches.map(p => `
    <a class="search-result-item" href="produto.html?id=${escapeHTML(p.id)}">
      <img src="${escapeHTML(p.imagens[0])}" alt="${escapeHTML(p.nome)}">
      <div class="search-result-info">
        <span class="cat">${escapeHTML(p.categoria)}</span>
        <h4>${escapeHTML(p.nome)}</h4>
        <span class="price">${formatBRL(p.preco)}</span>
      </div>
    </a>
  `).join('');
}

if (searchInput){
  searchInput.addEventListener('input', (e) => renderSearchResults(e.target.value));
}
