/**
 * Generador de landing pages estáticas para SEO
 * Genera páginas pre-calculadas de "salario neto X brutos en [ciudad]"
 * + página SMI + página tramos IRPF
 *
 * Uso: node scripts/generate-pages.js
 */

const fs = require('fs');
const path = require('path');
const { calcNet, calcDetailed } = require('../lib/irpf2026');
const { escalaParaCiudad, datosCcaa, ccaaDeCiudad } = require('../lib/irpf-autonomico');
const generateConvenios = require('./generate-convenios');
const generatePlantillas = require('./generate-plantillas');

const ROOT = path.join(__dirname, '..');

// ── Configuración ──────────────────────────────────────────────────
const SALARIES = [15000, 18000, 20000, 22000, 25000, 28000, 30000, 35000, 40000, 45000, 50000, 60000, 70000, 100000];
const CITIES = [
  { id: 'madrid',    name: 'Madrid' },
  { id: 'barcelona', name: 'Barcelona' },
  { id: 'valencia',  name: 'Valencia' },
  { id: 'sevilla',   name: 'Sevilla' },
  { id: 'bilbao',    name: 'Bilbao' },
  { id: 'malaga',    name: 'Málaga' },
  { id: 'zaragoza',  name: 'Zaragoza' },
  { id: 'alicante',  name: 'Alicante' },
  { id: 'murcia',    name: 'Murcia' },
  { id: 'palma',     name: 'Palma de Mallorca' },
  { id: 'laspalmas', name: 'Las Palmas de Gran Canaria' },
  { id: 'acoruna',   name: 'A Coruña' },
];

const SITUATIONS = [
  { id: 'single', label: 'Soltero/a sin hijos' },
  { id: 'single_kids', label: 'Monoparental (1 hijo)' },
  { id: 'married_noincome', label: 'Casado/a (cónyuge sin ingresos)' },
];

const fmt = n => new Intl.NumberFormat('es-ES').format(n);
const fmtEur = n => fmt(n) + ' €';
const today = '2026-05-06';

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
  "sameAs": ["https://salariojusto.es/sobre.html"]
}, null, 2);

// ── Helper: bloque interlinking convenio por ciudad ──────────────────
// Para cada landing salario-neto-{tramo}-{ciudad}, busca convenios
// existentes en esa ciudad y los enlaza.
function relatedConveniosForCity(cityId, cityName) {
  const sectores = [
    { slug: 'hosteleria', label: 'Hostelería' },
    { slug: 'limpieza', label: 'Limpieza de Edificios y Locales' },
    { slug: 'oficinas', label: 'Oficinas y Despachos' },
  ];
  const links = [];
  for (const s of sectores) {
    const file = path.join(ROOT, `convenio-${s.slug}-${cityId}.html`);
    if (fs.existsSync(file)) {
      links.push(`<li><a href="/convenio-${s.slug}-${cityId}.html">Convenio de ${s.label} en ${cityName}</a></li>`);
    }
  }
  return links;
}

// ── Escala IRPF para la página de tramos ───────────────────────────
const TRAMOS = [
  { desde: 0, hasta: 12450, tipo: 19 },
  { desde: 12450, hasta: 20200, tipo: 24 },
  { desde: 20200, hasta: 35200, tipo: 30 },
  { desde: 35200, hasta: 60000, tipo: 37 },
  { desde: 60000, hasta: 300000, tipo: 45 },
  { desde: 300000, hasta: null, tipo: 47 },
];

// ── SMI histórico ──────────────────────────────────────────────────
const SMI_HIST = [
  { año: 2020, mensual: 950, anual: 13300, pagas: 14 },
  { año: 2021, mensual: 965, anual: 13510, pagas: 14 },
  { año: 2022, mensual: 1000, anual: 14000, pagas: 14 },
  { año: 2023, mensual: 1080, anual: 15120, pagas: 14 },
  { año: 2024, mensual: 1134, anual: 15876, pagas: 14 },
  { año: 2025, mensual: 1184, anual: 16576, pagas: 14 },
  { año: 2026, mensual: 1184, anual: 16576, pagas: 14 },
];

// ── Helpers HTML ───────────────────────────────────────────────────
function navHTML(activePage) {
  return `
<header style="position:sticky;top:0;z-index:100;">
  <a href="/" class="logo">
    <div class="logo-mark">§</div>
    <div class="logo-text">Salario<span>Justo</span></div>
  </a>
  <a href="/" class="header-cta">Calculadora completa →</a>
</header>`;
}

// REGLA · El footer global DEBE incluir siempre los enlaces legales
// (Privacidad, Aviso legal, Contacto). Se renderizan en una segunda línea
// discreta para no competir con la navegación principal pero accesibles
// para cumplir requisitos LSSI/RGPD/AdSense en cualquier landing del sitio.
function footerHTML() {
  return `
<footer style="background:#2D2520;padding:24px 32px;text-align:center;">
  <p style="font-size:12px;color:rgba(255,255,255,0.5);line-height:1.6;">
    SalarioJusto · Herramienta gratuita para trabajadores y trabajadoras · Sin empresas detrás<br>
    <a href="/" style="color:#D9A06A;text-decoration:none;">Calculadora</a> ·
    <a href="/convenios.html" style="color:#D9A06A;text-decoration:none;">Convenios</a> ·
    <a href="/guias.html" style="color:#D9A06A;text-decoration:none;">Guías</a> ·
    <a href="/sobre.html" style="color:#D9A06A;text-decoration:none;">Sobre</a> ·
    <a href="/mapa-del-sitio.html" style="color:#D9A06A;text-decoration:none;">Mapa del sitio</a> ·
    <a href="/en/" style="color:#D9A06A;text-decoration:none;">English</a>
  </p>
  <p style="font-size:11px;color:rgba(255,255,255,0.35);line-height:1.5;margin-top:14px;">
    <a href="/privacidad.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Privacidad</a> ·
    <a href="/aviso-legal.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Aviso legal</a> ·
    <a href="/contacto.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Contacto</a> ·
    <a href="/sala-de-prensa.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Prensa</a>
  </p>
</footer>`;
}

