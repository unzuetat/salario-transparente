# Informe SalarioJusto 2026 · Metodología (interno)

**Privacidad**: este archivo NO se publica. La versión pública editorial irá en `/metodologia-informe-2026.html` cuando el dataset esté listo, con detalle de proceso pero sin URLs ni nombres de empresa.

**Última actualización**: 2026-04-28

---

## Pregunta de investigación

Doble. El art. 5 de la Directiva 2023/970 tiene dos disposiciones diferentes:

1. **Transparencia voluntaria sobre el rango (art. 5.1)** — *flexible*: la empresa puede facilitar la info "en el anuncio de la vacante que se publique **o por otro medio**" antes de la entrevista. Por tanto, NO publicar el rango en la oferta NO equivale a incumplir.
2. **Prohibición de preguntar el salario actual o anterior del candidato (art. 5.2)** — *taxativo*: hoy legal, el 7-jun ilegal.

Por eso el informe mide DOS métricas distintas:
- **Métrica A (transparencia voluntaria)**: ¿qué % de ofertas publica el rango en el anuncio? Es un indicador de madurez en transparencia, no de cumplimiento legal estricto. Útil para comparativas internacionales (UK, Colorado, NY, California sí lo obligan en oferta).
- **Métrica B (cumplimiento legal duro 7-jun)**: ¿qué % de ofertas pide al candidato su salario actual o anterior? Esto sí es incumplimiento que entra en vigor el 7-jun. Cifra titular.

## Marco legal evaluado

**Directiva (UE) 2023/970, artículo 5 — Transparencia retributiva previa al empleo** (texto literal pendiente de verificar carácter a carácter en EUR-Lex antes de publicar):

- **Art. 5.1**: la empresa debe facilitar al candidato información sobre la retribución inicial o el rango aplicable, "de tal forma que se garantice una negociación informada y transparente sobre la retribución, **por ejemplo, en el anuncio de la vacante que se publique o por otro medio**".
- **Art. 5.2**: "Ningún empleador podrá hacer a los solicitantes preguntas sobre su historial retributivo en sus relaciones laborales actuales o anteriores."
- **Art. 5.3**: la oferta y la denominación del puesto deben ser neutrales en cuanto al género; los procesos de contratación deben desarrollarse de modo no discriminatorio.

(Plazo de transposición: 7-jun-2026 — fecha de entrada en vigor en España.)

**⚠️ ALERTA METODOLÓGICA**: el matiz "o por otro medio" del art. 5.1 invalida el framing simplista "esta oferta no cumple porque no publica el rango". Una empresa puede no publicar el rango en la oferta y aun así cumplir la directiva si lo facilita por correo o teléfono antes de la primera entrevista. El informe NO debe acusar de incumplimiento por ausencia de rango en oferta, solo por petición de salario anterior (art. 5.2).

## Diseño muestral

- **Tipo**: muestreo estratificado con cuotas iguales por sector + sistemático ordenado por fecha dentro de cada estrato.
- **Universo**: ofertas de empleo en España publicadas en los últimos 7 días en LinkedIn.
- **N objetivo**: 200 ofertas (10 sectores × 20 ofertas/sector).
- **Margen de error estimado**: ±7 puntos al 95% de confianza para las cifras agregadas.

## Sectores (cuota = 20 ofertas cada uno)

| # | Sector LinkedIn (nombre exacto del filtro) | Slug | Cuota |
|---|---|---|---|
| 1 | Tecnología, información e Internet | TEC | 20 |
| 2 | Servicios financieros | BAN | 20 |
| 3 | Hospitales y atención sanitaria | SAN | 20 |
| 4 | Servicios educativos | EDU | 20 |
| 5 | Comercio al por menor | RET | 20 |
| 6 | Hostelería | HOS | 20 |
| 7 | Fabricación | IND | 20 |
| 8 | Construcción | CON | 20 |
| 9 | Servicios de consultoría empresarial | CSL | 20 |
| 10 | Administración pública | ADM | 20 |

