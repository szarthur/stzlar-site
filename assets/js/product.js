// ---------- Product page: reads ?id= from the URL and renders from PRODUCTS ----------

function announce(message){
  const el = document.getElementById('a11yStatus');
  if (el) el.textContent = message;
}

function getQueryParam(name){
  return new URLSearchParams(window.location.search).get(name);
}

const productId = getQueryParam('id') || (typeof PRODUCTS !== 'undefined' ? PRODUCTS[0].id : null);
const product = typeof getProductById === 'function' ? getProductById(productId) : null;

let selectedSize = null;
let selectedQty = 1;
let addedState = false;

if (product){
  renderProduct(product);
} else {
  document.querySelector('.product-main').innerHTML =
    '<p style="padding:40px 0;">Produto não encontrado. <a href="index.html#produtos" style="color:var(--blue);">Voltar para a loja</a>.</p>';
}

function renderProduct(p){
  document.title = `${p.nome} — STZLAR`;

  document.getElementById('breadcrumbCat').textContent = p.categoria;
  document.getElementById('breadcrumbCat').href = 'index.html#categorias';
  document.getElementById('breadcrumbName').textContent = p.nome;

  document.getElementById('productCat').textContent = p.categoria;
  document.getElementById('productName').textContent = p.nome;
  document.getElementById('productPrice').textContent = formatBRL(p.preco);
  document.getElementById('productDesc').textContent = p.descricao;
  document.getElementById('productDetails').textContent = p.detalhes;

  const tagEl = document.getElementById('productTag');
  if (p.tag){
    tagEl.textContent = p.tag.label;
    tagEl.className = 'prod-tag' + (p.tag.classe ? ' ' + p.tag.classe : '');
    tagEl.style.display = 'block';
  }

  const favBtnEl = document.getElementById('favBtn');
  if (favBtnEl){
    favBtnEl.setAttribute('data-fav-id', p.id);
    if (typeof updateFavoriteButtonsState === 'function') updateFavoriteButtonsState();
  }

  const mainImg = document.getElementById('galleryMainImg');
  const zoomLayer = document.getElementById('galleryZoomLayer');
  mainImg.src = p.imagens[0];
  mainImg.alt = p.nome;
  zoomLayer.style.backgroundImage = `url(${p.imagens[0]})`;

  const thumbsWrap = document.getElementById('galleryThumbs');
  thumbsWrap.innerHTML = '';
  if (p.imagens.length > 1){
    p.imagens.forEach((src, i) => {
      const thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'gallery-thumb' + (i === 0 ? ' active' : '');
      thumb.setAttribute('aria-label', `Ver imagem ${i + 1} de ${p.nome}`);
      thumb.setAttribute('aria-current', i === 0 ? 'true' : 'false');
      thumb.innerHTML = `<img src="${escapeHTML(src)}" alt="" loading="lazy">`;
      thumb.addEventListener('click', () => {
        mainImg.src = src;
        zoomLayer.style.backgroundImage = `url(${src})`;
        thumbsWrap.querySelectorAll('.gallery-thumb').forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-current', 'false');
        });
        thumb.classList.add('active');
        thumb.setAttribute('aria-current', 'true');
      });
      thumbsWrap.appendChild(thumb);
    });
  }

  const sizeOptions = document.getElementById('sizeOptions');
  sizeOptions.innerHTML = '';
  const esgotadoGeral = p.status === 'esgotado';
  p.tamanhos.forEach(s => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = s.tamanho;
    const unavailable = !s.disponivel || esgotadoGeral;
    btn.className = 'size-btn' + (unavailable ? ' unavailable' : '');
    btn.setAttribute('aria-pressed', 'false');
    if (unavailable){
      btn.setAttribute('aria-disabled', 'true');
      btn.setAttribute('aria-label', `Tamanho ${s.tamanho}, indisponível`);
    } else {
      btn.addEventListener('click', () => {
        sizeOptions.querySelectorAll('.size-btn').forEach(b => b.setAttribute('aria-pressed', 'false'));
        sizeOptions.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        btn.setAttribute('aria-pressed', 'true');
        selectedSize = s.tamanho;
        resetAddedState();
        announce(`Tamanho ${s.tamanho} selecionado`);
      });
    }
    sizeOptions.appendChild(btn);
  });

  const tbody = document.getElementById('sizeTableBody');
  tbody.innerHTML = p.medidas.map(m =>
    `<tr><td>${escapeHTML(m.tamanho)}</td><td>${escapeHTML(m.busto)}</td><td>${escapeHTML(m.cintura)}</td><td>${escapeHTML(m.quadril)}</td></tr>`
  ).join('');

  const addBtn = document.getElementById('addBagBtn');
  const stockNote = document.getElementById('stockNote');

  if (esgotadoGeral){
    stockNote.className = 'stock-note status-esgotado';
    stockNote.innerHTML = '<span class="stock-dot"></span> Produto esgotado no momento';
    addBtn.textContent = 'Esgotado';
    addBtn.disabled = true;
    addBtn.classList.add('disabled');
  } else if (p.status === 'poucas'){
    stockNote.className = 'stock-note status-poucas';
    stockNote.innerHTML = '<span class="stock-dot"></span> Poucas unidades disponíveis';
  } else {
    stockNote.className = 'stock-note';
    stockNote.innerHTML = '<span class="stock-dot"></span> Em estoque — envio em até 2 dias úteis';
  }

  const relatedGrid = document.getElementById('relatedGrid');
  relatedGrid.innerHTML = '';
  relatedGrid.innerHTML = getRelatedProducts(p.id, 4).map(renderProductCard).join('');

  if (typeof updateFavoriteButtonsState === 'function') updateFavoriteButtonsState();
}