function headCSS() {
  return `
  <style>
    :root{--cream-50:#FDFBF7;--cream-100:#F7F0E6;--cream-200:#EDE0CE;--gold:#C17B3E;--gold-dark:#A0622A;--gold-light:#D9A06A;--ink:#2D2520;--ink-light:#6B5E52;--ink-lighter:#9B8E88;--green:#2E7D52;--green-bg:#EAF5EE;--red:#B91C1C;--red-bg:#FEE2E2;--amber:#B45309;--amber-bg:#FEF3C7;--blue:#1D4ED8;--blue-bg:#EFF6FF;}
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:var(--cream-50);color:var(--ink);line-height:1.75;}
    header{background:var(--ink);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:56px;}
    .logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
    .logo-mark{width:28px;height:28px;border:1px solid rgba(217,160,106,0.5);display:flex;align-items:center;justify-content:center;font-family:'Newsreader',serif;font-size:17px;font-weight:500;color:var(--gold-light);line-height:1;padding-top:2px;}
    .logo-text{font-family:'Newsreader',serif;font-size:22px;font-weight:600;color:var(--gold-light);letter-spacing:-0.025em;line-height:1;font-feature-settings:"kern" 1,"liga" 1;}
    .logo-text span{color:#fff;}
    .header-cta{background:var(--gold);color:#fff;padding:8px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;}
    .header-cta:hover{background:var(--gold-dark);}
    .hero{background:var(--ink);padding:48px 32px 40px;text-align:center;}
    .hero-badge{display:inline-flex;align-items:center;gap:6px;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-light);border:1px solid rgba(193,123,62,0.35);padding:4px 12px;margin-bottom:20px;}
    .hero h1{font-family:'DM Serif Display',serif;font-size:clamp(22px,3.5vw,34px);color:#fff;font-weight:400;line-height:1.25;max-width:700px;margin:0 auto 16px;}
    .hero h1 em{font-style:normal;color:var(--gold-light);}
    .hero-sub{font-size:15px;color:rgba(255,255,255,0.6);max-width:550px;margin:0 auto;}
    main{max-width:860px;margin:0 auto;padding:40px 24px 64px;}
    .card{background:#fff;border:1px solid var(--cream-200);padding:32px;margin-bottom:24px;box-shadow:0 1px 3px rgba(45,37,32,0.06);}
    .card-title{font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold);margin-bottom:16px;display:flex;align-items:center;gap:10px;}
    .card-title::after{content:'';flex:1;height:1px;background:var(--cream-200);}
    table{width:100%;border-collapse:collapse;margin:12px 0;}
    th{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink-lighter);text-align:left;padding:10px 12px;border-bottom:2px solid var(--cream-200);}
    td{padding:10px 12px;border-bottom:1px solid var(--cream-100);font-size:14px;color:var(--ink-light);}
    td:first-child{font-weight:600;color:var(--ink);}
    .highlight{background:var(--green-bg);font-weight:700;color:var(--green);}
    .cta-box{background:var(--ink);padding:28px;text-align:center;margin:32px 0;}
    .cta-box p{color:rgba(255,255,255,0.7);font-size:14px;margin-bottom:14px;}
    .cta-btn{display:inline-block;background:var(--gold);color:#fff;padding:14px 28px;font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;}
    .cta-btn:hover{background:var(--gold-dark);}
    h2{font-family:'DM Serif Display',serif;font-size:22px;font-weight:400;color:var(--ink);margin:36px 0 14px;padding-top:24px;border-top:1px solid var(--cream-200);}
    h3{font-size:16px;font-weight:700;color:var(--ink);margin:20px 0 8px;}
    p{color:var(--ink-light);font-size:15px;margin-bottom:14px;}
    a{color:var(--gold);text-decoration:none;}
    a:hover{text-decoration:underline;}
    .related{margin-top:40px;padding:28px;background:var(--cream-100);border:1px solid var(--cream-200);}
    .related h2{border:none;padding:0;margin:0 0 14px;}
    .related ul{list-style:none;padding:0;display:flex;flex-direction:column;gap:10px;}
    .related a{color:var(--gold-dark);font-weight:500;font-size:14px;}
    .cities-grid{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0;}
    .city-link{display:inline-block;padding:6px 14px;background:#fff;border:1px solid var(--cream-200);font-size:13px;font-weight:500;color:var(--ink-light);text-decoration:none;}
    .city-link:hover,.city-link.active{background:var(--gold);color:#fff;border-color:var(--gold);text-decoration:none;}
    @media(max-width:600px){main{padding:24px 16px 48px;}.card{padding:20px;}th,td{padding:8px 6px;font-size:12px;}}
  </style>`;
}

