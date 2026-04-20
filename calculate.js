// ─── CACHÉ EN MEMORIA PARA RANGOS (TTL 24h) ─────────────────────────────────
// Evita llamadas repetidas a Claude para la misma profesión.
// En serverless (Vercel), la caché se pierde entre invocaciones frías,
// pero funciona perfecto durante picos de tráfico (invocaciones calientes).
const rangesCache = new Map();
const CACHE_TTL = 24 * 60 * 60 * 1000;

function getCachedRanges(profession) {
  const key = profession.toLowerCase().trim();
  const cached = rangesCache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) return cached.data;
  return null;
}

function setCachedRanges(profession, data) {
  rangesCache.set(profession.toLowerCase().trim(), { data, ts: Date.now() });
}

const ALLOWED_HOSTS = new Set(['salariojusto.com', 'www.salariojusto.com', 'localhost', '127.0.0.1']);
function isAllowedOrigin(req) {
  const raw = req.headers.origin || req.headers.referer;
  if (!raw) return false;
  try {
    const { hostname } = new URL(raw);
    if (ALLOWED_HOSTS.has(hostname)) return true;
    if (hostname.endsWith('.vercel.app')) return true;
    return false;
  } catch { return false; }
}

const RATE_WINDOW_MS = 60 * 1000;
const RATE_MAX = 10;
const rateHits = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const hits = (rateHits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  hits.push(now);
  rateHits.set(ip, hits);
  if (rateHits.size > 5000) for (const [k, v] of rateHits) if (!v.some(t => now - t < RATE_WINDOW_MS)) rateHits.delete(k);
  return hits.length <= RATE_MAX;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: 'Forbidden' });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  const isEN_early = req.body?.lang === 'en';
  if (!rateLimit(ip)) return res.status(429).json({ error: isEN_early ? 'Too many requests. Wait a minute.' : 'Demasiadas peticiones. Espera un minuto.' });

  const { salary, profession, city, situation, netMonthly, netAnnual, lang } = req.body;
  const isEN = lang === 'en';

  if (!salary || !profession) {
    return res.status(400).json({ error: isEN ? 'Missing required fields' : 'Faltan datos obligatorios' });
  }

  const cityNames = {
    madrid:'Madrid', barcelona:'Barcelona', valencia:'Valencia',
    sevilla: isEN ? 'Seville' : 'Sevilla',
    bilbao:'Bilbao', malaga:'Málaga', zaragoza:'Zaragoza',
    murcia:'Murcia', palma:'Palma de Mallorca',
    laspalmas:'Las Palmas de G.C.'
  };

  const situationNames = isEN ? {
    single: 'single, no children',
    single_kids: 'single with children',
    married_noincome: 'married, partner with no significant income',
    married: 'married, partner has own income'
  } : {
    single: 'soltero/a sin hijos',
    single_kids: 'soltero/a con hijos a cargo',
    married_noincome: 'casado/a, cónyuge sin rentas significativas',
    married: 'casado/a, cónyuge con rentas propias'
  };

  const cityLabel = cityNames[city] || city;
  const gross = parseInt(salary);

  // ─── PROMPT DE RANGOS: el salario del usuario NO aparece aquí ───────────────
  // Esto es crítico: los rangos deben reflejar la realidad del mercado,
  // no estar anclados al input del usuario. El percentil se calcula después,
  // comparando el salario real contra rangos independientes.

  const rangesPrompt = isEN
    ? `You are a Spanish labour market expert with verified data from INE, AEAT, InfoJobs and Randstad 2024-2025.

Generate realistic market salary ranges for the profession "${profession}" in Spain.

CRITICAL RULES:
- Ranges must reflect ACTUAL market reality, completely independent of any individual's salary
- Base ranges on real data: INE Encuesta Estructura Salarial, InfoJobs Annual Report, Randstad Salary Guide
- If the profession is very well-paid (e.g. surgeon, senior lawyer, tech director), reflect that honestly
- If the profession is modestly paid (e.g. cashier, cleaner), reflect that honestly — do NOT inflate ranges
- The median must be the REAL market median, not skewed toward any particular value
- Madrid/Barcelona typically 20-30% above national median for most professions
- Minimum must never be below 17,094€ (Spain SMI 2026)
- For niche or very senior roles, the maximum can be very high — be honest about it
- For entry-level or low-skill roles, the maximum should be modest — be honest about it

Return ONLY this JSON, no markdown, no extra text:
{
  "ranges": {
    "madrid": [min, median, max],
    "barcelona": [min, median, max],
    "valencia": [min, median, max],
    "sevilla": [min, median, max],
    "bilbao": [min, median, max],
    "malaga": [min, median, max],
    "zaragoza": [min, median, max],
    "murcia": [min, median, max],
    "palma": [min, median, max],
    "laspalmas": [min, median, max]
  }
}`

    : `Eres un experto en mercado laboral español con datos verificados del INE, AEAT, InfoJobs y Randstad 2024-2025.

Genera los rangos salariales REALES de mercado para la profesión "${profession}" en España.

REGLAS CRÍTICAS — LEE CON ATENCIÓN:
- Los rangos deben reflejar la REALIDAD del mercado, completamente independientes del salario de cualquier persona concreta
- Basa los rangos en datos reales: INE Encuesta Estructura Salarial, Informe Anual InfoJobs, Guía Salarial Randstad
- Si la profesión está bien remunerada (ej: cirujano, socio de consultoría, director tecnológico), refléjalo con honestidad
- Si la profesión está modestamente remunerada (ej: cajero, limpiador, auxiliar administrativo), refléjalo con honestidad — NO infles los rangos artificialmente
- La mediana debe ser la MEDIANA REAL del mercado, no sesgada hacia ningún valor concreto
- Madrid/Barcelona típicamente un 20-30% por encima de la mediana nacional para la mayoría de profesiones
- El mínimo nunca puede ser inferior a 17.094€ (SMI 2026)
- Para roles senior o de nicho, el máximo puede ser muy alto — sé honesto
- Para roles de entrada o baja cualificación, el máximo debe ser modesto — sé honesto
- NO ancles los rangos a ningún salario introducido por el usuario. Genera rangos objetivos de mercado.
- ADVERTENCIA ANTI-SESGO: Si alguien gana 200.000€ como auxiliar administrativo, el rango del auxiliar NO cambia. Si alguien gana 15.000€ como CEO, el rango del CEO NO cambia. Los rangos son del PUESTO, no de la persona.
- Ejemplos de rangos CORRECTOS por tipo de profesión:
  * Auxiliar administrativo Madrid: [18.000, 22.000, 30.000]
  * Médico especialista Madrid: [50.000, 75.000, 120.000]
  * Consultor senior Madrid: [45.000, 70.000, 110.000]
  * Director general gran empresa Madrid: [120.000, 200.000, 400.000]
  * Cajero supermercado Madrid: [17.100, 19.000, 24.000]
  * Ingeniero software senior Madrid: [50.000, 72.000, 100.000]

Devuelve ÚNICAMENTE este JSON, sin markdown, sin texto extra:
{
  "ranges": {
    "madrid": [min, mediana, max],
    "barcelona": [min, mediana, max],
    "valencia": [min, mediana, max],
    "sevilla": [min, mediana, max],
    "bilbao": [min, mediana, max],
    "malaga": [min, mediana, max],
    "zaragoza": [min, mediana, max],
    "murcia": [min, mediana, max],
    "palma": [min, mediana, max],
    "laspalmas": [min, mediana, max]
  }
}`;

  // ─── PROMPT DE ANÁLISIS: aquí sí usamos el salario para el análisis personalizado ─
  const analysisPrompt = isEN
    ? `You are a Spanish labour market expert. Write a personalised salary analysis.

Profile:
- Profession: ${profession}
- City: ${cityLabel}
- Gross salary: ${gross.toLocaleString('en-GB')}€/year
- Estimated net: ${netMonthly}
- Family situation: ${situationNames[situation] || situation}

Write 3 paragraphs in fluent English:
1. How their salary compares to market reality — be direct and honest, even if they earn significantly above or below market
2. Their specific rights under Spain's Pay Transparency Law (June 2026)
3. A concrete, actionable recommendation for their situation

No bullet points. No mentioning you are an AI. Direct, useful tone.`

    : `Eres un experto en mercado laboral español. Escribe un análisis salarial personalizado.

Perfil:
- Profesión: ${profession}
- Ciudad: ${cityLabel}
- Salario bruto: ${gross.toLocaleString('es-ES')}€/año
- Neto estimado: ${netMonthly}
- Situación: ${situationNames[situation] || situation}

Escribe 3 párrafos directos y útiles:
1. Cómo se compara su salario con la realidad del mercado — sé directo y honesto, especialmente si está muy por encima o muy por debajo de la media
2. Sus derechos concretos según la Ley de Transparencia Retributiva (junio 2026)
3. Una recomendación concreta y accionable para su situación

Sin bullets. Sin mencionar que eres IA. Tono directo y útil.`;

  try {
    // ─── LLAMADA 1: RANGOS DE MERCADO (con caché) ────────────────────────────
    // Primero miramos si ya tenemos rangos para esta profesión en caché.
    // Si sí → nos ahorramos la llamada a Claude (coste 0, latencia ~0ms).
    // Si no → llamamos a Claude y guardamos el resultado para las próximas 24h.
    let ranges = getCachedRanges(profession);

    if (!ranges) {
      const rangesRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 800,
          messages: [
            { role: 'user', content: rangesPrompt },
            { role: 'assistant', content: '{"ranges":{' }
          ]
        })
      });

      if (!rangesRes.ok) {
        console.error('Ranges API error:', rangesRes.status);
        return res.status(200).json({ ranges: null, analysis: '', percentile: 50, cityMedian: 0, spainMean: 0 });
      }

      const rangesData = await rangesRes.json();
      const rangesRaw = '{"ranges":{' + (rangesData.content?.[0]?.text || '');
      const rangesParsed = JSON.parse(rangesRaw.replace(/```json|```/g, '').trim());
      ranges = rangesParsed.ranges;

      // Guardar en caché para las próximas 24h
      setCachedRanges(profession, ranges);
    }

    // ─── CALCULAR PERCENTIL comparando el salario real contra rangos objetivos ─
    let percentile = 50, cityMedian = 0, spainMean = 0;

    if (ranges && ranges[city]) {
      const [min, med, max] = ranges[city];
      cityMedian = med;

      // Percentil honesto: si el salario está fuera del rango, lo refleja
      if (gross < min) {
        percentile = Math.max(1, Math.round((gross / min) * 10));
      } else if (gross <= med) {
        percentile = Math.round(10 + ((gross - min) / (med - min)) * 40);
      } else if (gross <= max) {
        percentile = Math.round(50 + ((gross - med) / (max - med)) * 40);
      } else {
        // Por encima del máximo del rango → percentil muy alto, refleja realidad
        const excess = (gross - max) / max;
        percentile = Math.min(99, Math.round(90 + excess * 30));
      }

      const allMedians = Object.values(ranges).map(r => r[1]);
      spainMean = Math.round(allMedians.reduce((a, b) => a + b, 0) / allMedians.length);
    }

  return res.status(200).json({
      ranges, percentile, cityMedian, spainMean,


    
      methodology: isEN
        ? 'Ranges estimated from INE EAES 2023, InfoJobs 2024 and Randstad 2024-2025 data. Percentile calculated by comparing your salary against market ranges for your profession and city.'
        : 'Rangos estimados a partir de datos INE EAES 2023, InfoJobs 2024 y Randstad 2024-2025. El percentil se calcula comparando tu salario contra el rango de mercado de tu profesión en tu ciudad.'
    });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(200).json({ ranges: null, analysis: '', percentile: 50, cityMedian: 0, spainMean: 0 });
  }
};
