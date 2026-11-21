/**
 * STZLAR — API de estoque (Google Apps Script)
 *
 * Lê a aba "Estoque por tamanho" desta planilha e devolve um JSON só com:
 * ID do produto, quantidade por tamanho e o status. Nada mais sai daqui
 * (sem preço de custo, sem nome de fornecedor, sem dados de cliente).
 *
 * Coluna de tamanho em BRANCO = "a planilha não controla esse tamanho" (o site mantém o que já tinha).
 * Coluna com 0 = esgotado.
 */
const ABA = 'Estoque por tamanho';
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

  return { ok: true, atualizado: new Date().toISOString(), itens: itens };
}