## Procedimiento de selección (idéntico para los 10 sectores)

1. Abrir LinkedIn → Empleos.
2. Buscador: dejar **keywords vacías**. Ubicación: **España**.
3. Aplicar filtros (en este orden):
   - **Fecha de publicación**: "Última semana" (últimos 7 días).
   - **Sector** (Industry): seleccionar EXACTAMENTE el nombre de la tabla.
   - Resto de filtros: indiferente.
4. **Ordenar por: Más recientes** (no "Más relevantes" — la relevancia depende del perfil del usuario y rompe reproducibilidad).
5. Capturar las **20 primeras ofertas en orden de aparición**, sin saltar ninguna salvo:
   - **Duplicado exacto** (misma empresa + mismo título de puesto: contar solo una).
   - **Puesto físicamente fuera de España y no remoto compatible**:
     - ✅ CUENTA: España (cualquier ciudad), remoto desde España, remoto Europa/UE, remoto global.
     - ❌ SALTA: otro país UE (Berlín, París, Lisboa...) — foco editorial es España.
     - ❌ SALTA: fuera de UE (Dubai, México, USA, UK post-Brexit...) — directiva no aplica.
   - **Idioma**: ofertas en inglés sí cuentan (típico en TEC y CSL). Solo saltar si están en idioma no entendible (chino, árabe, etc.) y sin traducción.

   Nota sobre el etiquetado de LinkedIn: el filtro de ubicación "España" incluye ofertas que la empresa marca como aceptables para candidatos en España, aunque el puesto físico sea en otro país. Hay que verificar la **ubicación real del puesto** en la oferta, no el filtro.
6. Para cada oferta, rellenar una fila completa de `ofertas.csv` siguiendo los criterios C1-C4 (abajo).

**Importante**: si LinkedIn devuelve menos de 20 ofertas que cumplan los criterios de inclusión, anotarlo en el log y continuar con las que haya. No "rellenar" buscando hacia atrás.

## Criterios de evaluación (versión simplificada · 2 decisiones por oferta)

### `transparencia` — mide el art. 5.1 (voluntario, indicador de madurez)

¿La oferta publica un rango o cifra salarial en su texto?

| Valor | Significado | Ejemplos |
|---|---|---|
| `SI` | Rango o cifra numérica clara | "30.000-38.000 €/año", "1.800 €/mes" |
| `PARCIAL` | Solo "desde X" o "hasta Y" | "Desde 25.000 €", "Hasta 50k OTE" |
| `NO` | Sin cifra concreta, o lenguaje vago | "Competitivo", "según valía", "a negociar", omisión total |

### `tipo_aplicacion` — auxiliar (clasifica auditabilidad de la oferta)

| Valor | Significado |
|---|---|
| `E` | Easy Apply: formulario nativo de LinkedIn. Auditable abriendo el formulario sin enviar. |
| `X` | Externo: redirige al ATS de la empresa (Workday, Greenhouse, Lever, Personio...). NO auditable sin registrarse. |

### `pide_salario_anterior` — mide el art. 5.2 (taxativo, cumplimiento 7-jun)

¿La oferta pide al candidato su salario actual o anterior, ya sea en el texto público o en el formulario de aplicación de LinkedIn?

| Valor | Significado | Cómo se verifica |
|---|---|---|
| `SI` | El texto público o el formulario Easy Apply lo pide | (a) si aparece en texto: directo; (b) si es Easy Apply: abrir el formulario, llegar al paso "Preguntas del empleador", revisar, cerrar sin enviar |
| `NO` | No lo pide ni en texto ni en formulario Easy Apply revisado | Revisado ambos |
| `?` | Indeterminado: oferta con `tipo_aplicacion = X` (ATS externo no auditado) | (no se entra al ATS para preservar reproducibilidad sin registro) |

**Operativa para Easy Apply sin enviar candidatura**:
1. Click "Solicitar empleo" / "Easy Apply".
2. Pulsa "Siguiente" hasta llegar al paso "Preguntas del empleador" (suele ser el 2º o 3º paso).
3. Revisa si hay preguntas sobre salario actual/anterior.
4. Cierra con la X arriba a la derecha. LinkedIn pregunta si descartar la solicitud — confirma. La candidatura NO se envía.

