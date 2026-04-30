const ALLOWED_HOSTS = new Set(['salariojusto.es', 'www.salariojusto.es', 'localhost', '127.0.0.1']);
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
  if (!rateLimit(ip)) return res.status(429).json({ error: 'Demasiadas peticiones. Espera un minuto.' });

  const { salary, profession, city, situation, netMonthly, netAnnual } = req.body;

  if (!salary || !profession) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const cityNames = {
    madrid:'Madrid', barcelona:'Barcelona', valencia:'Valencia', sevilla:'Sevilla',
    bilbao:'Bilbao', malaga:'Málaga', zaragoza:'Zaragoza',
    murcia:'Murcia', palma:'Palma de Mallorca', laspalmas:'Las Palmas de G.C.'
  };

  const situationNames = {
    single: 'soltero/a sin hijos',
    single_kids: 'soltero/a con hijos a cargo',
    married_noincome: 'casado/a, cónyuge sin rentas significativas',
    married: 'casado/a, cónyuge con rentas propias'
  };

  const cityLabel = cityNames[city] || city;
  const gross = parseInt(salary);

  const prompt = `Eres un experto en el mercado laboral español con datos de 2024-2025.

Perfil: profesión "${profession}", ciudad ${cityLabel}, salario bruto ${gross.toLocaleString('es-ES')}€, situación ${situationNames[situation] || situation}, neto estimado ${netMonthly}.

Devuelve ÚNICAMENTE este JSON sin texto extra ni markdown:

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
  },
  "analysis": "Párrafo situación vs mercado.\\n\\nPárrafo derechos Ley Transparencia 2026.\\n\\nPárrafo recomendación concreta."
}

Reglas: valores enteros en euros, mínimo >= 15876 (SMI 2025), Madrid/Barcelona 20-35% más que ciudades medianas, datos realistas mercado español 2024-2025. Análisis directo en 3 párrafos, sin bullets.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      console.error('Anthropic error:', response.status, await response.text());
      return res.status(200).json({ ranges: null, analysis: '', percentile: 50, cityMedian: 0, spainMean: 0 });
    }

    const data = await response.json();
    const rawText = data.content?.[0]?.text || '';
    const clean = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    const ranges = parsed.ranges;
    const analysis = parsed.analysis || '';

    let percentile = 50, cityMedian = 0, spainMean = 0;
    if (ranges && ranges[city]) {
      const [min, med, max] = ranges[city];
      cityMedian = med;
      if (gross <= min) percentile = 10;
      else if (gross <= med) percentile = Math.round(10 + ((gross-min)/(med-min))*40);
      else if (gross <= max) percentile = Math.round(50 + ((gross-med)/(max-med))*40);
      else percentile = 95;
      const allMedians = Object.values(ranges).map(r => r[1]);
      spainMean = Math.round(allMedians.reduce((a,b) => a+b, 0) / allMedians.length);
    }

    return res.status(200).json({ ranges, analysis, percentile, cityMedian, spainMean });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(200).json({ ranges: null, analysis: '', percentile: 50, cityMedian: 0, spainMean: 0 });
  }
};
