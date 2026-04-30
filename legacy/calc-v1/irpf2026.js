/**
 * Algoritmo IRPF 2026 oficial (Agencia Tributaria, 26-12-2025)
 * Implementación exacta del algoritmo publicado por el Departamento de
 * Informática Tributaria. Mismos resultados que la calculadora de la AEAT.
 *
 * Extraído de index.html para reutilización en generador de páginas estáticas.
 */

function calcNet(gross, situation, hijos3, hijos25, asc65, asc75, discapacidad, movilidad, pagas, añoper, situper, discaper, movilper, escalaCustom) {
  const AÑO = 2026;
  situper  = situper  || 'ACTIVO';
  discaper = discaper || 'NINGUNA';
  movilper = movilper || false;
  añoper   = añoper   || 1985;

  const situfam = situation === 'single_kids' ? 'S1'
                : situation === 'married_noincome' ? 'S2' : 'S3';

  // Cotizaciones SS (7.56%)
  const SS_PCT = 0.0756;
  const COTIZACIONES = gross * SS_PCT;

  // Gastos deducibles
  const GASTOSGEN = 2000;
  const INCREGASMOVIL = movilidad === 'si' ? 2000 : 0;
  let INCREGASDISTRA = 0;
  if (situper === 'ACTIVO') {
    if (discaper === 'DESDE65' || (discaper === 'DE33A65' && movilper)) INCREGASDISTRA = 7750;
    else if (discaper === 'DE33A65') INCREGASDISTRA = 3500;
  }
  let OTROSGASTOS = GASTOSGEN + INCREGASMOVIL + INCREGASDISTRA;
  if (gross - COTIZACIONES < 0) OTROSGASTOS = 0;
  if (OTROSGASTOS > gross - COTIZACIONES) OTROSGASTOS = gross - COTIZACIONES;

  // Rendimiento neto del trabajo
  const RNT = Math.max(0, gross - COTIZACIONES);

  // Reducción por rendimientos del trabajo (art. 20 LIRPF)
  let RED20 = 0;
  if (RNT <= 14852)          RED20 = 7302;
  else if (RNT <= 17673.52)  RED20 = 7302 - 1.75 * (RNT - 14852);
  else if (RNT < 19747.50)   RED20 = 2364.34 - 1.14 * (RNT - 17673.52);
  RED20 = Math.round(RED20 * 100) / 100;

  // Rendimiento neto reducido
  const RNTREDU = Math.max(0, RNT - OTROSGASTOS - RED20);

  // Reducciones adicionales
  const PENSION  = situper === 'PENSIONISTA'  ? 600  : 0;
  const DESEM    = situper === 'DESEMPLEADO'  ? 1200 : 0;
  const nHijos   = parseInt(hijos3) + parseInt(hijos25);
  const HIJOSRED = nHijos > 2 ? 600 : 0;

  // Mínimo personal y familiar
  const edad = AÑO - añoper;
  const MINCON = 5550 + (edad > 64 ? 1150 : 0) + (edad > 74 ? 1400 : 0);

  // Mínimo por descendientes
  const hijosArr = [];
  for (let i = 0; i < parseInt(hijos3); i++) hijosArr.push({ edad: 2 });
  for (let i = 0; i < parseInt(hijos25); i++) hijosArr.push({ edad: 10 });
  hijosArr.sort((a, b) => a.edad - b.edad);

  const montosPorOrden = [2400, 2700, 4000, 4500];
  let MINDESG = 0;
  hijosArr.forEach((h, i) => {
    if (h.edad < 25) MINDESG += montosPorOrden[Math.min(i, 3)];
  });
  MINDESG = Math.round(MINDESG * 100) / 100;

  const MINDES3 = Math.round(parseInt(hijos3) * 2800 * 100) / 100;
  const MINDES = MINDESG + MINDES3;

  // Mínimo por ascendientes
  const n65  = parseInt(asc65);
  const n75  = parseInt(asc75);
  const _65AS = Math.round((n65 + n75) * 1150 * 100) / 100;
  const _75AS = Math.round(n75 * 1400 * 100) / 100;
  const MINAS = _65AS + _75AS;

  // Mínimo por discapacidad del contribuyente
  let DISPER = 0, ASISPER = 0;
  if (discaper === 'DESDE65')                              { DISPER = 9000; ASISPER = 3000; }
  else if (discaper === 'DE33A65' && movilper)             { DISPER = 3000; ASISPER = 3000; }
  else if (discaper === 'DE33A65')                         { DISPER = 3000; }
  if (discapacidad === '65' || discapacidad === '65m')     { DISPER = 9000; ASISPER = discapacidad === '65m' ? 3000 : 0; }
  else if (discapacidad === '33')                          { DISPER = 3000; }
  const MINDIS = DISPER + ASISPER;

  const MINPERFA = MINCON + MINDES + MINAS + MINDIS;

  // Base de retención
  const REDU = PENSION + HIJOSRED + DESEM;
  const BASE = Math.max(0, RNTREDU - REDU);

  // Tabla 1: exentos de retención (art. 81 RIRPF)
  const limites = {
    S1: { 0: null, 1: 17644, 2: 18694 },
    S2: { 0: 17197, 1: 18130, 2: 19262 },
    S3: { 0: 15876, 1: 16342, 2: 19262 },
  };
  const desKey = nHijos === 0 ? 0 : nHijos === 1 ? 1 : 2;
  const limExento = limites[situfam]?.[desKey];
  const exento = limExento != null && gross <= (limExento + PENSION + DESEM)
                 && !(situfam === 'S1' && nHijos === 0);
  if (exento) {
    const ss = Math.round(COTIZACIONES);
    return { net: Math.round(gross - ss), irpf: 0, ss, tipo: 0, exento: true };
  }

  // Escala de retención (Tabla 2) — agregada estatal + autonómica estándar.
  // Una CCAA con escala propia puede inyectar su función vía `escalaCustom`
  // (p.ej. desde lib/irpf-autonomico.js para generar landings por ciudad).
  function escalaDefault(x) {
    if (x <= 0)       return 0;
    if (x <= 12450)   return x * 0.19;
    if (x <= 20200)   return 2365.50  + (x - 12450)  * 0.24;
    if (x <= 35200)   return 4225.50  + (x - 20200)  * 0.30;
    if (x <= 60000)   return 8725.50  + (x - 35200)  * 0.37;
    if (x <= 300000)  return 17901.50 + (x - 60000)  * 0.45;
    return 125901.50 + (x - 300000) * 0.47;
  }
  const escala = escalaCustom || escalaDefault;

  const CUOTA1 = escala(BASE);
  const CUOTA2 = escala(MINPERFA);
  let CUOTA = Math.max(0, CUOTA1 - CUOTA2);

  // Límite 43% (art. 85.3 RIRPF)
  if (gross <= 35200 && limExento != null) {
    const LIMITE = Math.max(0, (gross - (limExento + PENSION + DESEM)) * 0.43);
    if (CUOTA > LIMITE) CUOTA = LIMITE;
  }

  // Tipo y cálculo final
  const TIPO = Math.trunc((CUOTA / gross) * 10000) / 100;
  const IRPF = Math.round(gross * TIPO / 100);
  const SS   = Math.round(COTIZACIONES);
  const net  = Math.round(gross - IRPF - SS);

  return { net, irpf: IRPF, ss: SS, tipo: TIPO, exento: false };
}

/**
 * Calcula resultado detallado para una configuración dada.
 * Devuelve objeto con net anual, mensual (12 y 14 pagas), irpf, ss, tipo.
 */
function calcDetailed(gross, situation) {
  const result = calcNet(gross, situation, '0', '0', '0', '0', '0', 'no', '14', 1985, 'ACTIVO', 'NINGUNA', false);
  return {
    netAnual: result.net,
    netMensual14: Math.round(result.net / 14),
    netMensual12: Math.round(result.net / 12),
    irpf: result.irpf,
    ss: result.ss,
    tipo: result.tipo,
    exento: result.exento
  };
}

module.exports = { calcNet, calcDetailed };
