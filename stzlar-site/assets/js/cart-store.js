// ---------- STZLAR cart store (localStorage) ----------
// No backend yet — the cart lives in the customer's browser.
// Structure kept intentionally simple so it maps 1:1 to a future
// backend/database table when the site evolves past the WhatsApp MVP.

const CART_KEY = "stzlar_cart";

function getCart(){
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

function addToCart({ productId, nome, categoria, imagem, tamanho, preco, quantidade }){
  const cart = getCart();
  const existing = cart.find(i => i.productId === productId && i.tamanho === tamanho);
  if (existing){
    existing.quantidade += quantidade;
  } else {
    cart.push({ productId, nome, categoria, imagem, tamanho, preco, quantidade });
  }
  saveCart(cart);
}

function removeFromCart(index){
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateCartQuantity(index, quantidade){
  const cart = getCart();
  if (cart[index]){
    cart[index].quantidade = Math.max(1, quantidade);
  }
  saveCart(cart);
}

function clearCart(){
  saveCart([]);
}

function getCartCount(){
  return getCart().reduce((sum, i) => sum + i.quantidade, 0);
}

function getCartSubtotal(){
  return getCart().reduce((sum, i) => sum + (i.preco * i.quantidade), 0);
}

function updateCartBadge(){
  const count = getCartCount();
  document.querySelectorAll(".cart-badge").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

document.addEventListener("DOMContentLoaded", updateCartBadge);
