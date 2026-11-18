// ---------- Novidades page: shows products flagged as novo === true ----------

function renderNewPage(){
  const grid = document.getElementById('newGrid');
  const emptyState = document.getElementById('newEmpty');
  const countEl = document.getElementById('newCount');

  const items = getNewProducts();

  if (items.length === 0){
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    countEl.textContent = '';
    return;
  }

  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  countEl.textContent = `${items.length} peça${items.length > 1 ? 's' : ''} nova${items.length > 1 ? 's' : ''}`;
  grid.innerHTML = items.map(renderProductCard).join('');

  if (typeof updateFavoriteButtonsState === 'function') updateFavoriteButtonsState();
}

renderNewPage();
