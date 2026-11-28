// Páginas institucionais: liga os botões/links de WhatsApp ao número definido em config.js
// (ou na aba Configurações da planilha, quando houver).
(function(){
  function ligar(){
    document.querySelectorAll('[data-whatsapp]').forEach(function(a){
      var text = a.getAttribute('data-text') || '';
      a.href = 'https://wa.me/' + getWhatsappNumber() + (text ? '?text=' + encodeURIComponent(text) : '');
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    });
  }
  ligar();
  window.addEventListener('stzlar:stock', ligar);
})();
