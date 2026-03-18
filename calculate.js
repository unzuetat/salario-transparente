module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { salary, profession, city, situation, netMonthly, netAnnual, lang } = req.body;
  const isEN = lang === 'en';

  if (!salary || !profession) {
    return res.status(400).json({ error: isEN ? 'Missing required fields' : 'Faltan datos obligatorios' });
  }

  const cityNames = {
    madrid:'Madrid', barcelona:'Barcelona', valencia:'Valencia', sevilla: isEN ? 'Seville' : 'Sevilla',
    bilbao:'Bilbao', malaga:'Málaga', zaragoza:'Zaragoza',
    murcia:'Murcia', palma:'Palma de Mallorca', laspalmas: isEN ? 'Las Palmas de G.C.' : 'Las Palmas de G.C.'
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

  const prompt = isEN
    ? `You are an expert in the Spanish labour market with data from 2024-2025.

Profile: profession "${profession}", city ${cityLabel}, gross annual salary ${gross.toLocaleString('en-GB')}€, family situation: ${situationNames[situation] || situation}, estimated net: ${netMonthly}.

Return ONLY this JSON with no extra text or markdown:

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
  },
  "analysis": "Paragraph about salary vs market position.\\n\\nParagraph about rights under Spain's Pay Transparency Law (June 2026).\\n\\nParagraph with concrete negotiation advice."
}

Rules: integer values in euros, minimum >= 15876 (Spain minimum wage 2025), Madrid/Barcelona 20-35% higher than mid-sized cities, realistic Spanish market data 2024-2025. Analysis in fluent English, 3 paragraphs, no bullet points.`

    : `Eres un experto en el mercado laboral español con datos de 2024-2025.

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
