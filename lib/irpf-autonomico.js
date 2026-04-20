/**
 * Escalas autonómicas del IRPF — Ejercicio 2026
 *
 * Fuentes primarias oficiales:
 *   - Ministerio de Hacienda, "Tributación Autonómica 2026",
 *     Capítulo II (Medidas aprobadas para 2026), actualizado 10/03/2026.
 *     https://www.hacienda.gob.es/sgfal/financiacionterritorial/autonomica/capitulo-ii-tributacion-autonomica-2026.pdf
 *   - Ministerio de Hacienda, "Tributación Autonómica 2026",
 *     Capítulo IV (Resumen de medidas vigentes), actualizado 10/03/2026.
 *     https://www.hacienda.gob.es/sgfal/financiacionterritorial/autonomica/capitulo-iv-tributacion-autonomica-2026.pdf
 *   - Diputación Foral de Bizkaia, Norma Foral 7/2025 (BOB 30/12/2025).
 *     https://dfb.microsoftcrmportals.com/es-ES/Articulo/?Code=KA-01877
 *
 * Escala ESTATAL 2026 (art. 63 Ley 35/2006 IRPF — sin cambios desde 2021):
 *   hasta 12450:   9,5%
 *   hasta 20200:  12,0%
 *   hasta 35200:  15,0%
 *   hasta 60000:  18,5%
 *   hasta 300000: 22,5%
 *   resto:        24,5%
 *
 * Para las 9 CCAA de régimen común la cuota íntegra es:
 *   cuotaEstatal(base) + cuotaAutonomica(base, ccaa)
 * Para Bizkaia (foral pleno) se aplica únicamente la tarifa foral —
 * NO se suma tarifa estatal.
 */

// ── Escala estatal 2026 ──────────────────────────────────────────────
const ESCALA_ESTATAL_2026 = [
  { hasta: 12450,   tipo: 0.095 },
  { hasta: 20200,   tipo: 0.12  },
  { hasta: 35200,   tipo: 0.15  },
  { hasta: 60000,   tipo: 0.185 },
  { hasta: 300000,  tipo: 0.225 },
  { hasta: Infinity, tipo: 0.245 },
];

