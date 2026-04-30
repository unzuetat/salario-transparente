# Snapshot · Calculadora v1 (estado pre-rediseño)

**Creado**: 2026-04-30 (sesión Windows, replicando el snapshot que originalmente se hizo en la sesión Mac del 29-abr y que no llegó a pushed).

**Por qué existe**: red de seguridad documentada y accesible antes del rediseño de la home a "calc v2 minimalista en dos capas". La calculadora v1 llamaba a `api/calculate.js` (Claude Haiku) para generar una comparativa de mercado con cifras alucinadas — eso violaba la regla absoluta del proyecto *"nunca inventar datos, cifras ni links"*. La calc v2 retira la llamada al LLM y reduce los inputs iniciales a bruto + CCAA.

## Qué contiene

- `index.html` — copia literal de la home con la calc v1 funcional.
- `calculate.js` — endpoint Vercel serverless que llamaba a Claude Haiku.
- `irpf2026.js` — librería de cálculo IRPF 2026 (algoritmo embebido). Esta NO se modifica en v2; se preserva por completitud.

## Cómo restaurar la calc v1

### Opción A · vuelta total al estado pre-rediseño (recomendada)

```bash
git checkout calc-v1-pre-rediseno -- index.html api/calculate.js lib/irpf2026.js
git commit -m "revert: vuelta a calc v1 pre-rediseño"
```

El tag `calc-v1-pre-rediseno` apunta al commit `04224cd` (HEAD del 30-abr-2026, justo antes del rediseño v2).

### Opción B · restaurar archivos sueltos desde esta carpeta

```bash
cp legacy/calc-v1/index.html index.html
cp legacy/calc-v1/calculate.js api/calculate.js
cp legacy/calc-v1/irpf2026.js lib/irpf2026.js
git add index.html api/calculate.js lib/irpf2026.js
git commit -m "revert: restore calc v1 from legacy snapshot"
```

### Opción C · solo leer la versión vieja sin restaurar

Abre los archivos en `legacy/calc-v1/` desde el explorador o el editor. Quedan como referencia documentada del estado anterior.

## Decisiones cerradas para la calc v2

- **Capa 1** (visible inicialmente): inputs bruto + CCAA. Pagas por defecto 14 con switch 12/14/15. Asunciones por defecto en lo demás (soltero, sin descendencia a cargo, <65) con disclaimer.
- **Capa 2** (despliega tras toggle "Afinar mi cálculo"): form completo con profesión, ciudad, pagas, situación familiar. Refina el neto. Sirve como anzuelo al verificador de convenio (que sigue en su sección actual abajo de la home, recibe profesión+ciudad prefilled).
- **Front deja de llamar a `api/calculate.js`**. Endpoint queda dormido (sin tráfico, sin coste). NO se borra.
- **Comparativa de mercado**: pospuesta. Roadmap acordado en MC (project_comparador_roadmap): calc v2 sin comparador → INE como ancla en sprint posterior → BBDD propia desde jun-2026 con la Directiva 2023/970.

## Contexto cross-máquina

La sesión Mac del 29-abr (crumbs 19:55 + 20:25 + 20:55 en MC) decidió este rediseño y dejó el preview en `_preview/calc-v2.html` y como archivo `calc-v2-preview.html` en MC para sync. El commit local de Mac `0b46234` con un snapshot equivalente NUNCA llegó a pushed; este snapshot del 30-abr es la versión limpia que sí entra en remoto.
