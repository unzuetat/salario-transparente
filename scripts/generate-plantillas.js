/**
 * Generador de landings esqueleto para las 10 plantillas del Kit del trabajador
 * (Directiva UE 2023/970 · transparencia retributiva).
 *
 * SSOT: el array PLANTILLAS de este archivo. Cada elemento se renderiza con
 * `render()` y se escribe en /<slug>.html en la raíz del repo.
 *
 * Uso: node scripts/generate-plantillas.js
 *
 * Estado actual: las 10 landings se publican como esqueleto ("🚧 En preparación")
 * con marco legal y "Cuándo usarla" para que el lector entienda el alcance,
 * y para reservar las URLs canónicas. La redacción de cada plantilla se
 * irá rellenando en próximas tandas reemplazando el campo `body` y cambiando
 * `status` a "ready".
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Convierte el texto plano de una carta en HTML preservando saltos de línea
// (vía `white-space: pre-wrap` en CSS) y resaltando las variables del tipo
// [TEXTO] en negrita.
function formatCarta(text) {
  return escapeHtml(text).replace(/(\[[^\]]+\])/g, '<strong>$1</strong>');
}

// URLs canónicas en BOE.es de las normas referenciadas en las plantillas.
// Verificadas el 2026-04-27.
const LEY = {
  directiva2023_970: 'https://www.boe.es/buscar/doc.php?id=DOUE-L-2023-80668',
  et: 'https://www.boe.es/buscar/act.php?id=BOE-A-2015-11430',
  rd901_2020: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12214',
  rd902_2020: 'https://www.boe.es/buscar/act.php?id=BOE-A-2020-12215',
  lo3_2007: 'https://www.boe.es/buscar/act.php?id=BOE-A-2007-6115',
  constitucion: 'https://www.boe.es/buscar/act.php?id=BOE-A-1978-31229',
};

// ── Texto del modelo de carta (plantilla #1) ─────────────────────────
const CARTA_BANDA_SALARIAL = `[CIUDAD], [FECHA]

A la atención de [NOMBRE DEL/DE LA RESPONSABLE DE RECURSOS HUMANOS]
[RAZÓN SOCIAL DE LA EMPRESA]
[DOMICILIO DE LA EMPRESA]

Asunto: Solicitud de información retributiva conforme al artículo 7 de la Directiva (UE) 2023/970

Estimado/a [NOMBRE]:

Mediante el presente escrito, yo [TU NOMBRE Y APELLIDOS], con NIF [TU NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA SEGÚN CONTRATO O CONVENIO], ejerzo el derecho que me reconoce el artículo 7 de la Directiva (UE) 2023/970 del Parlamento Europeo y del Consejo, de 10 de mayo de 2023, sobre transparencia retributiva.

Conforme a ese precepto, le solicito que me facilite por escrito la siguiente información:

1. Mi nivel retributivo individual completo, con desglose entre salario base y todos los complementos.

2. Los niveles retributivos medios, desglosados por sexo, correspondientes a la categoría profesional de [TU CATEGORÍA] o, en su caso, a las categorías de trabajadores y trabajadoras que realicen el mismo trabajo o un trabajo de igual valor al mío.

3. Los criterios objetivos utilizados por la empresa para determinar la retribución, los niveles retributivos y la progresión profesional, así como su aplicación a mi caso concreto.

Le ruego que la información se me remita por escrito a la dirección de correo electrónico [TU EMAIL] o a la dirección postal [TU DIRECCIÓN POSTAL], en el plazo razonable previsto en el artículo 7.4 de la Directiva, que en ningún caso podrá exceder de dos meses desde la fecha de recepción de esta solicitud.

Quedo a su disposición para aportar cualquier aclaración que consideren necesaria.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

// ── Body redactado de la plantilla #1 ────────────────────────────────
const BODY_BANDA_SALARIAL = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>El <strong>artículo 7 de la Directiva (UE) 2023/970</strong> reconoce a cualquier persona trabajadora el derecho a solicitar y recibir <em>por escrito</em> información sobre su nivel retributivo individual y los niveles retributivos medios, desglosados por sexo, de las categorías que realizan el mismo trabajo o un trabajo de igual valor al suyo. La empresa está obligada a responder en un plazo razonable, que <strong>nunca puede exceder de dos meses</strong> (artículo 7.4).</p>
  <p>Esta plantilla convierte ese derecho en una solicitud formal lista para personalizar y enviar. Bien usada, te da en mano tres cosas que normalmente la empresa no comparte: tu desglose retributivo completo, la referencia salarial media de tu categoría con perspectiva de género, y los criterios objetivos que la empresa aplica para fijar y subir sueldos.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p><strong>Desde el 7 de junio de 2026.</strong> La Directiva debe estar transpuesta en esa fecha; si España no la transpone a tiempo, sus disposiciones suficientemente claras y precisas — el art. 7 lo es — pueden invocarse directamente. Antes de esa fecha, el cauce equivalente es el <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">acceso al registro retributivo (RD 902/2020)</a>, que se ejerce a través de la representación legal de los trabajadores.</p>
  </div>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li>Tus datos personales: <strong>nombre y apellidos, NIF, domicilio, email</strong>.</li>
    <li>Tu vinculación con la empresa: <strong>fecha de incorporación, categoría profesional según contrato o convenio, número de empleado/a si aplica</strong>.</li>
    <li>Datos de la empresa: <strong>razón social, CIF, domicilio social</strong> (vienen en tu nómina o en el contrato).</li>
    <li>El <strong>nombre de la persona responsable de RRHH</strong> a quien dirigirla. Si no lo conoces, basta con dirigirla al "Departamento de Recursos Humanos" o "Dirección de Personas".</li>
    <li>Idea clara del <strong>canal de envío</strong> que vas a usar (ver más abajo) — porque condiciona cómo dejarás constancia de la entrega.</li>
  </ul>

  <h2>Modelo de carta</h2>
  <p>Sustituye los campos en <strong>[CORCHETES]</strong> por tus datos. El resto del texto está redactado para invocar correctamente el art. 7 de la Directiva y dejar constancia del plazo legal de respuesta.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="solicitud-banda-salarial.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_BANDA_SALARIAL)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <p>La forma de envío importa: necesitas dejar constancia tanto del envío como de la fecha en que la empresa la recibe. El plazo de dos meses se cuenta desde la recepción.</p>

  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). Es la opción más sólida ante un eventual juicio: tienes prueba de qué dijiste y de cuándo lo recibieron. Coste aproximado: 25–40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de RRHH, solicitando "confirmación de lectura" en el cliente de correo y, en el cuerpo del mensaje, pidiendo expresamente acuse de recibo. Adjunta la carta firmada en PDF. Conserva la cabecera del correo enviado.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa. Lleva dos copias y exige que te sellen una con fecha y firma. Vale como prueba si la empresa tiene oficina física habilitada para registro.</li>
  </ol>

  <p>Sea cual sea la vía, <strong>conserva siempre tu copia firmada y la prueba de recepción</strong>. Si más adelante hay reclamación, son la base de tu argumento.</p>

  <h2>Qué pasa si la empresa no responde</h2>
  <p>El plazo máximo es de <strong>dos meses desde la recepción</strong>. Pasado ese plazo sin respuesta — o con una respuesta incompleta o evasiva — tienes varias vías que se pueden combinar:</p>
  <ul>
    <li><strong>Reiterar la solicitud por escrito</strong> recordando el plazo del art. 7.4 ya superado y advirtiendo de que se procederá a denuncia. Sirve para dejar constancia de la negativa.</li>
    <li><strong>Denunciar ante la Inspección de Trabajo y Seguridad Social</strong> (<a href="https://www.mites.gob.es/itss/web/index.html" target="_blank" rel="noopener">mites.gob.es/itss</a>). El incumplimiento del derecho de información retributiva es sancionable.</li>
    <li><strong>Acudir a la representación legal de los trabajadores</strong> (comité, delegados sindicales) o a un sindicato sectorial. La presión colectiva suele desbloquear la información sin necesidad de juicio.</li>
    <li><strong>Demanda ante el juzgado de lo social</strong>. Si la negativa de la empresa forma parte de un patrón de discriminación, puede combinarse con una reclamación por desigualdad retributiva — y entonces la <strong>carga de la prueba se invierte</strong> (<a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">art. 18 Directiva 2023/970</a>).</li>
  </ul>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales · Directiva (UE) 2023/970</p>
    <ul>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 7.1</strong></a> — Los trabajadores tienen derecho a solicitar y recibir información por escrito sobre su nivel retributivo individual y los niveles retributivos medios, desglosados por sexo, para las categorías de trabajadores que realicen el mismo trabajo o un trabajo de igual valor al suyo.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 7.3</strong></a> — Los empleadores informarán anualmente a todos los trabajadores de su derecho a recibir la información y de los pasos que deben seguir para ejercerlo.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 7.4</strong></a> — Los empleadores facilitarán la información solicitada en un plazo razonable y, en cualquier caso, en un plazo de dos meses a contar desde la fecha en que se cursó la solicitud.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 7.5</strong></a> — No se impedirá a los trabajadores revelar su retribución a efectos de la aplicación del principio de igualdad de retribución. Las cláusulas contractuales que impidan revelar información sobre la retribución son nulas.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">Texto consolidado de la Directiva (UE) 2023/970 en BOE.es →</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Puedo enviarla antes del 7 de junio de 2026?</p>
    <p class="faq-a">No con esta base legal. Antes de esa fecha, el cauce equivalente es el acceso al registro retributivo del RD 902/2020, que se ejerce a través de la representación legal de los trabajadores. Si tu empresa no tiene representación, en la práctica el ejercicio individual no está garantizado hasta la transposición de la Directiva.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿La empresa puede negarse alegando protección de datos?</p>
    <p class="faq-a">No. El art. 7 prevé que la información se entregue de forma agregada y desglosada por sexo, no individualizada por persona. La protección de datos no exime a la empresa de su obligación de transparencia retributiva.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puedo pedir el dato individual de un compañero/a?</p>
    <p class="faq-a">No. Lo que la Directiva exige a la empresa es facilitar <em>medias por sexo y categoría</em>. La transparencia se construye sobre datos agregados, no nominativos.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Tengo que motivar por qué pido la información?</p>
    <p class="faq-a">No. El derecho del art. 7 es incondicional. No hace falta sospechar discriminación ni alegar motivo concreto: basta con ejercerlo.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿La empresa puede sancionarme por enviar esta carta?</p>
    <p class="faq-a">No. La Directiva incluye protección expresa frente a represalias en su <a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">artículo 25 (Victimización y protección frente a un trato menos favorable)</a>. Cualquier despido o medida desfavorable que se produzca tras ejercer este derecho puede ser declarado nulo en juicio. Aun así, conviene leer el <a href="/reclamar-diferencias-salariales-convenio.html#escenario-serpico">escenario Serpico</a> para entender los matices reales de "represalia" más allá del papel.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de carta + body redactado de la plantilla #3 ─────────────
const CARTA_GRUPO_SUPERIOR = `[CIUDAD], [FECHA]

A la atención de [NOMBRE DEL/DE LA RESPONSABLE DE RECURSOS HUMANOS]
[RAZÓN SOCIAL DE LA EMPRESA]
[DOMICILIO DE LA EMPRESA]

Asunto: Solicitud de reconocimiento de grupo profesional superior y reclamación de diferencias retributivas

Estimado/a [NOMBRE]:

Mediante el presente escrito, yo [TU NOMBRE Y APELLIDOS], con NIF [TU NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA SEGÚN CONTRATO] (grupo profesional [TU GRUPO ACTUAL] del convenio colectivo aplicable), pongo en su conocimiento los siguientes hechos y formulo la siguiente solicitud:

PRIMERO. Desde el [FECHA DE INICIO DE FUNCIONES SUPERIORES] vengo desempeñando, de manera habitual y efectiva, las siguientes funciones que corresponden al grupo profesional [GRUPO SUPERIOR RECLAMADO] del convenio colectivo:

- [FUNCIÓN 1: descripción concreta]
- [FUNCIÓN 2: descripción concreta]
- [FUNCIÓN 3: descripción concreta]
[AÑADIR LAS QUE APLIQUEN, CON DESCRIPCIONES OPERATIVAS]

SEGUNDO. Estas funciones figuran descritas en el convenio colectivo aplicable como propias del grupo profesional [GRUPO SUPERIOR RECLAMADO], no del grupo en el que se me ha clasificado.

TERCERO. Conforme al artículo 39.2 del Estatuto de los Trabajadores, el desempeño de funciones superiores a las del grupo profesional por un período superior a seis meses durante un año, o a ocho meses durante dos años, da derecho a la persona trabajadora a reclamar el ascenso al grupo profesional superior y las diferencias retributivas correspondientes.

CUARTO. En mi caso, vengo desempeñando las funciones descritas de manera continuada durante [PERÍODO TEMPORAL CONCRETO: ej. "los últimos diez meses"], superando el umbral legal del artículo 39.2 ET.

Por todo lo anterior, SOLICITO:

1. El reconocimiento formal de mi clasificación en el grupo profesional [GRUPO SUPERIOR RECLAMADO], con efectos desde [FECHA DE INICIO DE FUNCIONES SUPERIORES].

2. El abono de las diferencias retributivas (salario base, complementos y pagas extraordinarias) entre mi grupo actual y el superior, correspondientes al período comprendido entre [FECHA DE INICIO] y la fecha de la presente reclamación, así como las que se devenguen mientras continúe el desempeño en el grupo superior.

Quedo a su disposición para aportar las pruebas documentales y testificales que acrediten los hechos descritos. Le ruego que me confirme por escrito la recepción de esta solicitud y me responda en un plazo razonable.

A los efectos del artículo 59.1 del Estatuto de los Trabajadores, dejo expresa constancia de la fecha de la presente reclamación, que interrumpe la prescripción de las cantidades reclamadas.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

const BODY_GRUPO_SUPERIOR = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>El <a href="${LEY.et}" target="_blank" rel="noopener">artículo 39 del Estatuto de los Trabajadores</a> reconoce a cualquier persona trabajadora el derecho a reclamar el ascenso al <strong>grupo profesional superior</strong> cuando viene desempeñando funciones de ese grupo de forma continuada — junto con las diferencias retributivas correspondientes desde que empezó a hacerlas. Esta plantilla convierte ese derecho en una solicitud formal con tres partes bien delimitadas: <strong>constatación de los hechos</strong> (qué funciones haces y desde cuándo), <strong>anclaje legal</strong> (art. 39.2 ET) y <strong>pretensión concreta</strong> (reconocimiento del grupo + atrasos).</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p>Llevas haciendo funciones del grupo profesional superior durante <strong>más de seis meses dentro del último año</strong>, o <strong>más de ocho meses dentro de los dos últimos años</strong>. Estos plazos los fija el art. 39.2 ET y son acumulables — no tienen que ser los últimos seis u ocho meses seguidos, basta con que sumen ese tiempo dentro del período de referencia. Si las funciones superiores han sido <em>puntuales o esporádicas</em>, no llegas al umbral del ascenso, pero sí tienes derecho a las diferencias retributivas del período concreto en que las realizaste.</p>
  </div>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li>Tus datos personales: <strong>nombre y apellidos, NIF, dirección</strong>.</li>
    <li>Datos del contrato: <strong>fecha de incorporación, categoría profesional asignada, grupo profesional según contrato</strong>.</li>
    <li>Datos de la empresa: <strong>razón social, CIF, domicilio social</strong> (vienen en tu nómina o en el contrato).</li>
    <li>El <strong>convenio colectivo aplicable</strong> y la <strong>tabla de grupos profesionales</strong>. Si está entre los que <a href="/convenios.html">desgranamos en SalarioJusto</a>, tienes ahí el resumen; si no, ve al BOE o al boletín provincial correspondiente.</li>
    <li>Una <strong>lista detallada y cronológica</strong> de las funciones del grupo superior que vienes desempeñando, con la <strong>fecha de inicio</strong> de cada una. Cuanto más concreta y comprobable, mejor.</li>
    <li>Pruebas documentales que acrediten esas funciones: <strong>correos donde se te asignan tareas del grupo superior, organigramas, comunicaciones internas, descripciones de proyecto, evaluaciones de desempeño, comunicados a clientes en los que firmas con responsabilidad propia del grupo superior</strong>.</li>
    <li>Cálculo aproximado de las <strong>diferencias retributivas</strong> mes a mes (salario base + complementos del grupo superior, menos los del grupo actual) por el período afectado. No tiene que ser exacto al céntimo — sirve para estimar la cuantía.</li>
  </ul>

  <h2>Modelo de carta</h2>
  <p>Sustituye los campos en <strong>[CORCHETES]</strong> por tus datos. La estructura "PRIMERO / SEGUNDO / TERCERO / CUARTO + SOLICITO" es el formato habitual en una reclamación previa al juzgado social: ordena los hechos antes que las pretensiones para que la respuesta de la empresa sea limpia.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="reclamacion-grupo-profesional-superior.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_GRUPO_SUPERIOR)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <p>La forma de envío importa porque la fecha de recepción es la que <strong>interrumpe la prescripción</strong> de las cantidades reclamadas (art. 59.1 ET). Necesitas dejar constancia tanto del envío como de la recepción.</p>

  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). La opción más sólida ante un eventual juicio: prueba de qué dijiste y de cuándo lo recibió la empresa. Coste aproximado: 25–40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de RRHH, con confirmación de lectura y solicitud expresa de acuse de recibo en el cuerpo del mensaje. Adjunta la carta firmada en PDF y conserva la cabecera del correo enviado.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa. Lleva dos copias y exige que te sellen una con fecha y firma.</li>
  </ol>

  <p>Sea cual sea la vía, <strong>conserva siempre tu copia firmada y la prueba de recepción</strong>: son la base de la futura reclamación judicial si hace falta llegar a ella.</p>

  <h2>Qué pasa si la empresa no responde o rechaza la solicitud</h2>

  <p>El art. 39.2 ET no fija un plazo concreto de respuesta. Como referencia razonable, suelen darse <strong>15 días laborables</strong> antes de escalar. Si pasado ese plazo la empresa no contesta o rechaza la pretensión, las vías son:</p>
  <ul>
    <li><strong>Reiterar por escrito</strong>, recordando el plazo transcurrido y advirtiendo de que se procederá a denuncia. Sirve para dejar constancia adicional.</li>
    <li><strong>Acudir a la representación legal</strong> de los trabajadores o a un sindicato sectorial. La presión colectiva suele resolver el caso sin juicio cuando el desempeño de funciones superiores es evidente para el resto de la plantilla.</li>
    <li><strong>Denunciar ante la Inspección de Trabajo</strong> (<a href="https://www.mites.gob.es/itss/web/index.html" target="_blank" rel="noopener">mites.gob.es/itss</a>): la incorrecta clasificación profesional es una infracción tipificada y sancionable.</li>
    <li><strong>Demanda ante el juzgado de lo social</strong>: la acción típica es declarativa de derecho al grupo + reclamación de cantidad. Es compatible reclamar cantidad a la vez que el reconocimiento del grupo.</li>
  </ul>

  <p><strong>Atención al plazo de prescripción.</strong> El plazo del art. 59.1 ET — un año desde que cada cantidad debió abonarse — afecta al <em>importe</em> que puedes recuperar, no al <em>derecho a la categoría</em>. Aunque hayan pasado más de doce meses desde que empezaste a hacer funciones superiores, sigues pudiendo reclamar el grupo correcto a partir de ahora; lo que pierdes son las diferencias retributivas anteriores al año previo a la reclamación. Por eso interesa enviar la carta cuanto antes y dejar constancia de la fecha.</p>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales · Estatuto de los Trabajadores</p>
    <ul>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 39.1</strong></a> — La movilidad funcional en la empresa se efectuará de acuerdo a las titulaciones académicas o profesionales precisas para ejercer la prestación laboral y con respeto a la dignidad del trabajador.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 39.2</strong></a> — La movilidad funcional para la realización de funciones, tanto superiores como inferiores, no correspondientes al grupo profesional sólo será posible si existen, además, razones técnicas u organizativas que la justificasen y por el tiempo imprescindible para su atención. […] En el caso de encomienda de funciones superiores a las del grupo profesional por un periodo superior a seis meses durante un año u ocho durante dos años, el trabajador podrá reclamar el ascenso, si a ello no obsta lo dispuesto en convenio colectivo […], sin perjuicio de reclamar la diferencia salarial correspondiente.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 39.3</strong></a> — El trabajador tendrá derecho a la retribución correspondiente a las funciones que efectivamente realice, salvo en los casos de encomienda de funciones inferiores, en los que mantendrá la retribución de origen.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 59.1</strong></a> — Las acciones derivadas del contrato de trabajo que no tengan señalado plazo especial prescribirán al año de su terminación. […] En general, el plazo de prescripción será de un año.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.et}" target="_blank" rel="noopener">Texto consolidado del Estatuto de los Trabajadores en BOE.es →</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Tengo que esperar a llegar a los 6 meses exactos para reclamar?</p>
    <p class="faq-a">No es obligatorio: si llevas menos tiempo, igualmente puedes reclamar la <strong>diferencia retributiva</strong> por las funciones superiores que hayas realizado (art. 39.3 ET). El umbral de 6/12 u 8/24 meses solo condiciona el derecho a reclamar el <em>ascenso</em>, no el cobro de la diferencia salarial mientras dure el desempeño superior.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿La empresa puede negarse alegando que es una "necesidad organizativa temporal"?</p>
    <p class="faq-a">El art. 39.2 ET exige razones técnicas u organizativas que justifiquen la movilidad funcional vertical y limita su duración al "tiempo imprescindible para su atención". Si la encomienda de funciones superiores se ha prolongado más allá de los plazos legales, la justificación de "temporalidad" deja de ser sostenible — y la empresa pierde ese argumento en juicio. La acumulación de tiempo es objetiva.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Qué pasa si el convenio colectivo regula los ascensos de forma específica?</p>
    <p class="faq-a">El art. 39.2 ET admite que el convenio colectivo establezca reglas propias para la cobertura de vacantes y los ascensos, siempre que no anulen el derecho al ascenso. En la práctica: lee el capítulo de "ascensos" o "promoción profesional" de tu convenio antes de redactar la carta. Si el convenio fija un sistema concreto (concurso interno, valoración de méritos, antigüedad), tu solicitud debe enmarcarse en él. Si no lo fija o lo fija de forma incompleta, se aplica el art. 39.2 ET íntegramente.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Cuánto puedo recuperar si reclamo después de mucho tiempo?</p>
    <p class="faq-a">El derecho a la <strong>categoría</strong> no prescribe en el plazo del año del art. 59.1 ET — puedes reclamar el reconocimiento del grupo profesional aunque hayas estado años haciendo funciones superiores. Lo que sí prescribe en un año son las <strong>cantidades</strong> económicas: las diferencias retributivas de mensualidades anteriores al año previo a la reclamación ya están perdidas. Por eso conviene reclamar pronto: cada mes que pasa, pierdes una mensualidad de atrasos por la "cola" del año.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puedo combinar esta plantilla con la Plantilla 1 (pedir la banda salarial a tu empresa)?</p>
    <p class="faq-a">Sí, y a menudo conviene. La <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a> te da los <em>datos retributivos medios</em> por categoría — eso es exactamente lo que necesitas para cuantificar la diferencia entre tu grupo actual y el superior. Si tienes margen de tiempo, pide primero los datos del art. 7 (la empresa tiene 2 meses para responder) y, con ellos en la mano, redacta esta reclamación con cifras concretas. Si la urgencia te aprieta — porque el plazo de prescripción está corriendo — envía las dos en paralelo.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de carta + body redactado de la plantilla #4 ─────────────
const CARTA_ATRASOS_CONVENIO = `[CIUDAD], [FECHA]

A la atención de [NOMBRE DEL/DE LA RESPONSABLE DE RECURSOS HUMANOS]
[RAZÓN SOCIAL DE LA EMPRESA]
[DOMICILIO DE LA EMPRESA]

Asunto: Reclamación de atrasos salariales por revisión del convenio colectivo aplicable

Estimado/a [NOMBRE]:

Mediante el presente escrito, yo [TU NOMBRE Y APELLIDOS], con NIF [TU NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA SEGÚN CONTRATO] (grupo profesional [TU GRUPO]), pongo en su conocimiento los siguientes hechos y formulo la siguiente reclamación:

PRIMERO. El convenio colectivo aplicable a la empresa, [NOMBRE COMPLETO DEL CONVENIO Y REFERENCIA: ej. "Convenio Colectivo del Comercio del Metal de Madrid, código 28000115011981"], publicado en [BOLETÍN: BOE / DOGC / BOP de … / DOG…] de fecha [FECHA DE PUBLICACIÓN], establece una revisión salarial con efectos retroactivos desde el [FECHA DE EFECTOS, normalmente 1 de enero del año correspondiente].

SEGUNDO. Conforme a las tablas salariales recogidas en dicha revisión, el salario aplicable a mi grupo profesional desde la fecha de efectos es:

- Salario base: [IMPORTE NUEVO] € (anteriormente: [IMPORTE ANTERIOR] €)
- [COMPLEMENTO 1]: [IMPORTE NUEVO] € (anteriormente: [IMPORTE ANTERIOR] €)
- [COMPLEMENTO 2]: [IMPORTE NUEVO] € (anteriormente: [IMPORTE ANTERIOR] €)
[AÑADIR LOS QUE APLIQUEN]

TERCERO. Sin embargo, las nóminas que he percibido desde [FECHA DE EFECTOS] hasta la fecha siguen aplicando los importes anteriores a la revisión, sin que se haya regularizado la diferencia retributiva debida.

CUARTO. La diferencia mensual a mi favor asciende aproximadamente a [DIFERENCIA MENSUAL ESTIMADA] €. La cantidad total acumulada desde la fecha de efectos del convenio es de aproximadamente [TOTAL ATRASOS ESTIMADO] €, sin perjuicio de los cálculos exactos que correspondan, incluidas las pagas extraordinarias y la incidencia sobre cotizaciones.

Por todo lo anterior, SOLICITO:

1. El abono de los atrasos salariales devengados desde [FECHA DE EFECTOS] hasta la fecha en que se regularicen las nóminas, conforme a las nuevas tablas del convenio.

2. La aplicación correcta de las tablas salariales actualizadas en las nóminas sucesivas, así como la regularización proporcional de las pagas extraordinarias y de cualquier otro concepto retributivo afectado por la revisión.

A los efectos del artículo 59.1 del Estatuto de los Trabajadores, dejo expresa constancia de la fecha de la presente reclamación, que interrumpe la prescripción de las cantidades reclamadas.

Quedo a su disposición para aportar la documentación que estime oportuna y le ruego que me confirme por escrito la recepción de esta solicitud y me responda en un plazo razonable.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

const BODY_ATRASOS_CONVENIO = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>Cuando un convenio colectivo se actualiza con efectos retroactivos — algo habitual en la negociación colectiva española —, las nuevas tablas salariales se aplican desde una fecha anterior a la de su publicación en el BOE o el boletín correspondiente. La empresa tiene la obligación de pagar la diferencia entre lo que cobraste y lo que te correspondía cobrar desde la fecha de efectos. Si no lo ha hecho, puedes reclamarlo. Esta plantilla convierte esa reclamación en un escrito formal que <strong>interrumpe la prescripción</strong> del año del <a href="${LEY.et}" target="_blank" rel="noopener">art. 59.1 ET</a> y deja prueba documentada antes de un eventual juicio.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p>Tu convenio colectivo se ha actualizado y el texto publicado <strong>fija una fecha de efectos retroactiva</strong> (típicamente el 1 de enero del año correspondiente). La empresa no te ha aplicado las diferencias retributivas en las nóminas posteriores a esa fecha. <strong>Cuanto antes reclames, mejor</strong>: el plazo de un año del art. 59.1 ET cuenta <em>desde que cada mensualidad debió abonarse</em>, no desde la publicación del convenio — cada mes que pasa, pierdes una mensualidad de atrasos por la "cola" del año.</p>
  </div>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li><strong>Texto del convenio actualizado</strong> con su fecha de publicación y su fecha de efectos. Localízalo en el <a href="https://www.boe.es/buscar/" target="_blank" rel="noopener">BOE</a>, el boletín provincial o autonómico, o el <a href="https://expinterweb.mites.gob.es/regcon/" target="_blank" rel="noopener">REGCON</a>. Si tu convenio está entre los que <a href="/convenios.html">desgranamos en SalarioJusto</a>, ahí encontrarás también la referencia oficial.</li>
    <li><strong>Tablas salariales nuevas y anteriores</strong>, identificando claramente tu grupo profesional. Necesitas las dos para calcular la diferencia.</li>
    <li><strong>Tus nóminas</strong> desde la fecha de efectos del nuevo convenio hasta la última cobrada. Si la empresa ya regularizó parcialmente, identifica el mes en que lo hizo.</li>
    <li><strong>Cálculo de la diferencia mes a mes</strong>: salario base + complementos del nuevo convenio menos lo cobrado realmente. No olvides la incidencia sobre las pagas extraordinarias (si las hay) y sobre cualquier complemento que se calcule como porcentaje del salario base.</li>
    <li>Datos de la empresa: <strong>razón social, CIF, domicilio social</strong>.</li>
    <li>El <strong>nombre de la persona responsable de RRHH</strong> a quien dirigirla.</li>
  </ul>

  <h2>Modelo de carta</h2>
  <p>Sustituye los campos en <strong>[CORCHETES]</strong> por tus datos. La estructura "PRIMERO/SEGUNDO/TERCERO/CUARTO + SOLICITO" es la habitual en una reclamación previa al juzgado social: ordena los hechos antes que las pretensiones para que la respuesta de la empresa sea limpia.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="reclamacion-atrasos-convenio.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_ATRASOS_CONVENIO)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <p>El detalle clave aquí es que la <strong>fecha de recepción interrumpe la prescripción</strong> de las cantidades reclamadas. Necesitas dejar constancia tanto del envío como de la recepción.</p>

  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). La opción más sólida ante un juicio: prueba de qué dijiste y de cuándo lo recibió la empresa. Coste aproximado: 25–40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de RRHH, con confirmación de lectura y solicitud expresa de acuse de recibo. Adjunta la carta firmada en PDF y conserva la cabecera del correo enviado.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa. Lleva dos copias y exige que te sellen una con fecha y firma.</li>
  </ol>

  <h2>Qué pasa si la empresa no responde o rechaza el pago</h2>
  <p>El art. 59.1 ET no fija un plazo de respuesta para la empresa. Como referencia razonable, suelen darse <strong>15 días laborables</strong> antes de escalar. Si pasado ese plazo no contesta, las vías son:</p>
  <ul>
    <li><strong>Reiterar por escrito</strong>, recordando el plazo transcurrido y advirtiendo de que se procederá a denuncia. Sirve para reforzar la prueba.</li>
    <li><strong>Acudir al SMAC (Servicio de Mediación, Arbitraje y Conciliación)</strong> de tu CCAA presentando una papeleta de conciliación previa por reclamación de cantidad. Es paso obligatorio antes de demandar — y muchas empresas pagan en este momento para evitar el juicio.</li>
    <li><strong>Demanda ante el juzgado de lo social</strong> por reclamación de cantidad. La cuantía es objetiva (las tablas del convenio son públicas) y la prueba documental es clara.</li>
    <li><strong>Denuncia ante la Inspección de Trabajo</strong>: el incumplimiento de las cláusulas del convenio en materia retributiva es una infracción tipificada en la Ley sobre Infracciones y Sanciones en el Orden Social (LISOS).</li>
  </ul>

  <p><strong>Sobre la prescripción</strong>: si entre la fecha de efectos del convenio y hoy ha pasado más de un año, las mensualidades anteriores al año previo a tu reclamación ya están prescritas <em>como cantidad</em>. Lo que sí sigue siendo reclamable son las mensualidades de los últimos doce meses. La fecha de la carta interrumpe el plazo: a partir de su recepción, ese plazo se reinicia.</p>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales · Estatuto de los Trabajadores</p>
    <ul>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 59.1</strong></a> — Las acciones derivadas del contrato de trabajo que no tengan señalado plazo especial prescribirán al año de su terminación. […] En general, el plazo de prescripción será de un año.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 26.1</strong></a> — Se considerará salario la totalidad de las percepciones económicas de los trabajadores, en dinero o en especie, por la prestación profesional de los servicios laborales por cuenta ajena, ya retribuyan el trabajo efectivo, cualquiera que sea la forma de remuneración, o los periodos de descanso computables como de trabajo.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 82.3</strong></a> — Los convenios colectivos regulados por esta ley obligan a todos los empresarios y trabajadores incluidos dentro de su ámbito de aplicación y durante todo el tiempo de su vigencia.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.et}" target="_blank" rel="noopener">Texto consolidado del Estatuto de los Trabajadores en BOE.es →</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Cuánto puedo recuperar si llevo más de un año sin que se aplique la subida?</p>
    <p class="faq-a">Las mensualidades anteriores al año previo a tu reclamación están prescritas <em>como cantidad económica</em> (art. 59.1 ET). Las de los últimos doce meses siguen siendo reclamables. Por eso interesa enviar la carta cuanto antes: cada mes que pasa sin reclamar, pierdes una mensualidad de atrasos por la "cola" del año.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿La empresa puede negarse alegando que está pendiente la firma definitiva del convenio?</p>
    <p class="faq-a">Si el convenio ya se ha publicado en el boletín correspondiente con efectos retroactivos, está vigente y obliga a todas las empresas de su ámbito (art. 82.3 ET). La excusa de "estamos pendientes de validar" no tiene base legal una vez el texto está publicado. Otro escenario distinto es cuando se está negociando un nuevo convenio y aún no hay texto firmado: en ese caso, lo aplicable sigue siendo el convenio anterior — pero también puede entrar en juego la cláusula de ultraactividad si está prevista.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Tengo que reclamar las pagas extraordinarias por separado?</p>
    <p class="faq-a">No: forman parte de la reclamación. La revisión del convenio suele afectar también al cálculo de las pagas extras (especialmente si se calculan como salario base × N días o como un porcentaje del salario anual). Inclúyelas en la cuantificación de tu carta y solicita su regularización proporcional desde la fecha de efectos del convenio.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Y si el convenio establece un plazo distinto de aplicación retroactiva?</p>
    <p class="faq-a">Cada convenio puede fijar libremente su fecha de efectos (siempre dentro de su ámbito temporal). La fecha que vale es <strong>la que diga literalmente el texto publicado</strong>. Léela con cuidado: a veces la fecha de efectos coincide con el 1 de enero, pero otras veces es la propia fecha de publicación o una fecha intermedia.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puedo combinar esta reclamación con otras?</p>
    <p class="faq-a">Sí. Si además has detectado que tu grupo profesional no es el correcto (haces funciones del grupo superior), puedes presentar las dos reclamaciones en paralelo o unificarlas en un solo escrito — porque la base legal es distinta (art. 39 ET para el grupo, art. 59.1 ET para la cantidad). Ver la <a href="/plantilla-reclamar-grupo-profesional-superior.html">Plantilla 3: reclamar el grupo profesional superior</a>.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de denuncia + body redactado de la plantilla #5 ──────────
const CARTA_DENUNCIA_DISCRIMINACION = `[CIUDAD], [FECHA]

A LA INSPECCIÓN PROVINCIAL DE TRABAJO Y SEGURIDAD SOCIAL DE [PROVINCIA]

DATOS DE LA PERSONA DENUNCIANTE:
- Nombre y apellidos: [TU NOMBRE Y APELLIDOS]
- NIF: [TU NIF]
- Domicilio a efectos de notificaciones: [DIRECCIÓN POSTAL]
- Email de contacto: [EMAIL]
- Teléfono: [TELÉFONO]

DATOS DE LA EMPRESA DENUNCIADA:
- Razón social: [RAZÓN SOCIAL DE LA EMPRESA]
- CIF: [CIF DE LA EMPRESA]
- Domicilio del centro de trabajo: [DOMICILIO DEL CENTRO DE TRABAJO]
- Actividad: [ACTIVIDAD PRINCIPAL]
- Convenio colectivo aplicable: [CONVENIO]

OBJETO DE LA DENUNCIA: Discriminación retributiva por razón de sexo (art. 28 del Estatuto de los Trabajadores y Directiva (UE) 2023/970).

EXPONGO los siguientes HECHOS:

PRIMERO. Que presto servicios para la empresa [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA] (grupo profesional [TU GRUPO]), realizando funciones de [DESCRIPCIÓN BREVE DE TUS FUNCIONES].

SEGUNDO. Que mi retribución actual asciende a [TU RETRIBUCIÓN ANUAL] € brutos anuales (salario base + complementos), conforme a la nómina que se acompaña.

TERCERO. Que tengo conocimiento de que en mi misma categoría profesional o en categorías que realizan trabajos de igual valor, las personas trabajadoras del sexo opuesto perciben una retribución superior a la mía, sin que dicha diferencia esté justificada por motivos objetivos, neutros y verificables. En concreto:

- [HECHO CONCRETO 1: ej. "El compañero D. ___, contratado en idéntica categoría y con menor antigüedad, percibe ___ € brutos anuales según la oferta interna publicada el ___"]
- [HECHO CONCRETO 2]
- [HECHO CONCRETO 3]
[AÑADIR LOS QUE APLIQUEN, CON FECHAS Y FUENTES VERIFICABLES]

CUARTO. Que, conforme al artículo 28.2 del Estatuto de los Trabajadores y al Real Decreto 902/2020, la empresa está obligada a llevar un registro retributivo con los valores medios desglosados por sexo. He solicitado [HE / NO HE] tenido acceso a dicho registro, [INDICAR RESULTADO: si negaron acceso, fecha, etc.].

QUINTO. Que esta situación constituye discriminación retributiva por razón de sexo, prohibida por el artículo 28 del Estatuto de los Trabajadores, el artículo 14 de la Constitución Española y la Directiva (UE) 2023/970, así como por la Ley Orgánica 3/2007 para la igualdad efectiva de mujeres y hombres.

PRUEBAS QUE SE ACOMPAÑAN:

1. Copia de mi contrato de trabajo y nóminas de los últimos [12 / 24] meses.
2. [LISTAR PRUEBAS: ej. captura de la oferta interna; correos donde se asignan funciones; comunicaciones internas que evidencian la diferencia; etc.]
3. [SI LO HUBIERA] Copia de la solicitud previa del registro retributivo y de la respuesta o falta de respuesta de la empresa.

Por todo lo anterior, SOLICITO a la Inspección Provincial de Trabajo y Seguridad Social:

1. Que se inicien las actuaciones inspectoras oportunas para verificar los hechos denunciados.

2. Que se requiera a la empresa la entrega del registro retributivo y, en su caso, de la auditoría retributiva (RD 902/2020) y del plan de igualdad si está obligada a tenerlo.

3. Que, de constatarse la infracción, se proceda a la sanción correspondiente conforme a la Ley sobre Infracciones y Sanciones en el Orden Social (LISOS).

4. Que se me informe del resultado de las actuaciones inspectoras.

A los efectos del artículo 25 de la Directiva (UE) 2023/970 y del artículo 17 del Estatuto de los Trabajadores, dejo constancia expresa de que cualquier represalia o trato desfavorable que se produjera tras la presentación de esta denuncia se entenderá nula de pleno derecho.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

const BODY_DENUNCIA_DISCRIMINACION = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>Cuando tienes indicios sólidos de que cobras menos que un compañero/a por razón de sexo, hay dos vías para reclamarlo y son <strong>compatibles entre sí</strong>: la <strong>denuncia ante la Inspección de Trabajo</strong> (vía administrativa, gratuita) y la <strong>demanda ante el juzgado de lo social</strong> (vía judicial, recupera diferencias y daños). Esta plantilla cubre la primera — el modelo de denuncia administrativa que abre el procedimiento inspector y, normalmente, hace que la empresa rectifique antes de llegar a juicio. Para la demanda judicial conviene contar con sindicato o abogado/a laboralista; el escrito de demanda es más complejo y requiere asesoramiento individualizado.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p>Tienes <strong>indicios sólidos y verificables</strong> (no sospechas vagas) de que tu retribución es inferior a la de personas del sexo opuesto en tu misma categoría profesional o en categorías que realizan trabajos de igual valor, y no hay justificación objetiva razonable. Los indicios pueden venir del registro retributivo de la empresa, de ofertas internas con banda salarial, de información salarial obtenida vía <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a>, o de comparaciones documentadas. La <a href="https://www.boe.es/buscar/doc.php?id=DOUE-L-2023-80668" target="_blank" rel="noopener">carga de la prueba se invierte (art. 18 Directiva)</a>: tú aportas indicios, la empresa tiene que demostrar que no hay discriminación.</p>
  </div>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li><strong>Tu archivo de evidencias bien ordenado</strong>. Esta es la pieza crítica: sin pruebas verificables, la denuncia se archiva. Tabla con fecha, hecho, fuente y prueba adjunta. → <a href="/plantilla-documentar-evidencias-desigualdad-salarial.html">Plantilla 7: documentar evidencias de desigualdad</a>.</li>
    <li><strong>Datos personales</strong>: nombre y apellidos, NIF, domicilio postal, email y teléfono.</li>
    <li><strong>Datos del contrato</strong>: fecha de incorporación, categoría profesional, funciones reales, retribución bruta anual desglosada (salario base + complementos).</li>
    <li><strong>Datos de la empresa</strong>: razón social, CIF, domicilio del centro de trabajo, actividad principal, convenio aplicable.</li>
    <li><strong>Hechos concretos</strong> con fechas y fuentes verificables. Cada hecho debe poder respaldarse con una prueba documental.</li>
    <li><strong>Si has solicitado previamente el registro retributivo</strong> (RD 902/2020 o art. 7 Directiva), copia de tu solicitud y de la respuesta o silencio de la empresa.</li>
    <li><strong>Provincia</strong> a la que dirigir la denuncia: la <a href="https://www.mites.gob.es/itss/web/atencion_al_ciudadano/atencion_ciudadano.html" target="_blank" rel="noopener">Inspección Provincial</a> donde radica tu centro de trabajo.</li>
  </ul>

  <h2>Modelo de denuncia ante la Inspección de Trabajo</h2>
  <p>Sustituye los campos en <strong>[CORCHETES]</strong> por tus datos. La estructura "EXPONGO los HECHOS / PRUEBAS / SOLICITO" es el formato administrativo estándar. La cláusula final sobre represalias es importante: anticipa la protección del art. 25 de la Directiva y del art. 17 ET y deja constancia desde el inicio.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="denuncia-discriminacion-salarial.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_DENUNCIA_DISCRIMINACION)}</div>
  </div>

  <h2>Cómo presentarla</h2>
  <p>Hay tres vías oficiales para presentar la denuncia ante la Inspección de Trabajo. Las tres son válidas y dejan registro:</p>
  <ol>
    <li><strong>Sede electrónica del Ministerio de Trabajo</strong>: <a href="https://expinterweb.mites.gob.es/itss_consultas/" target="_blank" rel="noopener">Formulario de denuncias online</a>. Requiere identificación con certificado digital, DNI electrónico o Cl@ve. Es la vía más rápida y deja registro inmediato.</li>
    <li><strong>Presentación presencial</strong> en la <a href="https://www.mites.gob.es/itss/web/atencion_al_ciudadano/Direcciones_y_telefonos/index.html" target="_blank" rel="noopener">Inspección Provincial de Trabajo</a> que corresponda al centro de trabajo. Lleva dos copias y exige que te sellen una con fecha.</li>
    <li><strong>Por correo postal o burofax</strong> a la Inspección Provincial. El burofax con acuse de recibo deja prueba de la fecha de presentación.</li>
  </ol>

  <p><strong>La denuncia puede ser anónima</strong>, pero no se recomienda en discriminación salarial: necesitas que se te informe del resultado y conservar legitimación en caso de demanda posterior. El <a href="https://www.boe.es/buscar/doc.php?id=DOUE-L-2023-80668" target="_blank" rel="noopener">art. 25 de la Directiva</a> protege explícitamente frente a represalias por presentar la denuncia.</p>

  <h2>Qué pasa después</h2>
  <ul>
    <li>La Inspección puede requerir documentación a la empresa (registro retributivo, auditoría, plan de igualdad) y realizar visitas al centro de trabajo.</li>
    <li>Si constata la infracción, levanta acta de infracción y propone sanción a la autoridad laboral. La <strong>sanción no recupera tus diferencias salariales</strong> — solo castiga a la empresa. Para recuperar lo dejado de cobrar es necesaria la demanda judicial.</li>
    <li>El procedimiento inspector puede tardar varios meses. Mientras, conviene avanzar con sindicato o abogado/a laboralista la preparación de la demanda judicial.</li>
    <li><strong>La demanda judicial</strong> ante el juzgado social se presenta tras intento de conciliación previa en el SMAC (<a href="https://www.mites.gob.es/itss/web/atencion_al_ciudadano/index.html" target="_blank" rel="noopener">Servicio de Mediación, Arbitraje y Conciliación</a>). En la demanda se reclaman las diferencias retributivas + daños y perjuicios (<a href="https://www.boe.es/buscar/doc.php?id=DOUE-L-2023-80668" target="_blank" rel="noopener">art. 16 Directiva</a>: derecho a indemnización íntegra). En este punto contar con asesoramiento jurídico no es opcional.</li>
  </ul>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales</p>
    <ul>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 16 Directiva 2023/970</strong></a> — Los Estados miembros velarán por que cualquier trabajador que haya sufrido un perjuicio […] tenga derecho a reclamar y obtener una indemnización íntegra […], que incluirá la recuperación íntegra de los atrasos salariales y de las primas o pagos en especie correspondientes, la indemnización por la pérdida de oportunidades, los daños morales […].</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 18 Directiva 2023/970</strong></a> — Cuando los trabajadores […] establezcan ante un órgano jurisdiccional u otra autoridad competente hechos a partir de los cuales pueda presumirse que se ha producido una discriminación directa o indirecta, corresponderá a la parte reclamada demostrar que no se ha producido tal discriminación directa o indirecta en relación con la retribución.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 25 Directiva 2023/970</strong></a> — Ni los trabajadores ni los representantes de los trabajadores recibirán un trato menos favorable por haber ejercido sus derechos relativos a la igualdad de retribución […], ni por haber prestado asistencia a otra persona en la defensa de tales derechos.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 28.1 ET</strong></a> — El empresario está obligado a pagar por la prestación de un trabajo de igual valor la misma retribución […], sin que pueda producirse discriminación alguna por razón de sexo en ninguno de los elementos o condiciones de aquella.</li>
      <li><a href="${LEY.lo3_2007}" target="_blank" rel="noopener"><strong>Ley Orgánica 3/2007</strong></a> para la igualdad efectiva de mujeres y hombres — Marco general que da soporte a los planes de igualdad y al principio de igualdad retributiva.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">Texto consolidado de la Directiva (UE) 2023/970 en BOE.es</a> · <a href="${LEY.et}" target="_blank" rel="noopener">Estatuto de los Trabajadores en BOE.es</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Qué consideran los tribunales "indicios sólidos" para invertir la carga de la prueba?</p>
    <p class="faq-a">No basta con la sospecha personal. Sirven, entre otros: datos del registro retributivo o de la respuesta a la solicitud del art. 7 Directiva que muestren diferencia injustificada; ofertas internas o externas de la empresa con banda salarial divergente para misma categoría; comparaciones documentadas con compañeros/as identificados/as; estadísticas internas de la empresa publicadas en su informe de brecha (a partir de 2027 para empresas de 250+); resoluciones previas de Inspección de Trabajo o sentencias en casos similares dentro de la misma empresa.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puedo presentar la denuncia sin haber pedido antes el registro retributivo?</p>
    <p class="faq-a">Sí, pero suele ser más sólida si has pedido la información antes. La <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a> activa la respuesta de la empresa en 2 meses. Si esa respuesta confirma la brecha, tienes prueba directa para la denuncia. Si la empresa se niega o demora indebidamente, la propia falta de respuesta es indicio adicional. Aun así, si la urgencia te aprieta o crees que pedir el registro va a alertar a la empresa antes de tiempo, puedes denunciar directamente con las pruebas que ya tengas.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puede mi empresa despedirme tras presentar la denuncia?</p>
    <p class="faq-a">Cualquier despido o medida desfavorable que se produzca tras la presentación de la denuncia y guarde relación con ella es <strong>nulo de pleno derecho</strong> (art. 25 Directiva 2023/970 y art. 17 ET): la consecuencia jurídica es la readmisión obligatoria con abono de salarios de tramitación. Aun así, conviene leer el <a href="/reclamar-diferencias-salariales-convenio.html#escenario-serpico">escenario Serpico</a> para entender los matices reales más allá del papel — no todas las represalias son tan visibles como un despido directo.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿La Inspección me dirá si la empresa ha sido sancionada?</p>
    <p class="faq-a">Si te identificas como denunciante (no anónimo/a), la Inspección debe informarte del resultado de las actuaciones — aunque no del importe concreto de la sanción, que es información reservada. La fecha de las actuaciones y el sentido de la resolución sí te lo trasladan.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Cuánto tarda el procedimiento ante la Inspección?</p>
    <p class="faq-a">Varía según provincia y carga de trabajo, pero suele ser de varios meses (3 a 12, en muchos casos). Por eso conviene avanzar en paralelo la preparación de la <strong>demanda ante el juzgado social</strong>, que es la vía para recuperar las diferencias salariales y los daños — la denuncia administrativa solo sanciona a la empresa, no recupera tu dinero.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de carta + body redactado de la plantilla #2 ─────────────
const CARTA_INFO_SALARIAL_RRHH = `[CIUDAD], [FECHA]

A la atención de [NOMBRE DEL/DE LA RESPONSABLE DE RECURSOS HUMANOS]
[RAZÓN SOCIAL DE LA EMPRESA]
[DOMICILIO DE LA EMPRESA]

Asunto: Solicitud de acceso al registro retributivo (Real Decreto 902/2020)

Estimado/a [NOMBRE]:

Mediante el presente escrito, yo [TU NOMBRE Y APELLIDOS], con NIF [TU NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA SEGÚN CONTRATO] (grupo profesional [TU GRUPO]), ejerzo mi derecho de acceso al registro retributivo de la empresa conforme al artículo 5 del Real Decreto 902/2020, de 13 de octubre, de igualdad retributiva entre mujeres y hombres.

[OPCIÓN A — SI EXISTE REPRESENTACIÓN LEGAL DE LOS TRABAJADORES EN LA EMPRESA:]
Solicito el acceso al contenido íntegro del registro retributivo, en los términos previstos en el artículo 5.3 del citado Real Decreto, a través de la representación legal de los trabajadores. Con copia de esta solicitud al [COMITÉ DE EMPRESA / DELEGADOS DE PERSONAL / SECCIÓN SINDICAL], a quienes corresponde el acceso íntegro al registro y la información a la plantilla.

[OPCIÓN B — SI NO EXISTE REPRESENTACIÓN LEGAL EN LA EMPRESA:]
Al no existir representación legal de los trabajadores en la empresa, y conforme al artículo 5.3 in fine del Real Decreto 902/2020, solicito que se me facilite la información sobre las diferencias porcentuales que existieran en las retribuciones promediadas de hombres y mujeres, también desagregadas por grupo profesional, categoría profesional o puestos de trabajo iguales o de igual valor.

En particular, solicito que se me facilite por escrito:

1. La información correspondiente a mi grupo profesional ([TU GRUPO]) y a las categorías que realizan trabajos de igual valor al mío.

2. Las diferencias porcentuales de retribución promediadas entre hombres y mujeres, en los términos del citado precepto.

3. [SI APLICA — empresas con plan de igualdad obligatorio (≥ 50 trabajadores)] Confirmación de que la empresa cuenta con plan de igualdad inscrito en el REGCON y, en su caso, copia del mismo o indicación del lugar donde puedo consultarlo.

Le ruego que me remita la información por escrito al correo electrónico [TU EMAIL] o a la dirección postal [TU DIRECCIÓN], en un plazo razonable que en ningún caso debería exceder de un mes desde la fecha de recepción de esta solicitud.

Quedo a su disposición para aportar cualquier aclaración que consideren necesaria. Le agradeceré que me confirme por escrito la recepción de esta solicitud.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

const BODY_INFO_SALARIAL_RRHH = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>Es el cauce <strong>previo al 7 de junio de 2026</strong> para acceder a la información retributiva de tu empresa, antes de que la Directiva (UE) 2023/970 esté transpuesta y operativo el derecho directo del art. 7. Se apoya en el <a href="${LEY.rd902_2020}" target="_blank" rel="noopener">artículo 5 del Real Decreto 902/2020</a>, que obliga a todas las empresas a llevar un registro retributivo y regula el acceso a su contenido. Una vez en vigor la Directiva, el cauce más amplio y directo es la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a>; mientras tanto, esta plantilla es lo que tienes.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p><strong>Antes del 7 de junio de 2026</strong>, cuando necesitas información retributiva agregada de tu empresa para detectar posibles brechas de género o anomalías en tu categoría. Es también útil <strong>como complemento</strong> a la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a> a partir de esa fecha, especialmente si quieres consultar el plan de igualdad o la auditoría retributiva.</p>
  </div>

  <p><strong>Diferencia clave del RD 902/2020 frente a la Directiva 2023/970</strong>: el acceso individual es más limitado. El art. 5.3 del RD distingue dos escenarios:</p>
  <ul>
    <li><strong>Si la empresa tiene representación legal de los trabajadores</strong> (comité de empresa, delegados de personal o sección sindical), <em>esa representación</em> tiene acceso íntegro al registro retributivo. La plantilla individual canaliza la solicitud a través de ella.</li>
    <li><strong>Si la empresa no tiene representación legal</strong>, el trabajador individual sólo puede acceder a las <em>diferencias porcentuales</em> entre la retribución media de hombres y mujeres por categoría — no al desglose completo.</li>
  </ul>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li>Tus datos personales: <strong>nombre y apellidos, NIF, dirección, email</strong>.</li>
    <li>Datos del contrato: <strong>fecha de incorporación, categoría profesional, grupo profesional según convenio</strong>.</li>
    <li>Datos de la empresa: <strong>razón social, CIF, domicilio social</strong>.</li>
    <li>Saber si en tu empresa <strong>existe representación legal de los trabajadores</strong>: comité de empresa, delegados de personal o sección sindical. Determina qué versión de la solicitud (Opción A o B) eliges.</li>
    <li>Si la empresa tiene <strong>50 o más personas trabajadoras</strong>, está obligada a tener <a href="${LEY.rd901_2020}" target="_blank" rel="noopener">plan de igualdad inscrito en el REGCON</a> y a someter el registro retributivo a auditoría retributiva. Saberlo es relevante para incluir o no la solicitud del plan en la carta.</li>
  </ul>

  <h2>Modelo de carta</h2>
  <p>El modelo incluye <strong>dos opciones a elegir</strong> (la A si hay representación legal en la empresa; la B si no la hay). Borra la opción que no aplique antes de enviar. Sustituye los campos en <strong>[CORCHETES]</strong> por tus datos.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="solicitud-info-salarial-rrhh.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_INFO_SALARIAL_RRHH)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <p>Necesitas dejar constancia del envío y de la recepción para poder escalar si la empresa no responde o lo hace de forma incompleta.</p>
  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). La opción más sólida ante un eventual juicio: prueba de qué dijiste y de cuándo lo recibió la empresa. Coste aproximado: 25–40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de RRHH, con confirmación de lectura y solicitud expresa de acuse de recibo. Si has elegido la Opción A, copia también al comité o delegados.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa con dos copias: una sellada para ti.</li>
  </ol>

  <h2>Qué pasa si la empresa no responde o lo hace de forma incompleta</h2>
  <p>El RD 902/2020 no fija un plazo concreto de respuesta para el acceso al registro. Como referencia razonable, suelen darse <strong>15 días laborables</strong> antes de escalar. Si pasado ese plazo no contesta o la información facilitada es claramente incompleta:</p>
  <ul>
    <li><strong>Reiterar por escrito</strong>, citando el incumplimiento del art. 5 RD 902/2020 y advirtiendo de denuncia.</li>
    <li><strong>Acudir a la representación legal</strong> de los trabajadores (si la hay): el incumplimiento del registro retributivo afecta a toda la plantilla, no solo a quien lo solicita.</li>
    <li><strong>Denunciar ante la Inspección de Trabajo</strong> (<a href="https://www.mites.gob.es/itss/web/index.html" target="_blank" rel="noopener">mites.gob.es/itss</a>): el incumplimiento del registro retributivo y de las obligaciones de transparencia retributiva está tipificado como infracción sancionable.</li>
    <li><strong>Si los datos sugieren discriminación retributiva por género</strong>, considera además la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a>, que activa la inversión de la carga de la prueba.</li>
  </ul>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales</p>
    <ul>
      <li><a href="${LEY.rd902_2020}" target="_blank" rel="noopener"><strong>RD 902/2020 · Art. 5.1</strong></a> — Todas las empresas, al margen de su tamaño, deben tener un registro retributivo de toda su plantilla, incluido el personal directivo y los altos cargos, con los valores medios de los salarios, los complementos salariales y las percepciones extrasalariales […], desagregados por sexo y distribuidos por grupos profesionales, categorías profesionales o puestos de trabajo iguales o de igual valor.</li>
      <li><a href="${LEY.rd902_2020}" target="_blank" rel="noopener"><strong>RD 902/2020 · Art. 5.3</strong></a> — Cuando exista representación legal de las personas trabajadoras, el acceso al registro se facilitará a las personas trabajadoras a través de la citada representación, teniendo derecho aquellas a conocer el contenido íntegro del mismo. Cuando no exista representación legal, la información que se facilitará por parte de la empresa […] se limitará a las diferencias porcentuales que existieran en las retribuciones promediadas de hombres y mujeres […].</li>
      <li><a href="${LEY.rd901_2020}" target="_blank" rel="noopener"><strong>RD 901/2020</strong></a> — Regula los planes de igualdad obligatorios para empresas de 50 o más personas trabajadoras, así como su contenido y registro en el REGCON.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.rd902_2020}" target="_blank" rel="noopener">RD 902/2020 en BOE.es</a> · <a href="${LEY.rd901_2020}" target="_blank" rel="noopener">RD 901/2020 en BOE.es</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Tengo derecho a las nóminas individuales de mis compañeros/as?</p>
    <p class="faq-a">No. El registro retributivo trabaja con <strong>valores medios</strong> agregados por sexo, grupo profesional, categoría o puesto, no con datos nominativos. La Ley Orgánica de Protección de Datos impide acceder a la retribución individual concreta de otra persona. Si lo que buscas es contrastar tu salario con el de un compañero/a específico/a, la vía no es el registro retributivo.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Por qué hay dos opciones en el modelo de carta?</p>
    <p class="faq-a">Porque el alcance del derecho de acceso varía según exista o no representación legal en la empresa (comité, delegados, sección sindical). Con representación, accedes al registro íntegro a través de ella. Sin representación, sólo a las diferencias porcentuales. La carta debe reflejar tu situación real para que la empresa no pueda denegar la solicitud apoyándose en el cauce equivocado.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Cuánto tiempo puede tardar la empresa en responder?</p>
    <p class="faq-a">El RD 902/2020 no fija un plazo expreso. Como referencia, 15 días laborables suele considerarse un plazo razonable. A partir del 7 de junio de 2026, la <a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">Directiva (UE) 2023/970 (art. 7.4)</a> fija un plazo máximo de <strong>2 meses</strong> para la información ampliada del derecho individual.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puedo combinar esta plantilla con la Plantilla 1 (banda salarial)?</p>
    <p class="faq-a">Sí. De hecho, a partir del 7 de junio de 2026 la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a> da derecho a información más amplia y directa (nivel retributivo individual + medios desglosados por sexo). Esta Plantilla 2 sigue siendo útil después de esa fecha si quieres pedir explícitamente acceso al <em>registro retributivo formal</em> o al plan de igualdad inscrito en el REGCON — son piezas que existen en paralelo a la información del art. 7 Directiva.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Y si la empresa dice que no tiene registro retributivo?</p>
    <p class="faq-a">Estaría incumpliendo el art. 5.1 RD 902/2020, que obliga a todas las empresas — al margen de su tamaño — a llevarlo. La negativa por escrito sirve como prueba de incumplimiento ante una eventual denuncia a la Inspección de Trabajo o ante un procedimiento por discriminación retributiva (donde la falta del registro juega contra la empresa al activar la inversión de la carga de la prueba).</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de carta + body redactado de la plantilla #10 ────────────
const CARTA_IGUALDAD_NO_DISCRIMINACION = `[CIUDAD], [FECHA]

A la atención de [NOMBRE DEL/DE LA RESPONSABLE DE RECURSOS HUMANOS]
[RAZÓN SOCIAL DE LA EMPRESA]
[DOMICILIO DE LA EMPRESA]

Asunto: Reclamación de igualdad retributiva por trato desigual injustificado (art. 17 del Estatuto de los Trabajadores)

Estimado/a [NOMBRE]:

Mediante el presente escrito, yo [TU NOMBRE Y APELLIDOS], con NIF [TU NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA SEGÚN CONTRATO] (grupo profesional [TU GRUPO]), pongo en su conocimiento los siguientes hechos y formulo la siguiente reclamación:

PRIMERO. Mi retribución actual asciende a [TU RETRIBUCIÓN ANUAL] € brutos anuales (salario base + complementos), conforme a las nóminas que se acompañan.

SEGUNDO. He tenido conocimiento de que [DESCRIPCIÓN VERIFICABLE DEL TRATO DESIGUAL: ej. "el trabajador D. ___, con la misma categoría profesional, antigüedad equivalente, funciones idénticas y desempeño comparable, percibe una retribución superior a la mía sin justificación objetiva"].

Las circunstancias que acreditan que se trata de la misma categoría y trabajo son las siguientes:

- [HECHO 1: ej. funciones efectivas idénticas — describir]
- [HECHO 2: ej. mismo grupo profesional según convenio]
- [HECHO 3: ej. responsabilidades equivalentes / formación equivalente]
[AÑADIR LOS QUE APLIQUEN]

TERCERO. La diferencia retributiva que se me aplica respecto a la persona referida [O AL CONJUNTO DE PERSONAS COMPARABLES] no responde a una causa objetiva, neutra y verificable. [SI APLICA: indicar la causa que sospechas — edad, condición social, ideología, adhesión sindical, lengua, etc.] Esta diferencia constituye una situación de discriminación prohibida por el artículo 17 del Estatuto de los Trabajadores y por el artículo 14 de la Constitución Española.

CUARTO. [SI APLICA — el convenio colectivo establece igualdad por categoría:] El convenio colectivo aplicable, [NOMBRE DEL CONVENIO], establece la igualdad retributiva dentro de cada grupo profesional / categoría, lo que refuerza la nulidad del trato desigual aplicado.

Por todo lo anterior, SOLICITO:

1. La equiparación de mi retribución a la de la persona o personas comparables, con efectos desde [FECHA DESDE LA QUE SE APLICA EL TRATO DESIGUAL].

2. El abono de las diferencias retributivas devengadas desde dicha fecha hasta la fecha de regularización efectiva.

3. La explicación por escrito de los motivos objetivos, neutros y verificables que, en su caso, fundamentaron la diferencia retributiva — para poder valorar si concurren razones que la justifiquen.

A los efectos del artículo 59.1 del Estatuto de los Trabajadores, dejo expresa constancia de la fecha de la presente reclamación, que interrumpe la prescripción de las cantidades reclamadas. Asimismo, conforme al artículo 17 in fine del Estatuto de los Trabajadores, cualquier represalia o trato desfavorable que se produjera tras la presentación de esta reclamación se entenderá nula de pleno derecho.

Quedo a su disposición para aportar la documentación que estime oportuna y le ruego me confirme por escrito la recepción de esta solicitud y me responda en un plazo razonable.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

const BODY_IGUALDAD_NO_DISCRIMINACION = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>Cuando cobras menos que un compañero/a haciendo el mismo trabajo y la causa <strong>no es la razón de sexo</strong>, la vía de la Directiva 2023/970 y del art. 28 ET no aplica directamente — esos preceptos se centran específicamente en la igualdad retributiva entre mujeres y hombres. La vía correcta es el <a href="${LEY.et}" target="_blank" rel="noopener">artículo 17 del Estatuto de los Trabajadores</a> (igualdad de trato y no discriminación), que declara nulas las decisiones empresariales que generen trato desigual por una de las causas protegidas: edad, discapacidad, origen racial o étnico, estado civil, condición social, religión, ideas políticas, orientación e identidad sexual, adhesión o no a sindicatos, vínculos de parentesco con personas relacionadas con la empresa, lengua, y otras. Esta plantilla canaliza la reclamación previa con apoyo en el art. 17 ET y, donde aplique, en el convenio colectivo y en el art. 14 de la Constitución.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p>Cobras menos que un compañero/a o conjunto de personas comparables haciendo el mismo trabajo o un trabajo equivalente, y la causa de la diferencia <strong>guarda relación con alguna de las características protegidas del art. 17 ET</strong> (edad, discapacidad, condición social, ideología, orientación sexual, adhesión sindical, lengua, etc.). Si la causa es la <em>razón de sexo</em>, la vía adecuada es la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a>, que activa además la inversión de la carga de la prueba del art. 18 Directiva 2023/970.</p>
  </div>

  <p><strong>Atención al matiz</strong>: si la diferencia retributiva no obedece a ninguna causa protegida y la empresa simplemente paga más a unas personas que a otras por mérito, antigüedad, evaluación de desempeño u otra razón objetiva, la jurisprudencia es restrictiva: el ET protege contra discriminación por causas tipificadas, no contra cualquier diferencia salarial entre dos personas de la misma categoría. En esos casos, la vía suele ser la negociación colectiva o individual, no la reclamación por discriminación.</p>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li>Tus datos personales: <strong>nombre y apellidos, NIF, dirección</strong>.</li>
    <li>Datos del contrato y nóminas: <strong>fecha de incorporación, categoría profesional, grupo profesional, retribución bruta anual desglosada</strong>.</li>
    <li>Datos de la empresa: <strong>razón social, CIF, domicilio social</strong>.</li>
    <li>Identificación de la persona o personas comparables, su categoría y, en lo posible, indicios verificables de su retribución (ofertas internas, comunicaciones, contratos colectivos firmados, comparativas que la propia empresa haya difundido, etc.).</li>
    <li>Identificación de la <strong>causa protegida</strong> a la que atribuyes la diferencia (edad, discapacidad, ideología…). Si no puedes identificar una causa concreta del catálogo del art. 17, la reclamación es más débil — y la vía de "discriminación" puede no encajar.</li>
    <li>Tu <strong>archivo de evidencias</strong> con fechas y fuentes — ver <a href="/plantilla-documentar-evidencias-desigualdad-salarial.html">Plantilla 7: documentar evidencias de desigualdad</a>.</li>
  </ul>

  <h2>Modelo de carta</h2>
  <p>Sustituye los campos en <strong>[CORCHETES]</strong> por tus datos. La estructura "PRIMERO/SEGUNDO/TERCERO/CUARTO + SOLICITO" es la habitual en una reclamación previa al juzgado social.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="reclamacion-igualdad-art-17-et.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_IGUALDAD_NO_DISCRIMINACION)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). La opción más sólida ante un eventual juicio: prueba de qué dijiste y de cuándo lo recibió la empresa. Coste aproximado: 25–40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de RRHH, con confirmación de lectura y solicitud expresa de acuse de recibo.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa, con dos copias y una sellada para ti.</li>
  </ol>

  <h2>Qué pasa si la empresa no responde o rechaza la reclamación</h2>
  <ul>
    <li><strong>Reiterar por escrito</strong>, recordando el plazo transcurrido y el incumplimiento del art. 17 ET. Sirve para reforzar la prueba de mala fe.</li>
    <li><strong>Acudir a la representación legal de los trabajadores</strong> o al sindicato. La discriminación por causas tipificadas suele afectar a más personas y la presión colectiva es más eficaz.</li>
    <li><strong>Denunciar ante la Inspección de Trabajo</strong> (<a href="https://www.mites.gob.es/itss/web/index.html" target="_blank" rel="noopener">mites.gob.es/itss</a>): la discriminación en materia retributiva está tipificada como infracción muy grave por la Ley sobre Infracciones y Sanciones en el Orden Social (LISOS).</li>
    <li><strong>Conciliación previa en el SMAC</strong> y, si no hay acuerdo, demanda ante el juzgado de lo social. El plazo de prescripción para reclamar cantidades es de un año desde que cada cantidad debió abonarse (art. 59.1 ET).</li>
  </ul>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales</p>
    <ul>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 17.1 ET</strong></a> — Se entenderán nulos y sin efecto los preceptos reglamentarios, las cláusulas de los convenios colectivos, los pactos individuales y las decisiones unilaterales del empresario que den lugar en el empleo, así como en materia de retribuciones, jornada y demás condiciones de trabajo, a situaciones de discriminación directa o indirecta desfavorables por razón de edad o discapacidad o a situaciones de discriminación directa o indirecta por razón de sexo, origen […], estado civil, condición social, religión o convicciones, ideas políticas, orientación e identidad sexual […], adhesión o no a sindicatos y a sus acuerdos, vínculos de parentesco con personas pertenecientes a o relacionadas con la empresa y lengua dentro del Estado español.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 17 in fine ET</strong></a> — Serán igualmente nulas las órdenes de discriminar y las decisiones del empresario que supongan un trato desfavorable de los trabajadores como reacción ante una reclamación efectuada en la empresa o ante una acción administrativa o judicial destinada a exigir el cumplimiento del principio de igualdad de trato y no discriminación.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 59.1 ET</strong></a> — Las acciones derivadas del contrato de trabajo que no tengan señalado plazo especial prescribirán al año de su terminación. […] En general, el plazo de prescripción será de un año.</li>
      <li><a href="${LEY.constitucion}" target="_blank" rel="noopener"><strong>Constitución Española · Art. 14</strong></a> — Los españoles son iguales ante la ley, sin que pueda prevalecer discriminación alguna por razón de nacimiento, raza, sexo, religión, opinión o cualquier otra condición o circunstancia personal o social.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.et}" target="_blank" rel="noopener">Estatuto de los Trabajadores en BOE.es</a> · <a href="${LEY.constitucion}" target="_blank" rel="noopener">Constitución Española en BOE.es</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Por qué no uso el art. 28 ET si trata de igualdad retributiva?</p>
    <p class="faq-a">El art. 28 ET es <strong>específicamente</strong> sobre discriminación retributiva por razón de sexo: su literalidad no admite extender su protección a otras causas. La vía general para diferencias retributivas por causas distintas al sexo es el art. 17 ET, que declara nulos los actos del empresario que generen discriminación por las causas tipificadas (edad, discapacidad, condición social, ideología, etc.). Si la causa de la diferencia es el sexo, la plantilla adecuada es la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a>.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Y si simplemente cobro menos que un compañero/a sin causa "tipificada"?</p>
    <p class="faq-a">Si la diferencia no obedece a ninguna de las causas protegidas del art. 17 ET, la reclamación por "discriminación" pierde fuerza. La empresa puede tener razones objetivas (mérito, evaluación, antigüedad, negociación individual) y los tribunales suelen admitirlas. En ese caso, la vía no es esta plantilla — es la negociación colectiva o individual, o la revisión salarial cuando se produzca. Esta plantilla está pensada para cuando hay una causa protegida identificable.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Necesito identificar a la persona o personas comparables con nombre y apellidos?</p>
    <p class="faq-a">No es imprescindible que la empresa conozca a quién comparas en la fase de reclamación previa, pero sí necesitas que tu argumento sea verificable. Suelen aceptarse referencias como "el trabajador con categoría X que se incorporó en fecha Y" si la información es pública internamente o consta en convenios o comunicaciones. En sede judicial, la prueba sí debe identificar a la persona comparable — habitualmente vía testifical o documental.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Tengo la inversión de la carga de la prueba como en discriminación por sexo?</p>
    <p class="faq-a">No de forma automática. La inversión específica del <a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">art. 18 de la Directiva 2023/970</a> aplica a discriminación por razón de sexo. Para otras causas protegidas, la jurisprudencia constitucional reconoce un mecanismo análogo (sentencia del TC 38/1981 y sucesivas) basado en el art. 14 CE: si aportas indicios sólidos de discriminación, la empresa debe acreditar la justificación objetiva, neutra y razonable de la diferencia. Es un terreno donde conviene contar con asesoramiento jurídico antes de demandar.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Qué pasa si me despiden tras reclamar?</p>
    <p class="faq-a">El art. 17 in fine ET declara <strong>nulas</strong> las decisiones del empresario que supongan un trato desfavorable como reacción ante una reclamación. Cualquier despido o medida desfavorable posterior a esta reclamación, si guarda relación con ella, puede declararse nulo en juicio — con consecuencia de readmisión obligatoria y abono de salarios de tramitación. Aun así, conviene leer el <a href="/reclamar-diferencias-salariales-convenio.html#escenario-serpico">escenario Serpico</a> para entender los matices reales más allá del papel.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de carta + body redactado de la plantilla #9 ─────────────
const CARTA_TRABAJO_IGUAL_VALOR = `[CIUDAD], [FECHA]

A la atención de [NOMBRE DEL/DE LA RESPONSABLE DE RECURSOS HUMANOS]
[RAZÓN SOCIAL DE LA EMPRESA]
[DOMICILIO DE LA EMPRESA]

Asunto: Reclamación de igualdad retributiva por trabajo de igual valor (art. 28 ET y art. 4 Directiva (UE) 2023/970)

Estimado/a [NOMBRE]:

Mediante el presente escrito, yo [TU NOMBRE Y APELLIDOS], con NIF [TU NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [TU CATEGORÍA] (grupo profesional [TU GRUPO]), pongo en su conocimiento los siguientes hechos y formulo la siguiente reclamación:

PRIMERO. Mi puesto, denominado [TU PUESTO O CATEGORÍA], es desempeñado mayoritariamente por [INDICAR: mujeres / hombres / personas con característica X]. Mi retribución actual asciende a [TU RETRIBUCIÓN ANUAL] € brutos anuales (salario base + complementos), conforme a las nóminas que se acompañan.

SEGUNDO. En la empresa existe otro puesto, denominado [PUESTO COMPARABLE], desempeñado mayoritariamente por personas del sexo opuesto, cuya retribución es superior a la mía: [RETRIBUCIÓN COMPARABLE ESTIMADA] € brutos anuales aproximadamente, según [FUENTE VERIFICABLE: oferta interna, comunicación, datos del registro retributivo, etc.].

TERCERO. Aunque las funciones de ambos puestos son distintas, son de IGUAL VALOR conforme al artículo 28.1 del Estatuto de los Trabajadores y al artículo 4 de la Directiva (UE) 2023/970, por las siguientes razones, evaluadas desde los cuatro factores reconocidos por la normativa (formación, esfuerzo, responsabilidad y condiciones de trabajo):

A. FORMACIÓN Y CUALIFICACIÓN EXIGIDA. [DESCRIBIR TU FORMACIÓN/EXPERIENCIA EXIGIDA Y LA DEL PUESTO COMPARABLE; INDICAR EQUIVALENCIA. Ej.: "Mi puesto exige formación profesional grado medio + 2 años de experiencia. El puesto comparable exige idéntica formación y experiencia equivalente."]

B. ESFUERZO. [DESCRIBIR ESFUERZO FÍSICO, MENTAL Y EMOCIONAL EN AMBOS PUESTOS. Ej.: "Mi puesto requiere atención sostenida durante toda la jornada y manejo de situaciones con clientes; el comparable requiere esfuerzo físico continuado en almacén. Ambos esfuerzos son equivalentes en intensidad y exigencia."]

C. RESPONSABILIDAD. [DESCRIBIR RESPONSABILIDAD ECONÓMICA, SOBRE PERSONAS, MATERIALES O DECISIONES. Ej.: "Mi puesto asume responsabilidad sobre la caja diaria y la atención al cliente; el comparable asume responsabilidad sobre el inventario y la disposición de productos. Ambas responsabilidades son comparables."]

D. CONDICIONES DE TRABAJO. [DESCRIBIR HORARIO, ENTORNO, ESTACIONALIDAD, ETC. Ej.: "Ambos puestos comparten horario, entorno y exigencias temporales."]

CUARTO. La diferencia retributiva entre dos puestos de igual valor desempeñados mayoritariamente por personas de distinto sexo constituye, conforme al artículo 28 del Estatuto de los Trabajadores y a los artículos 4 y 18 de la Directiva (UE) 2023/970, un indicio de discriminación retributiva indirecta por razón de sexo, salvo que la empresa acredite una justificación objetiva, neutra y verificable.

Por todo lo anterior, SOLICITO:

1. La equiparación retributiva entre mi puesto y el puesto comparable identificado, en aplicación del principio de igual retribución por trabajo de igual valor (art. 28.1 ET).

2. El abono de las diferencias retributivas devengadas desde [FECHA] hasta la fecha de regularización efectiva.

3. La explicación por escrito de los motivos objetivos, neutros y verificables que, en su caso, fundamenten la diferencia retributiva — para poder valorar si concurren razones que la justifiquen, en los términos del art. 4.4 de la Directiva (UE) 2023/970.

4. [SI APLICA — empresa con plan de igualdad obligatorio (≥ 50 trabajadores)] Acceso al sistema de valoración de puestos de trabajo previsto en el art. 4 del RD 902/2020, así como al registro retributivo y, en su caso, a la auditoría retributiva.

A los efectos del artículo 59.1 del Estatuto de los Trabajadores, dejo expresa constancia de la fecha de la presente reclamación, que interrumpe la prescripción de las cantidades reclamadas. Asimismo, conforme al artículo 25 de la Directiva (UE) 2023/970, cualquier represalia o trato desfavorable que se produjera tras la presentación de esta reclamación se entenderá nula de pleno derecho.

Quedo a su disposición para aportar la documentación que estime oportuna y le ruego me confirme por escrito la recepción de esta solicitud y me responda en un plazo razonable.

Atentamente,



[FIRMA]

[TU NOMBRE Y APELLIDOS]
[TU NIF]
`;

const BODY_TRABAJO_IGUAL_VALOR = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>El principio de igualdad retributiva no se limita al "mismo trabajo": cubre también el <strong>trabajo de igual valor</strong>, aunque las funciones sean distintas. Es la pieza clave para detectar y reclamar discriminaciones donde puestos ocupados mayoritariamente por mujeres están infravalorados respecto a otros equivalentes ocupados por hombres — el caso clásico de <em>cajera vs reponedor</em>, <em>limpiadora vs mantenimiento</em>, <em>cuidadora vs vigilante</em>. Esta plantilla convierte ese principio en una reclamación formal con la estructura argumental que utilizan los tribunales: comparación de puestos a partir de los cuatro factores reconocidos por el art. 4 de la Directiva (UE) 2023/970 — formación, esfuerzo, responsabilidad y condiciones de trabajo.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p>Tu puesto y el de la persona o personas comparables tienen <strong>funciones distintas</strong> pero <strong>responsabilidades, formación, esfuerzo y condiciones equivalentes</strong>. Tu puesto está desempeñado mayoritariamente por personas de un sexo y el comparable mayoritariamente por personas del sexo opuesto. La retribución es desigual y no hay justificación objetiva. Si los puestos hicieran exactamente <em>el mismo trabajo</em>, la vía sería la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a>; aquí estamos en el escenario más sutil pero más frecuente: trabajos distintos de igual valor.</p>
  </div>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li>Tus datos personales y de contrato: <strong>nombre y apellidos, NIF, fecha de incorporación, categoría, retribución bruta anual desglosada</strong>.</li>
    <li>Identificación del <strong>puesto comparable</strong>: denominación, perfil de las personas que lo ocupan, retribución estimada con fuente verificable (oferta interna, comunicación, registro retributivo, etc.).</li>
    <li>Análisis ordenado de los <strong>cuatro factores</strong> de comparación entre tu puesto y el comparable:
      <ul>
        <li><strong>Formación y cualificación</strong>: titulación o experiencia exigida en cada puesto.</li>
        <li><strong>Esfuerzo</strong>: físico, mental y emocional. Aunque sean distintos, ¿son comparables en intensidad?</li>
        <li><strong>Responsabilidad</strong>: económica, sobre personas, sobre materiales, sobre decisiones.</li>
        <li><strong>Condiciones de trabajo</strong>: horario, entorno, estacionalidad, exigencias temporales.</li>
      </ul>
    </li>
    <li>Si la empresa tiene <strong>50 o más personas trabajadoras</strong>, el sistema de valoración de puestos del <a href="${LEY.rd902_2020}" target="_blank" rel="noopener">art. 4 del RD 902/2020</a> debe usarse para la auditoría retributiva. Pídelo si aplica.</li>
    <li>Tu <strong>archivo de evidencias</strong> con fechas y fuentes — ver <a href="/plantilla-documentar-evidencias-desigualdad-salarial.html">Plantilla 7: documentar evidencias de desigualdad</a>.</li>
  </ul>

  <h2>Modelo de carta</h2>
  <p>El modelo despliega los cuatro factores (A, B, C, D) que los tribunales y la Directiva utilizan para valorar si dos puestos son de igual valor. Sustituye los campos en <strong>[CORCHETES]</strong> por tu análisis concreto. Cuanto más específico y comprobable, más sólida será la reclamación.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="reclamacion-trabajo-igual-valor.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_TRABAJO_IGUAL_VALOR)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). La opción más sólida ante un eventual juicio: prueba de qué dijiste y de cuándo lo recibió la empresa. Coste aproximado: 25–40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de RRHH, con confirmación de lectura y solicitud expresa de acuse de recibo.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa, con dos copias y una sellada para ti.</li>
  </ol>

  <h2>Qué pasa si la empresa no responde o rechaza la reclamación</h2>
  <ul>
    <li><strong>Reiterar por escrito</strong>, recordando el plazo y el incumplimiento del principio de igualdad retributiva del art. 28 ET. Sirve para reforzar la prueba.</li>
    <li><strong>Acudir a la representación legal de los trabajadores o al sindicato</strong>: las reclamaciones por trabajo de igual valor suelen afectar a colectivos enteros (todas las personas en el puesto infravalorado), y la presión colectiva es más eficaz que la individual.</li>
    <li><strong>Denunciar ante la Inspección de Trabajo</strong> (<a href="https://www.mites.gob.es/itss/web/index.html" target="_blank" rel="noopener">mites.gob.es/itss</a>): la falta de un sistema de valoración objetivo y la diferencia retributiva injustificada entre puestos de igual valor están tipificadas como infracción. → También aplica la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a> si quieres formalizar la denuncia administrativa.</li>
    <li><strong>Conciliación previa en el SMAC</strong> y, si no hay acuerdo, demanda ante el juzgado de lo social. La <strong>carga de la prueba se invierte</strong> (<a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">art. 18 Directiva 2023/970</a>): si aportas indicios sólidos del trato desigual entre puestos de igual valor, la empresa debe justificar la diferencia con criterios objetivos y neutros.</li>
  </ul>

  <h2>Marco legal aplicable</h2>
  <div class="legal-box">
    <p class="legal-title">Citas literales</p>
    <ul>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 4.1 Directiva 2023/970</strong></a> — Los Estados miembros adoptarán las medidas necesarias para garantizar que los empleadores dispongan de estructuras retributivas que aseguren la igualdad de retribución entre trabajadores y trabajadoras por el mismo trabajo o por un trabajo de igual valor.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 4.4 Directiva 2023/970</strong></a> — El valor del trabajo se evaluará y comparará sobre la base de criterios objetivos y neutros desde el punto de vista del género acordados con los representantes de los trabajadores […], que incluirán las capacidades, el esfuerzo, la responsabilidad y las condiciones de trabajo y, si procede, cualesquiera otros factores que sean pertinentes para el empleo o el puesto específico de que se trate.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 18 Directiva 2023/970</strong></a> — Cuando los trabajadores […] establezcan ante un órgano jurisdiccional u otra autoridad competente hechos a partir de los cuales pueda presumirse que se ha producido una discriminación directa o indirecta, corresponderá a la parte reclamada demostrar que no se ha producido tal discriminación directa o indirecta en relación con la retribución.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 28.1 ET</strong></a> — El empresario está obligado a pagar por la prestación de un trabajo de igual valor la misma retribución, satisfecha directa o indirectamente, y cualquiera que sea la naturaleza de la misma, salarial o extrasalarial, sin que pueda producirse discriminación alguna por razón de sexo en ninguno de los elementos o condiciones de aquella. Un trabajo tendrá igual valor que otro cuando la naturaleza de las funciones o tareas efectivamente encomendadas, las condiciones educativas, profesionales o de formación exigidas para su ejercicio, los factores estrictamente relacionados con su desempeño y las condiciones laborales en las que dichas actividades se llevan a cabo en realidad sean equivalentes.</li>
      <li><a href="${LEY.rd902_2020}" target="_blank" rel="noopener"><strong>RD 902/2020 · Art. 4</strong></a> — Sistema de valoración de los puestos de trabajo. Define los criterios de adecuación, totalidad y objetividad en la valoración para garantizar la igualdad retributiva.</li>
    </ul>
    <p class="legal-source"><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">Directiva (UE) 2023/970 en BOE.es</a> · <a href="${LEY.et}" target="_blank" rel="noopener">Estatuto de los Trabajadores en BOE.es</a> · <a href="${LEY.rd902_2020}" target="_blank" rel="noopener">RD 902/2020 en BOE.es</a></p>
  </div>

  <h2>Preguntas frecuentes sobre esta plantilla</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Cómo sé si dos puestos distintos son "de igual valor"?</p>
    <p class="faq-a">El art. 4.4 de la Directiva 2023/970 y el art. 28.1 ET marcan los <strong>cuatro factores</strong> de comparación: <strong>formación / cualificación</strong> exigida, <strong>esfuerzo</strong> (físico, mental, emocional), <strong>responsabilidad</strong> (económica, sobre personas, sobre decisiones) y <strong>condiciones de trabajo</strong> (horario, entorno, exigencias temporales). Si los cuatro factores son equivalentes — aunque las funciones sean distintas — los puestos son "de igual valor" y deben retribuirse igual. La normativa española añade en el RD 902/2020 los criterios de "adecuación, totalidad y objetividad" para que la valoración no sea arbitraria.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Necesito una valoración formal de puestos para reclamar?</p>
    <p class="faq-a">Si la empresa tiene 50 o más personas trabajadoras y plan de igualdad obligatorio, debería tener un <strong>sistema de valoración de puestos</strong> (RD 902/2020, art. 4). Si no lo tiene, está incumpliendo — y la falta del sistema juega contra la empresa al activar la inversión de la carga de la prueba. Si lo tiene, pídelo y úsalo en tu argumentación. Si no lo tiene o si trabajas en empresa más pequeña, basta con que tu análisis comparativo de los cuatro factores sea razonable y verificable: los tribunales aceptan esa argumentación cuando está bien construida.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Vale como comparador un solo compañero/a o tengo que comparar puestos colectivos?</p>
    <p class="faq-a">Vale el comparador individual si las circunstancias son objetivamente equivalentes. Pero la jurisprudencia del Tribunal de Justicia de la UE (sentencia <em>Tesco Stores</em>, C-624/19, entre otras) admite también la comparación entre <strong>colectivos de puestos</strong> cuando hay un denominador común de empleador y la valoración es coherente. Lo más sólido suele ser comparar grupos: "los puestos de cajera (mayoritariamente mujeres)" frente a "los puestos de reponedor (mayoritariamente hombres)" en la misma empresa.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Qué pasa si la empresa alega que las funciones no son comparables?</p>
    <p class="faq-a">La defensa típica es decir que los trabajos son distintos. Pero la Directiva y el ET establecen literalmente que el "igual valor" es independiente de que las funciones sean idénticas — lo que importa son los cuatro factores objetivos. Si la empresa quiere mantener la diferencia retributiva, le corresponde acreditar que los factores no son equivalentes (carga de la prueba invertida, art. 18 Directiva). Tu argumentación debe centrarse en demostrar la equivalencia de los cuatro factores, no en negar que las funciones sean distintas.</p>
  </div>
  <div class="faq-mini">
    <p class="faq-q">¿Puedo combinar esta plantilla con otras?</p>
    <p class="faq-a">Sí. Lo habitual es: pedir antes la información retributiva con la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a> para tener cifras objetivas; documentar evidencias con la Plantilla 7; y, si la empresa rechaza la reclamación o no responde, presentar la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a> ante la Inspección de Trabajo. Los tres escritos forman un itinerario coherente.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Tabla maestra de evidencias (plantilla #7) ───────────────────────
const TABLA_EVIDENCIAS_TSV = `Fecha\tTipo de evidencia\tDescripción\tFuente\tPrueba adjunta\tQuién más lo sabe\tRelevancia para la reclamación
[YYYY-MM-DD]\t[Comunicación / Documento / Comparación / Promoción / Oferta / Anuncio / Dato público]\t[Qué pasó o qué dice — frase corta]\t[De dónde sale: email, intranet, manual, BOE…]\t[Sí / No · nombre fichero]\t[Nombre o "ninguno"]\t[Por qué importa: igual valor, falta de criterios, comparador directo…]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
[YYYY-MM-DD]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]\t[ ]
`;

// ── Body redactado de la plantilla #7 ────────────────────────────────
const BODY_DOCUMENTAR_EVIDENCIAS = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>El <strong>artículo 18 de la Directiva (UE) 2023/970</strong> invierte la carga de la prueba en los casos de discriminación retributiva: cuando la persona trabajadora aporta <em>indicios suficientes</em> de que se ha producido un trato desigual, le corresponde a la empresa demostrar que la diferencia obedece a razones objetivas, neutras y verificables. Ese mecanismo es la diferencia entre una sospecha que se archiva y una reclamación que se gana — pero sólo se activa si existen indicios sólidos y bien documentados.</p>
  <p>Esta plantilla no es una carta. Es la herramienta para construir esos indicios <em>antes</em> de mover ficha: una taxonomía de qué cuenta como evidencia, una tabla maestra para llevar el registro y una guía de qué se puede y qué no se puede hacer al recabarlas. Cuando la tengas rellena, tendrás la base para usar la <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2</a> (registro retributivo), la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1</a> (banda salarial), la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5</a> (denuncia ITSS) o la <a href="/plantilla-reclamar-trabajo-igual-valor.html">Plantilla 9</a> (trabajo de igual valor) con expectativas razonables.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p><strong>En cuanto sospechas que algo no encaja.</strong> Documentar evidencias es una actividad continuada, no algo que se hace en una tarde. Cuanto antes empieces, más sólido y con menos sesgo será el conjunto. La regla práctica: si la duda lleva más de dos semanas en tu cabeza, abre la tabla y vuelca lo que ya recuerdas con fechas aproximadas — y a partir de ahí registra cada cosa nueva el mismo día.</p>
  </div>

  <h2>Antes de empezar a documentar, ten claro…</h2>
  <ul>
    <li><strong>Quién es tu comparador o tus comparadores</strong>: nombre concreto y puesto. Si trabajas en un equipo donde hay varias personas haciendo lo mismo, lista a varias.</li>
    <li><strong>Qué periodo abarca</strong>: desde cuándo crees que existe la diferencia. Lo habitual es revisar los 12 meses anteriores (la prescripción salarial del art. 59.1 ET es de un año).</li>
    <li><strong>Si en tu empresa hay representación legal de las personas trabajadoras</strong> (delegados, comité, sección sindical). Si la hay, la <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2</a> abre la vía más amplia para acceder al registro retributivo.</li>
    <li><strong>Si la empresa tiene 50 o más personas trabajadoras</strong>: en ese caso está obligada a tener plan de igualdad, registro retributivo y, en algunos casos, auditoría retributiva (RD 902/2020). La ausencia de cualquiera de estos juega a tu favor.</li>
    <li><strong>El nombre del convenio colectivo</strong> que te aplica y, si lo conoces, el grupo profesional o nivel asignado a tu puesto.</li>
  </ul>

  <h2>Qué cuenta como "indicio sólido" — taxonomía de evidencias</h2>
  <p>No todo vale. Los tribunales y la Inspección reconocen, esencialmente, siete tipos de evidencia. Tu objetivo es reunir, idealmente, al menos un elemento de tres categorías distintas — eso es lo que normalmente activa la inversión de la carga de la prueba (art. 18 Directiva).</p>

  <div class="evidence-types">
    <ol>
      <li><strong>Comunicaciones internas.</strong> Correos, mensajes en Slack/Teams, conversaciones en grupos corporativos de WhatsApp. Sólo aquellas en las que <em>tú participas</em> o que se han enviado a una distribución de la que <em>tú formas parte</em>. Captura de pantalla con fecha/hora y dirección visibles, y exporta el correo original a .eml o PDF si puedes.</li>
      <li><strong>Documentos retributivos en tu poder.</strong> Tus propias nóminas, tu contrato y sus anexos, ofertas internas o convocatorias publicadas en intranet con banda salarial para tu puesto exacto. Anuncios para tu mismo puesto que la empresa está publicando externamente con horquilla salarial visible.</li>
      <li><strong>Comparaciones de funciones.</strong> Descripciones de puesto oficiales, organigramas internos, manuales de procesos, fichas de competencias del plan de igualdad. Sirven para argumentar trabajo de igual valor (art. 4 Directiva 2023/970, art. 28.1 ET) cuando las funciones del comparador no son idénticas a las tuyas pero sí equivalentes en formación, esfuerzo, responsabilidad y condiciones.</li>
      <li><strong>Procesos de promoción y revisión salarial.</strong> Actas de comités de retribución comunicadas, evaluaciones de desempeño, comunicaciones colectivas de RRHH explicando criterios de subida (o ausencia de criterios escritos). Si la empresa nunca ha comunicado criterios claros, eso ya es un indicio: el art. 4 RD 902/2020 obliga a tener un sistema de valoración basado en "adecuación, totalidad y objetividad".</li>
      <li><strong>Ofertas externas para puesto equivalente.</strong> LinkedIn, InfoJobs, Glassdoor, ofertas que la propia empresa ha publicado para reemplazar a un compañero/a o para crecer en el mismo puesto que tú ocupas. Útiles tanto para situar el rango de mercado como para identificar qué banda interna maneja la empresa.</li>
      <li><strong>Anuncios y comunicados internos.</strong> Tablones físicos, intranet, comunicaciones de RRHH a toda la plantilla. Especialmente valiosos si describen políticas retributivas, criterios de subida, o si hay incoherencia entre lo anunciado y lo aplicado a tu caso.</li>
      <li><strong>Datos públicos verificables.</strong> Tu convenio colectivo en el BOE/BOP (con tablas salariales por grupo y nivel), tu plan de igualdad si está registrado en el <a href="https://expinterweb.mites.gob.es/regcon/" target="_blank" rel="noopener">REGCON</a>, las cuentas anuales depositadas en el Registro Mercantil (información pública sobre masa salarial), y el registro retributivo cuando la empresa esté obligada a darlo.</li>
    </ol>
  </div>

  <h2>Tabla maestra de evidencias</h2>
  <p>Una sola tabla viva, no notas dispersas. Cópiala a Excel, Google Sheets, Numbers o cualquier hoja de cálculo y rellénala según vayas observando. El formato del bloque inferior es <strong>tabulado (TSV)</strong>: al pegarlo en una hoja de cálculo, las columnas se separan automáticamente.</p>

  <div class="evidence-table-wrap">
    <table class="evidence-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo</th>
          <th>Descripción</th>
          <th>Fuente</th>
          <th>Prueba adjunta</th>
          <th>Quién más lo sabe</th>
          <th>Relevancia</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="ev-date">2026-04-15</td>
          <td>Comunicación interna</td>
          <td>RRHH explica que las subidas se basan en una "valoración global" sin desglosar criterios</td>
          <td>Email de RRHH del 15-abr al departamento</td>
          <td>Sí · email-2026-04-15.eml</td>
          <td>Toda la plantilla del departamento</td>
          <td>Falta de criterios objetivos (incumple art. 4 RD 902/2020)</td>
        </tr>
        <tr>
          <td class="ev-date">2026-04-22</td>
          <td>Documento retributivo</td>
          <td>Oferta interna publicada en intranet con banda 32-38 k€ para mi mismo puesto</td>
          <td>Intranet › Empleo › Vacantes 22-abr</td>
          <td>Sí · captura-vacante-22abr.png</td>
          <td>—</td>
          <td>Banda concreta para el puesto que ya ocupo (comparador interno)</td>
        </tr>
        <tr>
          <td class="ev-date">2026-05-03</td>
          <td>Comparación de funciones</td>
          <td>Manual de procesos describe el rol "Especialista nivel 2" con responsabilidades equivalentes a las mías pero en grupo profesional superior</td>
          <td>Manual de procesos v3, p. 18</td>
          <td>Sí · manual-p18-marca.pdf</td>
          <td>—</td>
          <td>Argumenta trabajo de igual valor (art. 4 Directiva, art. 28.1 ET)</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>Plantilla en blanco para copiar a tu hoja de cálculo (cabecera + 10 filas vacías):</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar para Excel/Sheets</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="tabla-evidencias-desigualdad.tsv">Descargar como .tsv</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(TABLA_EVIDENCIAS_TSV)}</div>
  </div>

  <h2>Checklist por tipo de evidencia</h2>
  <p>Para cada categoría, lo mínimo que conviene tener guardado:</p>
  <ul>
    <li><strong>Comunicaciones internas</strong>: captura visible con fecha, hora, remitente y destinatarios; archivo .eml exportado; copia del correo original en una carpeta personal (de tu equipo, no del trabajo).</li>
    <li><strong>Documentos retributivos</strong>: tus 12 últimas nóminas en PDF, tu contrato y todas las modificaciones; capturas de cualquier oferta interna o externa para tu puesto, con URL y fecha.</li>
    <li><strong>Comparaciones de funciones</strong>: descripciones de puesto oficiales del tuyo y del comparador; organigrama vigente; fichas de valoración del plan de igualdad si existe.</li>
    <li><strong>Procesos de promoción/revisión</strong>: comunicados de subida salarial recibidos por toda la plantilla; tus evaluaciones de desempeño firmadas; cualquier documento que cite criterios objetivos.</li>
    <li><strong>Ofertas externas</strong>: capturas con fecha y URL; idealmente, la oferta tal y como aparece en LinkedIn/InfoJobs descargada como PDF para preservar la versión original.</li>
    <li><strong>Anuncios y comunicados internos</strong>: capturas de tablones (con la cabecera de la pared visible si es físico), capturas de intranet con la URL en la barra del navegador.</li>
    <li><strong>Datos públicos</strong>: enlace permanente al convenio en el <a href="https://www.boe.es/" target="_blank" rel="noopener">BOE</a> o BOP; código y URL del plan de igualdad en el <a href="https://expinterweb.mites.gob.es/regcon/" target="_blank" rel="noopener">REGCON</a>; última cuenta anual depositada en el Registro Mercantil si aplica.</li>
  </ul>

  <h2>Cómo documentar SIN levantar ruido (límites legales)</h2>

  <div class="warning-box">
    <h3>⚠ Hay líneas rojas que conviene no cruzar</h3>
    <p>El derecho a documentar tiene límites. Cruzarlos puede convertir un caso ganable en un despido procedente o, en el peor escenario, en un delito. Los tribunales han fijado tres reglas claras:</p>
    <ul>
      <li><strong>No reenvíes documentos confidenciales a tu correo personal.</strong> El Tribunal Supremo ha declarado procedente el despido de personas que reenvían información confidencial de la empresa — incluso aunque sea para defenderse en un litigio: la doctrina exige acudir al juzgado por la vía del art. 20 Directiva 2023/970, donde el juez puede ordenar a la empresa que entregue las pruebas, en lugar de tomarlas por cuenta propia.</li>
      <li><strong>No accedas a documentos a los que no llegas por tu rol.</strong> Entrar en carpetas, expedientes o sistemas a los que tu permiso no alcanza — aunque la contraseña sea fácil o esté apuntada — puede ser delito de descubrimiento y revelación de secretos (art. 197 del Código Penal) o transgresión de la buena fe contractual.</li>
      <li><strong>No grabes conversaciones en las que no participas.</strong> Grabar a terceros sin estar tú en la conversación es ilícito. Las conversaciones en las que <em>sí</em> participas se pueden grabar legalmente en España, pero conviene revisar el reglamento interno y la política de protección de datos antes de aportarlas a un proceso.</li>
    </ul>
  </div>

  <p>Lo que <strong>sí</strong> puedes y debes hacer:</p>
  <ul>
    <li><strong>Captura de pantalla &gt; reenvío.</strong> La captura preserva fecha/hora del sistema, ventana y dirección — y no genera tráfico saliente trazable. Guárdalas con nombre descriptivo (por ejemplo <code>2026-04-15-email-rrhh-criterios.png</code>).</li>
    <li><strong>Pide la información formalmente.</strong> Manda la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1</a> (banda salarial post-7-jun) o la <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2</a> (registro retributivo RD 902/2020). La respuesta — o la falta de respuesta en plazo — es prueba en sí misma.</li>
    <li><strong>Conserva tus propias nóminas, tu contrato y tus comunicaciones.</strong> Los documentos que ya están en tu poder por la relación laboral son tuyos a todos los efectos.</li>
    <li><strong>Apóyate en datos públicos:</strong> convenio (BOE/BOP), plan de igualdad (REGCON), cuentas anuales (Registro Mercantil), ofertas externas. Son inatacables como fuente.</li>
    <li><strong>Habla con tu sindicato o con la representación legal.</strong> Tienen acceso al registro retributivo íntegro (art. 5.1 RD 902/2020) y experiencia en construir el relato de los hechos.</li>
  </ul>

  <h2>Cuándo tienes evidencias suficientes para reclamar</h2>
  <p>No hay un umbral matemático, pero el patrón aceptado por la Inspección de Trabajo y los juzgados de lo social es que existan, al menos, <strong>tres elementos consistentes</strong>:</p>
  <ol>
    <li><strong>Un comparador identificado</strong> — alguien con tu mismo trabajo o con un trabajo de igual valor, cuya retribución superior puedes situar al menos por banda.</li>
    <li><strong>Una diferencia retributiva apoyada en algún dato</strong> — tu nómina + uno de: oferta interna, banda externa publicada, registro retributivo recibido, comunicación que la mencione.</li>
    <li><strong>Un elemento que descarte explicaciones objetivas</strong> — mismo nivel formativo, antigüedad similar o superior, evaluaciones equivalentes, ausencia de criterios escritos para fijar la diferencia.</li>
  </ol>
  <p>Cuando reúnes esos tres, dispones de los <em>indicios suficientes</em> que activan la inversión de la carga de la prueba (art. 18 Directiva 2023/970). A partir de ahí no eres tú quien debe demostrar la discriminación: es la empresa quien debe demostrar que la diferencia obedece a una razón objetiva y verificable.</p>

  <h2>Marco legal aplicable</h2>

  <div class="legal-box">
    <p class="legal-title">Citas literales y enlaces verificables</p>
    <ul>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 18.1 Directiva 2023/970</strong></a> — Cuando los trabajadores que se consideren perjudicados por el incumplimiento del principio de igualdad de retribución demuestren ante un juzgado u otra autoridad competente hechos a partir de los cuales pueda presumirse que ha existido discriminación, los Estados miembros velarán por que recaiga sobre el empleador la carga de probar que no se ha producido discriminación directa o indirecta en la retribución.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 19 Directiva 2023/970</strong></a> — En la evaluación de la realización del mismo trabajo o de un trabajo de igual valor, la apreciación corresponderá a una valoración basada en criterios objetivos, neutros y verificables, conforme al art. 4.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 20 Directiva 2023/970</strong></a> — Los Estados miembros velarán por que, en los procesos relativos a denuncias por discriminación salarial, los órganos jurisdiccionales nacionales o, en su caso, otras autoridades competentes puedan ordenar al demandado que aporte las pruebas pertinentes que obren en su poder.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 28.1 ET</strong></a> — El empresario está obligado a pagar por la prestación de un trabajo de igual valor la misma retribución […], sin que pueda producirse discriminación alguna por razón de sexo en ninguno de los elementos o condiciones de aquella.</li>
      <li><a href="${LEY.lo3_2007}" target="_blank" rel="noopener"><strong>Art. 13 LO 3/2007</strong></a> (transposición previa) — De acuerdo con las leyes procesales, en aquellos procedimientos en los que las alegaciones de la parte actora se fundamenten en actuaciones discriminatorias por razón de sexo, corresponderá a la persona demandada probar la ausencia de discriminación en las medidas adoptadas y su proporcionalidad.</li>
      <li><a href="${LEY.rd902_2020}" target="_blank" rel="noopener"><strong>Art. 4 RD 902/2020</strong></a> — Sistema de valoración de puestos de trabajo basado en los criterios de adecuación, totalidad y objetividad.</li>
    </ul>
  </div>

  <h2>Preguntas frecuentes</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Puedo grabar conversaciones con mi jefe/a o con RRHH?</p>
    <p class="faq-a">En España, grabar conversaciones en las que <em>tú participas</em> es legal y la grabación es admisible como prueba (Tribunal Constitucional, doctrina consolidada desde la STC 114/1984). Lo que no puedes hacer es grabar conversaciones entre terceros. Antes de aportar una grabación a un proceso, comprueba el reglamento interno y la política de protección de datos: aunque sean ilegales para sancionarte por ello, conviene saber qué señales pueden mandar.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Puedo enviarme documentos confidenciales de la empresa a mi correo personal "por si acaso"?</p>
    <p class="faq-a">No. El Tribunal Supremo ha confirmado en varias sentencias que el reenvío masivo o sistemático de documentos confidenciales al correo personal — incluso con la justificación de prepararse para un litigio — puede ser causa de despido procedente por transgresión de la buena fe contractual. La vía correcta es el art. 20 de la Directiva 2023/970: si llegas al juzgado, el juez puede ordenar a la empresa que aporte las pruebas en su poder. Lo que sí puedes hacer es capturar pantalla de comunicaciones que ya están dirigidas a ti, y conservar tus propias nóminas, contratos y emails.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Puedo preguntarle directamente a mi compañero/a cuánto cobra?</p>
    <p class="faq-a">Sí. La <a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">Directiva 2023/970 (art. 7.5)</a> prohíbe a la empresa imponer cláusulas de confidencialidad sobre el salario, así que compartirlo entre compañeros/as es plenamente legal. Eso sí: pide consentimiento explícito si vas a usar el dato fuera de la conversación. Un correo o mensaje en el que la persona te dice expresamente su salario y te autoriza a usar el dato como comparador es prueba válida — anótalo en la tabla con la fuente correspondiente.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Cuántas evidencias hacen falta para que la Inspección o un juzgado actúen?</p>
    <p class="faq-a">No hay número fijo. La Inspección y los juzgados aplican el estándar de "indicios suficientes" del art. 18 Directiva: basta con que el conjunto sea coherente, verificable y permita presumir razonablemente la discriminación. En la práctica, tres elementos consistentes de tres categorías distintas (un comparador, una diferencia apoyada en dato, un elemento que descarte explicación objetiva) suelen bastar para activar la inversión de la carga de la prueba. Más, nunca sobran.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Y si la empresa borra los registros o las comunicaciones después?</p>
    <p class="faq-a">Por eso conviene fijar las pruebas <em>antes</em> de cualquier movimiento. Las capturas con metadatos, los .eml exportados y las URLs públicas con fecha en archive.org son prácticamente irreproducibles después. Adicionalmente, el art. 20 Directiva permite al juzgado ordenar a la empresa que aporte documentos en su poder; si la empresa no lo hace o si demuestras que los borró tras tener constancia de tu reclamación, esa conducta juega en su contra y puede equivaler a un reconocimiento implícito.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Sirve un grupo de WhatsApp del trabajo como prueba?</p>
    <p class="faq-a">Si tú formas parte del grupo y participas en la conversación, sí — y suele ser una de las pruebas más sólidas porque la cabecera del propio mensaje (remitente, hora) es difícil de falsificar. Captura la pantalla mostrando el grupo entero (con tu propio nombre o foto visible para acreditar que participas), exporta el chat completo desde la propia app (la opción "exportar chat") y guarda el .txt o .zip resultante. No edites nada.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Hoja de cálculo de brecha retributiva (plantilla #8) ─────────────
const TABLA_BRECHA_TSV = `Categoría profesional\tNº mujeres\tSalario medio mujeres (€/año bruto)\tNº hombres\tSalario medio hombres (€/año bruto)\tDiferencia H-M (€)\tBrecha (%)\t¿Supera 5%?
Categoría A (ejemplo)\t5\t28000\t5\t32000\t=E2-C2\t=((E2-C2)/E2)*100\t=IF(G2>=5,"Sí","No")
Categoría B (ejemplo)\t3\t24000\t7\t26000\t=E3-C3\t=((E3-C3)/E3)*100\t=IF(G3>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E4-C4\t=((E4-C4)/E4)*100\t=IF(G4>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E5-C5\t=((E5-C5)/E5)*100\t=IF(G5>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E6-C6\t=((E6-C6)/E6)*100\t=IF(G6>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E7-C7\t=((E7-C7)/E7)*100\t=IF(G7>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E8-C8\t=((E8-C8)/E8)*100\t=IF(G8>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E9-C9\t=((E9-C9)/E9)*100\t=IF(G9>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E10-C10\t=((E10-C10)/E10)*100\t=IF(G10>=5,"Sí","No")
[TU CATEGORÍA]\t[N]\t[€]\t[N]\t[€]\t=E11-C11\t=((E11-C11)/E11)*100\t=IF(G11>=5,"Sí","No")
`;

// ── Modelo de carta para solicitar la evaluación retributiva conjunta (#8) ──
const CARTA_EVALUACION_CONJUNTA = `[CIUDAD], [FECHA]

A la atención de la Dirección de [RAZÓN SOCIAL] / Departamento de Recursos Humanos
[DOMICILIO]

Asunto: Solicitud de inicio de la evaluación retributiva conjunta (art. 10 Directiva (UE) 2023/970)

Estimados/as:

Mediante el presente escrito, [yo / la representación legal de las personas trabajadoras de] [RAZÓN SOCIAL], [solicito / solicitamos] formalmente el INICIO DE LA EVALUACIÓN RETRIBUTIVA CONJUNTA prevista en el artículo 10 de la Directiva (UE) 2023/970 del Parlamento Europeo y del Consejo, de 10 de mayo de 2023, sobre transparencia retributiva.

ANTECEDENTES

PRIMERO. Con base en el registro retributivo de la empresa correspondiente al ejercicio [AÑO] (RD 902/2020, art. 5), [hemos / he] calculado la brecha retributiva entre mujeres y hombres por categoría profesional aplicando la fórmula estándar reconocida por Eurostat, el INE y el art. 3.1.b) de la Directiva 2023/970:

  Brecha (%) = ((salario medio H − salario medio M) / salario medio H) × 100

SEGUNDO. El cálculo arroja una brecha igual o superior al 5 % en las siguientes categorías profesionales:

  · [CATEGORÍA / GRUPO PROFESIONAL]  ·  Brecha: [X] %  ·  Plantilla: [N] mujeres + [N] hombres
  · [CATEGORÍA / GRUPO PROFESIONAL]  ·  Brecha: [X] %  ·  Plantilla: [N] mujeres + [N] hombres
  · [CATEGORÍA / GRUPO PROFESIONAL]  ·  Brecha: [X] %  ·  Plantilla: [N] mujeres + [N] hombres

Se adjunta hoja de cálculo con el detalle por categoría y la fuente de los datos.

FUNDAMENTACIÓN

Conforme al artículo 10.1 de la Directiva 2023/970, "cuando la información retributiva facilitada con arreglo al artículo 9 muestre una diferencia del nivel retributivo medio entre trabajadoras y trabajadores que realicen el mismo trabajo o un trabajo de igual valor de al menos un 5 %, en una categoría determinada, que el empleador no pueda justificar sobre la base de criterios objetivos, neutros desde el punto de vista del género, y la diferencia no se haya corregido en un plazo de seis meses […], se realizará una evaluación retributiva conjunta con la representación legal de las personas trabajadoras."

[SOLICITO / SOLICITAMOS]

1. La justificación por escrito, para cada una de las categorías profesionales arriba relacionadas con brecha ≥ 5 %, de los criterios objetivos, neutros desde el punto de vista del género y verificables en los que se basa la diferencia retributiva.

2. Si la justificación aportada no resulta válida con arreglo a esos criterios, o si la diferencia no se corrige en el plazo de seis meses previsto en el art. 10.1 de la Directiva, el INICIO FORMAL DE LA EVALUACIÓN RETRIBUTIVA CONJUNTA, con la participación de la representación legal de las personas trabajadoras y los contenidos previstos en el art. 10.2 de la Directiva: análisis por categoría, identificación de causas, medidas correctoras, plazos de aplicación y mecanismos de seguimiento.

3. Acceso al detalle del registro retributivo (RD 902/2020, art. 5) y, en su caso, a la auditoría retributiva (RD 902/2020, art. 7) y al plan de igualdad inscrito en el REGCON.

4. Respuesta por escrito a la dirección de correo electrónico [TU EMAIL] o a la dirección postal [TU DIRECCIÓN POSTAL] en plazo razonable.

Quedo / quedamos a disposición para cualquier aclaración que consideren necesaria.

Atentamente,



[FIRMA]

[NOMBRE Y APELLIDOS / RLPT / SECCIÓN SINDICAL]
[NIF / IDENTIFICACIÓN]
`;

// ── Body redactado de la plantilla #8 ────────────────────────────────
const BODY_CALCULAR_BRECHA = `
  <h2>Para qué sirve esta plantilla</h2>
  <p>El <strong>artículo 10 de la Directiva (UE) 2023/970</strong> establece un umbral de control: cuando, dentro de una categoría profesional, la diferencia retributiva media entre mujeres y hombres es igual o superior al <strong>5 %</strong> y la empresa no puede justificarla con criterios objetivos y neutros, la empresa está obligada a iniciar una <em>evaluación retributiva conjunta</em> con la representación legal de las personas trabajadoras. El umbral del 5 % no es decorativo: es la línea que separa una desigualdad estadística de una sospecha de discriminación retributiva indirecta que la empresa tiene que explicar o corregir.</p>
  <p>Esta plantilla convierte ese umbral en un cálculo concreto. Te da la fórmula, la hoja modelo descargable y la guía paso a paso para medir si tu categoría profesional dentro de la empresa está o no por encima del 5 %. Si lo está, tienes un argumento cuantitativo — no una intuición — para activar la <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2: solicitar información salarial al departamento de RRHH</a> (RD 902/2020), la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1: pedir la banda salarial a tu empresa</a> (art. 7 Directiva), la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a> ante la Inspección de Trabajo, o solicitar formalmente que se active la evaluación retributiva conjunta — abajo encontrarás un modelo de carta listo para personalizar.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p><strong>Cuando dispones de los datos retributivos por categoría desglosados por sexo.</strong> Esos datos te los puede facilitar (a) el registro retributivo de tu empresa si tiene 50 o más personas trabajadoras y plan de igualdad obligatorio (RD 902/2020, art. 5), (b) la representación legal de las personas trabajadoras a la que tienes acceso, o (c) la información agregada que la empresa esté obligada a publicar a partir del 7-jun-2026 conforme al art. 9 de la Directiva. Si todavía no los tienes, la <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2: solicitar información salarial al departamento de RRHH</a> (vía RD 902/2020) es el paso previo natural para obtenerlos.</p>
  </div>

  <h2>Antes de empezar, ten claro…</h2>
  <ul>
    <li><strong>El nombre de <a href="/convenios.html">tu convenio colectivo</a></strong> y los grupos profesionales o niveles que define para tu empresa. La Directiva exige comparar dentro de "categorías de personas trabajadoras que realizan el mismo trabajo o un trabajo de igual valor": las categorías del convenio son el primer marco natural. Si no lo tienes localizado, en nuestro <a href="/convenios.html">verificador de convenios</a> tienes acceso indexable a 19 convenios oficiales (limpieza, hostelería, oficinas, construcción) con sus tablas salariales por grupo y nivel.</li>
    <li><strong>El tamaño de la empresa</strong>. Las obligaciones de información cambian: ≥ 250 personas (informe público anual desde 2027), 150-249 (cada tres años desde 2027), 100-149 (cada tres años desde 2031), 50-99 (sin obligación de informe público pero sí de registro retributivo y plan de igualdad).</li>
    <li><strong>Si la empresa tiene plan de igualdad obligatorio</strong> (≥ 50 personas, RD 901/2020). Si lo tiene, está depositado en el <a href="https://expinterweb.mites.gob.es/regcon/" target="_blank" rel="noopener">REGCON</a> y puede ser consultable.</li>
    <li><strong>Tus datos retributivos personales</strong> (nóminas + variables anuales) por si necesitas comprobar tu posición individual frente a la media calculada.</li>
    <li><strong>Una hoja de cálculo abierta</strong> (Excel, Google Sheets, Numbers, LibreOffice). El modelo que ofrecemos abajo está pensado para pegarse y empezar a calcular.</li>
  </ul>

  <h2>Qué es exactamente la "brecha" y por qué el umbral es 5 %</h2>
  <p>La brecha salarial es la diferencia porcentual entre la <strong>retribución total media de los hombres y la de las mujeres</strong> dentro de una misma unidad de comparación. La fórmula estándar — la que utiliza Eurostat, el INE y la propia Directiva — es:</p>
  <p style="text-align:center;font-family:'Courier New',Courier,monospace;font-size:14px;background:var(--cream-100);border:1px solid var(--cream-200);padding:14px 18px;margin:6px 0 24px;color:var(--ink);">
    Brecha (%) = ((Salario medio H − Salario medio M) / Salario medio H) × 100
  </p>
  <p>El denominador es el salario medio de los hombres porque es la referencia respecto a la que se mide cuánto cobran <em>menos</em> las mujeres en términos relativos. Si te sale negativa, significa que en esa categoría las mujeres cobran más que los hombres (situación posible pero estadísticamente minoritaria).</p>
  <p>El umbral del 5 % proviene del <a href="${LEY.directiva2023_970}" target="_blank" rel="noopener">art. 10.1 de la Directiva 2023/970</a>: cuando la información retributiva muestra una diferencia de al menos un 5 % en una categoría de personas trabajadoras y la empresa no la justifica con criterios objetivos, neutros y verificables en un plazo de seis meses, debe iniciarse <em>de oficio</em> la evaluación retributiva conjunta. La evaluación implica abrir el detalle por categoría, identificar las causas, fijar medidas correctoras, plazos y mecanismos de seguimiento — todo ello con la representación legal de las personas trabajadoras.</p>

  <h2>Cómo calcular la brecha paso a paso</h2>
  <ol>
    <li><strong>Define la unidad de comparación.</strong> Lo más limpio es categoría profesional del convenio (Grupo II – Nivel 3, por ejemplo). Si trabajas en una empresa que ha hecho su propia valoración de puestos (RD 902/2020, art. 4), usa ese marco; en su defecto, usa los grupos del convenio.</li>
    <li><strong>Reúne los datos por categoría</strong>: para cada una, número de mujeres y de hombres y la <em>retribución total media anual</em> de cada grupo. La retribución total incluye salario base + complementos + variables + retribuciones en especie (la propia Directiva especifica que se cuenta toda la retribución, no sólo el salario base).</li>
    <li><strong>Aplica la fórmula</strong> a cada categoría: <code>brecha = ((H − M) / H) × 100</code>. Una hoja de cálculo lo hace por ti — la plantilla TSV de abajo trae las fórmulas listas en las columnas F, G y H.</li>
    <li><strong>Marca las categorías que superan el 5 %.</strong> Para esas, anota qué proporción de la plantilla de la categoría representan: si una categoría con brecha del 12 % tiene 4 personas (2 H + 2 M), la muestra es muy pequeña; si tiene 40 personas, la cifra es robusta.</li>
    <li><strong>Pide a la empresa la justificación</strong> de la diferencia para cada categoría con brecha ≥ 5 %. Esa solicitud — y la respuesta o falta de respuesta — es ya la base de una reclamación posterior si las explicaciones no cumplen el criterio de "objetivas, neutras y verificables".</li>
  </ol>

  <h2>Hoja de cálculo modelo</h2>
  <p>Abajo tienes dos cosas: una <strong>tabla visual</strong> con tres categorías de ejemplo ya calculadas, y un bloque <strong>TSV listo para copiar</strong> a Excel, Google Sheets, Numbers o LibreOffice. El TSV ya incluye las fórmulas de las columnas F (diferencia), G (brecha %) y H (¿supera 5 %?), de modo que al pegarlo se autocompletan según escribes los datos.</p>

  <div class="evidence-table-wrap">
    <table class="evidence-table">
      <thead>
        <tr>
          <th>Categoría</th>
          <th>Nº M</th>
          <th>Salario medio M</th>
          <th>Nº H</th>
          <th>Salario medio H</th>
          <th>Diferencia</th>
          <th>Brecha %</th>
          <th>¿Supera 5%?</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Categoría A</td>
          <td>5</td>
          <td>28.000 €</td>
          <td>5</td>
          <td>32.000 €</td>
          <td>4.000 €</td>
          <td>12,5 %</td>
          <td><strong>Sí</strong></td>
        </tr>
        <tr>
          <td>Categoría B</td>
          <td>3</td>
          <td>24.000 €</td>
          <td>7</td>
          <td>26.000 €</td>
          <td>2.000 €</td>
          <td>7,7 %</td>
          <td><strong>Sí</strong></td>
        </tr>
        <tr>
          <td>Categoría C</td>
          <td>4</td>
          <td>35.000 €</td>
          <td>4</td>
          <td>36.000 €</td>
          <td>1.000 €</td>
          <td>2,8 %</td>
          <td>No</td>
        </tr>
      </tbody>
    </table>
  </div>

  <p>Bloque TSV con cabecera + 2 filas de ejemplo + 8 filas en blanco con fórmulas pre-cargadas:</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar para Excel/Sheets</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="hoja-calculo-brecha-salarial.tsv">Descargar como .tsv</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(TABLA_BRECHA_TSV)}</div>
  </div>

  <div class="warning-box">
    <h3>⚠ Ojo con el idioma de las fórmulas</h3>
    <p>Las fórmulas usan <code>IF</code> en inglés. Funcionan tal cual en <strong>Google Sheets</strong>, <strong>Numbers</strong> y <strong>Excel en inglés</strong>. Si tu Excel está en español, sustituye <code>IF</code> por <code>SI</code> manualmente o copia las celdas a Google Sheets, que acepta ambas formas.</p>
  </div>

  <h2>Cómo interpretar el resultado</h2>
  <p>Tres escenarios posibles:</p>
  <ul>
    <li><strong>Brecha &lt; 5 % en todas las categorías relevantes.</strong> No hay obligación de evaluación retributiva conjunta. Eso no significa que no exista discriminación retributiva en casos individuales — significa que el agregado no la dispara. Conviene cruzar la cifra con tu posición personal: si tú estás dentro de una categoría con brecha baja pero tu salario es claramente inferior al de tu comparador, el camino sigue siendo la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1</a> o la <a href="/plantilla-reclamar-trabajo-igual-valor.html">Plantilla 9</a>.</li>
    <li><strong>Brecha ≥ 5 % en una o varias categorías, sin justificación objetiva conocida.</strong> Activa el supuesto del art. 10 Directiva: la empresa debería iniciar la evaluación retributiva conjunta. Si la empresa no la inicia tras seis meses desde que la información sale a la luz, esa inacción puede ser denunciada ante la Inspección de Trabajo. Aporta tu hoja calculada y la fuente de los datos.</li>
    <li><strong>Brecha ≥ 5 % con justificación que tu análisis considera insuficiente.</strong> Pide por escrito el detalle de los criterios objetivos, neutros y verificables en los que se apoya la diferencia. La carga de probar que esos criterios existen y son neutros recae sobre la empresa (art. 18 Directiva 2023/970). La <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2: solicitar información salarial al departamento de RRHH</a> (RD 902/2020) es la herramienta para esa solicitud.</li>
  </ul>

  <h2>Qué hacer con el resultado</h2>
  <ol>
    <li><strong>Si la brecha es ≥ 5 % y procede la evaluación retributiva conjunta</strong>, solicita por escrito a la empresa que la inicie en los términos del art. 10 Directiva 2023/970. Si hay representación legal de las personas trabajadoras, plantea la solicitud a través de ella.</li>
    <li><strong>Si la empresa rechaza la solicitud o no responde</strong> en plazo razonable, la vía es la denuncia ante la Inspección Provincial de Trabajo y Seguridad Social — usa la <a href="/plantilla-denunciar-discriminacion-salarial.html">Plantilla 5: denunciar discriminación salarial por género</a> aportando tu hoja de cálculo como anexo cuantitativo.</li>
    <li><strong>Si tu situación individual es además injusta</strong>, combina este cálculo con la <a href="/pedir-banda-salarial-empresa-2026.html">Plantilla 1</a> (banda salarial individual, art. 7 Directiva) y, si procede, con la <a href="/plantilla-reclamar-trabajo-igual-valor.html">Plantilla 9</a> (trabajo de igual valor).</li>
    <li><strong>Si quieres preparar terreno antes de mover ficha</strong>, archiva las cifras y las fuentes en la <a href="/plantilla-documentar-evidencias-desigualdad-salarial.html">Plantilla 7: documentar evidencias de desigualdad salarial</a> (tabla maestra de evidencias).</li>
  </ol>

  <h2>Modelo de carta — solicitar la evaluación retributiva conjunta</h2>
  <p>Si tu cálculo arroja una brecha igual o superior al 5 % en una o varias categorías, este es el escrito a remitir a la dirección de la empresa para activar formalmente el supuesto del art. 10.1 Directiva 2023/970. Personalízalo con los datos extraídos de tu hoja de cálculo (categorías, brechas, plantilla por sexo) y envíalo con prueba de recepción — la fecha de entrega es la que activa el cómputo del plazo de seis meses.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-carta-evaluacion">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-carta-evaluacion" data-filename="solicitud-evaluacion-retributiva-conjunta.txt">Descargar como .txt</button>
    </div>
    <div id="template-carta-evaluacion" class="template-text">${formatCarta(CARTA_EVALUACION_CONJUNTA)}</div>
  </div>

  <p>Vías de envío con prueba de recepción (cualquiera de ellas vale para activar el plazo del art. 10.1):</p>
  <ul>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). 25-40 €. Es la opción más sólida ante un eventual juicio.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de Dirección/RRHH solicitando confirmación de lectura. Adjunta carta firmada en PDF + hoja de cálculo de la brecha.</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa, con dos copias y sello de fecha y firma en la tuya.</li>
    <li><strong>A través de la representación legal de las personas trabajadoras</strong> (delegados, comité, sección sindical) si existe — es la vía más eficaz porque la solicitud colectiva tiene mayor peso jurídico que la individual.</li>
  </ul>

  <h2>Marco legal aplicable</h2>

  <div class="legal-box">
    <p class="legal-title">Citas literales y enlaces verificables</p>
    <ul>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 9 Directiva 2023/970</strong></a> — Información sobre la brecha retributiva entre trabajadores y trabajadoras: los empleadores facilitarán información sobre la brecha retributiva entre trabajadoras y trabajadores en su organización, calculada conforme a las definiciones del art. 3, y desglosada por categorías de personas trabajadoras que realicen el mismo trabajo o un trabajo de igual valor.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 10.1 Directiva 2023/970</strong></a> — Cuando la información retributiva facilitada con arreglo al art. 9 muestre una diferencia del nivel retributivo medio entre trabajadoras y trabajadores que realicen el mismo trabajo o un trabajo de igual valor de al menos un 5 %, en una categoría determinada, que el empleador no pueda justificar sobre la base de criterios objetivos, neutros desde el punto de vista del género, y la diferencia no se haya corregido en un plazo de seis meses, se realizará una evaluación retributiva conjunta con la representación legal de las personas trabajadoras.</li>
      <li><a href="${LEY.directiva2023_970}" target="_blank" rel="noopener"><strong>Art. 18.1 Directiva 2023/970</strong></a> — Cuando los trabajadores que se consideren perjudicados por el incumplimiento del principio de igualdad de retribución demuestren ante un juzgado u otra autoridad competente hechos a partir de los cuales pueda presumirse que ha existido discriminación, los Estados miembros velarán por que recaiga sobre el empleador la carga de probar que no se ha producido discriminación directa o indirecta en la retribución.</li>
      <li><a href="${LEY.rd902_2020}" target="_blank" rel="noopener"><strong>Art. 5 RD 902/2020</strong></a> — Registro retributivo: incluirá los valores medios de los salarios, los complementos salariales y las percepciones extrasalariales de la plantilla, desagregados por sexo y distribuidos por grupos profesionales, categorías profesionales o puestos de trabajo iguales o de igual valor.</li>
      <li><a href="${LEY.rd902_2020}" target="_blank" rel="noopener"><strong>Art. 7 RD 902/2020</strong></a> — Auditoría retributiva: las empresas con plan de igualdad obligatorio realizarán una auditoría retributiva con diagnóstico, plan de actuación y vigencia equivalente al plan.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 28 ET</strong></a> — Igualdad de remuneración por razón de sexo y obligación de llevar registro retributivo.</li>
    </ul>
  </div>

  <h2>Preguntas frecuentes</h2>

  <div class="faq-mini">
    <p class="faq-q">¿La brecha del 5 % se mide sobre el salario base o sobre la retribución total?</p>
    <p class="faq-a">Sobre la <strong>retribución total</strong>. El art. 3.1.b de la Directiva 2023/970 define "retribución" en sentido amplio: incluye el sueldo o salario base, así como cualquier otra contraprestación, en dinero o en especie, que el trabajador reciba directa o indirectamente del empleador en razón de su empleo. Eso significa que para el cálculo del umbral del 5 % entran salario base, complementos, variables (bonus, comisiones), retribución en especie (coche, móvil, seguro), aportaciones a planes de pensiones y cualquier otro extra. Si calculas sólo sobre salario base, puedes estar minusvalorando una brecha real.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Qué pasa si en mi empresa hay categorías con muy pocas personas? ¿La cifra es fiable?</p>
    <p class="faq-a">La Directiva no fija un mínimo de muestra, pero la propia <a href="${LEY.rd902_2020}" target="_blank" rel="noopener">guía técnica del Ministerio de Trabajo para el registro retributivo (RD 902/2020)</a> recomienda que cuando una categoría tenga menos de cuatro personas de cada sexo, la cifra se trate con cautela y se cruce con la categoría adyacente. Eso no significa que se ignore — significa que conviene presentar la brecha junto con el tamaño muestral cuando se reclama, para evitar que la empresa argumente que un porcentaje sobre 2 + 2 personas no es representativo.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Y si la empresa alega que la diferencia se debe a la antigüedad o al desempeño?</p>
    <p class="faq-a">Pueden ser justificaciones válidas, pero deben cumplir el test del art. 10.1 Directiva: <em>criterios objetivos, neutros desde el punto de vista del género</em>. Si la empresa premia la antigüedad y resulta que los hombres llevan más tiempo porque la empresa nunca contrató mujeres en esa categoría hasta hace cinco años, la antigüedad es una variable correlacionada con sexo y no neutra. Lo mismo aplica al desempeño: si los criterios de evaluación favorecen disponibilidad horaria sin considerar carreras profesionales atravesadas por permisos por maternidad, no son neutros. Pide por escrito los criterios y cómo se aplican y guarda la respuesta.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">Mi empresa no tiene 50 personas. ¿Sigue siendo aplicable el umbral del 5 %?</p>
    <p class="faq-a">El umbral del 5 % del art. 10 Directiva está pensado para las empresas obligadas a publicar información retributiva (las del art. 9, que son ≥ 100 personas con calendario escalonado). Para empresas más pequeñas, el cálculo sigue siendo útil como diagnóstico interno y como argumentación para una reclamación individual de igualdad retributiva (art. 28 ET, art. 17 ET o art. 4 Directiva 2023/970, según el caso), pero no activa automáticamente la obligación de evaluación retributiva conjunta. Si tu empresa tiene 50-99 personas, sí debe tener registro retributivo y plan de igualdad obligatorios — usa la <a href="/plantilla-solicitar-informacion-salarial-rrhh.html">Plantilla 2: solicitar información salarial al departamento de RRHH</a> (RD 902/2020) para acceder a esos datos.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Quién entra en cada categoría profesional? ¿Lo decide la empresa?</p>
    <p class="faq-a">El <a href="/convenios.html">convenio colectivo</a> define los grupos profesionales y la empresa los aplica al asignar a cada persona su grupo o nivel. Esa asignación tiene que estar basada en las funciones reales (art. 22 ET), no en una clasificación arbitraria. Si sospechas que una categoría está construida para "ocultar" a las mujeres en grupos infrarretribuidos pese a que hacen funciones de un grupo superior, ese es ya un indicio de discriminación retributiva indirecta — y la <a href="/plantilla-reclamar-grupo-profesional-superior.html">Plantilla 3: reclamar el grupo profesional superior</a> es la respuesta individual; el cálculo agregado del 5 %, la respuesta colectiva.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Cuándo entra en vigor la obligación del 5 %?</p>
    <p class="faq-a">La Directiva 2023/970 debía ser transpuesta antes del 7-jun-2026 — esa es la fecha clave para que sus disposiciones sean exigibles en España. La obligación de informar la brecha (art. 9) entra en vigor escalonadamente: empresas ≥ 250 personas deben publicar el primer informe en 2027 (con datos del año natural anterior); 150-249 personas, también en 2027; 100-149, en 2031; 50-99, sin obligación de informe público pero con registro retributivo y plan de igualdad. La obligación de evaluación retributiva conjunta cuando la brecha supera el 5 % (art. 10) se aplica desde el momento en que la información del art. 9 esté disponible en la empresa correspondiente.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Modelo de carta + body redactado de la plantilla #6 ─────────────
const CARTA_ABSORCION_SMI = `[CIUDAD], [FECHA]

A la atención de la Dirección de [RAZÓN SOCIAL] / Departamento de Recursos Humanos
[DOMICILIO]

Asunto: Reclamación previa por absorción indebida de complementos retributivos con la subida del SMI [AÑO]

Estimados/as:

Mediante el presente escrito, yo [NOMBRE Y APELLIDOS], con NIF [NIF], empleado/a de [RAZÓN SOCIAL] desde el [FECHA DE INCORPORACIÓN], con la categoría profesional de [CATEGORÍA SEGÚN CONVENIO] y el puesto de [PUESTO], formulo RECLAMACIÓN PREVIA por la operación de absorción y compensación que la empresa ha aplicado a mis complementos retributivos tras la entrada en vigor del Real Decreto del Salario Mínimo Interprofesional para el año [AÑO].

ANTECEDENTES

PRIMERO. Hasta la nómina de [MES Y AÑO ANTERIOR], venía percibiendo los siguientes complementos retributivos:
  · [CONCEPTO]: [CUANTÍA] €/mes — naturaleza: [salarial / extrasalarial / indemnizatoria, según convenio]
  · [CONCEPTO]: [CUANTÍA] €/mes — naturaleza: [...]
  · [CONCEPTO]: [CUANTÍA] €/mes — naturaleza: [...]

SEGUNDO. En la nómina de [MES POSTERIOR A LA SUBIDA DEL SMI], la empresa ha [eliminado / minorado / absorbido en el salario base] el siguiente concepto:
  · [CONCEPTO ABSORBIDO]: [CUANTÍA ABSORBIDA] €/mes

TERCERO. Esta absorción se ha producido con el objetivo de cumplir con la cuantía mínima del SMI vigente para [AÑO], establecida en el Real Decreto [Nº/AÑO], sin haberme comunicado previamente la modificación de la estructura retributiva ni haber tramitado el procedimiento del artículo 41 ET.

FUNDAMENTACIÓN

La doctrina consolidada del Tribunal Supremo en materia de compensación y absorción del SMI — entre otras, la STS 1100/2020 de 9 de diciembre (ROJ STS 4229/2020, Rec. 121/2019), la STS 272/2022 de 29 de marzo (ROJ STS 1353/2022, Rec. 162/2019) y la STS 446/2024 de 7 de marzo (Rec. 47/2022) — establece tres causas que impiden la absorción válida de complementos:

1. Naturaleza extrasalarial del concepto absorbido. La STS 1100/2020 declara expresamente que "la absorción y compensación prevista en el artículo 26.5 ET no es posible cuando uno de los conceptos retributivos que interviene en la operación es inabsorbible por su propia naturaleza, cual ocurre cuando se trata de un complemento no salarial".

2. Falta de homogeneidad entre los conceptos comparados. Conforme a la doctrina de la STS de 14 de abril de 2010 (Rcud. 2721/09), reiterada en STS 1100/2020 y 446/2024: "la absorción y compensación no rige en principio entre conceptos salariales por unidad de tiempo y devengos en función del esfuerzo laboral, ni entre complementos personales que no se vinculan a resultado alguno o a particulares condiciones de trabajo y aquéllos que se ligan al puesto de trabajo".

3. Disposición expresa del convenio colectivo o de la norma legal que prohíba la absorción. La STS 446/2024 reitera que "solo cabe bloquear la compensación y absorción por heterogeneidad de los conceptos salariales, cuando se haya convenido así en el convenio colectivo".

En mi caso, la absorción aplicada por la empresa es contraria a Derecho porque [SELECCIONAR Y CONCRETAR EL/LOS SUPUESTOS APLICABLES]:

  [ ] El complemento [CONCEPTO ABSORBIDO] tiene naturaleza extrasalarial, al constituir compensación de un gasto efectuado por mí en razón de la actividad laboral (art. 26.2 ET) y no retribución por la prestación de servicios.

  [ ] Los conceptos comparados no son homogéneos: [el complemento absorbido] retribuye [esfuerzo / condiciones específicas / circunstancia personal] y no es comparable con el salario base.

  [ ] El artículo [Nº] del convenio colectivo de aplicación dispone expresamente que los complementos tienen carácter "no compensable ni absorbible" con incrementos del SMI.

[SOLICITO]

1. La REPOSICIÓN inmediata de mi estructura retributiva al estado anterior a la subida del SMI [AÑO], con el restablecimiento del concepto [COMPLEMENTO ABSORBIDO] en su cuantía original de [CUANTÍA] €/mes.

2. El ABONO RETROACTIVO de las diferencias salariales correspondientes al período comprendido entre [FECHA DE LA ABSORCIÓN] y la fecha de regularización, calculadas como [CUANTÍA ABSORBIDA] € multiplicadas por las mensualidades transcurridas, más la incidencia que corresponda en pagas extraordinarias y vacaciones.

3. La RESPUESTA POR ESCRITO en plazo razonable a la dirección de correo electrónico [TU EMAIL] o a la dirección postal [TU DIRECCIÓN POSTAL], con la justificación detallada de la operación de absorción aplicada o, en su caso, el reconocimiento expreso de la pretensión.

ADVERTENCIA. En caso de no obtener respuesta favorable, o de no recibir respuesta en plazo razonable (15 días laborables), ejerceré las acciones legales pertinentes mediante presentación de papeleta de conciliación ante el Servicio de Mediación, Arbitraje y Conciliación (SMAC) y, en su caso, demanda ante el Juzgado de lo Social, dentro del plazo de prescripción de un año por mensualidad establecido en el artículo 59.2 ET. La presentación de la papeleta interrumpe la prescripción.

Quedo a la espera de su respuesta.

Atentamente,



[FIRMA]

[NOMBRE Y APELLIDOS]
[NIF]
`;

// ── Body redactado de la plantilla #6 ────────────────────────────────
const BODY_ABSORCION_SMI = `
  <p class="lede-quote">La subida del SMI te <em>"come"</em> los complementos.</p>

  <h2>Para qué sirve esta plantilla</h2>
  <p>Cada vez que sube el Salario Mínimo Interprofesional, muchas empresas reordenan la nómina <em>absorbiendo</em> complementos para que el coste laboral no aumente: te suben el salario base hasta el nuevo SMI mensual, pero a cambio te reducen o eliminan el plus de transporte, nocturnidad, antigüedad o lo que tengas. Esa operación se llama <strong>compensación y absorción</strong> (art. 26.5 ET) y, según la jurisprudencia consolidada del Tribunal Supremo, <strong>solo es válida en algunos supuestos</strong>. En otros, es ilegal — y puedes reclamar las diferencias salariales más la reposición de tu estructura retributiva.</p>
  <p>Esta plantilla no afirma que cualquier absorción sea injusta: lo importante es saber distinguir cuándo la empresa ha actuado dentro de la ley y cuándo se ha extralimitado. Si tu caso encaja en alguno de los tres supuestos de absorción ilegal que recoge la doctrina del TS — concepto extrasalarial, falta de homogeneidad, prohibición expresa del convenio — el escrito que generas con esta plantilla es la reclamación previa formal a la empresa antes de escalar a SMAC y Juzgado de lo Social.</p>

  <h2>Cuándo usar esta plantilla</h2>
  <div class="when-box">
    <p><strong>Cuando una subida del SMI te ha "comido" complementos.</strong> El patrón típico: tu nómina del primer mes del año (enero o febrero, según cuándo se publique el RD del SMI) muestra un salario base más alto pero con uno o varios complementos eliminados o minorados, y el cómputo total te queda igual o casi igual que antes. Si esos complementos eran extrasalariales (transporte como compensación de gasto, dietas), no homogéneos con el salario base (esfuerzo, condiciones específicas), o si tu convenio colectivo los declara expresamente "no compensables ni absorbibles", la operación es ilegal y tienes derecho a reclamar la reposición y los atrasos.</p>
  </div>

  <h2>Antes de redactarla, ten a mano…</h2>
  <ul>
    <li>Tu <strong>nómina del mes anterior</strong> a la subida del SMI y la <strong>nómina del mes posterior</strong>. Necesitas las dos para acreditar exactamente qué concepto se ha absorbido y por qué cuantía.</li>
    <li>El <strong>texto de tu convenio colectivo</strong> aplicable. Busca específicamente la cláusula sobre estructura salarial y, si existe, la frase "no compensable ni absorbible". Si no localizas tu convenio, en el <a href="/convenios.html">verificador de convenios</a> tienes 19 convenios oficiales indexados; alternativamente, está en el <a href="https://expinterweb.mites.gob.es/regcon/" target="_blank" rel="noopener">REGCON</a> y en el BOE/BOP correspondiente.</li>
    <li>El <strong>Real Decreto del SMI</strong> vigente que motivó la operación de la empresa (cada año tiene el suyo: RD 1462/2018 para 2019, RD 231/2020 para 2020, RD 817/2021 para 2021, etc.). Su artículo 3 regula la compensación y absorción.</li>
    <li>Tus datos personales: <strong>nombre y apellidos, NIF, fecha de incorporación, categoría profesional, puesto</strong>.</li>
    <li>Datos de la empresa: <strong>razón social, CIF, domicilio social</strong> y nombre de la persona responsable de RRHH si lo conoces.</li>
  </ul>

  <h2>Cuándo la absorción ES legal (para no reclamar en falso)</h2>
  <p>El TS ha consolidado en sentencias como la <strong>STS 272/2022</strong> (29 de marzo) y la <strong>STS 446/2024</strong> (7 de marzo) que la absorción <strong>SÍ es válida</strong> cuando concurren todas estas condiciones:</p>
  <ul>
    <li>Los complementos absorbidos tienen <strong>naturaleza salarial</strong> — pluses de antigüedad, sobrecargo, nocturnidad cuando su finalidad es retributiva (no compensación de gasto), pagas de beneficios, primas de productividad y similares.</li>
    <li>El <strong>convenio colectivo no contiene una cláusula expresa</strong> que prohíba la compensación y absorción de esos conceptos.</li>
    <li>El <strong>cómputo anual</strong> de tu salario sigue siendo igual o superior al SMI anual del año correspondiente (art. 27.1 último párrafo ET).</li>
  </ul>
  <p>Si tu caso encaja en este escenario, la operación de la empresa es jurídicamente correcta — aunque te resulte injusta. La protección frente a esta situación habría tenido que negociarse en el convenio colectivo previamente.</p>

  <h2>Cuándo la absorción es ILEGAL — los tres supuestos del TS</h2>

  <h3>Supuesto 1 · Concepto extrasalarial absorbido</h3>
  <p>La <a href="https://www.poderjudicial.es/search/" target="_blank" rel="noopener"><strong>STS 1100/2020</strong></a> (9 de diciembre, ROJ STS 4229/2020, Rec. 121/2019) declara la <strong>nulidad</strong> de la absorción cuando el concepto absorbido tiene naturaleza extrasalarial. Cita literal:</p>
  <div class="callout">
    "La absorción y compensación prevista en el artículo 26.5 ET no es posible cuando uno de los conceptos retributivos que interviene en la operación es inabsorbible por su propia naturaleza, cual ocurre cuando se trata de un complemento no salarial."
  </div>
  <p>El <strong>plus de transporte</strong>, cuando se configura en convenio como <em>compensación de un gasto</em> que el trabajador asume por desplazarse al centro de trabajo (art. 26.2 ET), es el caso paradigmático. Lo confirma la <strong>STS 446/2024</strong>: aunque cotice como salario y se abone en cuantía fija mensual, la naturaleza jurídica del concepto la determina <em>la finalidad real</em> del devengo — no el tratamiento contable que la empresa le dé en el recibo de nómina. Las dietas, el plus distancia y otros conceptos del art. 26.2 ET siguen la misma lógica.</p>

  <h3>Supuesto 2 · Conceptos no homogéneos</h3>
  <p>Aunque ambos conceptos sean salariales, la absorción exige <strong>homogeneidad</strong> entre ellos. La doctrina sentada por la STS de 14 de abril de 2010 (Rcud. 2721/09), reiterada en la STS 1100/2020 y la STS 446/2024, establece tres principios:</p>
  <ul>
    <li>La compensación y absorción debe operar sobre retribuciones que presenten la <strong>necesaria homogeneidad</strong>: la finalidad de la norma es evitar la superposición de mejoras salariales — superposición que <em>no se produce</em> cuando los conceptos son heterogéneos.</li>
    <li>Las posibilidades de compensación y absorción deben valorarse atendiendo a <strong>los términos, modo y extensión en los que han sido pactadas</strong> las remuneraciones implicadas.</li>
    <li>La absorción <strong>no rige</strong>, en principio, entre: (a) conceptos salariales por unidad de tiempo y devengos en función del esfuerzo laboral; (b) complementos personales no vinculados a resultado o condiciones específicas y aquellos que se ligan al puesto de trabajo.</li>
  </ul>

  <h3>Supuesto 3 · Disposición expresa del convenio</h3>
  <p>Si el convenio colectivo de aplicación contiene una cláusula del tipo "<em>las cantidades pactadas tendrán carácter no compensable ni absorbible</em>", esa disposición prohíbe la operación con independencia de la naturaleza de los conceptos. La <strong>STS 446/2024</strong> resume la doctrina actual: "solo cabe bloquear la compensación y absorción por heterogeneidad de los conceptos salariales, cuando se haya convenido así en el convenio colectivo". Si tu convenio incluye una cláusula de este tipo, llévala como argumento principal; el resto de fundamentación es subsidiaria.</p>

  <h2>Modelo de carta — reclamación previa a la empresa</h2>
  <p>Personaliza los campos en <strong>[CORCHETES]</strong> con tus datos, los conceptos retributivos concretos, las cuantías y el supuesto del TS aplicable. Mantén las citas legales y jurisprudenciales tal cual: ese es el contenido jurídico que da peso a la reclamación.</p>

  <div class="template-text-wrap">
    <div class="template-actions">
      <button type="button" class="btn-copy" data-target="template-text">Copiar al portapapeles</button>
      <button type="button" class="btn-download" data-target="template-text" data-filename="reclamacion-absorcion-complementos-smi.txt">Descargar como .txt</button>
    </div>
    <div id="template-text" class="template-text">${formatCarta(CARTA_ABSORCION_SMI)}</div>
  </div>

  <h2>Cómo enviarla</h2>
  <p>La reclamación previa a la empresa <strong>interrumpe la prescripción</strong> del año del art. 59.2 ET. Para que sea inatacable como prueba, necesitas dejar constancia del envío y de la fecha de recepción:</p>
  <ol>
    <li><strong>Burofax con acuse de recibo y certificación de contenido</strong> (Correos). Es la opción más sólida ante un eventual juicio: tienes prueba de qué dijiste y de cuándo lo recibieron. Coste 25-40 €.</li>
    <li><strong>Correo electrónico</strong> a la cuenta corporativa de Dirección/RRHH solicitando confirmación de lectura y acuse de recibo expreso. Adjunta carta firmada en PDF junto con copias de las dos nóminas (anterior y posterior).</li>
    <li><strong>Registro de entrada presencial</strong> en las oficinas de la empresa. Lleva dos copias y exige que te sellen una con fecha y firma.</li>
    <li><strong>A través de la representación legal de los trabajadores o tu sindicato.</strong> Si en tu empresa hay delegados, comité o sección sindical, planteales la reclamación: las absorciones suelen afectar a colectivos enteros y la presión colectiva es más eficaz.</li>
  </ol>

  <h2>Qué pasa si la empresa no responde o rechaza la reclamación</h2>
  <p>El siguiente paso es la <strong>papeleta de conciliación ante el SMAC</strong> de tu provincia (gratuita), que interrumpe la prescripción de forma definitiva e intenta una solución amistosa. Si no hay acuerdo o la empresa no comparece, queda expedita la vía de la <strong>demanda de cantidad ante el Juzgado de lo Social</strong>, donde podrás reclamar las diferencias salariales devengadas en el último año (art. 59.2 ET) más los intereses legales. Si la situación afecta a un colectivo, los sindicatos pueden plantear la cuestión como <strong>conflicto colectivo</strong> ante la Sala de lo Social de la Audiencia Nacional o el TSJ correspondiente — esta vía suele tener más eficacia y es la que las STS verificadas en esta plantilla resuelven.</p>

  <div class="callout">
    <strong>Plazo crítico:</strong> el art. 59.2 ET fija un año de prescripción <em>por cada mensualidad</em> desde que debió pagarse. Cuanto más tardes, más mensualidades pierdes por la "cola" del año. Reclama cuanto antes.
  </div>

  <h2>Marco legal aplicable</h2>

  <div class="legal-box">
    <p class="legal-title">Citas literales y enlaces verificables</p>
    <ul>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 26.2 ET</strong></a> — No tendrán la consideración de salario las cantidades percibidas por el trabajador en concepto de indemnizaciones o suplidos por los gastos realizados como consecuencia de su actividad laboral, las prestaciones e indemnizaciones de la Seguridad Social y las indemnizaciones correspondientes a traslados, suspensiones o despidos.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 26.5 ET</strong></a> — Operará la compensación y absorción cuando los salarios realmente abonados, en su conjunto y cómputo anual, sean más favorables para los trabajadores que los fijados en el orden normativo o convencional de referencia.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 27.1 ET</strong></a> (último párrafo) — La revisión del salario mínimo interprofesional no afectará a la estructura ni a la cuantía de los salarios profesionales cuando estos, en su conjunto y cómputo anual, fueran superiores a aquel.</li>
      <li><a href="${LEY.et}" target="_blank" rel="noopener"><strong>Art. 59.2 ET</strong></a> — La acción para exigir percepciones económicas o para el cumplimiento de obligaciones de tracto único, que no puedan tener lugar después de extinguido el contrato, prescribirá al año de su terminación. Esta prescripción cuenta por mensualidad.</li>
      <li><strong>Real Decreto del SMI</strong> aplicable al año correspondiente (RD 1462/2018 para 2019, RD 231/2020 para 2020, RD 817/2021 para 2021, RDs sucesivos). Su artículo 3 regula la compensación y absorción del incremento del SMI.</li>
    </ul>
  </div>

  <h3>Jurisprudencia del Tribunal Supremo (Sala IV · Social)</h3>
  <div class="legal-box">
    <ul>
      <li><strong>STS 1100/2020 de 9 de diciembre de 2020</strong> · ROJ STS 4229/2020 · Rec. 121/2019 · Ponente: Ángel Blasco Pellicer. <em>Caso Avanza</em>. Declara la nulidad de la absorción del plus transporte (extrasalarial) con la subida del SMI. Establece que la absorción "no es posible cuando uno de los conceptos retributivos que interviene en la operación es inabsorbible por su propia naturaleza, cual ocurre cuando se trata de un complemento no salarial".</li>
      <li><strong>STS 272/2022 de 29 de marzo de 2022</strong> · ROJ STS 1353/2022 · Rec. 162/2019 · Ponente: Antonio V. Sempere Navarro. <em>Caso Incatema</em>. Confirma que los complementos salariales (incluida la prima de productividad) sí son absorbibles cuando el convenio no contiene cláusula expresa que lo prohíba. Sintetiza la doctrina sobre homogeneidad y cómputo anual del SMI.</li>
      <li><strong>STS 446/2024 de 7 de marzo de 2024</strong> · Rec. 47/2022 · Ponente: Sebastián Moralo Gallego. <em>Caso Air Nostrum</em>. Confirma que pluses de sobrecargo, nocturnidad y paga de beneficios (de naturaleza salarial) sí son absorbibles si el convenio no lo prohíbe; el plus transporte (extrasalarial / indemnizatorio) NO lo es. Reitera: "solo cabe bloquear la compensación y absorción por heterogeneidad de los conceptos salariales, cuando se haya convenido así en el convenio colectivo".</li>
      <li><strong>STS de 14 de abril de 2010</strong> · Rcud. 2721/09. Doctrina nuclear sobre los tres principios de homogeneidad para que opere la absorción y compensación. Citada literalmente en STS 1100/2020 y 446/2024.</li>
      <li><strong>STS 74/2022 de 26 de enero de 2022</strong> · Rec. 89/2020. Confirma que el complemento de antigüedad sí entra en el cómputo del SMI cuando el convenio no lo excluye expresamente.</li>
    </ul>
    <p class="legal-source">Todas las sentencias son consultables en el <a href="https://www.poderjudicial.es/search/" target="_blank" rel="noopener">CENDOJ</a> introduciendo el ROJ o el número de sentencia.</p>
  </div>

  <h2>Preguntas frecuentes</h2>

  <div class="faq-mini">
    <p class="faq-q">¿Cómo sé si mi complemento es salarial o extrasalarial?</p>
    <p class="faq-a">Lo determina el <strong>convenio colectivo aplicable</strong> y la <strong>finalidad real</strong> del devengo, no el tratamiento que le dé la empresa en la nómina o en la cotización. Pista práctica: si el complemento <em>compensa un gasto</em> que el trabajador asume por su actividad laboral (transporte de su casa al centro de trabajo, dietas de comida, distancia, herramientas), es extrasalarial (art. 26.2 ET). Si <em>retribuye</em> trabajo (esfuerzo, condiciones específicas, antigüedad, productividad), es salarial. La STS 446/2024 confirma que aunque el plus transporte cotice como salario o se abone en cuantía fija mensual, sigue siendo extrasalarial si el convenio lo califica como tal y su finalidad real es indemnizar un gasto.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿La nocturnidad puede absorberse con la subida del SMI?</p>
    <p class="faq-a">Según la <strong>STS 446/2024</strong>, sí — siempre que (a) el plus de nocturnidad tenga naturaleza salarial en el convenio (que es lo habitual, art. 36.2 ET), y (b) el convenio colectivo no contenga una cláusula expresa que prohíba la compensación y absorción. Si tu convenio sí lo prohíbe, la absorción es ilegal y tienes argumento para reclamar. La intuición de que "la nocturnidad no puede comerse porque retribuye un esfuerzo singular" pierde apoyo jurisprudencial frente a esta sentencia: el TS rechaza ese argumento salvo cuando el convenio lo contempla expresamente.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Y el plus de antigüedad?</p>
    <p class="faq-a">La <strong>STS 74/2022</strong> y la <strong>STS 272/2022</strong> establecen que el complemento de antigüedad <em>se computa</em> dentro del salario anual a comparar con el SMI. Es decir: si entre tu salario base y tu antigüedad superas el SMI anual, no hay obligación de subirte. Y la antigüedad puede entrar en la operación de absorción si el convenio no lo prohíbe. Para reclamar contra la absorción de la antigüedad necesitas, por tanto, una cláusula convencional expresa de "no compensable ni absorbible" o una pugna sobre la homogeneidad.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">Mi convenio dice "las cantidades tendrán carácter no compensable ni absorbible". ¿Eso resuelve mi caso?</p>
    <p class="faq-a">Es el <strong>argumento más fuerte</strong>. La STS 446/2024 establece que esa cláusula bloquea la operación con independencia de la naturaleza de los conceptos. Lleva el texto literal del artículo del convenio en la reclamación previa y solicita expresamente la reposición. Cuidado con la interpretación de la cláusula: el TS ha analizado en varias sentencias si se refiere a cualquier incremento o solo a las revalorizaciones del propio convenio. Si tu cláusula es ambigua (por ejemplo, sin coma o sin "ni absorbible"), la empresa podría argumentar que solo aplica a las subidas pactadas en convenio. Si es clara, prevalece.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Cuánto tiempo hacia atrás puedo reclamar?</p>
    <p class="faq-a">El plazo de prescripción es de <strong>un año por mensualidad</strong> desde que debió pagarse cada cantidad (art. 59.2 ET). Si la absorción comenzó en enero y reclamas en diciembre del mismo año, todavía conservas las 11 mensualidades anteriores. Si reclamas dos años después, habrás perdido las primeras 12 mensualidades. La presentación de la reclamación previa a la empresa y, sobre todo, la papeleta de conciliación ante el SMAC, <strong>interrumpen la prescripción</strong> y reinician el cómputo del año.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Qué hago si la empresa rechaza la reclamación?</p>
    <p class="faq-a">Presenta <strong>papeleta de conciliación ante el SMAC</strong> de tu provincia. Es gratuita y obligatoria como paso previo a la demanda judicial. Si en el SMAC no hay acuerdo o la empresa no comparece, el secretario judicial te emite el correspondiente certificado y queda expedita la vía judicial: presentas demanda de cantidad ante el Juzgado de lo Social en el plazo de 20 días hábiles desde el acto de conciliación (no del rechazo extrajudicial inicial). Si el problema afecta a un colectivo y hay sindicato implantado, valora la vía del conflicto colectivo: las STS verificadas en esta plantilla resuelven precisamente conflictos colectivos.</p>
  </div>

  <div class="faq-mini">
    <p class="faq-q">¿Necesito abogado para esto?</p>
    <p class="faq-a">Para la reclamación previa a la empresa y la papeleta de conciliación al SMAC, no. Para la demanda al Juzgado de lo Social, en cantidad inferior a 6.000 € puedes ir sin abogado ni graduado social, aunque suele ser recomendable contar con asesoría — de tu sindicato si estás afiliado/a (suelen darla gratuita), de un graduado social, o de un abogado laboralista. Para reclamaciones por cuantía superior o con cierta complejidad jurídica, la representación letrada o de graduado social es obligatoria.</p>
  </div>

  <script>
    document.querySelectorAll('.btn-copy').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        navigator.clipboard.writeText(text).then(() => {
          const orig = btn.textContent;
          btn.textContent = 'Copiado';
          btn.classList.add('btn-success');
          setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-success'); }, 1800);
        }).catch(() => alert('No se pudo copiar. Selecciona el texto manualmente.'));
      });
    });
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        const text = target.innerText;
        const filename = btn.dataset.filename || 'plantilla.txt';
        const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    });
  </script>
`;

// ── Plantillas del Kit (SSOT) ────────────────────────────────────────
const PLANTILLAS = [
  {
    num: 1,
    slug: 'pedir-banda-salarial-empresa-2026',
    title: 'Plantilla para pedir la banda salarial a tu empresa (Directiva UE 2023/970)',
    h1: 'Plantilla para pedir la banda salarial a tu empresa',
    metaDescription: 'Modelo de carta para solicitar la banda salarial de tu posición a partir del 7 de junio de 2026, según la Directiva UE 2023/970. Listo para personalizar y descargar.',
    breadcrumb: 'Pedir banda salarial a tu empresa',
    hook: 'A partir del 7 de junio de 2026, en cualquier momento de tu relación laboral. La empresa está obligada a darte el rango salarial medio de tu categoría y trabajos de igual valor, desglosado por sexo. Es el derecho individual más directo de la Directiva.',
    legal: [
      { text: 'Directiva (UE) 2023/970 — artículo 7 (Derecho a la información retributiva del trabajador)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 5 (Transparencia retributiva previa al empleo)', href: LEY.directiva2023_970 },
    ],
    body: BODY_BANDA_SALARIAL,
  },
  {
    num: 2,
    slug: 'plantilla-solicitar-informacion-salarial-rrhh',
    title: 'Plantilla para solicitar información salarial a RRHH (RD 902/2020)',
    h1: 'Plantilla para solicitar información salarial a RRHH',
    metaDescription: 'Modelo de carta listo para personalizar (copiar o descargar como .txt) para pedir el acceso al registro retributivo de tu empresa antes del 7 de junio de 2026, según el RD 902/2020.',
    breadcrumb: 'Solicitar información salarial a RRHH',
    hook: 'Antes del 7 de junio de 2026 (basada en el RD 902/2020) o como complemento a la Plantilla 1 (banda salarial), cuando necesitas pedir acceso al registro retributivo de tu empresa para detectar diferencias por sexo o categoría.',
    legal: [
      { text: 'Real Decreto 902/2020 — artículo 5 (acceso al registro retributivo: íntegro vía representación legal; sin representación, sólo diferencias porcentuales)', href: LEY.rd902_2020 },
      { text: 'Real Decreto 901/2020 — planes de igualdad y auditoría retributiva', href: LEY.rd901_2020 },
      { text: 'Directiva (UE) 2023/970 — artículos 7 y 9 (refuerzo del derecho a partir del 7 de junio de 2026)', href: LEY.directiva2023_970 },
    ],
    body: BODY_INFO_SALARIAL_RRHH,
  },
  {
    num: 3,
    slug: 'plantilla-reclamar-grupo-profesional-superior',
    title: 'Plantilla para reclamar tu grupo profesional cuando haces funciones superiores',
    h1: 'Plantilla para reclamar el reconocimiento de un grupo profesional superior',
    metaDescription: 'Modelo de carta listo para personalizar (copiar o descargar como .txt) para reclamar el grupo profesional superior cuando haces sus funciones de manera continuada. Basado en el art. 39.2 ET.',
    breadcrumb: 'Reclamar grupo profesional superior',
    hook: 'Haces tareas correspondientes a un grupo profesional superior al que tienes reconocido en contrato. Tienes derecho a reclamar el reconocimiento del grupo y la diferencia retributiva — con apoyo en el convenio y el art. 39 ET.',
    legal: [
      { text: 'Estatuto de los Trabajadores — artículo 39 (movilidad funcional vertical y plazos para reclamar el ascenso)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 59.1 (prescripción de salarios: un año desde que cada cantidad debió abonarse)', href: LEY.et },
      { text: 'Convenio colectivo aplicable (tabla de grupos profesionales y reglas de ascensos)', href: 'https://www.boe.es/buscar/' },
    ],
    body: BODY_GRUPO_SUPERIOR,
  },
  {
    num: 4,
    slug: 'plantilla-reclamar-atrasos-convenio-salarial',
    title: 'Plantilla para reclamar atrasos por revisión del convenio salarial',
    h1: 'Plantilla para reclamar atrasos por revisión del convenio',
    metaDescription: 'Modelo de carta listo para personalizar (copiar o descargar como .txt) para reclamar los atrasos cuando tu convenio se actualiza con efectos retroactivos y la empresa no aplica las diferencias. Plazo de prescripción: 1 año (art. 59.1 ET).',
    breadcrumb: 'Reclamar atrasos del convenio',
    hook: 'Tu convenio se ha actualizado con efectos retroactivos desde el 1 de enero y la empresa no te ha aplicado las diferencias. Plazo de prescripción: 1 año desde que debieron abonarse (art. 59.1 ET).',
    legal: [
      { text: 'Estatuto de los Trabajadores — artículo 59.1 (prescripción de salarios: un año desde que cada cantidad debió abonarse)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 26.1 (concepto de salario)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 82.3 (eficacia obligatoria del convenio colectivo)', href: LEY.et },
      { text: 'Convenio colectivo aplicable (cláusula de revisión salarial y fecha de efectos)', href: 'https://www.boe.es/buscar/' },
    ],
    body: BODY_ATRASOS_CONVENIO,
  },
  {
    num: 5,
    slug: 'plantilla-denunciar-discriminacion-salarial',
    title: 'Plantilla para denunciar discriminación salarial por género ante la Inspección de Trabajo',
    h1: 'Plantilla para denunciar discriminación salarial por género',
    metaDescription: 'Modelo de denuncia ante la Inspección de Trabajo por discriminación retributiva por razón de sexo. Listo para personalizar (copiar o descargar como .txt). Carga de la prueba invertida (art. 18 Directiva 2023/970).',
    breadcrumb: 'Denunciar discriminación salarial',
    hook: 'Tienes indicios sólidos de que cobras menos que un compañero/a por razón de sexo. La carga de la prueba se invierte: si aportas indicios, es la empresa quien debe demostrar que no hay discriminación. Vía: Inspección de Trabajo y/o juzgado social.',
    legal: [
      { text: 'Directiva (UE) 2023/970 — artículo 16 (Derecho a indemnización)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 18 (Inversión de la carga de la prueba)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 25 (Victimización y protección frente a un trato menos favorable)', href: LEY.directiva2023_970 },
      { text: 'Estatuto de los Trabajadores — artículo 28 (igualdad de remuneración por razón de sexo)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 17 (igualdad de trato y no discriminación)', href: LEY.et },
      { text: 'Ley Orgánica 3/2007, para la igualdad efectiva de mujeres y hombres', href: LEY.lo3_2007 },
      { text: 'Constitución Española — artículo 14 (principio de igualdad)', href: LEY.constitucion },
    ],
    body: BODY_DENUNCIA_DISCRIMINACION,
  },
  {
    num: 6,
    slug: 'plantilla-reclamar-absorcion-complementos-smi',
    title: 'Plantilla para reclamar la absorción indebida de complementos por subida del SMI',
    h1: 'Plantilla para reclamar la absorción indebida de complementos por subida del SMI',
    metaDescription: 'Modelo de reclamación previa a la empresa cuando ha absorbido o eliminado complementos al subir el SMI. La doctrina del TS (SSTS 1100/2020, 272/2022 y 446/2024) impide la absorción cuando el concepto es extrasalarial, no homogéneo o el convenio lo prohíbe expresamente.',
    breadcrumb: 'Absorción indebida de complementos por SMI',
    hook: 'Al subir el SMI, la empresa ha reducido o eliminado complementos para mantener el coste laboral igual. La doctrina del Tribunal Supremo establece que la absorción es ilegal en tres supuestos: complemento extrasalarial, falta de homogeneidad entre conceptos, o prohibición expresa del convenio colectivo.',
    legal: [
      { text: 'Estatuto de los Trabajadores — artículo 26.2 (definición de conceptos extrasalariales)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 26.5 (compensación y absorción)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 27.1 (revisión del SMI no afecta a salarios profesionales superiores en cómputo anual)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 59.2 (prescripción de un año por mensualidad)', href: LEY.et },
      { text: 'Real Decreto del SMI aplicable al año correspondiente — artículo 3 sobre compensación y absorción', href: 'https://www.boe.es/' },
      { text: 'STS 1100/2020 de 9 de diciembre de 2020 (ROJ STS 4229/2020, Rec. 121/2019) — caso Avanza: nulidad de la absorción del plus transporte extrasalarial', href: 'https://www.poderjudicial.es/search/' },
      { text: 'STS 272/2022 de 29 de marzo de 2022 (ROJ STS 1353/2022, Rec. 162/2019) — caso Incatema: complementos salariales sí absorbibles si el convenio no lo prohíbe', href: 'https://www.poderjudicial.es/search/' },
      { text: 'STS 446/2024 de 7 de marzo de 2024 (Rec. 47/2022) — caso Air Nostrum: nocturnidad/sobrecargo absorbibles, plus transporte indemnizatorio NO', href: 'https://www.poderjudicial.es/search/' },
    ],
    body: BODY_ABSORCION_SMI,
  },
  {
    num: 7,
    slug: 'plantilla-documentar-evidencias-desigualdad-salarial',
    title: 'Plantilla para documentar evidencias de desigualdad salarial antes de reclamar',
    h1: 'Plantilla para documentar evidencias de desigualdad salarial',
    metaDescription: 'Tabla maestra + checklist para registrar indicios sólidos de desigualdad salarial (correos, ofertas internas, comparaciones de funciones, datos públicos) antes de presentar una reclamación. Activa la inversión de la carga de la prueba (art. 18 Directiva 2023/970).',
    breadcrumb: 'Documentar evidencias de desigualdad',
    hook: 'Sospechas que algo no encaja y quieres reunir indicios sólidos antes de mover ficha. No es una carta — es un checklist + formato de tabla para registrar lo que vas observando (correos, conversaciones, ofertas, anuncios, comparaciones de funciones) sin levantar ruido.',
    legal: [
      { text: 'Directiva (UE) 2023/970 — artículo 18 (Inversión de la carga de la prueba)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 19 (Probar la realización del mismo trabajo o de un trabajo de igual valor)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 20 (Acceso a las pruebas: el juzgado puede ordenarlas)', href: LEY.directiva2023_970 },
      { text: 'Estatuto de los Trabajadores — artículo 28.1 (igualdad de remuneración por trabajo de igual valor)', href: LEY.et },
      { text: 'Ley Orgánica 3/2007 — artículo 13 (carga de la prueba en discriminación por razón de sexo, transposición previa)', href: LEY.lo3_2007 },
      { text: 'Real Decreto 902/2020 — artículo 4 (sistema de valoración de puestos: adecuación, totalidad, objetividad)', href: LEY.rd902_2020 },
    ],
    body: BODY_DOCUMENTAR_EVIDENCIAS,
  },
  {
    num: 8,
    slug: 'plantilla-calcular-brecha-salarial-empresa',
    title: 'Plantilla para calcular la brecha salarial en tu empresa (umbral del 5%)',
    h1: 'Plantilla para calcular la brecha salarial en tu empresa',
    metaDescription: 'Hoja de cálculo TSV con fórmulas pre-cargadas + guía paso a paso para medir si la brecha entre mujeres y hombres en tu empresa supera el 5 % — el umbral que activa la evaluación retributiva conjunta (art. 10 Directiva UE 2023/970).',
    breadcrumb: 'Calcular la brecha salarial',
    hook: 'Quieres medir si la brecha entre mujeres y hombres de tu misma categoría supera el 5% sin justificación objetiva — el umbral que activa la evaluación retributiva conjunta obligatoria. Hoja de cálculo + guía paso a paso para hacerlo con los datos que tu empresa está obligada a darte.',
    legal: [
      { text: 'Directiva (UE) 2023/970 — artículo 3 (Definiciones: retribución total)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 9 (Información sobre la brecha retributiva entre trabajadores y trabajadoras)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 10 (Evaluación retributiva conjunta · umbral del 5 %)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 18 (Inversión de la carga de la prueba)', href: LEY.directiva2023_970 },
      { text: 'Real Decreto 902/2020 — artículo 5 (Registro retributivo)', href: LEY.rd902_2020 },
      { text: 'Real Decreto 902/2020 — artículo 7 (Auditoría retributiva)', href: LEY.rd902_2020 },
      { text: 'Estatuto de los Trabajadores — artículo 28 (igualdad de remuneración por razón de sexo)', href: LEY.et },
    ],
    body: BODY_CALCULAR_BRECHA,
  },
  {
    num: 9,
    slug: 'plantilla-reclamar-trabajo-igual-valor',
    title: 'Plantilla para reclamar igualdad salarial por trabajo de igual valor',
    h1: 'Plantilla para reclamar igualdad salarial por "trabajo de igual valor"',
    metaDescription: 'Modelo de carta listo para personalizar (copiar o descargar como .txt) para reclamar igualdad retributiva cuando tu trabajo no es idéntico al del comparador pero tiene formación, esfuerzo, responsabilidad y condiciones equivalentes (art. 4 Directiva 2023/970 y art. 28 ET).',
    breadcrumb: 'Trabajo de igual valor',
    hook: 'Tu trabajo no es idéntico al de tu comparador, pero tiene responsabilidades, formación, esfuerzo y condiciones equivalentes. La Directiva protege también este escenario, donde puestos ocupados mayoritariamente por mujeres están infravalorados respecto a otros equivalentes ocupados por hombres.',
    legal: [
      { text: 'Directiva (UE) 2023/970 — artículo 4 (Mismo trabajo y trabajo de igual valor: cuatro factores de comparación)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 18 (Inversión de la carga de la prueba)', href: LEY.directiva2023_970 },
      { text: 'Directiva (UE) 2023/970 — artículo 19 (Probar la realización del mismo trabajo o de un trabajo de igual valor)', href: LEY.directiva2023_970 },
      { text: 'Estatuto de los Trabajadores — artículo 28.1 (definición literal de "trabajo de igual valor")', href: LEY.et },
      { text: 'Real Decreto 902/2020 — artículo 4 (sistema de valoración de puestos: adecuación, totalidad, objetividad)', href: LEY.rd902_2020 },
    ],
    body: BODY_TRABAJO_IGUAL_VALOR,
  },
  {
    num: 10,
    slug: 'plantilla-reclamar-igualdad-salarial-no-discriminacion',
    title: 'Plantilla para reclamar igualdad salarial por trato desigual injustificado (art. 17 ET)',
    h1: 'Plantilla para reclamar igualdad salarial por trato desigual injustificado',
    metaDescription: 'Modelo de carta listo para personalizar (copiar o descargar como .txt) para reclamar igualdad retributiva cuando la diferencia salarial obedece a causas protegidas distintas del sexo (edad, discapacidad, condición social, ideología…). Vía: art. 17 ET y art. 14 CE.',
    breadcrumb: 'Reclamación por trato desigual injustificado',
    hook: 'Cobras menos que un compañero/a haciendo el mismo trabajo y la causa no es el género sino otra característica protegida (edad, discapacidad, condición social, ideología, orientación sexual, adhesión sindical, lengua…). La vía es el art. 17 ET y el convenio colectivo, no la Directiva 2023/970 ni el art. 28 ET (ambos específicos para discriminación por sexo).',
    legal: [
      { text: 'Estatuto de los Trabajadores — artículo 17 (igualdad de trato y no discriminación: edad, discapacidad, condición social, ideología, etc.)', href: LEY.et },
      { text: 'Estatuto de los Trabajadores — artículo 59.1 (prescripción de salarios: un año desde que cada cantidad debió abonarse)', href: LEY.et },
      { text: 'Constitución Española — artículo 14 (principio de igualdad y no discriminación)', href: LEY.constitucion },
      { text: 'Convenio colectivo aplicable (igualdad retributiva por categoría)', href: 'https://www.boe.es/buscar/' },
    ],
    body: BODY_IGUALDAD_NO_DISCRIMINACION,
  },
];

// ── Render ───────────────────────────────────────────────────────────
const HUB_URL = '/plantillas-transparencia-retributiva-2026.html';
const GUIA_URL = '/ley-transparencia-salarial-2026.html';

function render(p) {
  const canonical = `https://salariojusto.es/${p.slug}.html`;
  const legalItems = p.legal.map(l => {
    const text = typeof l === 'string' ? l : l.text;
    const href = typeof l === 'string' ? null : l.href;
    return href
      ? `        <li><a href="${href}" target="_blank" rel="noopener">${escapeHtml(text)}</a></li>`
      : `        <li>${escapeHtml(text)}</li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(p.title)} | SalarioJusto</title>
  <meta name="description" content="${escapeHtml(p.metaDescription)}">
  <link rel="canonical" href="${canonical}">
  <meta name="robots" content="index, follow">
  <meta property="og:title" content="${escapeHtml(p.h1)}">
  <meta property="og:description" content="${escapeHtml(p.metaDescription)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="https://salariojusto.es/preview.jpg">
  <meta property="og:type" content="article">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="alternate" hreflang="es" href="${canonical}">
  <link rel="alternate" hreflang="x-default" href="${canonical}">

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/favicon-180x180.png">

  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "SalarioJusto", "item": "https://salariojusto.es/"},
    {"@type": "ListItem", "position": 2, "name": "Guías", "item": "https://salariojusto.es/guias.html"},
    {"@type": "ListItem", "position": 3, "name": "Plantillas de transparencia salarial", "item": "https://salariojusto.es${HUB_URL}"},
    {"@type": "ListItem", "position": 4, "name": "${escapeHtml(p.breadcrumb)}"}
  ]
}
</script>
  <script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${escapeHtml(p.h1)}",
  "description": "${escapeHtml(p.metaDescription)}",
  "datePublished": "2026-04-27",
  "dateModified": "2026-04-27",
  "publisher": {
    "@type": "Organization",
    "name": "SalarioJusto",
    "url": "https://salariojusto.es"
  },
  "mainEntityOfPage": "${canonical}"
}
</script>

  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-MXJ8V2FBW9"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MXJ8V2FBW9');
  </script>
  <!-- Google AdSense -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1110009006533891" crossorigin="anonymous"></script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&family=Newsreader:wght@500;600&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">

  <style>
    :root {
      --cream-50: #FDFBF7;
      --cream-100: #F7F0E6;
      --cream-200: #EDE0CE;
      --gold: #C17B3E;
      --gold-dark: #A0622A;
      --gold-light: #D9A06A;
      --ink: #2D2520;
      --ink-light: #6B5E52;
      --ink-lighter: #9B8E88;
      --green: #2E7D52;
      --green-bg: #EAF5EE;
      --amber-bg: #FEF3C7;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'DM Sans', sans-serif; background: var(--cream-50); color: var(--ink); line-height: 1.75; }

    header { background: var(--ink); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; height: 56px; }
    .logo { display: flex; align-items: center; gap: 12px; text-decoration: none; }
    .logo-mark { width: 28px; height: 28px; border: 1px solid rgba(217,160,106,0.5); display: flex; align-items: center; justify-content: center; font-family: 'Newsreader', serif; font-size: 17px; font-weight: 500; color: var(--gold-light); line-height: 1; padding-top: 2px; }
    .logo-text { font-family: 'Newsreader', serif; font-size: 22px; font-weight: 600; color: var(--gold-light); letter-spacing: -0.025em; line-height: 1; font-feature-settings: "kern" 1, "liga" 1; }
    .logo-text span { color: #fff; }
    .header-cta { background: var(--gold); color: #fff; padding: 8px 16px; font-size: 12px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; text-decoration: none; }
    .header-cta:hover { background: var(--gold-dark); }

    .breadcrumb { background: var(--cream-100); border-bottom: 1px solid var(--cream-200); padding: 10px 32px; font-size: 12px; color: var(--ink-lighter); }
    .breadcrumb a { color: var(--gold); text-decoration: none; }
    .breadcrumb a:hover { text-decoration: underline; }

    .article-hero { background: var(--ink); padding: 52px 32px 48px; }
    .article-hero-inner { max-width: 800px; margin: 0 auto; }
    .article-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold-light); border: 1px solid rgba(193,123,62,0.35); padding: 4px 12px; margin-bottom: 20px; }
    .article-hero h1 { font-family: 'DM Serif Display', serif; font-size: clamp(24px, 3.5vw, 36px); color: #fff; font-weight: 400; line-height: 1.2; margin-bottom: 16px; }
    .article-meta { display: flex; gap: 20px; flex-wrap: wrap; font-size: 12px; color: rgba(255,255,255,0.45); }

    main { max-width: 800px; margin: 0 auto; padding: 48px 24px 80px; }

    .construction-banner { background: var(--amber-bg); border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 18px 22px; margin-bottom: 32px; }
    .construction-banner h2 { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 700; color: var(--ink); margin: 0 0 6px; padding: 0; border: none; }
    .construction-banner p { font-size: 14px; color: var(--ink); margin: 0; line-height: 1.65; }

    h2 { font-family: 'DM Serif Display', serif; font-size: 22px; font-weight: 400; color: var(--ink); margin: 40px 0 14px; padding-top: 28px; border-top: 1px solid var(--cream-200); }
    h2:first-of-type { padding-top: 0; border-top: none; margin-top: 0; }
    p { color: var(--ink-light); font-size: 15px; margin-bottom: 16px; }
    ul { padding-left: 22px; margin-bottom: 16px; }
    li { color: var(--ink-light); font-size: 15px; margin-bottom: 8px; line-height: 1.65; }
    a { color: var(--gold); text-decoration: none; }
    a:hover { text-decoration: underline; }
    strong { color: var(--ink); font-weight: 600; }

    .when-box { background: #fff; border: 1px solid var(--cream-200); border-left: 4px solid var(--gold); padding: 20px 24px; margin-bottom: 28px; }
    .when-box p { margin: 0; }

    .legal-box { background: var(--cream-100); border: 1px solid var(--cream-200); padding: 18px 22px; margin-bottom: 28px; }
    .legal-box p.legal-title { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-lighter); font-weight: 700; margin: 0 0 10px; }
    .legal-box ul { margin: 0; padding-left: 18px; }
    .legal-box li { font-size: 14px; }

    .cta-box { background: var(--ink); padding: 32px 36px; margin: 40px 0 24px; text-align: center; }
    .cta-box h3 { font-family: 'DM Serif Display', serif; font-size: 20px; font-weight: 400; color: #fff; margin-bottom: 8px; }
    .cta-box p { color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 20px; }
    .cta-btn { display: inline-block; background: var(--gold); color: #fff; padding: 12px 28px; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none; }
    .cta-btn:hover { background: var(--gold-dark); text-decoration: none; }
    .cta-btn.secondary { background: transparent; border: 1px solid var(--gold-light); color: var(--gold-light); margin-left: 8px; }
    .cta-btn.secondary:hover { background: var(--gold-dark); border-color: var(--gold-dark); color: #fff; }

    .disclaimer { background: var(--amber-bg); border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 14px 18px; margin-top: 20px; }
    .disclaimer p { font-size: 12px; color: var(--ink-light); margin: 0; line-height: 1.6; }

    /* Plantilla redactada: bloque del modelo de carta + acciones */
    .template-text-wrap { background: #fff; border: 1px solid var(--cream-200); border-left: 4px solid var(--gold); padding: 0; margin: 12px 0 28px; overflow: hidden; }
    .template-actions { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 14px; background: var(--cream-100); border-bottom: 1px solid var(--cream-200); }
    .template-actions button { font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 600; padding: 8px 14px; background: var(--ink); color: #fff; border: 1px solid var(--ink); cursor: pointer; letter-spacing: 0.04em; transition: background 0.15s ease, color 0.15s ease; }
    .template-actions button:hover { background: var(--gold); border-color: var(--gold); }
    .template-actions button.btn-success { background: var(--green); border-color: var(--green); }
    .template-text { font-family: 'Courier New', Courier, monospace; font-size: 13px; line-height: 1.65; color: var(--ink); padding: 22px 26px; white-space: pre-wrap; word-wrap: break-word; margin: 0; background: #fff; }

    /* FAQ miniatura dentro de plantilla redactada */
    .faq-mini { border-bottom: 1px solid var(--cream-200); padding: 16px 0; }
    .faq-mini:last-of-type { border-bottom: none; }
    .faq-mini .faq-q { font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 6px; }
    .faq-mini .faq-a { font-size: 14px; color: var(--ink-light); line-height: 1.6; margin: 0; }

    .legal-box .legal-source { font-size: 12px; color: var(--ink-lighter); margin: 12px 0 0; }
    .legal-box .legal-source a { color: var(--gold); }

    /* Tabla maestra de evidencias (plantilla #7) */
    .evidence-table-wrap { overflow-x: auto; margin: 12px 0 24px; border: 1px solid var(--cream-200); }
    .evidence-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; min-width: 720px; }
    .evidence-table th, .evidence-table td { text-align: left; padding: 10px 12px; border: 1px solid var(--cream-200); vertical-align: top; line-height: 1.55; color: var(--ink-light); }
    .evidence-table th { background: var(--cream-100); font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--ink); font-weight: 700; }
    .evidence-table .ev-date { white-space: nowrap; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: var(--ink); }

    /* Tipos de evidencia numerados */
    .evidence-types ol { counter-reset: ev-type; list-style: none; padding-left: 0; margin: 12px 0 28px; }
    .evidence-types li { position: relative; padding: 14px 0 14px 44px; border-bottom: 1px solid var(--cream-200); margin: 0; }
    .evidence-types li::before { counter-increment: ev-type; content: counter(ev-type); position: absolute; left: 0; top: 14px; width: 28px; height: 28px; background: var(--cream-100); border: 1px solid var(--cream-200); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: var(--ink); font-family: 'DM Serif Display', serif; }
    .evidence-types li:last-child { border-bottom: none; }

    /* Caja de advertencia (límites legales) */
    .warning-box { background: var(--amber-bg); border: 1px solid #FDE68A; border-left: 4px solid #F59E0B; padding: 18px 22px; margin: 12px 0 24px; }
    .warning-box h3 { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; color: var(--ink); margin: 0 0 8px; }
    .warning-box p { font-size: 14px; color: var(--ink); margin: 0 0 8px; line-height: 1.6; }
    .warning-box ul { margin: 6px 0 0; padding-left: 20px; }
    .warning-box li { color: var(--ink-light); margin-bottom: 6px; font-size: 14px; }

    /* Código inline (nombres de fichero) */
    code { background: var(--cream-100); padding: 1px 6px; font-family: 'Courier New', Courier, monospace; font-size: 12px; color: var(--ink); border: 1px solid var(--cream-200); }

    /* Lede destacado (idea principal de la plantilla, opcional) */
    .lede-quote { font-family: 'DM Serif Display', serif; font-size: clamp(17px, 2vw, 22px); line-height: 1.35; color: var(--ink); font-weight: 400; margin: 0 0 32px; padding: 4px 0 22px 22px; border-left: 4px solid var(--gold); }
    .lede-quote em { font-style: italic; color: var(--gold-dark); }


    footer { background: var(--ink); padding: 32px; text-align: center; margin-top: 0; }
    .footer-text { font-size: 11px; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 600px; margin: 0 auto; }
    .footer-text a { color: var(--gold-light); text-decoration: none; }

    @media (max-width: 600px) {
      header { padding: 0 16px; }
      .breadcrumb { padding: 10px 16px; }
      .article-hero { padding: 36px 16px; }
      main { padding: 32px 16px 60px; }
      .cta-box { padding: 24px 20px; }
      .cta-btn.secondary { display: block; margin: 10px 0 0; }
    }
  </style>
</head>
<body>

<header>
  <a href="/" class="logo">
    <div class="logo-mark">§</div>
    <div class="logo-text">Salario<span>Justo</span></div>
  </a>
  <a href="https://salariojusto.es" class="header-cta">Calcular mi salario →</a>
</header>

<div class="breadcrumb">
  <a href="https://salariojusto.es">SalarioJusto</a> ›
  <a href="https://salariojusto.es/guias.html">Guías</a> ›
  <a href="${HUB_URL}">Plantillas de transparencia salarial</a> ›
  ${escapeHtml(p.breadcrumb)}
</div>

<div class="article-hero">
  <div class="article-hero-inner">
    <div class="article-badge">Kit del trabajador · Plantilla ${p.num} de 10</div>
    <h1>${escapeHtml(p.h1)}</h1>
    <div class="article-meta">
      <span>Actualizado: 27 abril 2026</span>
      <span>${p.body ? 'Modelo listo para usar' : 'En preparación'}</span>
    </div>
  </div>
</div>

<main>
${p.body ? p.body : `
  <div class="construction-banner">
    <h2 style="font-family:'DM Sans',sans-serif;font-size:15px;margin-bottom:6px;border:none;padding:0;">Esta plantilla está en preparación</h2>
    <p>Estamos terminando de redactarla con todos los detalles legales y los campos personalizables. Mientras tanto, aquí abajo tienes el contexto: cuándo usarla y los artículos en los que se apoya. Vuelve en los próximos días para ver el modelo completo descargable.</p>
  </div>

  <h2>Cuándo usar esta plantilla</h2>

  <div class="when-box">
    <p>${escapeHtml(p.hook)}</p>
  </div>

  <h2>Marco legal en el que se apoya</h2>

  <div class="legal-box">
    <p class="legal-title">Artículos y normas aplicables</p>
    <ul>
${legalItems}
    </ul>
  </div>

  <p>El modelo completo incluirá un texto listo para personalizar (datos del trabajador, datos de la empresa, fechas, hechos), referencias a los artículos legales arriba citados, indicaciones para el envío con prueba de entrega (correo, burofax o registro presencial) y orientación sobre qué hacer si la empresa no responde en plazo.</p>
`}
  <div class="cta-box">
    <h3>${p.body ? '¿Necesitas más contexto antes de enviarla?' : 'Mientras tanto, prepara el contexto'}</h3>
    <p>${p.body ? 'La guía de la Ley explica los derechos completos, los plazos y qué hacer si la empresa no responde como debe.' : 'Antes de usar cualquier plantilla, conviene tener claro qué derechos tienes y cómo funcionan los plazos.'}</p>
    <a href="${GUIA_URL}" class="cta-btn">Leer la guía de la Ley →</a>
    <a href="${HUB_URL}" class="cta-btn secondary">Ver el Kit completo</a>
  </div>

  <div class="disclaimer">
    <p>⚠ Información orientativa basada en fuentes públicas y normativa vigente a abril de 2026. La plantilla es un modelo general — para casos complejos, despidos en curso o reclamaciones judiciales, consulta con un sindicato, un graduado social o un abogado laboralista.</p>
  </div>

</main>

<footer>
  <p class="footer-text">
    SalarioJusto es una herramienta informativa independiente para trabajadores. Sin empresas detrás.<br>
    <a href="https://salariojusto.es">Calculadora de salario neto</a> · <a href="https://salariojusto.es/guias.html">Guías para trabajadores</a> · <a href="https://salariojusto.es${HUB_URL}">Kit de plantillas</a>
  </p>
  <p style="font-size:11px;color:rgba(255,255,255,0.35);line-height:1.5;margin-top:14px;text-align:center;">
    <a href="/privacidad.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Privacidad</a> ·
    <a href="/aviso-legal.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Aviso legal</a> ·
    <a href="/contacto.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Contacto</a> ·
    <a href="/sala-de-prensa.html" style="color:rgba(255,255,255,0.55);text-decoration:none;">Prensa</a>
  </p>
</footer>

</body>
</html>
`;
}

// ── Ejecución ────────────────────────────────────────────────────────
function main() {
  let written = 0;
  for (const p of PLANTILLAS) {
    const filePath = path.join(ROOT, `${p.slug}.html`);
    fs.writeFileSync(filePath, render(p), 'utf8');
    console.log(`  ✓ ${p.slug}.html`);
    written++;
  }
  console.log(`\n${written} plantilla${written === 1 ? '' : 's'} generada${written === 1 ? '' : 's'}.`);
  return PLANTILLAS;
}

if (require.main === module) main();

module.exports = { PLANTILLAS, render, main, HUB_URL };
