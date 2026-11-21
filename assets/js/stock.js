// ---------- STZLAR: estoque ligado à planilha (Google Apps Script) ----------
// Carrega logo depois de products-data.js. Fluxo:
//  1. aplica o último estoque guardado no navegador (se houver) NA HORA, antes da página desenhar;
//  2. se o guardado tem mais de 2 min, busca o estoque novo em segundo plano;
//  3. se algo mudou, avisa as páginas (evento "stzlar:stock") para se redesenharem.
// Se STOCK_URL estiver vazio, ou a planilha estiver fora do ar, o site segue com o products-data.js.
(function(){
  if (typeof PRODUCTS === 'undefined') return;
  var URL_ESTOQUE = (typeof STOCK_URL === 'string') ? STOCK_URL.trim() : '';
  if (!URL_ESTOQUE) return;

  var KEY = 'stzlar_stock_v1';
  var TTL = 2 * 60 * 1000;

  function normStatus(s){
    s = String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (s.indexOf('esgot') === 0) return 'esgotado';
    if (s.indexOf('pouca') === 0) return 'poucas';
    return 'disponivel';
  }

  function aplicar(itens){
    var assinatura = [];
    PRODUCTS.forEach(function(p){
      var it = itens[p.id];
      if (!it || typeof it !== 'object' || !it.tamanhos) return;
      p.tamanhos.forEach(function(s){
        var q = it.tamanhos[s.tamanho];
        if (typeof q === 'number' && isFinite(q)){
          s.estoque = Math.max(0, Math.floor(q));
          s.disponivel = s.estoque > 0;
        }
      });
      p.status = normStatus(it.status);
      assinatura.push(p.id + ':' + p.status + ':' + p.tamanhos.map(function(s){ return s.estoque; }).join(','));
    });
    return assinatura.join('|');
  }

  function ler(){
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function guardar(obj){
    try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {}
  }

  var cache = ler();
  var assinaturaAtual = '';
  if (cache && cache.itens) assinaturaAtual = aplicar(cache.itens);

  if (cache && cache.t && (Date.now() - cache.t) < TTL) return;

  var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function(){ ctrl.abort(); }, 8000) : null;

  fetch(URL_ESTOQUE, ctrl ? { signal: ctrl.signal } : {})
    .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
    .then(function(data){
      if (!data || data.ok !== true || !data.itens) return;
      guardar({ t: Date.now(), itens: data.itens });
      var nova = aplicar(data.itens);
      if (nova !== assinaturaAtual){
        assinaturaAtual = nova;
        window.dispatchEvent(new Event('stzlar:stock'));
      }
    })
    .catch(function(){ /* sem internet / planilha fora do ar: segue com o que já tem */ })
    .then(function(){ if (timer) clearTimeout(timer); });
})();
