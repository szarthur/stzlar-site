// ---------- Cart page: renders from localStorage, builds the WhatsApp order ----------

// TODO: replace with the STZLAR official WhatsApp number before going live.
// Format: country code + area code + number, digits only (e.g. 55 + DDD + number).
const WHATSAPP_NUMBER = "5500000000000";

// Matches the promise in the site-wide promo bar ("frete grátis acima de
// R$350"). Applies to the fixed-price local deliveries (Acarape, Redenção).
// "Entrega em Fortaleza" is intentionally left out — its price is already
// variable ("consultar valor"), so there's no fixed cost to waive.
const FREE_SHIPPING_THRESHOLD = 350;

function updateDeliveryFreeShipping(){
  const subtotal = getCartSubtotal();
  const qualifies = subtotal >= FREE_SHIPPING_THRESHOLD;

  document.querySelectorAll('.delivery-option').forEach(option => {
    const input = option.querySelector('input[name="deliveryMethod"]');
    const em = option.querySelector('.delivery-text em');
    if (!input || !em) return;
    if (input.dataset.cost === '0' || input.dataset.cost === 'consultar') return;

    if (!input.dataset.originalCost){
      input.dataset.originalCost = input.dataset.cost;
    }
    const originalCost = parseFloat(input.dataset.originalCost);

    if (qualifies){
      input.dataset.cost = '0';
      em.textContent = '— Grátis';
    } else {
      input.dataset.cost = input.dataset.originalCost;
      em.textContent = `— ${formatBRL(originalCost)}`;
    }
  });
}

function getSelectedDelivery(){
  const checked = document.querySelector('input[name="deliveryMethod"]:checked');
  if (!checked) return null;
  const cost = checked.dataset.cost === 'consultar' ? null : parseFloat(checked.dataset.cost);
  return { label: checked.value, cost };
}

function updateTotals(){
  updateDeliveryFreeShipping();

  const subtotal = getCartSubtotal();
  document.getElementById('subtotalValue').textContent = formatBRL(subtotal);

  const delivery = getSelectedDelivery();
  const totalEl = document.getElementById('totalValue');
  if (delivery && delivery.cost !== null){
    totalEl.textContent = formatBRL(subtotal + delivery.cost);
  } else {
    // "Entrega em Fortaleza" has no fixed price — total shown is subtotal only,
    // frete fica combinado por WhatsApp.
    totalEl.textContent = formatBRL(subtotal);
  }
}

document.querySelectorAll('input[name="deliveryMethod"]').forEach(radio => {
  radio.addEventListener('change', updateTotals);
});

function renderCart(){
  const cart = getCart();
  const container = document.getElementById('cartItemsContainer');
  const emptyState = document.getElementById('cartEmpty');
  const cartLayout = document.getElementById('cartLayout');

  if (cart.length === 0){
    emptyState.style.display = 'block';
    cartLayout.style.display = 'none';
    return;
  }
  emptyState.style.display = 'none';
  cartLayout.style.display = 'grid';

  container.innerHTML = '';
  cart.forEach((item, index) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-media">
        <img src="${escapeHTML(item.imagem)}" alt="${escapeHTML(item.nome)}" loading="lazy">
      </div>
      <div class="cart-item-info">
        <span class="cat">${escapeHTML(item.categoria || '')}</span>
        <h4>${escapeHTML(item.nome)}</h4>
        <span class="meta">Tamanho ${escapeHTML(item.tamanho)}</span>
        <div class="qty-stepper">
          <button class="qty-minus" type="button" aria-label="Diminuir quantidade">−</button>
          <span class="qty-value">${item.quantidade}</span>
          <button class="qty-plus" type="button" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <div class="cart-item-price">
        <span class="line-total">${formatBRL(item.preco * item.quantidade)}</span>
        <button class="cart-item-remove" type="button" aria-label="Remover item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></svg>
        </button>
      </div>
    `;

    row.querySelector('.qty-minus').addEventListener('click', () => {
      if (item.quantidade > 1){
        updateCartQuantity(index, item.quantidade - 1);
        renderCart();
      }
    });
    row.querySelector('.qty-plus').addEventListener('click', () => {
      updateCartQuantity(index, item.quantidade + 1);
      renderCart();
    });
    row.querySelector('.cart-item-remove').addEventListener('click', () => {
      row.style.transition = 'opacity .25s ease';
      row.style.opacity = '0';
      setTimeout(() => { removeFromCart(index); renderCart(); }, 200);
    });

    container.appendChild(row);
  });

  updateTotals();
}

function buildWhatsAppMessage(){
  const cart = getCart();
  const nome = document.getElementById('nameInput').value.trim();
  const cep = document.getElementById('cepInput').value.trim();
  const observacao = document.getElementById('noteInput').value.trim();

  let mensagem = `🛍️ *NOVO PEDIDO — STZLAR*\n\n`;

  if (nome) mensagem += `Cliente: ${nome}\n`;
  if (cep) mensagem += `CEP: ${cep}\n`;
  if (nome || cep) mensagem += `\n`;

  mensagem += `Olá! Gostaria de finalizar este pedido:\n\n`;

  let total = 0;
  cart.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    mensagem += `*${index + 1}. ${item.nome}*\n`;
    mensagem += `Tamanho: ${item.tamanho}\n`;
    mensagem += `Quantidade: ${item.quantidade}\n`;
    mensagem += `Valor: ${formatBRL(subtotal)}\n\n`;
  });

  mensagem += `───────────────\n`;
  mensagem += `*Subtotal: ${formatBRL(total)}*\n`;

  const delivery = getSelectedDelivery();
  if (delivery){
    if (delivery.cost !== null){
      mensagem += `*${delivery.label}: ${delivery.cost === 0 ? 'Grátis' : formatBRL(delivery.cost)}*\n`;
      mensagem += `*Total: ${formatBRL(total + delivery.cost)}*\n\n`;
    } else {
      mensagem += `*Forma de entrega: ${delivery.label} (valor a consultar)*\n\n`;
    }
  } else {
    mensagem += `\n`;
  }

  if (observacao){
    mensagem += `Observação: ${observacao}\n\n`;
  }

  mensagem += `Gostaria de confirmar a disponibilidade, o frete e finalizar a compra.`;

  return mensagem;
}

const checkoutBtn = document.getElementById('checkoutWhatsBtn');
if (checkoutBtn){
  checkoutBtn.addEventListener('click', () => {
    const messageEl = document.getElementById('checkoutMessage');
    const cart = getCart();

    if (cart.length === 0){
      messageEl.textContent = 'Sua sacola está vazia — adicione uma peça antes de finalizar.';
      messageEl.className = 'checkout-message';
      return;
    }

    const mensagem = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');

    clearCart();
    renderCart();
    messageEl.textContent = 'Pedido enviado! Sua sacola foi esvaziada.';
    messageEl.className = 'checkout-message info';
  });
}

renderCart();