// ── Generar página de salario ──────────────────────────────────────
function generateSalaryPage(gross, city) {
  const grossFmt = fmt(gross);
  const fileName = `salario-neto-${gross}-euros-brutos-${city.id}.html`;
  const url = `https://salariojusto.es/${fileName}`;
  const title = `Salario neto de ${grossFmt} € brutos en ${city.name} (2026) | SalarioJusto`;
  const desc = `Si cobras ${grossFmt} € brutos anuales en ${city.name}, descubre cuánto es tu salario neto en 2026 tras IRPF y Seguridad Social. Cálculo oficial AEAT.`;

  // Escala autonómica específica de esta ciudad — neto varía por CCAA.
  // Fuentes citadas en lib/irpf-autonomico.js.
  const escalaCity = escalaParaCiudad(city.id);
  const ccaaId = ccaaDeCiudad(city.id);
  const ccaaInfo = datosCcaa(ccaaId);
  const esForal = ccaaId === 'BIZKAIA';

  // Calcular para cada situación
  const results = SITUATIONS.map(sit => {
    const hijos3 = sit.id === 'single_kids' ? '1' : '0';
    const r = calcNet(gross, sit.id, hijos3, '0', '0', '0', '0', 'no', '14', 1985, 'ACTIVO', 'NINGUNA', false, escalaCity);
    return {
      ...sit,
      net: r.net,
      irpf: r.irpf || 0,
      ss: r.ss,
      tipo: r.tipo || 0,
      netMes14: Math.round(r.net / 14),
      netMes12: Math.round(r.net / 12),
    };
  });

  const single = results[0];
  const ssPct = '7,56';
  const ssAmount = fmtEur(single.ss);

  // Otras ciudades para este salario
  const otherCities = CITIES.filter(c => c.id !== city.id);

  // FAQs
  const faqs = [
    {
      q: `¿Cuánto son ${grossFmt} € brutos en neto en ${city.name}?`,
      a: `Con un salario bruto anual de ${grossFmt} € en ${city.name} (2026), siendo soltero/a sin hijos y 14 pagas, tu salario neto anual es de ${fmtEur(single.net)}, lo que equivale a ${fmtEur(single.netMes14)} netos al mes.`
    },
    {
      q: `¿Cuánto IRPF se paga con ${grossFmt} € brutos?`,
      a: `El tipo de retención de IRPF para ${grossFmt} € brutos anuales es del ${single.tipo.toFixed(2).replace('.', ',')}%. Esto supone ${fmtEur(single.irpf)} anuales de retención. Además se descuentan ${ssAmount} de cotizaciones a la Seguridad Social (${ssPct}%).`
    },
    {
      q: `¿Cuánto cobro al mes con ${grossFmt} € brutos y 14 pagas?`,
      a: `Con 14 pagas, tu salario neto mensual es de ${fmtEur(single.netMes14)}. Con 12 pagas serían ${fmtEur(single.netMes12)} al mes, pero en ambos casos el neto anual es el mismo: ${fmtEur(single.net)}.`
    },
    {
      q: `¿Cuánto se queda Hacienda de ${grossFmt} € brutos?`,
      a: `Entre IRPF (${fmtEur(single.irpf)}) y cotizaciones a la Seguridad Social (${ssAmount}), Hacienda y la SS retienen un total de ${fmtEur(single.irpf + single.ss)}, lo que supone un ${((single.irpf + single.ss) / gross * 100).toFixed(1).replace('.', ',')}% de tu salario bruto.`
    },
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": `Salario neto ${grossFmt} € brutos`, "item": url }
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
  <meta property="og:title" content="Salario neto de ${grossFmt} € brutos en ${city.name} (2026)">
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

<section class="hero">
  <div class="hero-badge">Cálculo IRPF 2026 · ${city.name}</div>
  <h1>Si cobras <em>${grossFmt} € brutos</em> en ${city.name}, tu salario neto en 2026 es…</h1>
  <p class="hero-sub">Resultado calculado con el algoritmo oficial de la Agencia Tributaria (IRPF 2026). Sin registro, sin datos personales.</p>
</section>

<main>

  <div class="card">
    <div class="card-title">Resultado principal — Soltero/a, sin hijos, 14 pagas</div>
    <table>
      <tr>
        <td>Salario bruto anual</td>
        <td>${fmtEur(gross)}</td>
      </tr>
      <tr>
        <td>Cotizaciones SS (${ssPct}%)</td>
        <td>−${ssAmount}</td>
      </tr>
      <tr>
        <td>Retención IRPF (${single.tipo.toFixed(2).replace('.', ',')}%)</td>
        <td>−${fmtEur(single.irpf)}</td>
      </tr>
      <tr class="highlight">
        <td>Salario neto anual</td>
        <td>${fmtEur(single.net)}</td>
      </tr>
      <tr class="highlight">
        <td>Neto al mes (14 pagas)</td>
        <td>${fmtEur(single.netMes14)}</td>
      </tr>
      <tr>
        <td>Neto al mes (12 pagas)</td>
        <td>${fmtEur(single.netMes12)}</td>
      </tr>
    </table>
  </div>

  <div class="card">
    <div class="card-title">Comparativa por situación familiar</div>
    <table>
      <thead>
        <tr>
          <th>Situación</th>
          <th>IRPF</th>
          <th>Neto anual</th>
          <th>Neto/mes (14p)</th>
        </tr>
      </thead>
      <tbody>
${results.map(r => `        <tr>
          <td>${r.label}</td>
          <td>${r.tipo.toFixed(2).replace('.', ',')}%</td>
          <td>${fmtEur(r.net)}</td>
          <td>${fmtEur(r.netMes14)}</td>
        </tr>`).join('\n')}
      </tbody>
    </table>
  </div>

  <div class="card">
    <div class="card-title">Fiscalidad en ${ccaaInfo.ccaaNombre}</div>
    <p>${esForal
      ? `${city.name} se encuentra en el <strong>${ccaaInfo.ccaaNombre}</strong>, territorio con <strong>régimen foral pleno</strong>. La Hacienda Foral de Bizkaia aplica una tarifa propia del IRPF — <em>no suma tarifa estatal y autonómica</em> como el régimen común. Norma aplicable: ${ccaaInfo.norma}. ${ccaaInfo.notaPresupuestos}`
      : `${city.name} aplica la escala autonómica del IRPF de <strong>${ccaaInfo.ccaaNombre}</strong>, que se suma a la escala estatal. Norma aplicable: ${ccaaInfo.norma}. ${ccaaInfo.notaPresupuestos}`}</p>
    ${esForal
      ? `<p style="font-size:13px;color:#7a6f60;margin-top:12px;"><strong>Nota:</strong> la cifra mostrada es una aproximación que aplica la tarifa foral de Bizkaia sobre la base calculada con las reglas generales del IRPF común. El cálculo foral exacto usa mínimos y reducciones forales propios — para una cifra definitiva consulta a la <a href="${ccaaInfo.fuenteEnlace}" target="_blank" rel="noopener">Diputación Foral de Bizkaia</a>.</p>`
      : `<p style="font-size:13px;color:#7a6f60;margin-top:12px;">Fuente oficial: <a href="${ccaaInfo.fuenteEnlace}" target="_blank" rel="noopener">${ccaaInfo.fuenteEnlace.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}</a>. Confirmación de vigencia para 2026: Ministerio de Hacienda, "Tributación Autonómica 2026" (Cap. II, actualizado 10/03/2026).</p>`}
  </div>

  <div class="cta-box">
    <p>¿Quieres un cálculo exacto con hijos, ascendientes, discapacidad o Ley Beckham?</p>
    <a href="/" class="cta-btn">Usar la calculadora completa →</a>
  </div>

  <h2>${grossFmt} € brutos en otras ciudades</h2>
  <p>Cada comunidad autónoma fija su propia escala del IRPF (y Bizkaia aplica régimen foral), así que el neto difiere entre ciudades de distintas CCAA. Compara:</p>
  <div class="cities-grid">
    <a href="/salario-neto-${gross}-euros-brutos-${city.id}.html" class="city-link active">${city.name}</a>
${otherCities.map(c => `    <a href="/salario-neto-${gross}-euros-brutos-${c.id}.html" class="city-link">${c.name}</a>`).join('\n')}
  </div>

  <h2>Otros tramos salariales en ${city.name}</h2>
  <div class="cities-grid">
${SALARIES.filter(s => s !== gross).map(s => `    <a href="/salario-neto-${s}-euros-brutos-${city.id}.html" class="city-link">${fmt(s)} € brutos</a>`).join('\n')}
  </div>

  <h2>Preguntas frecuentes</h2>
${faqs.map(f => `  <h3>${f.q}</h3>
  <p>${f.a}</p>`).join('\n\n')}

  ${(() => {
    const conv = relatedConveniosForCity(city.id, city.name);
    if (conv.length === 0) return '';
    return `<div class="related">
    <h2 style="font-size:18px;">Convenios colectivos en ${city.name}</h2>
    <p style="font-size:13px;color:#7a6f60;margin-bottom:8px;">¿Tu salario coincide con tu convenio? Verifícalo en estas guías:</p>
    <ul>
      ${conv.join('\n      ')}
    </ul>
  </div>`;
  })()}

  <div class="related">
    <h2 style="font-size:18px;">Guías relacionadas</h2>
    <ul>
      <li><a href="/tramos-irpf-2026.html">Tramos IRPF 2026: tabla completa y ejemplos →</a></li>
      <li><a href="/salario-minimo-interprofesional-2026.html">Salario Mínimo Interprofesional 2026 →</a></li>
      <li><a href="/ley-transparencia-salarial-2026.html">Ley de Transparencia Salarial 2026 →</a></li>
      <li><a href="/reclamar-diferencias-salariales-convenio.html">Cómo reclamar diferencias con tu convenio →</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`;

  return { fileName, html };
}

// ── Generar página SMI ─────────────────────────────────────────────
function generateSMIPage() {
  const smi2026 = SMI_HIST[SMI_HIST.length - 1];
  const r = calcNet(smi2026.anual, 'single', '0', '0', '0', '0', '0', 'no', '14', 1985, 'ACTIVO', 'NINGUNA', false);

  const faqs = [
    { q: '¿Cuánto es el SMI en 2026?', a: `El Salario Mínimo Interprofesional en 2026 es de ${fmtEur(smi2026.anual)} brutos anuales, repartidos en 14 pagas de ${fmtEur(smi2026.mensual)} cada una.` },
    { q: '¿El SMI paga IRPF?', a: r.exento ? 'No. El SMI en 2026 está exento de retención de IRPF para la mayoría de situaciones familiares, ya que no supera los límites de la tabla de exenciones del artículo 81 del RIRPF.' : `Sí. Siendo soltero/a sin hijos, el tipo de retención es del ${r.tipo.toFixed(2).replace('.', ',')}%.` },
    { q: '¿Cuánto es el SMI neto en 2026?', a: `Tras descontar las cotizaciones a la Seguridad Social (7,56%), el SMI neto anual es de aproximadamente ${fmtEur(r.net)}, lo que equivale a ${fmtEur(Math.round(r.net / 14))} netos al mes con 14 pagas.` },
    { q: '¿Cuántas pagas tiene el SMI?', a: 'El SMI se establece en 14 pagas anuales (12 mensualidades + 2 pagas extraordinarias). Algunas empresas lo prorratean en 12 pagas, pero el total anual es el mismo.' },
    { q: '¿Ha subido el SMI en 2026?', a: `El SMI ha pasado de ${fmtEur(SMI_HIST[0].anual)} anuales en 2020 a ${fmtEur(smi2026.anual)} en 2026, una subida del ${((smi2026.anual / SMI_HIST[0].anual - 1) * 100).toFixed(1).replace('.', ',')}% en 6 años.` },
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": "Salario Mínimo Interprofesional 2026" }
    ]
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Salario Mínimo Interprofesional (SMI) 2026: cuantía, neto y evolución | SalarioJusto</title>
  <meta name="description" content="SMI 2026 en España: ${fmtEur(smi2026.anual)} brutos anuales (${fmtEur(smi2026.mensual)}/mes en 14 pagas). Cuánto es en neto, si paga IRPF y evolución histórica desde 2020.">
  <link rel="canonical" href="https://salariojusto.es/salario-minimo-interprofesional-2026.html">
  <link rel="alternate" hreflang="es" href="https://salariojusto.es/salario-minimo-interprofesional-2026.html">
  <link rel="alternate" hreflang="x-default" href="https://salariojusto.es/salario-minimo-interprofesional-2026.html">
  <meta property="og:title" content="SMI 2026: cuantía, neto y evolución histórica">
  <meta property="og:description" content="Salario Mínimo Interprofesional 2026: ${fmtEur(smi2026.anual)} brutos/año. Descubre cuánto es en neto y si paga IRPF.">
  <meta property="og:url" content="https://salariojusto.es/salario-minimo-interprofesional-2026.html">
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

<section class="hero">
  <div class="hero-badge">SMI España · 2026</div>
  <h1>Salario Mínimo Interprofesional 2026: <em>${fmtEur(smi2026.anual)}</em> brutos al año</h1>
  <p class="hero-sub">${fmtEur(smi2026.mensual)} al mes en 14 pagas. ¿Cuánto es en neto? ¿Paga IRPF? Todo lo que necesitas saber.</p>
</section>

<main>

  <div class="card">
    <div class="card-title">SMI 2026 en cifras</div>
    <table>
      <tr><td>Bruto anual</td><td>${fmtEur(smi2026.anual)}</td></tr>
      <tr><td>Bruto mensual (14 pagas)</td><td>${fmtEur(smi2026.mensual)}</td></tr>
      <tr><td>Bruto mensual (12 pagas)</td><td>${fmtEur(Math.round(smi2026.anual / 12))}</td></tr>
      <tr><td>Cotizaciones SS (7,56%)</td><td>−${fmtEur(r.ss)}</td></tr>
      <tr><td>Retención IRPF</td><td>${r.exento ? 'Exento (0 €)' : '−' + fmtEur(r.irpf)}</td></tr>
      <tr class="highlight"><td>Neto anual</td><td>${fmtEur(r.net)}</td></tr>
      <tr class="highlight"><td>Neto mensual (14 pagas)</td><td>${fmtEur(Math.round(r.net / 14))}</td></tr>
    </table>
  </div>

  <h2>Evolución histórica del SMI (2020–2026)</h2>
  <div class="card">
    <table>
      <thead>
        <tr><th>Año</th><th>Mensual (14p)</th><th>Anual bruto</th><th>Subida</th></tr>
      </thead>
      <tbody>
${SMI_HIST.map((s, i) => {
  const prev = i > 0 ? SMI_HIST[i-1].anual : s.anual;
  const pct = i > 0 ? ((s.anual / prev - 1) * 100).toFixed(1).replace('.', ',') + '%' : '—';
  return `        <tr><td>${s.año}</td><td>${fmtEur(s.mensual)}</td><td>${fmtEur(s.anual)}</td><td>${pct}</td></tr>`;
}).join('\n')}
      </tbody>
    </table>
  </div>

  <div class="cta-box">
    <p>¿Cobras más que el SMI? Calcula tu salario neto exacto con todas las deducciones.</p>
    <a href="/" class="cta-btn">Calculadora de salario neto →</a>
  </div>

  <h2>Preguntas frecuentes sobre el SMI</h2>
${faqs.map(f => `  <h3>${f.q}</h3>
  <p>${f.a}</p>`).join('\n\n')}

  <div class="related">
    <h2 style="font-size:18px;">Guías relacionadas</h2>
    <ul>
      <li><a href="/tramos-irpf-2026.html">Tramos IRPF 2026: tabla completa y ejemplos →</a></li>
      <li><a href="/ley-transparencia-salarial-2026.html">Ley de Transparencia Salarial 2026 →</a></li>
      <li><a href="/convenios.html">Convenios colectivos por provincia →</a></li>
      <li><a href="/construccion-estatal-suelo-salarial.html">Convenio Construcción Estatal →</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`;

  return { fileName: 'salario-minimo-interprofesional-2026.html', html };
}

// ── Generar página tramos IRPF ─────────────────────────────────────
function generateTramosPage() {
  // Pre-calcular ejemplos en cada frontera de tramo
  const examples = [12450, 20200, 35200, 60000, 100000].map(gross => {
    const r = calcNet(gross, 'single', '0', '0', '0', '0', '0', 'no', '14', 1985, 'ACTIVO', 'NINGUNA', false);
    return { gross, net: r.net, irpf: r.irpf || 0, ss: r.ss, tipo: r.tipo || 0 };
  });

  const faqs = [
    { q: '¿Cuáles son los tramos del IRPF en 2026?', a: 'Los tramos del IRPF 2026 son: 19% hasta 12.450 €, 24% de 12.450 a 20.200 €, 30% de 20.200 a 35.200 €, 37% de 35.200 a 60.000 €, 45% de 60.000 a 300.000 €, y 47% a partir de 300.000 €.' },
    { q: '¿Qué es el tipo marginal y el tipo efectivo?', a: 'El tipo marginal es el porcentaje que se aplica al último euro que ganas (por ejemplo, 30% si ganas 25.000 €). El tipo efectivo es el porcentaje real sobre todo tu salario, que siempre es menor porque los primeros euros se gravan a tipos más bajos.' },
    { q: '¿Cuánto IRPF pago con 30.000 € brutos?', a: `Con 30.000 € brutos anuales (soltero, sin hijos), la retención efectiva de IRPF es de aproximadamente un ${examples.find(e => e.gross === 35200) ? examples[2].tipo.toFixed(2).replace('.', ',') : '14'}%, no del 30% que indica el tramo marginal.` },
    { q: '¿Los tramos del IRPF son iguales en toda España?', a: 'Los tramos estatales son los mismos en toda España. Sin embargo, cada comunidad autónoma puede ajustar la parte autonómica (aproximadamente el 50% de la cuota). En la práctica, las diferencias entre comunidades son pequeñas para la mayoría de salarios.' },
  ];

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({ "@type": "Question", "name": f.q, "acceptedAnswer": { "@type": "Answer", "text": f.a } }))
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": "Tramos IRPF 2026" }
    ]
  }, null, 2);

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tramos IRPF 2026: tabla completa, tipos y ejemplos prácticos | SalarioJusto</title>
  <meta name="description" content="Tabla de tramos del IRPF 2026 en España: tipos marginales del 19% al 47%. Con ejemplos reales de retención para salarios de 12.450 € a 100.000 € brutos.">
  <link rel="canonical" href="https://salariojusto.es/tramos-irpf-2026.html">
  <link rel="alternate" hreflang="es" href="https://salariojusto.es/tramos-irpf-2026.html">
  <link rel="alternate" hreflang="x-default" href="https://salariojusto.es/tramos-irpf-2026.html">
  <meta property="og:title" content="Tramos IRPF 2026: tabla completa y ejemplos">
  <meta property="og:description" content="Los 6 tramos del IRPF 2026 con tipos del 19% al 47%. Ejemplos reales de cuánto pagas según tu salario.">
  <meta property="og:url" content="https://salariojusto.es/tramos-irpf-2026.html">
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