// ── Escalas autonómicas 2026 ─────────────────────────────────────────
// Los IDs usan ASCII sin diacríticos para evitar problemas de encoding.
const ESCALAS_AUTONOMICAS = {
  // Madrid — vigente desde 2024. Ley 13/2023 deflactación (BOCM 27/12/2023).
  // Ley 6/2025 Presupuestos 2026 (BOCM 29/12/2025) solo añade deducciones; no modifica escala.
  MADRID: {
    ccaaNombre: 'Comunidad de Madrid',
    norma: 'Decreto Legislativo 1/2010 (TR tributos cedidos Madrid), art. 1',
    fuenteEnlace: 'https://www.bocm.es/',
    notaPresupuestos: 'Ley 6/2025 de Presupuestos 2026 no modifica la escala.',
    escala: [
      { hasta: 13362.22, tipo: 0.085 },
      { hasta: 19004.63, tipo: 0.107 },
      { hasta: 35425.68, tipo: 0.128 },
      { hasta: 57320.40, tipo: 0.174 },
      { hasta: Infinity, tipo: 0.205 },
    ],
  },

  // Cataluña — vigente desde 1/1/2025. Decreto-ley 5/2025 (DOGC 26/03/2025; BOE 27/05/2025).
  // Reduce de 9 a 8 tramos; tipo del primer tramo pasa del 10,5% al 9,5%.
  // Ley 8/2025 (municipios rurales, DOG 31/07/2025) introduce deducciones sin tocar escala.
  CATALUNA: {
    ccaaNombre: 'Cataluña',
    norma: 'Decreto Legislativo 1/2024 (Código tributario de Catalunya, libro sexto), art. 611-1, en la redacción dada por art. 3.1 Decreto-ley 5/2025',
    fuenteEnlace: 'https://www.boe.es/diario_boe/txt.php?id=BOE-A-2025-10521',
    notaPresupuestos: 'Confirmada para 2026 por el Ministerio de Hacienda (Cap. II 2026).',
    escala: [
      { hasta: 12500,    tipo: 0.095 },
      { hasta: 22000,    tipo: 0.125 },
      { hasta: 33000,    tipo: 0.16  },
      { hasta: 53000,    tipo: 0.19  },
      { hasta: 90000,    tipo: 0.215 },
      { hasta: 120000,   tipo: 0.235 },
      { hasta: 175000,   tipo: 0.245 },
      { hasta: Infinity, tipo: 0.255 },
    ],
  },

  // Andalucía — vigente desde 2022. Ley 5/2021, art. 23, modificado por Decreto-ley 7/2022 (BOJA 21/09/2022).
  // Ley 8/2025 Presupuestos 2026 (BOJA 31/12/2025) añade deducciones por temporales; no modifica escala.
  ANDALUCIA: {
    ccaaNombre: 'Andalucía',
    norma: 'Ley 5/2021 de Tributos Cedidos de Andalucía, art. 23 (redacción Decreto-ley 7/2022)',
    fuenteEnlace: 'https://www.boe.es/buscar/act.php?id=BOE-A-2021-18325',
    notaPresupuestos: 'Ley 8/2025 de Presupuestos 2026 no modifica la escala.',
    escala: [
      { hasta: 13000,    tipo: 0.095 },
      { hasta: 21100,    tipo: 0.12  },
      { hasta: 35200,    tipo: 0.15  },
      { hasta: 60000,    tipo: 0.185 },
      { hasta: Infinity, tipo: 0.225 },
    ],
  },

  // Comunidad Valenciana — vigente desde 2024. Ley 13/1997, art. 2, tras Ley de Presupuestos 2024.
  // Ley 5/2025 (DOGV 31/05/2025) modifica ITP/AJD/ISD, no la escala IRPF.
  VALENCIA: {
    ccaaNombre: 'Comunitat Valenciana',
    norma: 'Ley 13/1997 (tramo autonómico IRPF y tributos cedidos), art. 2',
    fuenteEnlace: 'https://www.boe.es/buscar/act.php?id=BOE-A-1998-358',
    notaPresupuestos: 'Confirmada para 2026 por el Ministerio de Hacienda (Cap. II 2026).',
    escala: [
      { hasta: 12000,    tipo: 0.09  },
      { hasta: 22000,    tipo: 0.12  },
      { hasta: 32000,    tipo: 0.15  },
      { hasta: 42000,    tipo: 0.175 },
      { hasta: 52000,    tipo: 0.20  },
      { hasta: 62000,    tipo: 0.225 },
      { hasta: 72000,    tipo: 0.25  },
      { hasta: 100000,   tipo: 0.265 },
      { hasta: 150000,   tipo: 0.275 },
      { hasta: 200000,   tipo: 0.285 },
      { hasta: Infinity, tipo: 0.295 },
    ],
  },

  // Galicia — vigente desde 2022. TR DL 1/2011, art. 4, tras Ley 7/2022.
  // Ley 5/2025 de medidas fiscales (DOG 31/12/2025) añade deducción talidomida; no modifica escala.
  GALICIA: {
    ccaaNombre: 'Galicia',
    norma: 'Decreto Legislativo 1/2011 (TR tributos cedidos Galicia), art. 4 (redacción Ley 7/2022)',
    fuenteEnlace: 'https://www.xunta.gal/dog',
    notaPresupuestos: 'Ley 5/2025 de medidas fiscales no modifica la escala.',
    escala: [
      { hasta: 12985.35, tipo: 0.09   },
      { hasta: 21068.60, tipo: 0.1165 },
      { hasta: 35200,    tipo: 0.149  },
      { hasta: 60000,    tipo: 0.184  },
      { hasta: Infinity, tipo: 0.225  },
    ],
  },

  // Región de Murcia — vigente desde 2023. TR DL 1/2010, art. 2.
  // Ley 9/2025 introduce deflactación automática condicional a IPC dic > 3%.
  // IPC interanual Murcia diciembre 2025 (dato no verificado directamente por este motor): 2,7%,
  // por debajo del umbral — la deflactación no se activó para 2026. Ministerio de Hacienda
  // confirma en Cap. II 2026 que "Murcia no ha aprobado ninguna norma que introduzca nuevas medidas".
  MURCIA: {
    ccaaNombre: 'Región de Murcia',
    norma: 'Decreto Legislativo 1/2010 (TR tributos cedidos Murcia), art. 2',
    fuenteEnlace: 'https://www.borm.es/',
    notaPresupuestos: 'Ministerio de Hacienda (Cap. II 2026): sin nuevas medidas para 2026.',
    escala: [
      { hasta: 12450,    tipo: 0.095 },
      { hasta: 20200,    tipo: 0.112 },
      { hasta: 34000,    tipo: 0.133 },
      { hasta: 60000,    tipo: 0.179 },
      { hasta: Infinity, tipo: 0.225 },
    ],
  },

  // Aragón — vigente desde 2023. TR DL 1/2005, art. 110-1.
  // Ministerio de Hacienda confirma sin nuevas medidas para 2026.
  ARAGON: {
    ccaaNombre: 'Aragón',
    norma: 'Decreto Legislativo 1/2005 (TR tributos cedidos Aragón), art. 110-1',
    fuenteEnlace: 'https://www.boa.aragon.es/',
    notaPresupuestos: 'Ministerio de Hacienda (Cap. II 2026): sin nuevas medidas para 2026.',
    escala: [
      { hasta: 13072.50, tipo: 0.095 },
      { hasta: 21210,    tipo: 0.12  },
      { hasta: 36960,    tipo: 0.15  },
      { hasta: 52500,    tipo: 0.185 },
      { hasta: 60000,    tipo: 0.205 },
      { hasta: 80000,    tipo: 0.23  },
      { hasta: 90000,    tipo: 0.24  },
      { hasta: 130000,   tipo: 0.25  },
      { hasta: Infinity, tipo: 0.255 },
    ],
  },

  // Illes Balears — vigente desde 2024. TR DL 1/2014, art. 1, tras Ley 12/2023 Presupuestos 2024.
  // Ministerio de Hacienda confirma sin nuevas medidas para 2026.
  BALEARES: {
    ccaaNombre: 'Illes Balears',
    norma: 'Decreto Legislativo 1/2014 (TR tributos cedidos Illes Balears), art. 1 (redacción Ley 12/2023)',
    fuenteEnlace: 'https://www.caib.es/boib',
    notaPresupuestos: 'Ministerio de Hacienda (Cap. II 2026): sin nuevas medidas para 2026.',
    escala: [
      { hasta: 10000,    tipo: 0.09   },
      { hasta: 18000,    tipo: 0.1125 },
      { hasta: 30000,    tipo: 0.1425 },
      { hasta: 48000,    tipo: 0.175  },
      { hasta: 70000,    tipo: 0.19   },
      { hasta: 90000,    tipo: 0.2175 },
      { hasta: 120000,   tipo: 0.2275 },
      { hasta: 175000,   tipo: 0.2375 },
      { hasta: Infinity, tipo: 0.2475 },
    ],
  },

  // Canarias — vigente desde 2024. TR DL 1/2009, art. 18 bis, tras Ley 5/2024 Presupuestos 2025
  // (efectos retroactivos 1/1/2024). Ministerio de Hacienda confirma sin nuevas medidas para 2026.
  CANARIAS: {
    ccaaNombre: 'Canarias',
    norma: 'Decreto Legislativo 1/2009 (TR tributos cedidos Canarias), art. 18 bis (redacción Ley 5/2024)',
    fuenteEnlace: 'http://www.gobiernodecanarias.org/boc/',
    notaPresupuestos: 'Ministerio de Hacienda (Cap. II 2026): sin nuevas medidas para 2026.',
    escala: [
      { hasta: 13465,    tipo: 0.09  },
      { hasta: 19022,    tipo: 0.115 },
      { hasta: 35185,    tipo: 0.14  },
      { hasta: 56382,    tipo: 0.185 },
      { hasta: 91350,    tipo: 0.235 },
      { hasta: 121200,   tipo: 0.25  },
      { hasta: Infinity, tipo: 0.26  },
    ],
  },
};

