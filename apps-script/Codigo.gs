/**
 * STZLAR — API de estoque (Google Apps Script)
 *
 * Lê as abas "Estoque por tamanho" e "Produtos" e devolve um JSON só com:
 * ID do produto, quantidade por tamanho, status, preço, etiqueta, novo?,
 * visível e destaque. Nada mais sai daqui (sem custo, sem fornecedor,
 * sem dados de cliente, sem a coluna Observações).
 *
 * Coluna de tamanho em BRANCO = "a planilha não controla esse tamanho" (o site mantém o que já tinha).
 * Coluna com 0 = esgotado.
 */
const ABA = 'Estoque por tamanho';
const ABA_PRODUTOS = 'Produtos';
const TAMANHOS = ['P', 'M', 'G', 'GG', 'Tamanho único'];
const CACHE_SEGUNDOS = 60; // evita reler a planilha a cada visita

function doGet() {
  const cache = CacheService.getScriptCache();
  let json = cache.get('estoque_json');
  if (!json) {
    json = JSON.stringify(montarEstoque_());
    cache.put('estoque_json', json, CACHE_SEGUNDOS);
  }
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function montarEstoque_() {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA);
  if (!aba) return { ok: false, erro: 'Aba não encontrada: ' + ABA, itens: {} };

  const dados = aba.getDataRange().getValues();
  const cab = dados[0].map(function (h) {
    return String(h).replace(/\(un\.\)/i, '').trim();
  });
  const colId = cab.indexOf('ID do produto');
  const colStatus = cab.indexOf('Status no site');
  if (colId < 0) return { ok: false, erro: 'Coluna "ID do produto" não encontrada', itens: {} };

  const colunas = {};
  TAMANHOS.forEach(function (t) {
    const i = cab.indexOf(t);
    if (i >= 0) colunas[t] = i;
  });

  const itens = {};
  for (let r = 1; r < dados.length; r++) {
    const linha = dados[r];
    const id = String(linha[colId] || '').trim();
    if (!id) continue;

    const tamanhos = {};
    Object.keys(colunas).forEach(function (t) {
      const bruto = linha[colunas[t]];
      if (bruto === '' || bruto === null) return; // em branco: não controlado
      const n = Math.floor(Number(bruto));
      if (isFinite(n)) tamanhos[t] = Math.max(0, n);
    });

    itens[id] = {
      tamanhos: tamanhos,
      status: colStatus >= 0 ? String(linha[colStatus] || '') : ''
    };
  }

  lerProdutos_(itens);

  return { ok: true, atualizado: new Date().toISOString(), itens: itens };
}

// Preço, etiqueta, novo?, visível e destaque (aba "Produtos"). Se a aba ou uma coluna
// não existir, o site simplesmente mantém o que já tem no código.
function lerProdutos_(itens) {
  const aba = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(ABA_PRODUTOS);
  if (!aba) return;
  const dados = aba.getDataRange().getValues();
  const cab = dados[0].map(function (h) { return String(h).trim(); });
  const c = {
    id: cab.indexOf('ID do produto'),
    preco: cab.indexOf('Preço (R$)'),
    novo: cab.indexOf('Novo?'),
    etiqueta: cab.indexOf('Etiqueta'),
    visivel: cab.indexOf('Visível no site'),
    destaque: cab.indexOf('Destaque na home')
  };
  if (c.id < 0) return;

  const simNao = function (v) {
    return String(v).trim().toLowerCase().replace('ã', 'a') === 'sim';
  };

  for (let r = 1; r < dados.length; r++) {
    const l = dados[r];
    const id = String(l[c.id] || '').trim();
    if (!id) continue;
    if (!itens[id]) itens[id] = { tamanhos: {}, status: '' };
    const it = itens[id];

    if (c.preco >= 0) {
      const n = Number(String(l[c.preco]).replace(',', '.'));
      if (isFinite(n) && n > 0) it.preco = n;
    }
    if (c.novo >= 0) it.novo = simNao(l[c.novo]);
    if (c.etiqueta >= 0) it.etiqueta = String(l[c.etiqueta] || '').trim();
    if (c.visivel >= 0) it.visivel = String(l[c.visivel]).trim() === '' ? true : simNao(l[c.visivel]);
    if (c.destaque >= 0) it.destaque = simNao(l[c.destaque]);
  }
}