<section class="hero">
  <div class="hero-badge">IRPF España · 2026</div>
  <h1>Tramos del IRPF 2026: <em>del 19% al 47%</em></h1>
  <p class="hero-sub">Tabla oficial de tipos marginales, qué significa cada tramo y ejemplos reales de cuánto pagas según tu salario bruto.</p>
</section>

<main>

  <div class="card">
    <div class="card-title">Tabla de tramos IRPF 2026</div>
    <table>
      <thead>
        <tr><th>Base liquidable</th><th>Tipo marginal</th><th>Cuota acumulada</th></tr>
      </thead>
      <tbody>
        <tr><td>0 € – 12.450 €</td><td>19%</td><td>2.365,50 €</td></tr>
        <tr><td>12.450 € – 20.200 €</td><td>24%</td><td>4.225,50 €</td></tr>
        <tr><td>20.200 € – 35.200 €</td><td>30%</td><td>8.725,50 €</td></tr>
        <tr><td>35.200 € – 60.000 €</td><td>37%</td><td>17.901,50 €</td></tr>
        <tr><td>60.000 € – 300.000 €</td><td>45%</td><td>125.901,50 €</td></tr>
        <tr><td>Más de 300.000 €</td><td>47%</td><td>—</td></tr>
      </tbody>
    </table>
  </div>

  <h2>¿Qué significa "tipo marginal"?</h2>
  <p>El tipo marginal <strong>solo se aplica a la parte del salario que cae en ese tramo</strong>, no a todo tu sueldo. Por ejemplo, si ganas 30.000 € brutos, no pagas un 30% de todo — pagas el 19% de los primeros 12.450 €, el 24% de los siguientes 7.750 €, y el 30% solo de lo que supera 20.200 €.</p>
  <p>Por eso el <strong>tipo efectivo</strong> (lo que realmente pagas sobre el total) siempre es menor que el tramo marginal.</p>

  <h2>Ejemplos reales de retención por salario</h2>
  <div class="card">
    <table>
      <thead>
        <tr><th>Bruto anual</th><th>Retención IRPF</th><th>Tipo efectivo</th><th>SS (7,56%)</th><th>Neto anual</th></tr>
      </thead>
      <tbody>
