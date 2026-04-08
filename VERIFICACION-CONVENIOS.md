# Guía de verificación de convenios colectivos

Documento de referencia para validar datos salariales antes de integrarlos en
salariojusto. Objetivo: que cada número publicado sea **trazable a una fuente
oficial** y que la validación no dependa de tener una conversación abierta.

---

## 1. Flujo de trabajo por convenio

```
1. Tú pides un convenio          → "añade Metal Valencia"
2. Claude busca en webs oficiales → CCOO, UGT, REGCON, BOP
3. Claude entrega una FICHA       → datos + fuentes + cita literal
4. Tú verificas en < 10 min       → abres la URL, comparas números
5. Das luz verde / pides ajustes  → Claude corrige si hace falta
6. Claude estructura el JSON      → /data/convenios/[slug].json
7. Claude integra en la web       → selector calculadora o landing
8. Commit + push en rama test/    → preview Vercel
9. Tú pruebas en preview          → si OK, autorizas merge
```

---

## 2. Ficha de fuente (obligatoria por convenio)

Cada convenio debe tener esta ficha antes de meterse al JSON.

```
CONVENIO: [Sector] [Provincia/Ámbito] [Vigencia]
──────────────────────────────────────────────────────

Código oficial:           [Nº REGCON, ej. 46000105011981]
Ámbito funcional:         [qué actividades cubre]
Ámbito territorial:       [provincia / CCAA / estatal]

FUENTE PRIMARIA (oficial):
  Boletín:                [BOE / BOP + provincia]
  Número y fecha:         [nº XXX de DD/MM/AAAA]
  URL BOE/BOP:            [enlace directo al PDF oficial]

FUENTE USADA (secundaria, legible):
  Entidad:                [CCOO Industria / UGT-FICA / etc.]
  URL directa:            [enlace a página con las tablas]
  Fecha de consulta:      [AAAA-MM-DD]

TABLAS EXTRAÍDAS:
  Año de vigencia:        [2024 / 2025 / etc.]
  Tipo:                   [definitivas / provisionales / revisadas]

CITA LITERAL DE LA FUENTE:
  [copia exacta de la tabla como aparece en la fuente,
   sin reformatear, para comparación directa]

COMENTARIOS:
  [particularidades, cláusulas a tener en cuenta,
   revisiones pendientes, etc.]
```

---

## 3. Cómo verificar en < 10 minutos

### Paso 1 — Abrir la fuente usada
Haz clic en la URL directa de la ficha. Debe cargar una página con las tablas
visibles. Si la página no carga o no contiene las tablas → rechazar.

### Paso 2 — Comparar números uno a uno
Pon la tabla de la ficha al lado de mi propuesta de JSON (que te enseñaré en
formato legible). Verifica **fila por fila**:
- Nombre del grupo/nivel/categoría
- Salario base (mensual o diario)
- Plus convenio
- Pagas extras
- Complementos (si aplican)

**Tolerancia: cero.** Si un número no coincide → rechazar y pedir corrección.

### Paso 3 — Cruzar con fuente primaria (opcional pero recomendado)
Abrir el BOE/BOP oficial citado. Buscar las tablas salariales en ese PDF.
Confirmar que los números de la fuente secundaria coinciden con el documento
oficial.

Si no tienes tiempo para este paso: al menos házlo de forma aleatoria en 1 de
cada 3 convenios para detectar fuentes secundarias poco fiables.

### Paso 4 — Validar la fecha de vigencia
Confirma que la tabla corresponde al año actual o al año que queremos mostrar.
Los convenios tienen revisiones anuales: una tabla "2023" puede estar obsoleta
si estamos en 2026.

---

## 4. Reglas de calidad de datos

Antes de publicar un convenio en salariojusto:

- [ ] **Fuente primaria identificada** (BOE/BOP con número y fecha)
- [ ] **Código oficial** del convenio registrado
- [ ] **URL directa** a la fuente secundaria usada
- [ ] **Tablas salariales** del año vigente o más reciente publicado
- [ ] **Cita literal** conservada para posible auditoría
- [ ] **Telmo ha verificado** los números uno a uno
- [ ] **Preview Vercel probado** antes del merge a main

