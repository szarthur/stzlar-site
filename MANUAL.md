# Manual de manutenção — STZLAR

Guia rápido para manter a loja. Nada aqui é sensível: o repositório é público, então **nunca** coloque senhas, chaves ou dados de clientes nele.

## Como a loja funciona

- O site é estático, publicado pelo **GitHub Pages**: `https://szarthur.github.io/stzlar-site/`.
- O pedido é fechado pelo **WhatsApp**: o site monta a mensagem e abre a conversa.
- A **planilha do Google** controla o dia a dia (estoque, preço, etiqueta, peças novas, avisos). O site lê a planilha ao abrir e as mudanças aparecem em **1 a 3 minutos**.
- O que não está na planilha fica em arquivos do GitHub (fotos, textos das páginas, visual).

## O que mexer na planilha (sem GitHub)

| Quero... | Onde |
|---|---|
| Dar baixa em uma venda / atualizar quantidade | aba **Estoque por tamanho** → coluna do tamanho |
| Mudar preço, etiqueta, "Novo?", esconder peça, destacar na home | aba **Produtos** |
| Mudar descrição, detalhes, nome ou categoria de uma peça | aba **Produtos** |
| Pausar a loja ou avisar algo | aba **Configurações** → *Modo da loja* |
| Mudar a barra de promoção, frete grátis, WhatsApp ou horário | aba **Configurações** |
| Tabela de medidas de uma peça | aba **Medidas** |

Regras importantes:
- **Nunca mude o ID** de uma peça (coluna "ID do produto"). É ele que liga a planilha ao site.
- Tamanho com número (inclusive 0) = oferecido. Em branco = a peça não tem esse tamanho.
- Total de unidades em **vermelho claro** = 2 ou menos; **vermelho forte** = esgotado.
- Use os menus suspensos (Sim/Não, Etiqueta, Modo). Não digite por cima.

### Pausar a loja (tela cheia)
Aba **Configurações** → *Modo da loja* = **Pausa** e escreva a *Mensagem*. O site inteiro é coberto pela mensagem. Para voltar, escreva **Normal**. O modo **Aviso** mostra só uma faixa na parte de baixo.

## Cadastrar uma peça nova

1. **Fotos:** no GitHub, abra a pasta `assets/images/product/`, clique em *Add file → Upload files* e envie as fotos em **.webp** (ex.: `lua-1.webp`, `lua-2.webp`). Dê *Commit changes*.
2. **Aba Produtos:** crie uma linha nova com **ID único** (minúsculas, sem espaço nem acento, ex.: `vestido-lua`), Nome, Categoria (*Vestidos*, *Conjuntos* ou *Casual*), Preço, Descrição, Detalhes e *Fotos (arquivos)* — os nomes separados por vírgula: `lua-1.webp, lua-2.webp`.
3. **Aba Estoque por tamanho:** crie uma linha com o **mesmo ID** e preencha a quantidade de cada tamanho que a peça tem.
4. Espere 1 a 3 minutos. A peça só aparece quando tem nome, categoria, preço, foto e pelo menos um tamanho com quantidade.

Para **tirar** uma peça do site sem apagar: *Visível no site* = **Não**.

## Trocar a foto de uma peça que já existe

Suba a nova foto no GitHub (mesma pasta e **mesmo nome** do arquivo antigo, para substituir) ou preencha a coluna *Fotos (arquivos)* com os nomes novos.

## Atualizar o site no GitHub

1. Abra o repositório → clique no arquivo → ícone do lápis (editar) → altere → *Commit changes*.
2. Para vários arquivos de uma vez: *Add file → Upload files*, mantendo as **mesmas pastas**.
3. O GitHub Pages publica em 1 a 2 minutos. Depois, atualize a página com **Ctrl + F5** (no celular, limpe o cache) para ver a mudança.

## Atualizar o script da planilha (Apps Script)

Só é preciso quando o arquivo `apps-script/Codigo.gs` mudar:
1. Planilha → **Extensões → Apps Script**. Apague o código antigo e cole o novo. Salve.
2. **Implantar → Gerenciar implantações** → lápis → **Nova versão** → Implantar.
3. O link continua o mesmo. **Não** crie uma "Nova implantação" (isso troca o link).

Se algum dia o link mudar, edite `assets/js/config.js` e troque o valor de `STOCK_URL`.

## Se algo der errado

- **A planilha mudou e o site não:** espere 3 minutos e dê Ctrl + F5. Teste o link do script no navegador: deve aparecer um texto começando com `{"ok":true`.
- **A planilha ficou fora do ar:** o site continua funcionando com o que está nos arquivos do GitHub.
- **O site quebrou depois de uma edição:** no GitHub, abra o arquivo → *History* → volte para a versão anterior.
- **Tela de manutenção sem depender da planilha:** crie um arquivo `index.html` simples no lugar do atual (guarde o original antes).

## Quando comprar um domínio próprio

Será preciso atualizar: o `<base href>` em `404.html`, o `robots.txt`, o `sitemap.xml`, os links `canonical` e `og:image` das páginas. Peça ajuda para fazer tudo de uma vez.

## Mapa dos arquivos

- `index.html`, `catalogo.html`, `produto.html`, `carrinho.html`… → páginas
- `assets/js/config.js` → número do WhatsApp (reserva) e link da planilha
- `assets/js/products-data.js` → peças "de reserva" (usadas se a planilha cair)
- `assets/js/stock.js` → liga o site à planilha
- `apps-script/Codigo.gs` → código que roda dentro da planilha
- `assets/images/` → fotos · `assets/css/` → visual
