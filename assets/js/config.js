// ---------- STZLAR: configurações do site (edite SÓ aqui) ----------
// Número oficial do WhatsApp: código do país + DDD + número, só dígitos (ex.: 55 + 85 + número).
// TODO: trocar pelo número oficial antes de ir ao ar.
const WHATSAPP_NUMBER = "5585994290667";

// Estoque ligado à planilha do Google. Cole aqui o link "/exec" gerado pelo Apps Script (aba apps-script/Codigo.gs).
// Deixe "" para o site usar só o estoque do products-data.js.
const STOCK_URL = "https://script.google.com/macros/s/AKfycbxxBM4zy6WuGReuGP1qz-VwaZ-cnNi6ouUYOvT5vdJlvI4MxTO1NLEo1K0cDVYssdeMcQ/exec";

// Número que recebe os pedidos: o da planilha (aba Configurações) se for válido; senão, o de cima.
function getWhatsappNumber(){
  var c = window.SITE_CONFIG;
  var n = c && c.whatsapp;
  return (n && /^\d{10,15}$/.test(n)) ? n : WHATSAPP_NUMBER;
}
// Frete grátis a partir de (R$): o da planilha se houver; senão, 350.
function getFreeShippingThreshold(){
  var c = window.SITE_CONFIG;
  return (c && c.freteGratis) ? c.freteGratis : 350;
}