Si alguna casilla queda sin marcar → **no publicar**.

---

## 5. Fuentes recomendadas por orden de fiabilidad

### Fuentes primarias (oficiales)
1. **BOE** — https://www.boe.es/ (convenios estatales)
2. **BOP provincial** — cada provincia tiene su boletín
   - BOP Valencia: https://bop.dival.es/
   - BOP Madrid: https://www.bocm.es/
   - BOP Barcelona: https://bop.diba.cat/
3. **REGCON** — https://servicios.mites.gob.es/regcon/ (registro nacional)

### Fuentes secundarias (legibles, más rápidas)
1. **CCOO Industria** — industria.ccoo.es (tiene tablas por provincia/sector)
2. **UGT-FICA** — ugt-fica.org
3. **CCOO Servicios** — servicios.ccoo.es
4. **CCOO Sanidad** — sanidad.ccoo.es
5. **Iberley** — iberley.es (base de datos jurídica)

### A evitar
- Blogs de empresas de RRHH con ánimo de lucro (pueden estar desactualizados)
- Webs que no citan la publicación oficial
- PDFs sin fecha de publicación identificable

---

## 6. Qué tipos de convenio distinguimos

| Tipo | Qué contiene | Uso en salariojusto |
|------|--------------|---------------------|
| **Suelo estatal** | Solo remuneración mínima anual por nivel | Verificador de suelo (landing propia) |
| **Provincial completo** | Tablas mensuales + complementos + pluses | Selector en la calculadora |
| **Marco estatal con desarrollo provincial** | Marco estatal + tabla provincial | Ambos: el estatal como referencia + el provincial en calculadora |

Ejemplo actual:
- **Construcción-estatal**: tipo `suelo_estatal` → landing `/construccion-estatal-suelo-salarial.html`
- **Hostelería Madrid/Valencia**: tipo `provincial` → selector de calculadora
- **Metal Valencia** (en curso): tipo `provincial`

---

## 7. Convenios prioritarios (por volumen de trabajadores en España)

Lista propuesta de los más relevantes:

1. ✅ Construcción estatal (suelo)
2. ⬜ Construcción Valencia
3. ⬜ Construcción Madrid
4. ⬜ Construcción Barcelona
5. ✅ Hostelería Madrid
6. ✅ Hostelería Valencia
7. ⬜ Hostelería Barcelona
8. ⬜ Comercio Valencia/Madrid/Barcelona
9. ⬜ Metal Valencia
10. ⬜ Metal Madrid
11. ⬜ Limpieza de edificios y locales (por provincia)
12. ⬜ Oficinas y Despachos Madrid
13. ✅ Oficinas y Despachos Valencia
14. ⬜ Consultoría y TIC estatal
15. ⬜ Enseñanza concertada/privada estatal
16. ⬜ Químicas estatal
17. ⬜ Transporte de mercancías por carretera (por provincia)

Estado: ✅ hecho · ⬜ pendiente

---

## 8. Cómo reanudar el trabajo en cualquier momento

Si pasa tiempo entre sesiones y quieres retomar:

1. Lee este documento entero (5 min)
2. Mira `data/convenios/` → qué convenios tenemos
3. Mira la lista de prioridades (sección 7) → qué sigue
4. Pide al agente: *"añade [convenio X]"*
5. El agente busca fuentes, te enseña ficha, tú validas

No necesitas memorizar nada. El flujo es siempre el mismo: pedir → ficha → validar → JSON → preview → merge.

---

## 9. Reglas innegociables

1. **Nunca publicar datos sin validación humana.** Usuarios toman decisiones
   legales reales con estos números.
2. **Nunca push directo a main.** Siempre rama `test/` + preview Vercel + decisión explícita.
3. **Nunca inventar importes salariales.** Si no encuentro la fuente, lo digo y
   paramos. No se estima.
4. **Siempre guardar cita literal de la fuente** en el comentario del JSON, para
   auditoría posterior.
5. **Siempre indicar fecha de actualización** visible en la web para el usuario.