${examples.map(e => `        <tr><td>${fmtEur(e.gross)}</td><td>${fmtEur(e.irpf)}</td><td>${e.tipo.toFixed(2).replace('.', ',')}%</td><td>${fmtEur(e.ss)}</td><td><strong>${fmtEur(e.net)}</strong></td></tr>`).join('\n')}
      </tbody>
    </table>
    <p style="font-size:12px;color:var(--ink-lighter);margin-top:8px;">Cálculos para soltero/a sin hijos, 14 pagas, sin discapacidad ni movilidad geográfica.</p>
  </div>

  <div class="cta-box">
    <p>Calcula tu retención exacta con tu situación familiar completa.</p>
    <a href="/" class="cta-btn">Calculadora de salario neto →</a>
  </div>

  <h2>Preguntas frecuentes sobre el IRPF 2026</h2>
${faqs.map(f => `  <h3>${f.q}</h3>
  <p>${f.a}</p>`).join('\n\n')}

  <div class="related">
    <h2 style="font-size:18px;">Guías relacionadas</h2>
    <ul>
      <li><a href="/salario-minimo-interprofesional-2026.html">Salario Mínimo Interprofesional 2026 →</a></li>
      <li><a href="/ley-transparencia-salarial-2026.html">Ley de Transparencia Salarial 2026 →</a></li>
      <li><a href="/reclamar-diferencias-salariales-convenio.html">Reclamar diferencias salariales con convenio →</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`;

  return { fileName: 'tramos-irpf-2026.html', html };
}

// ── Generar página hub /salarios.html ──────────────────────────────
function generateHubPage() {
  const title = 'Calculadora de salario neto por ciudad y tramo (IRPF 2026) | SalarioJusto';
  const desc = `Todas las combinaciones de salario neto calculadas: ${SALARIES.length} tramos brutos × ${CITIES.length} ciudades. IRPF 2026 oficial, datos AEAT.`;
  const url = 'https://salariojusto.es/salarios.html';

  const collectionSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Salario neto calculado por ciudad y tramo IRPF 2026",
    "url": url,
    "description": desc,
    "numberOfItems": SALARIES.length * CITIES.length
  }, null, 2);

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": "Cálculos de salario neto", "item": url }
    ]
  }, null, 2);

  // Tabla: filas = tramos, columnas = ciudades
  const rows = SALARIES.map(gross => {
    const cells = CITIES.map(c => `<td><a href="/salario-neto-${gross}-euros-brutos-${c.id}.html">${fmtEur(gross)}<br><span style="font-size:11px;color:var(--ink-lighter);">en ${c.name}</span></a></td>`).join('');
    return `        <tr><th>${fmtEur(gross)}</th>${cells}</tr>`;
  }).join('\n');

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
  <meta property="og:title" content="Calculadora de salario neto por ciudad y tramo (IRPF 2026)">
  <meta property="og:description" content="${desc}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="https://salariojusto.es/preview.jpg">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="dns-prefetch" href="https://www.googletagmanager.com">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">
  <script type="application/ld+json">${ORGANIZATION_SCHEMA}</script>
  <script type="application/ld+json">${breadcrumbSchema}</script>
  <script type="application/ld+json">${collectionSchema}</script>
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MXJ8V2FBW9"></script>
  <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-MXJ8V2FBW9');</script>
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1110009006533891" crossorigin="anonymous"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&family=Newsreader:wght@500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
  ${headCSS()}
  <style>
    .hub-table{width:100%;border-collapse:collapse;margin:8px 0 32px;}
    .hub-table th{font-size:12px;font-weight:700;color:var(--ink);background:var(--cream-100);padding:12px;text-align:center;border:1px solid var(--cream-200);}
    .hub-table td{padding:0;border:1px solid var(--cream-200);text-align:center;}
    .hub-table td a{display:block;padding:14px 8px;color:var(--gold);text-decoration:none;font-size:13px;font-weight:600;line-height:1.35;}
    .hub-table td a:hover{background:var(--cream-100);text-decoration:none;}
    .hub-table thead th:first-child{background:var(--ink);color:#fff;}
    .hub-table tbody th{background:var(--cream-50);font-size:13px;}
    @media(max-width:700px){.hub-table th,.hub-table td a{padding:8px 4px;font-size:11px;}.hub-table td a span{display:none;}}
  </style>
</head>
<body>

${navHTML()}

<div style="background:var(--cream-100);border-bottom:1px solid var(--cream-200);padding:10px 32px;font-size:12px;color:var(--ink-lighter);"><a href="/" style="color:var(--gold);">SalarioJusto</a> › Cálculos de salario neto</div>

<section class="hero">
  <div class="hero-badge">${SALARIES.length * CITIES.length} cálculos precomputados</div>
  <h1>Salario neto por <em>ciudad y tramo</em> — IRPF 2026</h1>
  <p class="hero-sub">Todas las combinaciones de salario bruto y ciudad con el cálculo oficial de la Agencia Tributaria. Elige el tuyo:</p>
</section>

<main>

  <div class="card">
    <div class="card-title">Matriz completa</div>
    <div style="overflow-x:auto;">
      <table class="hub-table">
        <thead>
          <tr>
            <th>Bruto anual</th>
${CITIES.map(c => `            <th>${c.name}</th>`).join('\n')}
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
  </div>

  <div class="cta-box">
    <p>¿Tu caso es distinto? Hijos, discapacidad, Ley Beckham, movilidad geográfica…</p>
    <a href="/" class="cta-btn">Calculadora completa personalizada →</a>
  </div>

  <h2>Guías fiscales y convenios 2026</h2>
  <div class="cities-grid">
    <a href="/tramos-irpf-2026.html" class="city-link">Tramos IRPF 2026 →</a>
    <a href="/salario-minimo-interprofesional-2026.html" class="city-link">Salario Mínimo Interprofesional 2026 →</a>
    <a href="/convenios.html" class="city-link">Convenios colectivos →</a>
    <a href="/ley-transparencia-salarial-2026.html" class="city-link">Ley de Transparencia Salarial →</a>
    <a href="/reclamar-diferencias-salariales-convenio.html" class="city-link">Reclamar diferencias de convenio →</a>
    <a href="/denunciar-brecha-salarial-guia-practica-2026.html" class="city-link">Denunciar brecha salarial →</a>
    <a href="/rangos-salariales-empresa-transparencia-2026.html" class="city-link">Rangos salariales en empresa →</a>
    <a href="/guias.html" class="city-link">Ver todas las guías →</a>
  </div>

  <h2>¿Cómo se calcula?</h2>
  <p>Cada celda de la matriz usa el algoritmo oficial de retención IRPF 2026 publicado por la Agencia Tributaria. Se aplican las escalas estatal y autonómica, el mínimo personal y familiar, y las cotizaciones a la Seguridad Social del trabajador (7,56% del salario bruto).</p>
  <p>Los resultados asumen una persona soltera sin hijos y 14 pagas. Si tu situación familiar es distinta o quieres ajustes específicos, usa la <a href="/">calculadora completa</a> donde puedes introducir hijos menores, ascendientes, discapacidad o régimen Beckham.</p>

  <div class="related">
    <h2 style="font-size:18px;">Navegación rápida</h2>
    <ul>
      <li><a href="/">← Volver a la calculadora</a></li>
      <li><a href="/guias.html">Guías para trabajadores</a></li>
      <li><a href="/en/">English version</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`;

  return { fileName: 'salarios.html', html };
}

