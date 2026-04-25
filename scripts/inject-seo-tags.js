/**
 * Inyecta Schema Organization + hreflang en landings manuales (no generadas por scripts).
 * Idempotente: detecta si ya están aplicados y no duplica.
 *
 * Uso: node scripts/inject-seo-tags.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const ORGANIZATION_SCHEMA = `<script type="application/ld+json">${JSON.stringify({
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
}, null, 2)}</script>`;

const TARGETS = [
  'convenio-limpieza-edificios-locales.html',
  'convenio-limpieza-madrid.html',
  'convenio-limpieza-barcelona.html',
  'convenio-limpieza-valencia.html',
  'convenio-limpieza-sevilla.html',
  'convenio-limpieza-malaga.html',
  'ley-transparencia-salarial-2026.html',
  'rangos-salariales-empresa-transparencia-2026.html',
  'denunciar-brecha-salarial-guia-practica-2026.html',
  'reclamar-diferencias-salariales-convenio.html',
  'construccion-estatal-suelo-salarial.html',
  'guias.html',
  'mapa-del-sitio.html',
];

function patch(filename) {
  const fullPath = path.join(ROOT, filename);
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⊘ ${filename} no existe, salto`);
    return false;
  }
  let html = fs.readFileSync(fullPath, 'utf8');
  const before = html;

  // 1) hreflang: insertar tras <link rel="canonical" ...> si no hay hreflang ya.
  if (!/hreflang="es"/i.test(html)) {
    html = html.replace(
      /(<link rel="canonical" href="([^"]+)">)/,
      (m, full, url) => `${full}\n  <link rel="alternate" hreflang="es" href="${url}">\n  <link rel="alternate" hreflang="x-default" href="${url}">`
    );
  }

  // 2) Organization: insertar tras la primera etiqueta de JSON-LD si no está.
  if (!/"@type":\s*"Organization"/.test(html)) {
    html = html.replace(
      /(<\/script>)(\s*<script type="application\/ld\+json">)/,
      (m, close, openNext) => `${close}\n  ${ORGANIZATION_SCHEMA}${openNext}`
    );
    // Si solo hay 1 schema (sin "siguiente"), insertar antes de </head>.
    if (!/"@type":\s*"Organization"/.test(html)) {
      html = html.replace(/(<\/head>)/, `  ${ORGANIZATION_SCHEMA}\n$1`);
    }
  }

  if (html === before) {
    console.log(`  ✓ ${filename} (ya tenía todo)`);
    return false;
  }
  fs.writeFileSync(fullPath, html, 'utf8');
  console.log(`  ✓ ${filename} (parcheado)`);
  return true;
}

console.log('Inyectando Schema Organization + hreflang en landings manuales...\n');
let touched = 0;
for (const f of TARGETS) {
  if (patch(f)) touched++;
}
console.log(`\nListo. ${touched} ficheros modificados, ${TARGETS.length - touched} ya estaban al día.`);