**Limitación reconocida**: las ofertas con `tipo_aplicacion = X` no se auditan, por preservar reproducibilidad metodológica (sin registrarse en cada ATS externo). El % de incumplimiento se calcula sobre el subconjunto auditable (`tipo_aplicacion = E`) y se declara explícitamente como tal. Es una cota inferior del incumplimiento real, ya que los ATS externos suelen ser más exhaustivos en preguntas al candidato.

### `notas` (libre)

Capturar solo si hay algo notable. Ejemplos de qué anotar:
- `pide en formulario` (si por algún motivo lo verifica el formulario)
- `menciona convenio` (cita convenio por nombre)
- `engañosa` ("competitivo + bonus" tipo cosas confusas)
- `multiidioma` (oferta en EN/ES mezclados)
- `puesto duplicado, no contar`

## Score sintético (calculado a posteriori, no rellenar a mano)

Se computará desde Python/SQL al cierre del dataset:

- **`TRANSPARENTE_VOLUNTARIA`**: `transparencia = SI` AND `pide_salario_anterior = NO` → cumple la mejor práctica internacional
- **`OPACA_PERO_LEGAL`**: `transparencia ∈ {NO, PARCIAL}` AND `pide_salario_anterior = NO` → cumplirá la directiva si entrega el rango antes de entrevista
- **`INCOMPATIBLE_5_2`**: `pide_salario_anterior = SI` → en 5 semanas será ilegal (titular principal)

## Tamaño de empresa (categoría auxiliar)

LinkedIn muestra el tamaño de cada empresa en su perfil ("Número de empleados"). Categorías que usaremos:

| Categoría | Empleados | Fuente legal (ref.) |
|---|---|---|
| `MICRO` | <10 | RDL 1/2010 |
| `PEQUEÑA` | 10-49 | RDL 1/2010 |
| `MEDIANA` | 50-249 | RDL 1/2010 |
| `GRANDE` | 250-999 | (interno) |
| `MUY_GRANDE` | 1.000+ | (interno) |
| `IBEX35` | Cotizada IBEX | (manual, marcar también GRANDE/MUY_GRANDE según empleados) |

Si no figura el tamaño en la página de la empresa: `INDET`.

## Anonimización

- En `ofertas.csv` se rellenan dos columnas: `empresa_real` (privada) y `empresa_anon` (publicable).
- Esquema de `empresa_anon`: `EMP_<SLUG_SECTOR>_<NNN>` (ej. `EMP_TEC_001`, `EMP_TEC_002`...).
- En la publicación pública del dataset: solo `empresa_anon`. La columna `empresa_real` se elimina antes de publicar.
- Si una empresa repite (varias ofertas), reusa el mismo `empresa_anon` para esa empresa.

## Plan de validación (piloto antes de escalar)

1. **Piloto sector Tecnología (5 ofertas)** → revisar criterios y plantilla con Claude. Iterar.
2. Una vez validado el piloto, **escalar al resto del sector Tecnología** (15 ofertas más para cerrar las 20).
3. Continuar con los 9 sectores restantes a ritmo de 1-2 sectores/sesión.

## Calendario realista

- Semana del 28-abr → 4-may: piloto + sector Tecnología completo + sector Banca.
- Semana del 5-may → 11-may: sectores 3-6.
- Semana del 12-may → 18-may: sectores 7-10 + análisis estadístico.
- Semana del 19-may → 25-may: redacción del informe + maquetación + sala de prensa.
- 26-30 may: outreach con embargo 6-jun.

## Reporte de incidencias

Si algún sector no devuelve 20 ofertas en últimos 7 días con los filtros de la metodología, ampliar a "Último mes" y anotarlo en el comentario de cada fila como `RANGO_FECHA_AMPLIADO`. Si tampoco así, documentar y reducir cuota para ese sector con justificación.
