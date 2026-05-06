/**
 * Generador de landings SEO para convenios colectivos.
 * Lee /data/convenios/*.json y genera una landing por convenio
 * (o una por provincia si es plurprovincial).
 *
 * Uso: node scripts/generate-convenios.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'data', 'convenios');

const fmt = n => new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: true }).format(n);
const fmtEur = n => fmt(n) + ' €';
const slug = s => s.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ── Schema Organization global (E-E-A-T) ─────────────────────────────
const ORGANIZATION_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SalarioJusto",
  "alternateName": "Salario Justo",
  "url": "https://salariojusto.es/",
  "logo": "https://salariojusto.es/preview.jpg",
  "description": "Herramienta gratuita de transparencia salarial para España: cálculo IRPF 2026, verificación de convenios colectivos y guías de derechos laborales.",
  "areaServed": { "@type": "Country", "name": "España" },
  "knowsAbout": [
    "Derecho laboral español",
    "Convenios colectivos",
    "IRPF 2026",
    "Salario Mínimo Interprofesional",
    "Ley de Transparencia Retributiva (Directiva UE 2023/970)"
  ],
  "sameAs": [
    "https://salariojusto.es/sobre.html"
  ]
}, null, 2);

// ── Helper: detectar si el convenio está en ultraactividad ───────────
// Si el último año mencionado en `vigencia` es anterior al año actual,
// el convenio ha vencido y sus tablas siguen aplicándose por ultraactividad.
const CURRENT_YEAR = 2026;
function detectaUltraactividad(vigencia) {
  if (!vigencia) return false;
  const years = (String(vigencia).match(/\d{4}/g) || []).map(Number);
  if (years.length === 0) return false;
  return Math.max(...years) < CURRENT_YEAR;
}

// ── Helper: interlinking por provincia ───────────────────────────────
const PROVINCIA_A_CIUDAD_SLUG = {
  'madrid': 'madrid', 'barcelona': 'barcelona', 'valencia': 'valencia',
  'sevilla': 'sevilla', 'bilbao': 'bilbao', 'malaga': 'malaga',
  'zaragoza': 'zaragoza', 'alicante': 'alicante', 'murcia': 'murcia',
  'palma': 'palma', 'laspalmas': 'laspalmas', 'acoruna': 'acoruna',
  'tarragona': null, 'maresme': null, 'girona': null,
};
const TRAMOS_DESTACADOS = [20000, 25000, 30000, 35000, 45000];

function relatedSalarioNetoLinksHTML(provinciaSlug, provinciaNombre) {
  // RETIRADA 2026-05-06: las landings programáticas salario-neto-* fueron retiradas
  // tras rechazo AdSense por "contenido de poco valor" (0 clics totales en GSC).
  // Devolvemos string vacío; el caller compone "Más recursos para {provincia}"
  // solo si quedan convenios cruzados disponibles.
  return '';
}

function relatedConvenioLinksHTML(provinciaSlug, provinciaNombre, sectorActual) {
  const ciudadSlug = PROVINCIA_A_CIUDAD_SLUG[provinciaSlug];
  if (!ciudadSlug) return '';
  const otrosSectores = ['hosteleria', 'limpieza', 'oficinas'].filter(s => s !== sectorActual);
  const links = [];
  for (const sec of otrosSectores) {
    const file = path.join(ROOT, `convenio-${sec}-${provinciaSlug}.html`);
    if (fs.existsSync(file)) {
      const sectorLabel = sec === 'hosteleria' ? 'Hostelería'
        : sec === 'limpieza' ? 'Limpieza de Edificios y Locales'
        : 'Oficinas y Despachos';
      links.push(`      <li><a href="/convenio-${sec}-${provinciaSlug}.html">Convenio de ${sectorLabel} en ${provinciaNombre}</a></li>`);
    }
  }
  return links.join('\n');
}

// ── Configuración por convenio ───────────────────────────────────────
// Mapea archivos JSON a metadatos de landing (slug URL, keyword, H1)
const CONVENIO_CONFIG = {
  'hosteleria_mad.json': {
    sector: 'Hostelería', sectorSlug: 'hosteleria',
    provincia: 'Madrid', provinciaSlug: 'madrid',
    plurprovincial: false,
    relacionadas: ['hosteleria-valencia', 'hosteleria-barcelona']
  },
  'hosteleria_vlc.json': {
    sector: 'Hostelería', sectorSlug: 'hosteleria',
    provincia: 'Valencia', provinciaSlug: 'valencia',
    plurprovincial: false,
    relacionadas: ['hosteleria-madrid', 'oficinas-valencia']
  },
  'ofydes_vlc.json': {
    sector: 'Oficinas y Despachos', sectorSlug: 'oficinas',
    provincia: 'Valencia', provinciaSlug: 'valencia',
    plurprovincial: false,
    relacionadas: ['hosteleria-valencia']
  },
  'hosteleria_cat.json': {
    sector: 'Hostelería', sectorSlug: 'hosteleria',
    plurprovincial: true,
    provincias: [
      { key: 'barcelona', nombre: 'Barcelona', slug: 'barcelona' },
      { key: 'maresme',   nombre: 'Maresme',   slug: 'maresme'   },
      { key: 'tarragona', nombre: 'Tarragona', slug: 'tarragona' },
      { key: 'girona',    nombre: 'Girona',    slug: 'girona'    },
    ],
    relacionadas: ['hosteleria-madrid', 'hosteleria-valencia']
  },
};

// ── Adaptador plurprovincial (copiado de index.html) ─────────────────
function adaptPlurProvincial(rawData, provinciaKey) {
  const prov = rawData.provincias && rawData.provincias[provinciaKey];
  if (!prov) return null;
  const numPagas = rawData.pagas || 14;
  const grupos = [];
  prov.niveles.forEach(nivel => {
    Object.keys(prov.subtablas).forEach(stKey => {
      const salario = {};
      for (const [anyo, matriz] of Object.entries(nivel.salario)) {
        const mes = matriz[stKey];
        if (mes != null) salario[anyo] = { mes: mes, sba: +(mes * numPagas).toFixed(2) };
      }
      if (Object.keys(salario).length > 0) {
        grupos.push({
          id: nivel.id + '-' + stKey,
          subtabla: stKey,
          nombre: nivel.nombre,
          puestos: nivel.puestos || [],
          salario: salario,
        });
      }
    });
  });

  let jornadaAnual = rawData.jornadaAnual;
  if (typeof jornadaAnual === 'object' && jornadaAnual !== null) {
    const anyos = Object.keys(jornadaAnual).sort().reverse();
    jornadaAnual = jornadaAnual[anyos[0]];
  }

  return {
    nombre: rawData.nombre,
    bop: rawData.bop,
    codigo: rawData.codigo,
    vigencia: rawData.vigencia,
    pagas: numPagas,
    jornadaAnual: jornadaAnual,
    urlBop: rawData.urlBop,
    subtablas: prov.subtablas,
    grupos: grupos,
    anyoMasReciente: Math.max(...Object.keys(prov.niveles[0].salario).map(Number)),
  };
}

// ── Normalizar convenio simple ───────────────────────────────────────
function normalizeSimple(rawData) {
  let jornadaAnual = rawData.jornadaAnual;
  if (typeof jornadaAnual === 'object' && jornadaAnual !== null) {
    const anyos = Object.keys(jornadaAnual).sort().reverse();
    jornadaAnual = jornadaAnual[anyos[0]];
  }
  const anyos = Object.keys(rawData.grupos[0].salario).map(Number);
  return {
    nombre: rawData.nombre,
    bop: rawData.bop,
    codigo: rawData.codigo,
    vigencia: rawData.vigencia,
    pagas: rawData.pagas || 14,
    jornadaAnual: jornadaAnual,
    urlBop: rawData.urlBop,
    subtablas: rawData.subtablas || {},
    grupos: rawData.grupos,
    anyoMasReciente: Math.max(...anyos),
  };
}

// ── headCSS compartido (copia del generator de salarios) ────────────
function headCSS() {
  return `
  <style>
    :root{--cream-50:#FDFBF7;--cream-100:#F7F0E6;--cream-200:#EDE0CE;--gold:#C17B3E;--gold-dark:#A0622A;--gold-light:#D9A06A;--ink:#2D2520;--ink-light:#6B5E52;--ink-lighter:#9B8E88;--green:#2E7D52;--green-bg:#EAF5EE;--amber:#B45309;--amber-bg:#FEF3C7;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:var(--cream-50);color:var(--ink);line-height:1.75;}
    header{background:var(--ink);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:56px;}
    .logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
    .logo-mark{width:28px;height:28px;border:1px solid rgba(217,160,106,0.5);display:flex;align-items:center;justify-content:center;font-family:'Newsreader',serif;font-size:17px;font-weight:500;color:var(--gold-light);line-height:1;padding-top:2px;}
    .logo-text{font-family:'Newsreader',serif;font-size:22px;font-weight:600;color:var(--gold-light);letter-spacing:-0.025em;line-height:1;font-feature-settings:"kern" 1,"liga" 1;}
    .logo-text span{color:#fff;}
    .header-cta{background:var(--gold);color:#fff;padding:8px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;}
    .header-cta:hover{background:var(--gold-dark);}
    .breadcrumb{background:var(--cream-100);border-bottom:1px solid var(--cream-200);padding:10px 32px;font-size:12px;color:var(--ink-lighter);}
    .breadcrumb a{color:var(--gold);text-decoration:none;}
    .hero{background:var(--ink);padding:48px 32px 40px;text-align:center;}
    .hero-badge{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-light);border:1px solid rgba(193,123,62,0.35);padding:4px 12px;margin-bottom:20px;}
    .hero h1{font-family:'DM Serif Display',serif;font-size:clamp(22px,3.5vw,34px);color:#fff;font-weight:400;line-height:1.25;max-width:780px;margin:0 auto 16px;}
    .hero h1 em{font-style:normal;color:var(--gold-light);}
    .hero-sub{font-size:15px;color:rgba(255,255,255,0.65);max-width:620px;margin:0 auto;}
    main{max-width:920px;margin:0 auto;padding:40px 24px 64px;}
    .card{background:#fff;border:1px solid var(--cream-200);padding:28px;margin-bottom:24px;box-shadow:0 1px 3px rgba(45,37,32,0.06);}
    .card-title{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
    .card-title::after{content:'';flex:1;height:1px;background:var(--cream-200);}
    .stats-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;}
    .stat-item{border-left:3px solid var(--gold);padding:4px 14px;}
    .stat-label{font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-lighter);margin-bottom:2px;}
    .stat-value{font-size:15px;font-weight:700;color:var(--ink);line-height:1.3;}
    table{width:100%;border-collapse:collapse;margin:8px 0;}
    th{font-size:10px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-lighter);text-align:left;padding:10px 12px;border-bottom:2px solid var(--cream-200);background:var(--cream-50);}
    td{padding:12px;border-bottom:1px solid var(--cream-100);font-size:13px;color:var(--ink-light);vertical-align:top;}
    td:first-child{font-weight:700;color:var(--ink);white-space:nowrap;}
    td.sal{font-weight:700;color:var(--green);text-align:right;white-space:nowrap;}
    .cta-box{background:var(--ink);padding:28px;text-align:center;margin:32px 0;}
    .cta-box p{color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:14px;}
    .cta-btn{display:inline-block;background:var(--gold);color:#fff;padding:14px 28px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;}
    .cta-btn:hover{background:var(--gold-dark);}
    h2{font-family:'DM Serif Display',serif;font-size:22px;font-weight:400;color:var(--ink);margin:36px 0 14px;padding-top:24px;border-top:1px solid var(--cream-200);}
    h3{font-size:15px;font-weight:700;color:var(--ink);margin:18px 0 6px;}
    p{color:var(--ink-light);font-size:14.5px;margin-bottom:14px;}
    a{color:var(--gold);text-decoration:none;}
    a:hover{text-decoration:underline;}
    .related{margin-top:36px;padding:24px;background:var(--cream-100);border:1px solid var(--cream-200);}
    .related h2{border:none;padding:0;margin:0 0 12px;}
    .related ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:8px;}
    .related a{color:var(--gold-dark);font-weight:500;font-size:14px;}
    .convenios-grid{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 24px;}
    .convenio-chip{display:inline-block;padding:7px 14px;background:#fff;border:1px solid var(--cream-200);font-size:13px;font-weight:500;color:var(--ink-light);text-decoration:none;}
    .convenio-chip:hover{background:var(--gold);color:#fff;border-color:var(--gold);text-decoration:none;}
    footer{background:var(--ink);padding:24px 32px;text-align:center;margin-top:32px;}
    .footer-text{font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;}
    .footer-text a{color:var(--gold-light);text-decoration:none;}
    @media(max-width:600px){main{padding:24px 16px 48px;}.card{padding:18px;}th,td{padding:8px 6px;font-size:12px;}}
  </style>`;
}

function navHTML() {
  return `
<header>
  <a href="/" class="logo"><div class="logo-mark">§</div><div class="logo-text">Salario<span>Justo</span></div></a>
  <a href="/" class="header-cta">Calculadora completa →</a>
</header>`;
}

// REGLA · El footer global DEBE incluir siempre los enlaces legales
// (Privacidad, Aviso legal, Contacto). Se renderizan en una segunda línea
// discreta para no competir con la navegación principal pero accesibles
// para cumplir requisitos LSSI/RGPD/AdSense en cualquier landing del sitio.
function footerHTML() {
  return `
<footer>
  <p class="footer-text">
    SalarioJusto · Herramienta gratuita para trabajadores y trabajadoras · Sin empresas detrás<br>
    <a href="/">Calculadora</a> ·
    <a href="/convenios.html">Convenios</a> ·
    <a href="/guias.html">Guías</a> ·
    <a href="/sobre.html">Sobre</a> ·
    <a href="/mapa-del-sitio.html">Mapa del sitio</a>
  </p>
  <p class="footer-legal" style="font-size:11px;color:rgba(255,255,255,0.35);line-height:1.5;margin-top:14px;">
    <a href="/privacidad.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Privacidad</a> ·
    <a href="/aviso-legal.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Aviso legal</a> ·
    <a href="/contacto.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Contacto</a> ·
    <a href="/sala-de-prensa.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Prensa</a>
  </p>
</footer>`;
}

// ── Renderiza una landing de convenio ────────────────────────────────
function generateConvenioPage(data, meta) {
  const anyo = data.anyoMasReciente;
  const fileName = `convenio-${meta.sectorSlug}-${meta.provinciaSlug}.html`;
  const url = `https://salariojusto.es/${fileName}`;

  // Ultraactividad: si las tablas son de un año anterior pero siguen vigentes
  const enUltraactividad = detectaUltraactividad(data.vigencia);
  const anyoMostrado = enUltraactividad ? CURRENT_YEAR : anyo;
  // Rango salarial mensual del convenio — usado en title/desc (V1 cifra-directa) y en la primera FAQ
  const salariosMes = data.grupos.map(g => g.salario[anyo]?.mes).filter(Boolean);
  const salarioMinimo = Math.min(...salariosMes);
  const salarioMaximo = Math.max(...salariosMes);
  const fmtMil = n => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0, useGrouping: true }).format(n);
  const sectorCorto = meta.sector === 'Oficinas y Despachos' ? 'Oficinas' : meta.sector;

  const title = `Convenio ${sectorCorto} ${meta.provincia} ${CURRENT_YEAR}: tablas ${fmtMil(salarioMinimo)}–${fmtMil(salarioMaximo)} €/mes`;
  const desc = `Tablas salariales del convenio de ${meta.sector.toLowerCase()} de ${meta.provincia} ${CURRENT_YEAR}: salario base de ${fmtEur(salarioMinimo)} a ${fmtEur(salarioMaximo)} en ${data.pagas} pagas, jornada ${fmtMil(data.jornadaAnual)} h/año. BOP oficial.`;
  const ogTitle = `Convenio ${meta.sector} ${meta.provincia} ${CURRENT_YEAR}`;

  // Construir tabla de grupos (máximo 15 filas, mostramos todos pero responsive)
  const subtablasKeys = Object.keys(data.subtablas);
  const hayVariasSubtablas = subtablasKeys.length > 1;

  const rows = data.grupos.map(g => {
    const s = g.salario[anyo];
    if (!s) return '';
    const subtablaLabel = hayVariasSubtablas && g.subtabla ? ` <span style="font-size:11px;color:var(--ink-lighter);font-weight:400;">(${data.subtablas[g.subtabla] || g.subtabla})</span>` : '';
    const puestos = g.puestos && g.puestos.length > 0
      ? g.puestos.slice(0, 4).join(', ') + (g.puestos.length > 4 ? '…' : '')
      : '';
    return `        <tr>
          <td>${g.id}${subtablaLabel}<div style="font-size:11px;color:var(--ink-lighter);font-weight:400;margin-top:2px;">${puestos}</div></td>
          <td>${g.nombre.replace(/^Nivel [IVX]+ — /, '').replace(/^Grupo [IVX0-9]+ — /, '')}</td>
          <td class="sal">${fmtEur(s.mes)}<div style="font-size:11px;color:var(--ink-lighter);font-weight:400;">${fmtEur(s.sba)}/año</div></td>
        </tr>`;
  }).filter(Boolean).join('\n');

  // FAQs (salarioMinimo/Maximo ya calculados arriba para title/desc)
  const faqs = [
    {
      q: `¿Cuál es el salario mínimo del convenio de ${meta.sector} en ${meta.provincia} para ${anyo}?`,
      a: `Según las tablas salariales ${anyo} publicadas en ${data.bop}, el salario base mensual mínimo es de ${fmtEur(salarioMinimo)} (categoría más baja) y puede llegar hasta ${fmtEur(salarioMaximo)} en las categorías superiores. Son cuantías brutas en ${data.pagas} pagas.`
    },
    {
      q: `¿Cuántas horas de jornada anual fija el convenio?`,
      a: `La jornada anual máxima pactada es de ${data.jornadaAnual} horas efectivas al año, distribuidas según el calendario laboral del centro de trabajo. Superar esta jornada genera horas extraordinarias con su correspondiente compensación.`
    },
    {
      q: `¿Qué hago si mi empresa paga menos que el convenio?`,
      a: `Tienes derecho a reclamar las diferencias salariales. El plazo de prescripción es de 1 año por mensualidad desde que debió abonarse (art. 59.2 ET). Presentar papeleta de conciliación ante el SMAC interrumpe ese plazo. Consulta nuestra <a href="/reclamar-diferencias-salariales-convenio.html">guía para reclamar diferencias de convenio</a>.`
    },
    {
      q: `¿Dónde puedo consultar el texto oficial del convenio?`,
      a: `El texto completo se publicó en ${data.bop} con código de convenio ${data.codigo}. <a href="${data.urlBop}" target="_blank" rel="noopener">Abrir publicación oficial</a>.`
    },
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a.replace(/<[^>]+>/g, '') } }))
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": "Convenios colectivos", "item": "https://salariojusto.es/convenios.html" },
      { "@type": "ListItem", "position": 3, "name": `${meta.sector} ${meta.provincia}`, "item": url }
    ]
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://salariojusto.es/preview.jpg">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
  <script type="application/ld+json">${ORGANIZATION_SCHEMA}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script type="application/ld+json">${faqSchema}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MXJ8V2FBW9"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MXJ8V2FBW9');</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1110009006533891" crossorigin="anonymous"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&family=Newsreader:wght@500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
  ${headCSS()}
</head>
<body>

${navHTML()}

<div class="breadcrumb"><a href="/">SalarioJusto</a> › <a href="/convenios.html">Convenios</a> › ${meta.sector} ${meta.provincia}</div>

<section class="hero">
  <div class="hero-badge">Tablas salariales ${anyo}${enUltraactividad ? ` · vigentes en ${CURRENT_YEAR}` : ''}</div>
  <h1>Convenio de <em>${meta.sector}</em> en ${meta.provincia}${enUltraactividad ? ` ${CURRENT_YEAR}` : ''}</h1>
  <p class="hero-sub">Tablas oficiales, jornada anual, pagas extras y complementos. ${data.bop}. Vigencia ${data.vigencia}.</p>
  ${enUltraactividad ? `<div style="display:inline-block;margin-top:18px;padding:8px 16px;background:rgba(193,123,62,0.15);border:1px solid rgba(193,123,62,0.5);font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--gold-light);">⚠ Convenio en ultraactividad desde ${CURRENT_YEAR}</div>
  <p style="font-size:13px;color:rgba(255,255,255,0.55);max-width:620px;margin:12px auto 0;line-height:1.6;">El convenio expiró el 31/12/${anyo} pero las tablas siguen aplicándose por ultraactividad (art. 86.3 ET) mientras se negocia un nuevo texto. No hay incremento automático.</p>` : ''}
</section>

<main>

  <div class="card">
    <div class="card-title">Datos clave del convenio</div>
    <div class="stats-grid">
      <div class="stat-item"><div class="stat-label">Jornada anual</div><div class="stat-value">${data.jornadaAnual} horas</div></div>
      <div class="stat-item"><div class="stat-label">Pagas al año</div><div class="stat-value">${data.pagas} pagas</div></div>
      <div class="stat-item"><div class="stat-label">Vigencia</div><div class="stat-value">${data.vigencia}</div></div>
      <div class="stat-item"><div class="stat-label">Código convenio</div><div class="stat-value" style="font-size:13px;font-family:monospace;">${data.codigo}</div></div>
    </div>
  </div>

  <div class="card">
    <div class="card-title">Tablas salariales ${anyo} — ${meta.provincia}</div>
    <p style="font-size:13px;color:var(--ink-lighter);margin-bottom:12px;">Salario base mensual bruto en ${data.pagas} pagas. Cuantías oficiales publicadas en ${data.bop}.</p>
    <div style="overflow-x:auto;">
      <table>
        <thead>
          <tr>
            <th>Nivel</th>
            <th>Categoría</th>
            <th style="text-align:right;">Salario bruto</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
    <p style="font-size:12px;color:var(--ink-lighter);margin-top:12px;">Importes brutos antes de descuentos de IRPF y Seguridad Social. Para calcular tu <strong>salario neto exacto</strong> con tu situación familiar, usa la <a href="/">calculadora oficial de SalarioJusto</a>.</p>
  </div>

  <div class="cta-box">
    <p>¿Tu salario real coincide con el convenio? Verifícalo ahora y reclama diferencias si las hay.</p>
    <a href="/#verifica-convenio" class="cta-btn">Verificar mi salario →</a>
  </div>

  <h2>Preguntas frecuentes</h2>
${faqs.map(f => `  <h3>${f.q}</h3>\n  <p>${f.a}</p>`).join('\n\n')}

  <h2>¿Cobras menos de lo que fija el convenio?</h2>
  <p>Si tu nómina está por debajo de las cantidades de la tabla, puedes reclamar las diferencias salariales. Tienes <strong>1 año por mensualidad</strong> de plazo desde que debió pagarse (art. 59.2 ET). Presentar papeleta de conciliación ante el SMAC de ${meta.provincia} interrumpe el plazo y es gratuito.</p>
  <p>Consulta nuestra <a href="/reclamar-diferencias-salariales-convenio.html">guía completa para reclamar diferencias salariales</a> paso a paso.</p>

  ${(() => {
    const salarioNetoLinks = relatedSalarioNetoLinksHTML(meta.provinciaSlug, meta.provincia);
    const convenioCruzadoLinks = relatedConvenioLinksHTML(meta.provinciaSlug, meta.provincia, meta.sectorSlug);
    const localBlock = (salarioNetoLinks || convenioCruzadoLinks)
      ? `<div class="related">
    <h2 style="font-size:18px;">Más recursos para ${meta.provincia}</h2>
    <ul>
${convenioCruzadoLinks}${convenioCruzadoLinks && salarioNetoLinks ? '\n' : ''}${salarioNetoLinks}
    </ul>
  </div>`
      : '';
    return localBlock;
  })()}

  <div class="related">
    <h2 style="font-size:18px;">Guías y herramientas</h2>
    <ul>
      <li><a href="/convenios.html">← Ver todos los convenios colectivos</a></li>
      <li><a href="/">Calculadora de salario neto</a></li>
      <li><a href="/reclamar-diferencias-salariales-convenio.html">Cómo reclamar diferencias salariales</a></li>
      <li><a href="/salario-minimo-interprofesional-2026.html">Salario Mínimo Interprofesional 2026</a></li>
      <li><a href="/ley-transparencia-salarial-2026.html">Ley de Transparencia Salarial 2026</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`;

  return { fileName, html };
}

// ── Hub /convenios.html ──────────────────────────────────────────────
function generateHub(convenios) {
  const url = 'https://salariojusto.es/convenios.html';
  const title = 'Convenios colectivos: tablas salariales por sector y provincia | SalarioJusto';
  const desc = `${convenios.length} convenios colectivos con tablas salariales, jornada anual y complementos. Hostelería, Limpieza de Edificios y Locales, Oficinas y Despachos, Construcción por provincia y estatal.`;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": "Convenios colectivos", "item": url }
    ]
  }, null, 2);

  // Agrupar por sector
  const porSector = {};
  convenios.forEach(c => {
    if (!porSector[c.sector]) porSector[c.sector] = [];
    porSector[c.sector].push(c);
  });

  let sectionsHTML = '';
  for (const [sector, lista] of Object.entries(porSector)) {
    sectionsHTML += `
  <div class="card">
    <div class="card-title">${sector}</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:10px;">
${lista.map(c => `      <a href="${c.href}" style="display:block;padding:14px 16px;background:var(--cream-50);border:1px solid var(--cream-200);text-decoration:none;transition:all 0.15s;">
        <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold);margin-bottom:4px;">${c.provincia || c.ambito || ''}</div>
        <div style="font-size:14px;font-weight:600;color:var(--ink);line-height:1.35;">${c.nombreCorto}</div>
        <div style="font-size:11px;color:var(--ink-lighter);margin-top:4px;">${c.vigencia || ''}</div>
        ${c.enUltraactividad ? `<div style="display:inline-block;margin-top:6px;padding:2px 8px;background:#FEF3C7;border:1px solid #B45309;font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#B45309;">⚠ Ultraactividad</div>` : ''}
      </a>`).join('\n')}
    </div>
  </div>`;
  }

  return {
    fileName: 'convenios.html',
    html: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="es" href="${url}">
  <link rel="alternate" hreflang="x-default" href="${url}">
  <meta property="og:title" content="Convenios colectivos: tablas salariales por sector y provincia">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://salariojusto.es/preview.jpg">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <script type="application/ld+json">${ORGANIZATION_SCHEMA}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MXJ8V2FBW9"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MXJ8V2FBW9');</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1110009006533891" crossorigin="anonymous"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&family=Newsreader:wght@500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
  ${headCSS()}
</head>
<body>

${navHTML()}

<div class="breadcrumb"><a href="/">SalarioJusto</a> › Convenios colectivos</div>

<section class="hero">
  <div class="hero-badge">${convenios.length} convenios disponibles</div>
  <h1>Convenios colectivos: <em>tablas salariales</em> por sector y provincia</h1>
  <p class="hero-sub">Tablas oficiales, jornada anual, pagas extras y complementos de los convenios colectivos publicados en el BOE, DOGC y boletines provinciales.</p>
</section>

<main>
${sectionsHTML}

  <div class="cta-box">
    <p>¿Tu empresa cumple con el convenio? Verifícalo en 30 segundos.</p>
    <a href="/#verifica-convenio" class="cta-btn">Verificar mi salario →</a>
  </div>

  <h2>¿Qué es un convenio colectivo?</h2>
  <p>Un convenio colectivo es un acuerdo legal que fija las condiciones mínimas de trabajo (salario, jornada, complementos, vacaciones, permisos) para un sector y ámbito territorial. Es de obligado cumplimiento: tu empresa puede pagarte más, nunca menos.</p>

  <h2>¿Cómo sé qué convenio me aplica?</h2>
  <p>Depende de tres factores: el <strong>sector de actividad</strong> de la empresa (qué hace, no qué haces tú), el <strong>ámbito territorial</strong> (provincial, autonómico o estatal) y el <strong>ámbito funcional</strong> (algunos convenios excluyen puestos concretos). Si no estás seguro, consulta tu contrato o tu nómina: suele aparecer el código de convenio.</p>

  <div class="related">
    <h2 style="font-size:18px;">Guías relacionadas</h2>
    <ul>
      <li><a href="/reclamar-diferencias-salariales-convenio.html">Reclamar diferencias salariales de convenio</a></li>
      <li><a href="/salario-minimo-interprofesional-2026.html">Salario Mínimo Interprofesional 2026</a></li>
      <li><a href="/tramos-irpf-2026.html">Tramos IRPF 2026</a></li>
      <li><a href="/">Calculadora de salario neto</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`
  };
}

// ── MAIN ─────────────────────────────────────────────────────────────
function main() {
  console.log('Generando landings de convenios...\n');
  const generated = [];

  for (const [filename, meta] of Object.entries(CONVENIO_CONFIG)) {
    const rawData = JSON.parse(fs.readFileSync(path.join(DATA_DIR, filename), 'utf8'));

    if (meta.plurprovincial) {
      for (const prov of meta.provincias) {
        const data = adaptPlurProvincial(rawData, prov.key);
        if (!data) { console.warn(`  ⚠ Provincia ${prov.key} no disponible en ${filename}`); continue; }
        data.anyoMasReciente = Math.max(...Object.keys(rawData.provincias[prov.key].niveles[0].salario).map(Number));
        const page = generateConvenioPage(data, {
          sector: meta.sector, sectorSlug: meta.sectorSlug,
          provincia: prov.nombre, provinciaSlug: prov.slug
        });
        fs.writeFileSync(path.join(ROOT, page.fileName), page.html, 'utf8');
        console.log(`  ✓ ${page.fileName}`);
        generated.push({
          sector: meta.sector,
          provincia: prov.nombre,
          href: '/' + page.fileName,
          nombreCorto: `${meta.sector} — ${prov.nombre}`,
          vigencia: data.vigencia,
          enUltraactividad: detectaUltraactividad(data.vigencia),
        });
      }
    } else {
      const data = normalizeSimple(rawData);
      const page = generateConvenioPage(data, {
        sector: meta.sector, sectorSlug: meta.sectorSlug,
        provincia: meta.provincia, provinciaSlug: meta.provinciaSlug
      });
      fs.writeFileSync(path.join(ROOT, page.fileName), page.html, 'utf8');
      console.log(`  ✓ ${page.fileName}`);
      generated.push({
        sector: meta.sector,
        provincia: meta.provincia,
        href: '/' + page.fileName,
        nombreCorto: `${meta.sector} — ${meta.provincia}`,
        vigencia: data.vigencia,
        enUltraactividad: detectaUltraactividad(data.vigencia),
      });
    }
  }

  // Añadir landings manuales (no regenerables desde JSON):
  //  · Pilar de Limpieza (estatal) y sus provinciales (Sprint 1)
  //  · Construcción estatal (suelo salarial)
  // Se incluyen en /convenios.html y en el sitemap, pero los HTML son fuente de verdad.
  const MANUAL_CONVENIOS = [
    { sector: 'Limpieza de Edificios y Locales', ambito: 'Estatal · Pilar', provincia: null, href: '/convenio-limpieza-edificios-locales.html', nombreCorto: 'Limpieza — Estatal (pilar)', vigencia: '52 provincias · 800.000 trabajadores' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Madrid', href: '/convenio-limpieza-madrid.html', nombreCorto: 'Limpieza — Madrid', vigencia: 'Tabla 2025 · jornada 1.792 h', enUltraactividad: true },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Barcelona', href: '/convenio-limpieza-barcelona.html', nombreCorto: 'Limpieza — Barcelona', vigencia: '1 enero 2026 – 31 diciembre 2030' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Valencia', href: '/convenio-limpieza-valencia.html', nombreCorto: 'Limpieza — Valencia', vigencia: 'Tabla 2025 · jornada 1.780 h', enUltraactividad: true },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Sevilla', href: '/convenio-limpieza-sevilla.html', nombreCorto: 'Limpieza — Sevilla', vigencia: '1 enero 2024 – 31 diciembre 2027' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Málaga', href: '/convenio-limpieza-malaga.html', nombreCorto: 'Limpieza — Málaga', vigencia: 'Tabla 2025 · jornada 1.826 h', enUltraactividad: true },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Las Palmas', href: '/convenio-limpieza-laspalmas.html', nombreCorto: 'Limpieza — Las Palmas', vigencia: 'Tabla 2026 vigente · +3% sobre 2025' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Bizkaia', href: '/convenio-limpieza-bizkaia.html', nombreCorto: 'Limpieza — Bizkaia', vigencia: 'Jornada 35 h/sem · 0 cats bajo SMI' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Zaragoza', href: '/convenio-limpieza-zaragoza.html', nombreCorto: 'Limpieza — Zaragoza', vigencia: 'Tabla 2025 · prorrogado 2026 (Art. 5) · jornada 1.766 h' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Asturias', href: '/convenio-limpieza-asturias.html', nombreCorto: 'Limpieza — Asturias', vigencia: 'Tabla 2025 (corregida) · 3 pagas extras · jornada 1.758 h' },
    { sector: 'Limpieza de Edificios y Locales', provincia: 'Murcia', href: '/convenio-limpieza-murcia.html', nombreCorto: 'Limpieza — Murcia', vigencia: 'Convenio 2023-2027 · Tabla 2026 · 16 pagas anuales · jornada 1.748 h' },
    { sector: 'Construcción', ambito: 'Estatal', provincia: null, href: '/construccion-estatal-suelo-salarial.html', nombreCorto: 'Construcción — Suelo salarial estatal', vigencia: '1 enero 2022 – 31 diciembre 2026' },
  ];
  for (const m of MANUAL_CONVENIOS) generated.push(m);

  console.log('\nGenerando hub /convenios.html...');
  const hub = generateHub(generated);
  fs.writeFileSync(path.join(ROOT, hub.fileName), hub.html, 'utf8');
  console.log(`  ✓ ${hub.fileName}`);

  console.log(`\nListo. ${generated.length} convenios indexables.`);
  return generated;
}

if (require.main === module) main();
module.exports = { main };