// ── Generar mapa del sitio HTML /mapa-del-sitio.html ───────────────
function generateSiteMapHTML(salaryPages, convenios) {
  const url = 'https://salariojusto.es/mapa-del-sitio.html';
  const title = 'Mapa del sitio | SalarioJusto';
  const desc = `Índice completo de SalarioJusto: ${convenios.length} convenios colectivos auditados, guías fiscales y herramientas para trabajadores en España.`;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/" },
      { "@type": "ListItem", "position": 2, "name": "Mapa del sitio", "item": url }
    ]
  }, null, 2);

  // Agrupar landings por tramo
  const porTramo = {};
  SALARIES.forEach(s => { porTramo[s] = []; });
  salaryPages.forEach(p => {
    const match = p.fileName.match(/salario-neto-(\d+)-euros-brutos-(.+)\.html/);
    if (match) {
      const gross = parseInt(match[1]);
      const cityId = match[2];
      const city = CITIES.find(c => c.id === cityId);
      if (city) porTramo[gross].push({ city: city.name, href: '/' + p.fileName });
    }
  });

  const tramosHTML = SALARIES.map(s => `
    <div class="sm-section">
      <h3>${fmt(s)} € brutos anuales</h3>
      <ul>
${porTramo[s].map(l => `        <li><a href="${l.href}">Salario neto en ${l.city}</a></li>`).join('\n')}
      </ul>
    </div>`).join('');

  const conveniosHTML = convenios.map(c =>
    `      <li><a href="${c.href}">${c.nombreCorto}${c.vigencia ? ' <span class="sm-meta">(' + c.vigencia + ')</span>' : ''}</a></li>`
  ).join('\n');

  return {
    fileName: 'mapa-del-sitio.html',
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
  <meta property="og:title" content="Mapa del sitio — SalarioJusto">
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
  <style>
    .sm-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;}
    .sm-section h3{font-family:'DM Serif Display',serif;font-size:18px;font-weight:400;color:var(--ink);margin:0 0 10px;padding-bottom:8px;border-bottom:2px solid var(--gold);}
    .sm-section ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:4px;}
    .sm-section li a{display:block;padding:4px 0;font-size:13px;color:var(--gold);text-decoration:none;}
    .sm-section li a:hover{text-decoration:underline;}
    .sm-meta{font-size:11px;color:var(--ink-lighter);font-weight:400;}
    .sm-counter{display:inline-block;font-size:11px;font-weight:700;color:var(--gold-dark);background:var(--cream-100);padding:2px 8px;margin-left:8px;vertical-align:middle;}
  </style>