// ── Tarifa foral Bizkaia 2026 ────────────────────────────────────────
// Régimen foral pleno. La tarifa es ÚNICA (no se suma al estatal).
// Norma Foral 13/2013 IRPF, art. 75.1, en la redacción dada por art. 49
// Norma Foral 7/2025 de Presupuestos 2026 (BOB 30/12/2025). Deflactación 2% sobre tarifa 2025.
const ESCALA_FORAL_BIZKAIA_2026 = [
  { hasta: 18080,    tipo: 0.23 },
  { hasta: 36160,    tipo: 0.28 },
  { hasta: 54240,    tipo: 0.35 },
  { hasta: 77450,    tipo: 0.40 },
  { hasta: 107260,   tipo: 0.45 },
  { hasta: 142960,   tipo: 0.46 },
  { hasta: 208390,   tipo: 0.47 },
  { hasta: Infinity, tipo: 0.49 },
];

const DATOS_BIZKAIA = {
  ccaaNombre: 'Territorio Histórico de Bizkaia',
  norma: 'Norma Foral 13/2013 IRPF Bizkaia, art. 75.1 (redacción NF 7/2025 Presupuestos 2026)',
  fuenteEnlace: 'https://dfb.microsoftcrmportals.com/es-ES/Articulo/?Code=KA-01877',
  notaPresupuestos: 'Deflactación 2% sobre tarifa 2025 con efectos 1/1/2026.',
  escala: ESCALA_FORAL_BIZKAIA_2026,
};

