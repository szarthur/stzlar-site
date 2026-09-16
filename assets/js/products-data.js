// ---------- STZLAR product catalog ----------
// Central source of truth for every product on the site.
// Later this can be swapped for data coming from a real backend/API
// without needing to rewrite produto.html — only this file changes.

const PRODUCTS = [
  {
    id: "vestido-aurora",
    novo: true,
    nome: "Vestido Aurora",
    categoria: "Vestidos",
    preco: 389.00,
    imagens: [
      "assets/images/product/aurora-1.jpg",
      "assets/images/product/aurora-2.jpg",
      "assets/images/product/aurora-3.jpg",
      "assets/images/product/aurora-4.jpg"
    ],
    descricao: "Vestido longo em tecido fluido, com decote assimétrico e recortes discretos na cintura. Uma peça pensada para o entardecer — leve o suficiente pro calor, elegante o suficiente pra qualquer ocasião.",
    detalhes: "Tecido fluido com caimento leve. Decote assimétrico, recorte na cintura e forro interno. Modelo veste tamanho M e tem 1,75m.",
    tag: { label: "Lançamento", classe: "" },
    status: "disponivel",
    tamanhos: [
      { tamanho: "PP", disponivel: false },
      { tamanho: "P",  disponivel: true },
      { tamanho: "M",  disponivel: true },
      { tamanho: "G",  disponivel: true },
      { tamanho: "GG", disponivel: true }
    ],
    medidas: [
      { tamanho: "PP", busto: 80, cintura: 62, quadril: 88 },
      { tamanho: "P",  busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M",  busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G",  busto: 92, cintura: 74, quadril: 100 },
      { tamanho: "GG", busto: 96, cintura: 78, quadril: 104 }
    ]
  },
  {
    id: "conjunto-riviera",
    novo: true,
    nome: "Conjunto Riviera",
    categoria: "Conjuntos",
    preco: 459.00,
    imagens: ["assets/images/prod-riviera.jpg"],
    descricao: "Conjunto de duas peças em linho leve — top e saia com caimento solto. Combina com qualquer estação do verão, do dia à noite.",
    detalhes: "Composição em linho e viscose. Top com amarração nas costas, saia com cós alto. Modelo veste tamanho P e tem 1,72m.",
    tag: { label: "Mais vendido", classe: "tag-bestseller" },
    status: "disponivel",
    tamanhos: [
      { tamanho: "P",  disponivel: true },
      { tamanho: "M",  disponivel: true },
      { tamanho: "G",  disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-linhares",
    novo: false,
    nome: "Vestido Linhares",
    categoria: "Vestidos",
    preco: 419.00,
    imagens: ["assets/images/prod-linhares.jpg"],
    descricao: "Vestido midi em algodão, com botões frontais e mangas amplas. Uma peça versátil, do escritório ao fim de tarde.",
    detalhes: "100% algodão. Botões frontais funcionais, cinto de amarrar incluso. Modelo veste tamanho M e tem 1,74m.",
    tag: null,
    status: "disponivel",
    tamanhos: [
      { tamanho: "P",  disponivel: true },
      { tamanho: "M",  disponivel: true },
      { tamanho: "G",  disponivel: true },
      { tamanho: "GG", disponivel: false }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 },
      { tamanho: "GG", busto: 96, cintura: 78, quadril: 104 }
    ]
  },
  {
    id: "look-urbano-nara",
    novo: false,
    nome: "Look Urbano Nara",
    categoria: "Casual",
    preco: 329.00,
    imagens: ["assets/images/prod-look-urbano.jpg"],
    descricao: "Conjunto casual em moletom premium — blusa cropped e calça reta. Conforto com atitude, pensado pro dia a dia urbano.",
    detalhes: "Moletom peluciado, punhos canelados. Calça com elástico e cordão no cós. Modelo veste tamanho P e tem 1,70m.",
    tag: null,
    status: "poucas",
    tamanhos: [
      { tamanho: "P",  disponivel: true },
      { tamanho: "M",  disponivel: true },
      { tamanho: "G",  disponivel: false }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-marina",
    nome: "Vestido Marina",
    categoria: "Vestidos",
    preco: 349.00,
    imagens: ["assets/images/catalog/vestido-marina.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-solene",
    nome: "Vestido Solene",
    categoria: "Vestidos",
    preco: 399.00,
    imagens: ["assets/images/catalog/vestido-solene.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-ipanema",
    nome: "Vestido Ipanema",
    categoria: "Vestidos",
    preco: 359.00,
    imagens: ["assets/images/catalog/vestido-ipanema.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-camelia",
    nome: "Vestido Camélia",
    categoria: "Vestidos",
    preco: 429.00,
    imagens: ["assets/images/catalog/vestido-camelia.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-serena",
    nome: "Vestido Serena",
    categoria: "Vestidos",
    preco: 379.00,
    imagens: ["assets/images/catalog/vestido-serena.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-valentina",
    nome: "Vestido Valentina",
    categoria: "Vestidos",
    preco: 449.00,
    imagens: ["assets/images/catalog/vestido-valentina.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-amora",
    nome: "Vestido Amora",
    categoria: "Vestidos",
    preco: 369.00,
    imagens: ["assets/images/catalog/vestido-amora.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-bruma",
    nome: "Vestido Bruma",
    categoria: "Vestidos",
    preco: 409.00,
    imagens: ["assets/images/catalog/vestido-bruma.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-cordelia",
    nome: "Vestido Cordélia",
    categoria: "Vestidos",
    preco: 389.00,
    imagens: ["assets/images/catalog/vestido-cordelia.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "vestido-miranda",
    nome: "Vestido Miranda",
    categoria: "Vestidos",
    preco: 419.00,
    imagens: ["assets/images/catalog/vestido-miranda.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "conjunto-ilha",
    nome: "Conjunto Ilha",
    categoria: "Conjuntos",
    preco: 459.00,
    imagens: ["assets/images/catalog/conjunto-ilha.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "conjunto-veneza",
    nome: "Conjunto Veneza",
    categoria: "Conjuntos",
    preco: 479.00,
    imagens: ["assets/images/catalog/conjunto-veneza.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "conjunto-copacabana",
    nome: "Conjunto Copacabana",
    categoria: "Conjuntos",
    preco: 439.00,
    imagens: ["assets/images/catalog/conjunto-copacabana.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "conjunto-jasmim",
    nome: "Conjunto Jasmim",
    categoria: "Conjuntos",
    preco: 419.00,
    imagens: ["assets/images/catalog/conjunto-jasmim.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "conjunto-marbella",
    nome: "Conjunto Marbella",
    categoria: "Conjuntos",
    preco: 499.00,
    imagens: ["assets/images/catalog/conjunto-marbella.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "look-urbano-vento",
    nome: "Look Urbano Vento",
    categoria: "Casual",
    preco: 319.00,
    imagens: ["assets/images/catalog/look-urbano-vento.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "look-urbano-areia",
    nome: "Look Urbano Areia",
    categoria: "Casual",
    preco: 339.00,
    imagens: ["assets/images/catalog/look-urbano-areia.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "look-urbano-cais",
    nome: "Look Urbano Cais",
    categoria: "Casual",
    preco: 299.00,
    imagens: ["assets/images/catalog/look-urbano-cais.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "look-urbano-ipe",
    nome: "Look Urbano Ipê",
    categoria: "Casual",
    preco: 329.00,
    imagens: ["assets/images/catalog/look-urbano-ipe.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  },
  {
    id: "look-urbano-noturno",
    nome: "Look Urbano Noturno",
    categoria: "Casual",
    preco: 349.00,
    imagens: ["assets/images/catalog/look-urbano-noturno.jpg"],
    descricao: "Descrição a definir — peça de exemplo aguardando conteúdo e fotos reais.",
    detalhes: "Detalhes a definir — informações de tecido, caimento e medidas do modelo entram aqui quando a peça for cadastrada de verdade.",
    tag: null,
    status: "disponivel",
    novo: false,
    tamanhos: [
      { tamanho: "P", disponivel: true },
      { tamanho: "M", disponivel: true },
      { tamanho: "G", disponivel: true }
    ],
    medidas: [
      { tamanho: "P", busto: 84, cintura: 66, quadril: 92 },
      { tamanho: "M", busto: 88, cintura: 70, quadril: 96 },
      { tamanho: "G", busto: 92, cintura: 74, quadril: 100 }
    ]
  }
];

function getProductById(id){
  return PRODUCTS.find(p => p.id === id) || null;
}

function getRelatedProducts(currentId, limit = 4){
  return PRODUCTS.filter(p => p.id !== currentId).slice(0, limit);
}

function getProductsByCategory(categoria){
  return PRODUCTS.filter(p => p.categoria.toLowerCase() === categoria.toLowerCase());
}

function getNewProducts(){
  return PRODUCTS.filter(p => p.novo === true);
}

// Single source of truth for how a product card looks — used by the homepage
// vitrine, category pages, novidades and "related products". Change it once,
// it updates everywhere instead of drifting between hand-copied versions.
function renderProductCard(p){
  const nome = escapeHTML(p.nome);
  const categoria = escapeHTML(p.categoria);
  const img = escapeHTML(p.imagens[0]);
  const id = escapeHTML(p.id);
  return `
    <a href="produto.html?id=${id}" class="prod-card">
      <div class="prod-media">
        <button class="card-fav-btn" data-fav-id="${id}" aria-label="Favoritar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 21s-7.5-4.6-10-9.2C.5 8 2 4 6 4c2.2 0 3.8 1.4 6 4 2.2-2.6 3.8-4 6-4 4 0 5.5 4 4 7.8C19.5 16.4 12 21 12 21z"/></svg>
        </button>
        ${p.tag ? `<span class="prod-tag ${escapeHTML(p.tag.classe)}">${escapeHTML(p.tag.label)}</span>` : ''}
        <img src="${img}" alt="${nome}" loading="lazy">
        <span class="prod-view">Ver produto</span>
      </div>
      <div class="prod-info"><span class="cat">${categoria}</span><h4>${nome}</h4><span class="price">${formatBRL(p.preco)}</span></div>
    </a>
  `;
}

function formatBRL(value){
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Escapes any string before it's interpolated into an HTML template that
// gets inserted via innerHTML. Today every value comes from our own trusted
// products-data.js, so the practical risk is low — but the render functions
// below are reused across the whole site, and the search box interpolates
// raw user input into a message, so this closes that door for good rather
// than relying on "the data is trusted for now".
function escapeHTML(str){
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