const qtyStepper = document.getElementById('qtyStepper');
if (qtyStepper){
  const qtyValueEl = qtyStepper.querySelector('.qty-value');
  qtyStepper.querySelector('.qty-minus').addEventListener('click', () => {
    if (selectedQty > 1){ selectedQty -= 1; qtyValueEl.textContent = selectedQty; resetAddedState(); }
  });
  qtyStepper.querySelector('.qty-plus').addEventListener('click', () => {
    selectedQty += 1; qtyValueEl.textContent = selectedQty; resetAddedState();
  });
}

function resetAddedState(){
  if (addedState){
    addedState = false;
    const addBtn = document.getElementById('addBagBtn');
    if (addBtn && !addBtn.disabled){
      addBtn.textContent = 'Adicionar à sacola';
      addBtn.classList.remove('added');
    }
  }
}

const favBtn = document.getElementById('favBtn');

const shareBtn = document.getElementById('shareBtn');
if (shareBtn && product){
  shareBtn.addEventListener('click', () => {
    const mensagem = `✦ Olha que peça linda da STZLAR: *${product.nome}* — ${formatBRL(product.preco)}\n${window.location.href}`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
  });
}

const addBagBtn = document.getElementById('addBagBtn');
if (addBagBtn){
  addBagBtn.addEventListener('click', () => {
    if (addBagBtn.disabled) return;

    if (!selectedSize){
      addBagBtn.textContent = 'Selecione um tamanho';
      announce('Selecione um tamanho antes de adicionar à sacola');
      setTimeout(() => {
        if (!addedState) addBagBtn.textContent = 'Adicionar à sacola';
      }, 1800);
      return;
    }

    addToCart({
      productId: product.id,
      nome: product.nome,
      categoria: product.categoria,
      imagem: product.imagens[0],
      tamanho: selectedSize,
      preco: product.preco,
      quantidade: selectedQty
    });

    addedState = true;
    addBagBtn.textContent = 'Adicionado ✓';
    addBagBtn.classList.add('added');
    announce(`${product.nome}, tamanho ${selectedSize}, adicionado à sacola`);

    const cartIcon = document.querySelector('.cart-icon-wrap');
    if (cartIcon){
      cartIcon.classList.remove('bump');
      void cartIcon.offsetWidth; // restart animation on repeated clicks
      cartIcon.classList.add('bump');
    }
  });
}

document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

document.querySelectorAll('[data-open-sizes]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelector('[data-accordion="medidas"] .accordion-trigger').click();
    document.querySelector('[data-accordion="medidas"]').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
});
