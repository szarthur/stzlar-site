/**
 * STZLAR — API da loja (Google Apps Script)
 *
 * Lê esta planilha e devolve um JSON público e SOMENTE LEITURA com:
 *  - itens: por ID de produto → estoque por tamanho, status, preço, etiqueta, novo?,
 *           visível, destaque, nome, categoria, descrição, detalhes, fotos e medidas
 *  - config: modo da loja, mensagem, frases da promoção, frete grátis, WhatsApp, horário
 * Nada além disso sai daqui (sem custo, sem fornecedor, sem dados de cliente,
 * sem a coluna Observações).
 *
 * Tamanho com número (inclusive 0) = oferecido. Em branco = a peça não tem esse tamanho.
 */
const ABA_ESTOQUE = 'Estoque por tamanho';
const ABA_PRODUTOS = 'Produtos';
const ABA_MEDIDAS = 'Medidas';
const ABA_CONFIG = 'Configurações';
const TAMANHOS = ['P', 'M', 'G', 'GG', 'Tamanho único'];
const CACHE_SEGUNDOS = 60; // evita reler a planilha a cada visita

function doGet() {
  const cache = CacheService.getScriptCache();
  let json = cache.get('loja_json');
  if (!json) {
    json = JSON.stringify(montar_());
    if (json.length < 90000) cache.put('loja_json', json, CACHE_SEGUNDOS); // limite do cache: 100 KB
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function montar_() {
  const itens = {};
  const erro = lerEstoque_(itens);
  if (erro) return { ok: false, erro: erro, itens: {} };
  lerProdutos_(itens);
  lerMedidas_(itens);
  return { ok: true, atualizado: new Date().toISOString(), itens: itens, config: lerConfig_() };
}

function aba_(nome) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nome);
}

function cabecalho_(dados) {
  return dados[0].map(function (h) {
    return String(h).replace(/\(un\.\)/i, '').trim();
  });
}

function simNao_(v) {
  return String(v).trim().toLowerCase().replace('ã', 'a') === 'sim';
}

// ---------- Estoque ----------
function lerEstoque_(itens) {
  const aba = aba_(ABA_ESTOQUE);
  if (!aba) return 'Aba não encontrada: ' + ABA_ESTOQUE;
  const dados = aba.getDataRange().getValues();
  const cab = cabecalho_(dados);
  const colId = cab.indexOf('ID do produto');
  const colStatus = cab.indexOf('Status no site');
  if (colId < 0) return 'Coluna "ID do produto" não encontrada';

  const colunas = {};
  TAMANHOS.forEach(function (t) {
    const i = cab.indexOf(t);
    if (i >= 0) colunas[t] = i;
  });

  for (let r = 1; r < dados.length; r++) {
    const linha = dados[r];
    const id = String(linha[colId] || '').trim();
    if (!id) continue;
    const tamanhos = {};
    Object.keys(colunas).forEach(function (t) {
      const bruto = linha[colunas[t]];
      if (bruto === '' || bruto === null) return;
      const n = Math.floor(Number(bruto));
      if (isFinite(n)) tamanhos[t] = Math.max(0, n);
    });
    itens[id] = { tamanhos: tamanhos, status: colStatus >= 0 ? String(linha[colStatus] || '') : '' };
  }
  return null;
}

