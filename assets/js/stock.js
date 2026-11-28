// ---------- STZLAR: loja ligada à planilha do Google (Apps Script) ----------
// Carrega em TODAS as páginas, depois de config.js (e de products-data.js, quando a página tem produtos).
// Fluxo:
//  1. aplica o último conteúdo guardado no navegador (se houver) NA HORA, antes da página desenhar;
//  2. se o guardado tem mais de 2 min, busca o novo em segundo plano;
//  3. se algo mudou, avisa as páginas (evento "stzlar:stock") para se redesenharem.
// Planilha controla: estoque, preço, etiqueta, novo?, visível, destaque, peças novas
// (nome, categoria, descrição, fotos, medidas) e configurações (promo, frete, WhatsApp, horário, modo).
// Se STOCK_URL estiver vazio, ou a planilha estiver fora do ar, o site segue com o que está no código.
(function(){
  var URL_PLANILHA = (typeof STOCK_URL === 'string') ? STOCK_URL.trim() : '';
  if (!URL_PLANILHA) return;

  var KEY = 'stzlar_stock_v2';
  var TTL = 2 * 60 * 1000;
  var ORDEM_TAMANHOS = ['P', 'M', 'G', 'GG', 'Tamanho único'];
  var CATEGORIAS = ['Vestidos', 'Conjuntos', 'Casual'];
  var CLASSES_ETIQUETA = { 'mais vendido': 'tag-bestseller', 'promocao': 'tag-promo', 'ultimas pecas': 'tag-last' };
  var FOTO_OK = /^[\w\-.]+\.(webp|jpe?g|png)$/i;
  var PASTA_FOTOS = 'assets/images/product/';

  var temProdutos = (typeof PRODUCTS !== 'undefined');
  var BASE = {};      // cópia fiel do products-data.js, para poder "desfazer" o que a planilha mudou
  var TODOS = [];     // todas as peças (inclui escondidas e as criadas pela planilha)
  var NOVOS = {};     // peças criadas pela planilha (mantém o mesmo objeto entre atualizações)
  if (temProdutos){
    PRODUCTS.forEach(function(p){ BASE[p.id] = JSON.parse(JSON.stringify(p)); });
    TODOS = PRODUCTS.slice();
  }

  function semAcento(s){
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  }
  function normStatus(s){
    s = semAcento(s);
    if (s.indexOf('esgot') === 0) return 'esgotado';
    if (s.indexOf('pouca') === 0) return 'poucas';
    return 'disponivel';
  }
  function texto(v){ return (typeof v === 'string') ? v.trim() : ''; }

  // ---------- Produtos ----------
  function aplicarItem(p, it){
    var nome = texto(it.nome), desc = texto(it.descricao), det = texto(it.detalhes), cat = texto(it.categoria);
    if (nome) p.nome = nome.slice(0, 120);
    if (desc) p.descricao = desc.slice(0, 1500);
    if (det) p.detalhes = det.slice(0, 1500);
    if (CATEGORIAS.indexOf(cat) >= 0) p.categoria = cat;

    if (Array.isArray(it.fotos)){
      var fotos = it.fotos.filter(function(f){ return FOTO_OK.test(f); }).map(function(f){ return PASTA_FOTOS + f; });
      if (fotos.length) p.imagens = fotos;
    }

    // Tamanhos: número na planilha (inclusive 0) = tamanho oferecido.
    var nomes = [];
    if (it.tamanhos && typeof it.tamanhos === 'object'){
      nomes = ORDEM_TAMANHOS.filter(function(t){ return typeof it.tamanhos[t] === 'number' && isFinite(it.tamanhos[t]); });
    }
    if (nomes.length){
      p.tamanhos = nomes.map(function(t){
        var q = Math.max(0, Math.floor(it.tamanhos[t]));
        return { tamanho: t, estoque: q, disponivel: q > 0 };
      });
      p.medidas = (p.medidas || []).filter(function(m){ return nomes.indexOf(m.tamanho) >= 0; });
    }
    if (Array.isArray(it.medidas)){
      it.medidas.forEach(function(m){
        if (!m || !m.tamanho || !m.busto || !m.cintura || !m.quadril) return;
        if (nomes.length && nomes.indexOf(m.tamanho) < 0) return;
        p.medidas = (p.medidas || []).filter(function(x){ return x.tamanho !== m.tamanho; });
        p.medidas.push({ tamanho: m.tamanho, busto: m.busto, cintura: m.cintura, quadril: m.quadril });
      });
    }

    if (it.status) p.status = normStatus(it.status);
    if (typeof it.preco === 'number' && isFinite(it.preco) && it.preco > 0) p.preco = it.preco;
    if (typeof it.novo === 'boolean') p.novo = it.novo;
    if (typeof it.etiqueta === 'string'){
      var label = it.etiqueta.trim().slice(0, 30);
      p.tag = label ? { label: label, classe: CLASSES_ETIQUETA[semAcento(label)] || '' } : null;
    }
    if (typeof it.visivel === 'boolean') p._oculto = !it.visivel;
    if (typeof it.destaque === 'boolean') p.destaque = it.destaque;
  }

  function criarNovo(id, it){
    var preco = (typeof it.preco === 'number' && it.preco > 0) ? it.preco : 0;
    if (!texto(it.nome) || CATEGORIAS.indexOf(texto(it.categoria)) < 0 || !preco) return null;
    if (!it.tamanhos || !ORDEM_TAMANHOS.some(function(t){ return typeof it.tamanhos[t] === 'number'; })) return null;
    if (!Array.isArray(it.fotos) || !it.fotos.some(function(f){ return FOTO_OK.test(f); })) return null;
    if (it.visivel === false) return null;
    var p = NOVOS[id] || (NOVOS[id] = {});
    Object.keys(p).forEach(function(k){ delete p[k]; });
    Object.assign(p, { id: id, novo: false, nome: '', categoria: '', preco: preco, imagens: [], descricao: '', detalhes: '',
      tag: null, status: 'disponivel', tamanhos: [], medidas: [], _planilha: true });
    aplicarItem(p, it);
    return p;
  }

  function aplicarProdutos(itens){
    TODOS = TODOS.filter(function(p){ return !p._planilha; });
    TODOS.forEach(function(p){
      var b = BASE[p.id];
      Object.keys(p).forEach(function(k){ delete p[k]; });
      Object.assign(p, JSON.parse(JSON.stringify(b)));
    });
    TODOS.forEach(function(p){
      var it = itens[p.id];
      if (it && typeof it === 'object') aplicarItem(p, it);
    });
    Object.keys(itens).forEach(function(id){
      if (BASE[id]) return;
      var it = itens[id];
      if (!it || typeof it !== 'object') return;
      var np = criarNovo(id, it);
      if (np) TODOS.push(np);
    });
    // Peças com "Visível = Não" saem de PRODUCTS (catálogo, busca, novidades, home).
    PRODUCTS.length = 0;
    TODOS.forEach(function(p){ if (!p._oculto) PRODUCTS.push(p); });
  }

  // ---------- Configurações ----------
  function brl(n){ return 'R$ ' + Number(n).toFixed(2).replace('.', ','); }

  var sparkleHTML = null;
  function aplicarPromo(frases){
    var tracks = document.querySelectorAll('.promo-marquee-track');
    if (!tracks.length || !frases || !frases.length) return;
    tracks.forEach(function(track){
      if (sparkleHTML === null){
        var sp = track.querySelector('svg.sparkle');
        sparkleHTML = sp ? sp.outerHTML : '';
      }
      var meia = [];
      while (meia.length < 6) frases.forEach(function(f, i){ meia.push({ t: f, spark: i === 0 }); });
      var spans = meia.concat(meia).map(function(x){
        var s = document.createElement('span');
        if (x.spark && sparkleHTML) s.insertAdjacentHTML('beforeend', sparkleHTML);
        s.appendChild(document.createTextNode(x.t));
        return s;
      });
      track.textContent = '';
      spans.forEach(function(s){ track.appendChild(s); });
    });
  }

  function limparAviso(){
    var a = document.querySelector('.site-notice'); if (a) a.remove();
    var p = document.querySelector('.site-pause'); if (p) p.remove();
    document.documentElement.classList.remove('site-paused');
    if (document.body) document.body.removeAttribute('inert');
  }

  function mostrarModo(cfg){
    limparAviso();
    if (!cfg || (cfg.modo !== 'aviso' && cfg.modo !== 'pausa')) return;
    var msg = cfg.mensagem || (cfg.modo === 'pausa' ? 'Estamos em pausa. Voltamos em breve!' : '');
    if (!msg) return;

    if (cfg.modo === 'aviso'){
      try { if (sessionStorage.getItem('stzlar_aviso_fechado') === msg) return; } catch (e) {}
      var bar = document.createElement('div');
      bar.className = 'site-notice';
      bar.setAttribute('role', 'status');
      var span = document.createElement('span'); span.textContent = msg;
      var x = document.createElement('button');
      x.type = 'button'; x.setAttribute('aria-label', 'Fechar aviso'); x.textContent = '×';
      x.addEventListener('click', function(){
        bar.remove();
        try { sessionStorage.setItem('stzlar_aviso_fechado', msg); } catch (e) {}
      });
      bar.appendChild(span); bar.appendChild(x);
      document.body.appendChild(bar);
      return;
    }

    // pausa: tela cheia cobrindo o site inteiro
    var tela = document.createElement('div');
    tela.className = 'site-pause';
    tela.setAttribute('role', 'alertdialog');
    tela.setAttribute('aria-modal', 'true');
    tela.setAttribute('aria-label', 'Loja em pausa');
    var caixa = document.createElement('div'); caixa.className = 'site-pause-box';
    var logo = document.createElement('img');
    logo.src = 'assets/brand/logo-full.png'; logo.alt = 'STZLAR'; logo.className = 'site-pause-logo';
    var h = document.createElement('h1'); h.textContent = 'Loja em pausa';
    var p = document.createElement('p'); p.textContent = msg;
    caixa.appendChild(logo); caixa.appendChild(h); caixa.appendChild(p);
    if (cfg.horario){
      var hr = document.createElement('p'); hr.className = 'site-pause-hours';
      hr.textContent = 'Atendimento: ' + cfg.horario;
      caixa.appendChild(hr);
    }
    tela.appendChild(caixa);
    document.documentElement.appendChild(tela);
    document.documentElement.classList.add('site-paused');
    document.body.setAttribute('inert', '');
  }

  function aplicarConfig(cfg){
    window.SITE_CONFIG = cfg || {};
    if (!cfg) return;
    function pronto(){
      aplicarPromo(cfg.promo);
      document.querySelectorAll('[data-config="horario"]').forEach(function(el){ if (cfg.horario) el.textContent = cfg.horario; });
      document.querySelectorAll('[data-config="frete"]').forEach(function(el){ if (cfg.freteGratis) el.textContent = brl(cfg.freteGratis); });
      mostrarModo(cfg);
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', pronto);
    else pronto();
  }

  function aplicar(dados){
    if (temProdutos && dados.itens) aplicarProdutos(dados.itens);
    aplicarConfig(dados.config || null);
  }

  function ler(){ try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }
  function guardar(obj){ try { localStorage.setItem(KEY, JSON.stringify(obj)); } catch (e) {} }

  var cache = ler();
  var assinaturaAtual = '';
  if (cache && cache.itens){
    aplicar(cache);
    assinaturaAtual = JSON.stringify([cache.itens, cache.config]);
  }
  if (cache && cache.t && (Date.now() - cache.t) < TTL) return;

  var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
  var timer = ctrl ? setTimeout(function(){ ctrl.abort(); }, 8000) : null;

  fetch(URL_PLANILHA, ctrl ? { signal: ctrl.signal } : {})
    .then(function(r){ return r.ok ? r.json() : Promise.reject(); })
    .then(function(data){
      if (!data || data.ok !== true || !data.itens) return;
      guardar({ t: Date.now(), itens: data.itens, config: data.config || null });
      var nova = JSON.stringify([data.itens, data.config || null]);
      if (nova !== assinaturaAtual){
        assinaturaAtual = nova;
        aplicar(data);
        window.dispatchEvent(new Event('stzlar:stock'));
      }
    })
    .catch(function(){ /* sem internet / planilha fora do ar: segue com o que já tem */ })
    .then(function(){ if (timer) clearTimeout(timer); });
})();