</head>
<body>

${navHTML()}

<div style="background:var(--cream-100);border-bottom:1px solid var(--cream-200);padding:10px 32px;font-size:12px;color:var(--ink-lighter);"><a href="/" style="color:var(--gold);">SalarioJusto</a> › Mapa del sitio</div>

<section class="hero">
  <div class="hero-badge">Índice completo del sitio</div>
  <h1>Mapa del sitio — <em>SalarioJusto</em></h1>
  <p class="hero-sub">Listado completo de convenios, guías y herramientas para trabajadores y trabajadoras en España.</p>
</section>

<main>

  <div class="card">
    <div class="card-title">Calculadoras <span class="sm-counter">2</span></div>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      <li><a href="/" style="font-size:14px;font-weight:600;">Calculadora de salario neto (personalizada)</a> — situación familiar exacta, IRPF 2026</li>
      <li><a href="/#verifica-convenio" style="font-size:14px;font-weight:600;">Verificador de convenio colectivo</a> — comprueba si tu salario cumple el mínimo legal</li>
    </ul>
  </div>

  <div class="card">
    <div class="card-title">Convenios por provincia <span class="sm-counter">${convenios.length}</span></div>
    <p style="font-size:13px;color:var(--ink-light);margin-bottom:10px;">Ver también: <a href="/salarios.html">hub de convenios por provincia</a> · <a href="/convenios.html">hub por sector</a>.</p>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      <li><a href="/convenios.html" style="font-size:14px;font-weight:600;">Hub de convenios colectivos</a> — todos agrupados por sector</li>
${conveniosHTML}
    </ul>
  </div>

  <div class="card">
    <div class="card-title">Guías y referencias fiscales</div>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      <li><a href="/guias.html">Todas las guías para trabajadores</a></li>
      <li><a href="/tramos-irpf-2026.html">Tramos IRPF 2026 — tabla completa y ejemplos</a></li>
      <li><a href="/salario-minimo-interprofesional-2026.html">Salario Mínimo Interprofesional 2026</a></li>
      <li><a href="/ley-transparencia-salarial-2026.html">Ley de Transparencia Salarial 2026</a></li>
      <li><a href="/rangos-salariales-empresa-transparencia-2026.html">Rangos salariales en empresa — Transparencia</a></li>
      <li><a href="/reclamar-diferencias-salariales-convenio.html">Reclamar diferencias salariales de convenio</a></li>
      <li><a href="/denunciar-brecha-salarial-guia-practica-2026.html">Denunciar brecha salarial — guía práctica</a></li>
    </ul>
  </div>

  <div class="card">
    <div class="card-title">Idiomas</div>
    <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;">
      <li><a href="/">Español (principal)</a></li>
      <li><a href="/en/">English version</a></li>
    </ul>
  </div>

  <div class="related">
    <h2 style="font-size:18px;">¿Buscas algo más?</h2>
    <ul>
      <li><a href="/sitemap.xml">Sitemap XML</a> (para Google y otros buscadores)</li>
      <li><a href="/">← Volver a la calculadora principal</a></li>
    </ul>
  </div>

