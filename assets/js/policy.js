// Páginas institucionais: liga os botões/links de WhatsApp ao número definido em config.js
(function(){
  document.querySelectorAll('[data-whatsapp]').forEach(function(a){
    var text = a.getAttribute('data-text') || '';
    a.href = 'https://wa.me/' + WHATSAPP_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
  });
})();