// ── Mapping ciudad → CCAA/foral ──────────────────────────────────────
// Las 12 ciudades del generador (scripts/generate-pages.js).
const CIUDAD_A_CCAA = {
  madrid:    'MADRID',
  barcelona: 'CATALUNA',
  valencia:  'VALENCIA',
  sevilla:   'ANDALUCIA',
  bilbao:    'BIZKAIA',
  malaga:    'ANDALUCIA',
  zaragoza:  'ARAGON',
  alicante:  'VALENCIA',
  murcia:    'MURCIA',
  palma:     'BALEARES',
  laspalmas: 'CANARIAS',
  acoruna:   'GALICIA',
};

// ── Helpers de cálculo ───────────────────────────────────────────────
function aplicarEscala(tramos, base) {
  if (base <= 0) return 0;
  let cuota = 0;
  let acumulado = 0;
  for (const { hasta, tipo } of tramos) {
    const tramoMax = Math.min(base, hasta);
    cuota += (tramoMax - acumulado) * tipo;
    if (base <= hasta) return cuota;
    acumulado = hasta;
  }
  return cuota;
}

function cuotaEstatal(base) {
  return aplicarEscala(ESCALA_ESTATAL_2026, base);
}

function cuotaAutonomica(base, ccaaId) {
  const ccaa = ESCALAS_AUTONOMICAS[ccaaId];
  if (!ccaa) throw new Error(`CCAA desconocida: ${ccaaId}`);
  return aplicarEscala(ccaa.escala, base);
}

function cuotaForalBizkaia(base) {
  return aplicarEscala(ESCALA_FORAL_BIZKAIA_2026, base);
}

function datosCcaa(ccaaId) {
  if (ccaaId === 'BIZKAIA') return DATOS_BIZKAIA;
  return ESCALAS_AUTONOMICAS[ccaaId];
}

function ccaaDeCiudad(ciudadId) {
  const ccaa = CIUDAD_A_CCAA[ciudadId];
  if (!ccaa) throw new Error(`Ciudad sin mapping a CCAA: ${ciudadId}`);
  return ccaa;
}

// Construye la función escala(base) que consume calcNet() del motor común.
// Para las 9 CCAA: cuota = estatal + autonómica propia.
// Para Bizkaia (foral): cuota = foral únicamente.
function escalaParaCiudad(ciudadId) {
  const ccaaId = ccaaDeCiudad(ciudadId);
  if (ccaaId === 'BIZKAIA') {
    return (base) => cuotaForalBizkaia(base);
  }
  return (base) => cuotaEstatal(base) + cuotaAutonomica(base, ccaaId);
}

module.exports = {
  ESCALA_ESTATAL_2026,
  ESCALAS_AUTONOMICAS,
  ESCALA_FORAL_BIZKAIA_2026,
  DATOS_BIZKAIA,
  CIUDAD_A_CCAA,
  cuotaEstatal,
  cuotaAutonomica,
  cuotaForalBizkaia,
  datosCcaa,
  ccaaDeCiudad,
  escalaParaCiudad,
};