</main>

${footerHTML()}

</body>
</html>`
  };
}

// ── Generar sitemap ────────────────────────────────────────────────
function generateSitemap(pages, convenios = [], plantillas = [], plantillasHubUrl = null) {
  const existingPages = [
    { url: 'https://salariojusto.es/', priority: '1.00', freq: 'weekly', hreflang: [{ lang: 'es', href: 'https://salariojusto.es/' }, { lang: 'en', href: 'https://salariojusto.es/en/' }] },
    { url: 'https://salariojusto.es/en/', priority: '0.90', freq: 'weekly', hreflang: [{ lang: 'es', href: 'https://salariojusto.es/' }, { lang: 'en', href: 'https://salariojusto.es/en/' }] },
    { url: 'https://salariojusto.es/guias.html', priority: '0.90', freq: 'weekly' },
    { url: 'https://salariojusto.es/ley-transparencia-salarial-2026.html', priority: '0.85', freq: 'monthly' },
    { url: 'https://salariojusto.es/rangos-salariales-empresa-transparencia-2026.html', priority: '0.80', freq: 'monthly' },
    { url: 'https://salariojusto.es/reclamar-diferencias-salariales-convenio.html', priority: '0.80', freq: 'monthly' },
    { url: 'https://salariojusto.es/denunciar-brecha-salarial-guia-practica-2026.html', priority: '0.80', freq: 'monthly' },
    // construccion-estatal y convenio-limpieza-* se añaden automáticamente vía
    // MANUAL_CONVENIOS en generate-convenios.js → no listarlas aquí (evita duplicados).
    { url: 'https://salariojusto.es/tramos-irpf-2026.html', priority: '0.85', freq: 'monthly' },
    { url: 'https://salariojusto.es/salario-minimo-interprofesional-2026.html', priority: '0.85', freq: 'monthly' },
    { url: 'https://salariojusto.es/salarios.html', priority: '0.90', freq: 'weekly' },
    { url: 'https://salariojusto.es/convenios.html', priority: '0.90', freq: 'weekly' },
    { url: 'https://salariojusto.es/sobre.html', priority: '0.70', freq: 'monthly' },
    { url: 'https://salariojusto.es/sala-de-prensa.html', priority: '0.70', freq: 'monthly' },
    { url: 'https://salariojusto.es/mapa-del-sitio.html', priority: '0.60', freq: 'weekly' },
  ];

  // (Las 168 landings programáticas salario-neto-* fueron retiradas el 2026-05-06
  // tras rechazo AdSense por "contenido de poco valor". Snapshot en tag git
  // landings-thin-pre-retirada-2026-05-06.)

  // Add generated convenio pages
  convenios.forEach(c => {
    // Skip construccion-estatal-* which is already above
    if (c.href === '/construccion-estatal-suelo-salarial.html') return;
    existingPages.push({ url: `https://salariojusto.es${c.href}`, priority: '0.80', freq: 'monthly' });
  });

  // Add Kit hub + plantillas
  if (plantillasHubUrl) {
    existingPages.push({ url: `https://salariojusto.es${plantillasHubUrl}`, priority: '0.85', freq: 'weekly' });
  }
  plantillas.forEach(p => {
    existingPages.push({ url: `https://salariojusto.es/${p.slug}.html`, priority: '0.75', freq: 'monthly' });
  });

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  existingPages.forEach(p => {
    xml += `  <url>\n`;
    xml += `    <loc>${p.url}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${p.freq}</changefreq>\n`;
    xml += `    <priority>${p.priority}</priority>\n`;
    if (p.hreflang) {
      p.hreflang.forEach(h => {
        xml += `    <xhtml:link rel="alternate" hreflang="${h.lang}" href="${h.href}" />\n`;
      });
    }
    xml += `  </url>\n`;
  });

  xml += `</urlset>\n`;
  return xml;
}

// ── MAIN ───────────────────────────────────────────────────────────
function main() {
  // RETIRADA 2026-05-06: bucle de 168 landings programáticas y hub /salarios.html
  // generado eliminados tras rechazo de AdSense por "contenido de poco valor"
  // (0 clics totales en ventana 28d previa). /salarios.html ahora se mantiene
  // a mano como hub provincial editorial. Snapshot recuperable en tag git
  // landings-thin-pre-retirada-2026-05-06. Ver MC/GSC_STATUS.md.
  const salaryPages = [];

  // Generate SMI page
  console.log('\nGenerating SMI page...');
  const smiPage = generateSMIPage();
  fs.writeFileSync(path.join(ROOT, smiPage.fileName), smiPage.html, 'utf8');
  console.log(`  ✓ ${smiPage.fileName}`);

  // Generate tramos IRPF page
  console.log('\nGenerating tramos IRPF page...');
  const tramosPage = generateTramosPage();
  fs.writeFileSync(path.join(ROOT, tramosPage.fileName), tramosPage.html, 'utf8');
  console.log(`  ✓ ${tramosPage.fileName}`);

  // Generate convenio landings + /convenios.html hub
  console.log('\nGenerating convenio landings...');
  const convenios = generateConvenios.main();

  // Generate Kit del trabajador plantillas
  console.log('\nGenerating Kit plantillas...');
  const plantillas = generatePlantillas.main();

  // Generate /mapa-del-sitio.html (human-readable sitemap)
  console.log('\nGenerating /mapa-del-sitio.html...');
  const siteMapPage = generateSiteMapHTML(salaryPages, convenios);
  fs.writeFileSync(path.join(ROOT, siteMapPage.fileName), siteMapPage.html, 'utf8');
  console.log(`  ✓ ${siteMapPage.fileName}`);

  // Generate sitemap
  console.log('\nGenerating sitemap.xml...');
  const sitemap = generateSitemap(salaryPages, convenios, plantillas, generatePlantillas.HUB_URL);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
  const totalUrls = 14 + convenios.filter(c => c.href !== '/construccion-estatal-suelo-salarial.html').length + 1 + plantillas.length;
  console.log(`  ✓ sitemap.xml (${totalUrls} URLs)`);

  console.log(`\nDone!`);
}

main();