// ---------- Produtos ----------
function lerProdutos_(itens) {
  const aba = aba_(ABA_PRODUTOS);
  if (!aba) return;
  const dados = aba.getDataRange().getValues();
  const cab = cabecalho_(dados);
  const c = {
    id: cab.indexOf('ID do produto'),
    nome: cab.indexOf('Nome'),
    categoria: cab.indexOf('Categoria'),
    preco: cab.indexOf('Preço (R$)'),
    novo: cab.indexOf('Novo?'),
    etiqueta: cab.indexOf('Etiqueta'),
    visivel: cab.indexOf('Visível no site'),
    destaque: cab.indexOf('Destaque na home'),
    descricao: cab.indexOf('Descrição'),
    detalhes: cab.indexOf('Detalhes'),
    fotos: cab.indexOf('Fotos (arquivos)')
  };
  if (c.id < 0) return;
  const txt = function (l, i) { return i >= 0 ? String(l[i] === null ? '' : l[i]).trim() : ''; };

  for (let r = 1; r < dados.length; r++) {
    const l = dados[r];
    const id = txt(l, c.id);
    if (!id) continue;
    if (!itens[id]) itens[id] = { tamanhos: {}, status: '' };
    const it = itens[id];

    if (c.preco >= 0) {
      const n = Number(String(l[c.preco]).replace(',', '.'));
      if (isFinite(n) && n > 0) it.preco = n;
    }
    if (c.novo >= 0) it.novo = simNao_(l[c.novo]);
    if (c.etiqueta >= 0) it.etiqueta = txt(l, c.etiqueta);
    if (c.visivel >= 0) it.visivel = txt(l, c.visivel) === '' ? true : simNao_(l[c.visivel]);
    if (c.destaque >= 0) it.destaque = simNao_(l[c.destaque]);

    const nome = txt(l, c.nome), cat = txt(l, c.categoria);
    const desc = txt(l, c.descricao), det = txt(l, c.detalhes);
    if (nome) it.nome = nome;
    if (cat) it.categoria = cat;
    if (desc) it.descricao = desc;
    if (det) it.detalhes = det;
    const fotos = txt(l, c.fotos);
    if (fotos) it.fotos = fotos.split(/[,;\n]+/).map(function (f) { return f.trim(); }).filter(String);
  }
}

// ---------- Medidas (opcional) ----------
function lerMedidas_(itens) {
  const aba = aba_(ABA_MEDIDAS);
  if (!aba) return;
  const dados = aba.getDataRange().getValues();
  const cab = cabecalho_(dados);
  const c = {
    id: cab.indexOf('ID do produto'),
    tam: cab.indexOf('Tamanho'),
    busto: cab.indexOf('Busto (cm)'),
    cintura: cab.indexOf('Cintura (cm)'),
    quadril: cab.indexOf('Quadril (cm)')
  };
  if (c.id < 0 || c.tam < 0) return;
  for (let r = 1; r < dados.length; r++) {
    const l = dados[r];
    const id = String(l[c.id] || '').trim();
    const tam = String(l[c.tam] || '').trim();
    if (!id || !tam || !itens[id]) continue;
    const n = function (i) { const v = Number(l[i]); return isFinite(v) && v > 0 ? v : null; };
    if (!itens[id].medidas) itens[id].medidas = [];
    itens[id].medidas.push({ tamanho: tam, busto: n(c.busto), cintura: n(c.cintura), quadril: n(c.quadril) });
  }
}

// ---------- Configurações ----------
function lerConfig_() {
  const aba = aba_(ABA_CONFIG);
  if (!aba) return null;
  const dados = aba.getDataRange().getValues();
  const v = {};
  for (let r = 1; r < dados.length; r++) {
    const chave = String(dados[r][0] || '').trim();
    if (chave) v[chave] = dados[r][1] === null ? '' : String(dados[r][1]).trim();
  }
  const modo = (v['Modo da loja'] || 'Normal').toLowerCase();
  const promo = [v['Frase 1 da barra de promoção'], v['Frase 2 da barra de promoção'], v['Frase 3 da barra de promoção']]
    .filter(function (s) { return s; });
  const frete = Number(String(v['Frete grátis a partir de (R$)'] || '').replace(',', '.'));
  return {
    modo: modo === 'pausa' ? 'pausa' : (modo === 'aviso' ? 'aviso' : 'normal'),
    mensagem: v['Mensagem do aviso / pausa'] || '',
    promo: promo,
    freteGratis: isFinite(frete) && frete > 0 ? frete : null,
    whatsapp: (v['WhatsApp (só números, com 55 e DDD)'] || '').replace(/\D/g, ''),
    horario: v['Horário de atendimento'] || ''
  };
}
