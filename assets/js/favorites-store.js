// ---------- STZLAR favorites store (localStorage) ----------
// Same pattern as cart-store.js — lives in the browser until there's a backend.

const FAVORITES_KEY = "stzlar_favorites";

function getFavorites(){
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveFavorites(list){
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
  updateFavoritesBadge();
  updateFavoriteButtonsState();
}

function isFavorite(productId){
  return getFavorites().includes(productId);
}

function toggleFavorite(productId){
  let list = getFavorites();
  if (list.includes(productId)){
    list = list.filter(id => id !== productId);
  } else {
    list.push(productId);
  }
  saveFavorites(list);
  return list.includes(productId);
}

function getFavoritesCount(){
  return getFavorites().length;
}

function updateFavoritesBadge(){
  const count = getFavoritesCount();
  document.querySelectorAll(".fav-badge").forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? "flex" : "none";
  });
}

// Keeps every heart icon on the page (product cards, product page) in sync
// with the stored list — matters when the same product appears more than once.
function updateFavoriteButtonsState(){
  document.querySelectorAll("[data-fav-id]").forEach(btn => {
    const id = btn.getAttribute("data-fav-id");
    btn.classList.toggle("active", isFavorite(id));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateFavoritesBadge();
  updateFavoriteButtonsState();
});
