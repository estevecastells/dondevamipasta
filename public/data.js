// ¿Y mi pasta? · Datos
// Todas las cifras de gasto están en millones de euros (M€).
// Cada bloque indica su fuente. Si actualizas una cifra, actualiza también su fuente.

export const SITE = {
  name: '¿Y mi pasta?',
  url: 'https://dondevamipasta.com',
  year: 2026,
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. EN QUÉ SE GASTA: gasto de TODAS las administraciones públicas
//    (Estado, CCAA, ayuntamientos y Seguridad Social), por funciones.
//    Fuente: Eurostat, gov_10a_exp (COFOG), España, sector S13, año 2024
//    (último año publicado; dato provisional, actualizado el 21/10/2026).
//    Total: 725.001 M€ (45,5 % del PIB).
// ─────────────────────────────────────────────────────────────────────────────
export const SPENDING_YEAR = 2024;
export const SPENDING_TOTAL = 725001;

export const SPENDING = [
  { key: 'jubilacion', emoji: '🧓', label: 'Pensiones de jubilación', short: 'Pensiones jubilación', m: 165050, cofog: 'GF1002' },
  { key: 'sanidad', emoji: '🏥', label: 'Sanidad', short: 'Sanidad', m: 102942, cofog: 'GF07' },
  { key: 'educacion', emoji: '🎓', label: 'Educación', short: 'Educación', m: 65862, cofog: 'GF09' },
  { key: 'incapacidad', emoji: '🩹', label: 'Incapacidad y bajas por enfermedad', short: 'Incapacidad y bajas', m: 44019, cofog: 'GF1001' },
  { key: 'administracion', emoji: '🏛️', label: 'Gobiernos, parlamentos, Hacienda y exteriores', short: 'Administración general', m: 21444 + 16626 + 4661, cofog: 'GF0101+GF0103+GF0106' },
  { key: 'intereses', emoji: '💸', label: 'Intereses de la deuda', short: 'Intereses de la deuda', m: 39644, cofog: 'GF0107', spicy: true },
  { key: 'viudedad', emoji: '🕊️', label: 'Pensiones de viudedad y orfandad', short: 'Viudedad y orfandad', m: 35425, cofog: 'GF1003' },
  { key: 'transporte', emoji: '🚆', label: 'Carreteras, trenes y transporte', short: 'Transporte', m: 28634, cofog: 'GF0405' },
  { key: 'seguridad', emoji: '🚓', label: 'Policía, bomberos, juzgados y cárceles', short: 'Policía y justicia', m: 28628, cofog: 'GF03' },
  { key: 'paro', emoji: '📉', label: 'Prestaciones por desempleo', short: 'Paro', m: 24077, cofog: 'GF1005' },
  { key: 'empleo', emoji: '💼', label: 'Políticas de empleo, comercio y ayudas a empresas', short: 'Empleo y empresas', m: 21124, cofog: 'GF0401' },
  { key: 'medioambiente', emoji: '♻️', label: 'Basuras, depuradoras y medio ambiente', short: 'Basuras y medio ambiente', m: 15539, cofog: 'GF05' },
  { key: 'familia', emoji: '👶', label: 'Familias e hijos', short: 'Familias e hijos', m: 15294, cofog: 'GF1004' },
  { key: 'cultura', emoji: '🎭', label: 'Cultura, deporte y ocio', short: 'Cultura y deporte', m: 6770 + 7804 + 175 + 325, cofog: 'GF0801+GF0802+GF0805+GF0806' },
  { key: 'idi', emoji: '🔬', label: 'Investigación (I+D)', short: 'Investigación (I+D)', m: 8513 + 408 + 5485, cofog: 'GF0104+GF0105+GF0408' },
  { key: 'defensa', emoji: '🪖', label: 'Defensa', short: 'Defensa', m: 14233, cofog: 'GF02' },
  { key: 'exclusion', emoji: '🤝', label: 'Exclusión social y otras ayudas', short: 'Exclusión social', m: 10878 + 5 + 2127, cofog: 'GF1007+GF1008+GF1009' },
  { key: 'industria', emoji: '🔧', label: 'Industria, telecos, turismo y otros sectores', short: 'Industria y otros', m: 2519 + 3685 + 4212 + 2337, cofog: 'GF0404+GF0406+GF0407+GF0409' },
  { key: 'vivienda', emoji: '🏘️', label: 'Vivienda, urbanismo y agua', short: 'Vivienda y urbanismo', m: 7613 + 657, cofog: 'GF06+GF1006' },
  { key: 'agricultura', emoji: '🚜', label: 'Agricultura y pesca', short: 'Agricultura y pesca', m: 7156, cofog: 'GF0402' },
  { key: 'energia', emoji: '⚡', label: 'Energía', short: 'Energía', m: 5756, cofog: 'GF0403' },
  { key: 'teles', emoji: '📺', label: 'Televisiones, radios y publicaciones públicas', short: 'Teles y radios públicas', m: 3144, cofog: 'GF0803' },
  { key: 'cooperacion', emoji: '🌍', label: 'Ayuda al desarrollo en el exterior', short: 'Ayuda exterior', m: 1255, cofog: 'GF0102' },
  { key: 'religion', emoji: '⛪', label: 'Servicios religiosos y comunitarios', short: 'Culto y comunidad', m: 975, cofog: 'GF0804' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 2. LO QUE NO SALE EN EL FOLLETO (partidas concretas)
//    Los textos están en castellano; las traducciones van en i18n/ca.js, eu.js y gl.js.
//    En `stat`, lo que va entre llaves ({timesCasaReal}…) lo calcula app.js.
//    Se reparten igual que el resto: (partida / gasto total) × lo que pagas.
//    Son trozos de las categorías de arriba, no se suman al total.
// ─────────────────────────────────────────────────────────────────────────────
// Subida de las pensiones de enero de 2027 (la usan el folleto y las ofertas de campaña).
// Cuando el INE publique el IPC de noviembre (15 de diciembre), cambia IPC_2027 por la subida real.
const IPC_2027 = 3.5; // Previsión de Funcas para la subida de enero de 2027
const COSTE_PUNTO_IPC = 2606; // M€ por cada punto de subida (memoria del Gobierno)
const COSTE_IPC_2027 = Math.round(IPC_2027 * COSTE_PUNTO_IPC); // ≈ 9.121 M€

export const SPICY = [
  {
    key: 'pensiones',
    emoji: '🧓',
    title: 'Pensiones: lo que pones hoy y la subida de 2027',
    // Hoy: jubilación + viudedad y orfandad (las mismas líneas del ticket)
    m: SPENDING.filter((x) => x.key === 'jubilacion' || x.key === 'viudedad').reduce((a, x) => a + x.m, 0),
    unit: 'lo que pones tú al año en pensiones',
    extra: { m: COSTE_IPC_2027, text: 'más a partir de enero, con la subida de 2027' },
    blurb: 'Jubilación, viudedad y orfandad: la partida más grande del gasto público. Por ley, cada enero suben lo que subieron los precios. Funcas prevé alrededor de un 3,5 % para 2027 y cada punto cuesta unos 2.606 M€ al año: unos 9.100 M€ más que pagamos entre todos. La nómina ya marcó récord en octubre: 14.540 M€ en un mes para 10,57 millones de pensiones.',
    stat: 'Las pensiones ya se llevan {pensionShare} de cada 100 € de tu ticket',
    source: { name: 'Gobierno, coste por punto de IPC (El Independiente)', url: 'https://www.elindependiente.com/economia/2025/10/14/gasto-pensiones-disparara-6250-millones-aumento-inflacion/amp/' },
  },
  {
    key: 'corrupcion',
    emoji: '✉️',
    title: 'Amaños y corrupción en contratos públicos',
    m: 40000,
    estimate: true,
    blurb: 'La CNMC calcula que la falta de competencia en los concursos públicos encarece la factura entre 40.000 y 48.000 M€ al año. Usamos la cifra baja. Es una estimación de máximos e incluye cárteles de empresas, no solo corrupción política.',
    stat: 'Estimación, no es una partida del presupuesto',
    source: { name: 'CNMC', url: 'https://www.cnmc.es/2017-01-18-la-cnmc-intensifica-su-esfuerzo-en-la-persecucion-de-las-irregularidades-en-los' },
    // Por partido. No hay ninguna fuente oficial ni académica que sume el dinero por partido ni el % de imputados.
    // Lo más comparable: el estudio de la UB (un solo método para todos) y lo que han fijado los tribunales caso a caso.
    byParty: {
      title: '¿Y por partido?',
      moneyLabel: 'Lo que han fijado los tribunales',
      peopleLabel: 'De todos los casos, 2000-2020',
      rows: [
        {
          party: 'PP',
          moneyText: '<b>Gürtel:</b> el PP tuvo que devolver 573.311 € por beneficiarse de la trama (firme).<br><b>Erial (Zaplana):</b> multas de más de 25 M€ (2024, recurrida).',
          pct: 40.5,
          detail: '1.516 casos, 248 con condena',
        },
        {
          party: 'PSOE',
          moneyText: '<b>ERE:</b> 679 M€ en ayudas repartidas sin los controles debidos entre 2000 y 2009 (anulada en parte en 2024, falta la nueva sentencia).<br><b>Mascarillas:</b> 6,6 M€ en comisiones (Supremo, 2026).',
          pct: 38.3,
          detail: '1.434 casos, 252 con condena',
        },
        {
          party: 'Vox',
          moneyText: 'Ninguna condena. El Tribunal de Cuentas le multó con 862.497 € por donaciones en efectivo sin identificar (recurrida).',
          pct: 0.027,
          pctLabel: '0,03 %',
          detail: '1 caso, sin sentencia',
          caveat: 'Casi no ha gobernado: nunca en España, y en ninguna comunidad hasta 2022, después de los años del estudio. Con poco poder hay pocas ocasiones.',
        },
        {
          party: 'Sumar',
          name: 'Sumar (IU)',
          moneyText: 'Ningún caso de Sumar. En IU: 456.522 € gastados con una tarjeta black de Caja Madrid (Supremo, 2018).',
          pct: 4.1,
          detail: '152 casos de IU, 40 con condena',
        },
      ],
      note: 'El porcentaje es la parte de los 3.743 casos de corrupción con algún cargo público investigado entre 2000 y 2020 (<a href="http://www.ub.edu/irea/working_papers/2022/202221.pdf" target="_blank" rel="noopener">Universitat de Barcelona, 2022</a>). Cuenta casos, no personas, y un caso entra en cuanto se investiga a alguien: muchos acaban archivados o en absolución. Depende sobre todo de cuánto poder ha tenido cada partido: PP y PSOE tuvieron cerca del 72 % de las alcaldías en esos años, el PSOE ha gobernado España unos 29 años y el PP unos 14, y Vox nunca. Las cifras en euros no se pueden sumar entre sí: unas son daños, otras comisiones, multas o ayudas mal repartidas. Fuentes de los euros: <a href="https://www.newtral.es/sentencias-pp-gurtel/20220408/" target="_blank" rel="noopener">Newtral</a>, <a href="https://www.infobae.com/espana/agencias/2024/10/15/zaplana-condenado-a-10-anos-y-cinco-meses-de-carcel-y-a-pagar-25-millones-por-la-trama-de-las-itv-en-erial/" target="_blank" rel="noopener">EFE</a>, <a href="https://www.publico.es/politica/destino-679-millones-ere-sentencia.html" target="_blank" rel="noopener">Público</a>, <a href="https://www.larazon.es/andalucia/caso-ere-siete-anos-busca-sentencia_202611206affafe5c0d5c85b96c2c3ab.html" target="_blank" rel="noopener">La Razón</a>, <a href="https://www.eldiario.es/politica/comisiones-pagos-mensuales-10-000-euros-enchufes-considera-probado-sentencia-caso-mascarillas_1_13324415.html" target="_blank" rel="noopener">elDiario.es (mascarillas)</a>, <a href="https://www.eldiario.es/politica/anticorrupcion-archiva-investigacion-vox-financiacion-irregular-sancion-tribunal-cuentas_1_12389832.html" target="_blank" rel="noopener">elDiario.es (Vox)</a> e <a href="https://www.iustel.com/diario_del_derecho/noticia.asp?ref_iustel=1176364" target="_blank" rel="noopener">Iustel</a>. Todas las personas investigadas son inocentes mientras no haya condena.',
    },
  },
  {
    key: 'intereses',
    emoji: '💸',
    title: 'Intereses de la deuda',
    m: 39644,
    blurb: 'Lo que pagaron todas las administraciones solo en intereses en 2024. Más que todo el gasto en prestaciones por desempleo (24.077 M€).',
    stat: 'Por cada 10 € para educación, {interestPer10Edu} € para intereses',
    source: { name: 'Eurostat, COFOG 2024', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
  },
  {
    key: 'marruecos',
    emoji: '🛂',
    title: 'Ayuda a la policía de Marruecos',
    m: 30,
    blurb: 'Desde 2019 el Consejo de Ministros ha aprobado varias ayudas directas a Marruecos para frenar la inmigración irregular, de unos 30 M€ cada una. Calculamos lo que te toca de una de ellas. Aparte, la UE ha comprometido 500 M€ con Marruecos para 2021-2027.',
    stat: '30 M€ por ayuda; entre 92 y 123 M€ desde 2019, según la fuente',
    source: { name: 'La Moncloa, Consejo de Ministros', url: 'https://www.lamoncloa.gob.es/consejodeministros/Paginas/enlaces/190719-enlace-marruecos.aspx' },
  },
  {
    key: 'deuda',
    emoji: '🧾',
    title: 'Tu trozo de la deuda pública',
    perCapita: 1698354.8 / 49590099 * 1e6,
    blurb: 'La deuda de todas las administraciones cerró 2025 en 1,70 billones de euros. Repartida entre los 49,6 millones de residentes, bebés incluidos.',
    stat: 'Por residente, no depende de tu sueldo',
    source: { name: 'Eurostat (deuda) e INE/Eurostat (población)', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10dd_edpt1/default/table' },
  },
  {
    key: 'deficit',
    emoji: '🕳️',
    title: 'Deuda nueva de 2025',
    perCapita: 40641 / 49590099 * 1e6,
    blurb: 'En 2025 las administraciones gastaron 40.641 M€ más de lo que ingresaron. Ese agujero se tapa pidiendo prestado.',
    stat: 'Por residente, no depende de tu sueldo',
    source: { name: 'Eurostat, déficit 2025', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10dd_edpt1/default/table' },
  },
  {
    key: 'casareal',
    emoji: '👑',
    title: 'Casa Real',
    m: 8.43,
    blurb: 'Asignación de la Casa del Rey en los PGE, congelada desde 2021. Incluye los sueldos de la Familia Real. Seguridad, viajes y palacios van en otros presupuestos (Interior, Defensa, Patrimonio Nacional).',
    stat: '8,43 M€ al año',
    source: { name: 'PGE 2023, sección 01', url: 'https://www.moncloa.com/2022/10/06/gobierno-congela-tercer-ano-presupuesto-de-la-casa-real-dispondra-843-millones-1648606/' },
  },
  {
    key: 'partidos',
    emoji: '🗳️',
    title: 'Subvención a los partidos políticos',
    m: 52.7,
    blurb: 'Lo que reciben cada año los partidos con escaño para su funcionamiento ordinario, congelado desde 2018. Aparte van las subvenciones electorales y las de los grupos parlamentarios.',
    stat: '52,7 M€ al año',
    source: { name: 'Consejo de Ministros, reparto 2023', url: 'https://valenciaplaza.com/valenciaplaza/el-gobierno-aprueba-el-reparto-de-52-millones-en-subvenciones-para-partidos-en-2023' },
  },
  {
    key: 'congreso',
    emoji: '🏛️',
    title: 'Congreso de los Diputados',
    m: 110.42,
    blurb: 'Presupuesto propio del Congreso: sueldos de los 350 diputados, personal, grupos parlamentarios y funcionamiento. El Senado va aparte.',
    stat: '110,4 M€ al año',
    source: { name: 'Congreso, presupuesto 2023', url: 'https://www.congreso.es/docu/transp/presupuestos/congreso/presupuestos2023/presupuestos2023_encabezado.html' },
  },
  {
    key: 'teles',
    emoji: '📺',
    title: 'Teles y radios públicas',
    m: 3144,
    blurb: 'Televisiones, radios y publicaciones de todas las administraciones: RTVE y las autonómicas, entre otras.',
    stat: '3.144 M€ en 2024',
    source: { name: 'Eurostat, COFOG 2024', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
  },
  {
    key: 'defensa',
    emoji: '🪖',
    title: 'Defensa',
    m: 14233,
    blurb: 'Gasto militar según la clasificación oficial de la UE. La OTAN usa una definición más amplia que da una cifra mayor.',
    stat: '14.233 M€ en 2024',
    source: { name: 'Eurostat, COFOG 2024', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
  },
  {
    key: 'religion',
    emoji: '⛪',
    title: 'Culto y servicios comunitarios',
    m: 975,
    blurb: 'Gasto público clasificado como servicios religiosos y comunitarios en 2024.',
    stat: '975 M€ en 2024',
    source: { name: 'Eurostat, COFOG 2024', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
  },
  {
    key: 'igualdad',
    emoji: '♀️',
    title: 'Ministerio de Igualdad',
    m: 573,
    blurb: 'Presupuesto del ministerio en los PGE de 2023, que siguen vigentes por prórroga. Según el propio ministerio, unos 320 M€ van a combatir la violencia de género.',
    stat: '573 M€ al año, {timesCasaReal} veces la Casa Real',
    source: { name: 'La Moncloa, PGE 2023', url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/igualdad/Paginas/2022/071022-pge-2023.aspx' },
  },
  {
    key: 'lgtbi',
    emoji: '🏳️‍🌈',
    title: 'Proyectos LGTBI+ en otros países',
    m: 2,
    blurb: 'En 2023 la AECID dedicó más de 2 M€ a proyectos para personas LGTBI+ en Ecuador, Colombia, Nicaragua, México, Honduras, República Dominicana, Argentina y Cabo Verde.',
    stat: 'Algo más de 2 M€ en 2023',
    source: { name: 'AECID', url: 'https://www.aecid.es/w/la-aecid-mas-comprometida-que-nunca-con-la-defensa-de-los-derechos-lgtbi-en-todo-el-mundo' },
  },
  {
    key: 'palestina',
    emoji: '🇵🇸',
    title: 'Ayuda extra a Palestina',
    m: 150,
    blurb: 'Ayuda adicional a la población palestina anunciada por Exteriores para 2025. Incluye a la UNRWA, la agencia de la ONU para los refugiados palestinos, que ha recibido más de 60 M€ de España desde octubre de 2023.',
    stat: '150 M€ en 2025',
    source: { name: 'Ministerio de Exteriores', url: 'https://www.exteriores.gob.es/es/Comunicacion/NotasPrensa/Paginas/2025_NOTAS_P/Albares-refuerza--el-apoyo-de-Espana-a-la-Agencia-de-la-ONU-para-los-refugiados-palestinos.aspx' },
  },
  {
    key: 'cooperacion',
    emoji: '🌍',
    title: 'Ayuda Oficial al Desarrollo',
    m: 4550,
    blurb: 'Todo lo que España cuenta como ayuda a otros países en 2025, la cifra más alta en 15 años. Con las reglas de la OCDE incluye la parte del presupuesto de la UE destinada a cooperación y las aportaciones a organismos internacionales, por eso es mayor que la línea “Ayuda exterior” del ticket.',
    stat: 'Más de 4.550 M€ en 2025',
    source: { name: 'Ministerio de Exteriores', url: 'https://www.exteriores.gob.es/es/Comunicacion/NotasPrensa/Paginas/2026_NOTAS_P/La-Ayuda-Oficial-al-Desarrollo-española-alcanza-su-mayor-cifra-de-los-ultimos-15-años.aspx' },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. FUENTES (se muestran en la sección de metodología)
// ─────────────────────────────────────────────────────────────────────────────
export const SOURCES = [
  { name: 'Eurostat: gasto de las administraciones por funciones (COFOG), España 2024', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table' },
  { name: 'Eurostat: déficit y deuda de las administraciones, España 2025', url: 'https://ec.europa.eu/eurostat/databrowser/view/gov_10dd_edpt1/default/table' },
  { name: 'BOE: Orden PJC/297/2026 de bases y tipos de cotización', url: 'https://boe.es/buscar/pdf/2026/BOE-A-2026-7296-consolidado.pdf' },
  { name: 'Ministerio de Hacienda: deducción del IRPF para el SMI de 2026', url: 'https://www.hacienda.gob.es/es-ES/Prensa/Noticias/Paginas/2026/20260217-NP-CM-SMI-DEDUCCION-2026.aspx' },
  { name: 'Ministerio de Hacienda: prórroga de los PGE para 2026', url: 'https://www.hacienda.gob.es/es-ES/Prensa/Noticias/Paginas/2025/20251223-NP-CM-PRORROGA-PGE.aspx' },
  { name: 'Agencia Tributaria: tipo efectivo del IVA, informe de recaudación 2025', url: 'https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2025/nota_informativa_9_iar_2025.html' },
  { name: 'La Moncloa: presupuesto del Ministerio de Igualdad para 2023', url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/igualdad/Paginas/2022/071022-pge-2023.aspx' },
  { name: 'Congreso de los Diputados: presupuesto de 2023', url: 'https://www.congreso.es/docu/transp/presupuestos/congreso/presupuestos2023/presupuestos2023_encabezado.html' },
  { name: 'CNMC: sobrecostes en la contratación pública', url: 'https://www.cnmc.es/2017-01-18-la-cnmc-intensifica-su-esfuerzo-en-la-persecucion-de-las-irregularidades-en-los' },
  { name: 'La Moncloa: ayuda a Marruecos contra la inmigración irregular (2019)', url: 'https://www.lamoncloa.gob.es/consejodeministros/Paginas/enlaces/190719-enlace-marruecos.aspx' },
  { name: 'Statewatch: cuarta ayuda de 30 M€ a Marruecos (2022)', url: 'https://statewatch.org/news/2022/october/spanish-government-approves-another-30-million-for-migration-control-in-morocco/' },
  { name: 'AECID: proyectos LGTBI+ en 2023', url: 'https://www.aecid.es/w/la-aecid-mas-comprometida-que-nunca-con-la-defensa-de-los-derechos-lgtbi-en-todo-el-mundo' },
  { name: 'Ministerio de Exteriores: apoyo a la UNRWA y a Palestina', url: 'https://www.exteriores.gob.es/es/Comunicacion/NotasPrensa/Paginas/2025_NOTAS_P/Albares-refuerza--el-apoyo-de-Espana-a-la-Agencia-de-la-ONU-para-los-refugiados-palestinos.aspx' },
  { name: 'Ministerio de Exteriores: Ayuda Oficial al Desarrollo de 2025', url: 'https://www.exteriores.gob.es/es/Comunicacion/NotasPrensa/Paginas/2026_NOTAS_P/La-Ayuda-Oficial-al-Desarrollo-española-alcanza-su-mayor-cifra-de-los-ultimos-15-años.aspx' },
];

// ─────────────────────────────────────────────────────────────────────────────
// 4. LAS OFERTAS DE CAMPAÑA (elecciones generales del 29 de noviembre de 2026)
//    Programas: PP (10 nov), Vox (12 nov), PSOE (15 nov), Frente Amplio (16 nov).
//    Ninguno trae memoria económica. Mismo criterio para los cuatro (ver `verdicts`).
//    `cost` (M€/año) solo cuando es gasto nuevo: sirve para calcular "tu parte",
//    con el mismo reparto que el ticket (coste / gasto total × lo que pones).
// ─────────────────────────────────────────────────────────────────────────────

const SRC = {
  ppPrograma: { name: 'Programa del PP', url: 'https://www.pp.es/wp-content/uploads/2026/11/PROGRAMA-ELECTORAL-PP-2026-RECONSTRUCCION-NACIONAL.pdf' },
  psoePrograma: { name: 'Programa del PSOE', url: 'https://www.elindependiente.com/wp-content/uploads/2026/11/PROGRAMAPSOE29N26.pdf' },
  voxPrograma: { name: 'Programa de Vox', url: 'https://www.elindependiente.com/wp-content/uploads/2026/11/programa-elecct-vox.pdf' },
  faPrograma: { name: 'Programa de Frente Amplio', url: 'https://frenteamplio.info/pdf/ProgramaFrenteAmplio.pdf' },
  ipcPunto: { name: 'El Independiente: cada punto de IPC cuesta 2.606 M€ (memoria del Gobierno)', url: 'https://www.elindependiente.com/economia/2025/10/14/gasto-pensiones-disparara-6250-millones-aumento-inflacion/amp/' },
  funcas2027: { name: 'Infobae: previsión de Funcas para 2027', url: 'https://www.infobae.com/espana/2026/10/08/asi-subiran-las-pensiones-en-enero-de-2027/' },
  airefPensiones: { name: 'AIReF: regla de gasto en pensiones (mayo de 2026)', url: 'https://www.bolsamania.com/noticias/economia/economia--airef-ratifica-el-cumplimiento-de-la-regla-de-gasto-de-pensiones-pero-dice-que-no-garantiza-la-sostenibilidad--22574898.html' },
  finectPensiones: { name: 'Finect: qué proponen los partidos sobre pensiones', url: 'https://www.finect.com/usuario/eduardogarcia/articulos/revalorizar-capitalizar-o-jubilarse-antes-que-proponen-los-partidos-sobre-pensiones-el-29n' },
  voxMixto: { name: 'Demócrata: la receta económica de Vox', url: 'https://www.democrata.es/elecciones-generales-espana/vox-lleva-29n-su-receta-economica-con-rebajas-fiscales-recorte-gasto-reforma-pensiones/' },
  colau10000: { name: 'Público: Colau y el impuesto a los ultrarricos', url: 'https://www.publico.es/politica/tax-the-rich-colau-propone-nuevo-impuesto-patrimonio-ultrarricos.html' },
  grandesFortunas: { name: 'Hacienda: lo que recaudó el impuesto a las grandes fortunas', url: 'https://www.lamoncloa.gob.es/serviciosdeprensa/notasprensa/hacienda/paginas/2023/200923-impuesto-solidaridad-grandes-fortunas.aspx' },
  airefAjuste: { name: 'El Independiente: la AIReF pide un ajuste en 2027', url: 'https://www.elindependiente.com/economia/2026/05/14/airef-advierte-ajuste-necesario-15-000-millones-critica-falta-ambicion-gobierno/amp/' },
  ppIrpf: { name: 'Moncloa.com: la rebaja del IRPF del PP', url: 'https://www.moncloa.com/2026/06/30/feijoo-rebaja-fiscal-pp-congreso-3392154' },
  ceDeflactar: { name: 'Qué!: la Comisión Europea sobre deflactar el IRPF', url: 'https://www.que.es/2026/11/17/deflactacion-irpf-coste-2500-millones/' },
  juanMariana: { name: 'Infobae: el Instituto Juan de Mariana sobre el IRPF sin deflactar', url: 'https://www.infobae.com/america/agencias/2026/11/17/instituto-juan-de-mariana-cifra-en-55600-millones-el-sobrecoste-del-irpf-por-no-ajustarlo-al-ipc-desde-2019/' },
  hacienda85000: { name: 'El Independiente: Hacienda cifra la rebaja de Vox en 85.000 M€', url: 'https://www.elindependiente.com/economia/2026/10/13/hacienda-cifra-en-85-000-millones-el-coste-de-la-rebaja-del-irpf-de-vox-el-61-de-toda-la-recaudacion-del-impuesto/' },
  herqlesVox: { name: 'Herqles: las cifras de la rebaja fiscal de Vox', url: 'https://herqles.com/2026/10/10/rebaja-fiscal-vox-aumentaria-poder-adquisitivo-38-pib/' },
  voxAhorros: { name: 'Infobae: cómo dice Vox que pagaría la rebaja', url: 'https://www.infobae.com/espana/2026/11/04/vox-anuncia-bajada-masiva-de-impuestos-y-reducir-el-iva-al-18-como-pretende-hacerlo/' },
  subvenciones4771: { name: 'The Objective: ayudas a asociaciones, partidos y sindicatos en 2025', url: 'https://theobjective.com/economia/2026-06-20/asociaciones-partidos-sindicatos-ayudas-publicas-2025/' },
  presupuestosCCAA: { name: 'Cátedra UNED: en qué gastan las comunidades (2026)', url: 'https://blogs.uned.es/catedraunedfuenlabrada/wp-content/uploads/sites/313/2026/07/Informe-2026-1.pdf' },
  ivaAlimentos2023: { name: 'Agencia Tributaria: IVA en 2023', url: 'https://sede.agenciatributaria.gob.es/Sede/estadisticas/recaudacion-tributaria/informe-anual/ejercicio-2023/4-impuesto-sobre-valor-anadido.html' },
  crianza19276: { name: 'Artículo14: lo que costaría una ayuda de 200 € por hijo', url: 'https://www.articulo14.es/economia/una-ayuda-de-200-euros-por-hijo-que-nos-costara-19-000-millones-al-ano-20240706.html' },
  zucmanEspana: { name: 'El Salto: el Observatorio Fiscal de la UE sobre un impuesto a milmillonarios', url: 'https://www.elsaltodiario.com/fiscalidad/impuesto-millonarios-europeos-podria-recaudar-120000-millones-europa-5200-espana' },
};


export const PROMISES = {
  lede: 'El <b>29 de noviembre</b> hay elecciones generales. Esto es lo que PP, PSOE, Vox y Sumar quieren cambiar en las partidas de tu ticket, lo que costaría y si les salen las cuentas. Ninguno de los cuatro programas dice cuánto cuesta en total lo que promete.',
  note: 'Mismo criterio para los cuatro. Usamos sus programas para el 29N (PP, 10 de noviembre; Vox, 12; PSOE, 15; Frente Amplio, 16) y, para los costes, datos oficiales y estimaciones independientes; cuando la única cifra es del propio partido, lo decimos. «Sin precio» no es mejor nota que «Cuentas de la lechera»: solo significa que no han dado números para comprobarlo. Punto de partida para todos: la AIReF calcula que en 2027 ya hace falta un ajuste de unos 10.700 M€ antes de cualquier promesa nueva. Sumar se presenta dentro de la coalición Frente Amplio.',
  noOffer: 'No hemos encontrado una propuesta concreta en su programa.',
  verdicts: {
    cuadra: { label: 'Cuadra', rule: 'Se sabe lo que cuesta y el dinero para pagarlo está identificado y llega.' },
    medias: { label: 'Cuadra a medias', rule: 'Se sabe lo que cuesta, pero cómo pagarlo está sin cifrar o solo cubre una parte.' },
    sinprecio: { label: 'Sin precio', rule: 'No dicen cuánto cuesta ni cuánto recaudaría. Sin esa cifra no se puede comprobar.' },
    lechera: { label: 'Cuentas de la lechera', rule: 'Cuesta mucho y lo que proponen para pagarlo no llega ni de lejos, según los datos oficiales de esas partidas.' },
  },
  parties: [
    { key: 'PP', name: 'PP', logo: 'logos/pp.svg', w: 361, h: 243 },
    { key: 'PSOE', name: 'PSOE', logo: 'logos/psoe.svg', w: 351, h: 168 },
    { key: 'Vox', name: 'Vox', logo: 'logos/vox.svg', w: 365, h: 176 },
    { key: 'Sumar', name: 'Sumar', sub: 'en Frente Amplio', logo: 'logos/sumar.svg', w: 272, h: 91 },
  ],
  items: [
    {
      key: 'pensiones',
      emoji: '🧓',
      title: 'Pensiones',
      line: ['jubilacion', 'viudedad'],
      nowLabel: 'Hoy pones en pensiones',
      intro: 'Por ley, cada enero las pensiones suben lo que subieron los precios. Cada punto cuesta unos 2.606 M€ al año, y para enero de 2027 Funcas prevé alrededor de un 3,5 %.',
      highlight: { cost: COSTE_IPC_2027, text: 'Esa subida son unos 9.100 M€ más al año. Tu parte:' },
      offers: {
        PP: {
          what: 'Blindar por ley que suban con el IPC y bajar el IRPF a quien siga trabajando después de jubilarse.',
          cost: COSTE_IPC_2027,
          costText: 'Subirlas con el IPC en 2027: unos 9.100 M€ más al año.',
          verdict: 'medias',
          why: 'La subida con el IPC ya es ley desde 2021, así que el coste no es nuevo. Se paga con cotizaciones, con el recargo del MEI y con dinero del Estado, en parte prestado: la AIReF da por cumplida la regla de gasto, pero calcula que la deuda llegaría al 123 % del PIB en 2050. El PP no dice de dónde saldría dinero extra.',
          source: [SRC.finectPensiones, SRC.ipcPunto, SRC.airefPensiones],
        },
        PSOE: {
          what: 'Meter en la Constitución que suban con el IPC, seguir subiendo las mínimas y adelantar la cuota extra que pagan los sueldos más altos.',
          cost: COSTE_IPC_2027,
          costText: 'Subirlas con el IPC en 2027: unos 9.100 M€ más al año.',
          verdict: 'medias',
          why: 'Igual que con el PP, la subida con el IPC ya es ley y se paga en parte con deuda (la AIReF avisa de que la regla de gasto se cumple, pero no garantiza que sea sostenible). La cuota de los sueldos altos ya existe; no dicen cuánto más traería adelantarla. Cambiar la Constitución necesita tres quintos del Congreso y del Senado.',
          source: [SRC.psoePrograma, SRC.ipcPunto, SRC.airefPensiones],
        },
        Vox: {
          what: 'No dice si seguirán subiendo con el IPC. Promete que serán sostenibles gracias a más crecimiento y más natalidad.',
          verdict: 'sinprecio',
          why: 'El programa no cifra nada sobre pensiones. Su portavoz económico ha defendido un sistema mixto con una parte de capitalización individual, pero eso no está en el programa.',
          source: [SRC.voxPrograma, SRC.voxMixto],
        },
        Sumar: {
          what: 'Ninguna pensión por debajo del salario mínimo, jubilación a los 65 como máximo y a los 60 en trabajos penosos. Y el IPC en la Constitución.',
          cost: 20000,
          costText: 'Solo lo nuevo: unos 20.000 M€ al año, según el propio Frente Amplio. Más la subida con el IPC.',
          verdict: 'lechera',
          why: 'Lo pagarían con impuestos a grandes patrimonios, herencias y grandes empresas, que según Colau darían «más de 10.000 millones» en total. Solo esta medida cuesta el doble, y con ese mismo dinero prometen también vivienda y la ayuda por hijo. Como referencia, el impuesto a las grandes fortunas recaudó 623 M€ en su primer año.',
          source: [SRC.finectPensiones, SRC.colau10000, SRC.grandesFortunas],
        },
      },
    },
    {
      key: 'irpf',
      emoji: '🧾',
      title: 'IRPF',
      part: 'irpf',
      nowLabel: 'Hoy pagas de IRPF',
      intro: 'El impuesto que más te quitan de la nómina. La mitad va al Estado y la otra mitad a tu comunidad autónoma.',
      offers: {
        PP: {
          what: 'Ajustar el IRPF a la inflación, que no pague quien cobra el salario mínimo y rebajas para los menores de 35 en sus primeros cuatro años.',
          costText: 'Dejaría de entrar unos 5.300 M€ al año según el PP, y más de 16.000 M€ si compensa toda la inflación desde 2018 (Instituto Juan de Mariana).',
          verdict: 'medias',
          why: 'Es la rebaja más moderada de las grandes. Dicen pagarla con una auditoría del gasto, menos ministerios y asesores y más lucha contra el fraude, pero no ponen cifras a esos ahorros. Y la AIReF ya pide un ajuste de unos 10.700 M€ en 2027 antes de cualquier rebaja.',
          source: [SRC.ppPrograma, SRC.ppIrpf, SRC.ceDeflactar, SRC.juanMariana, SRC.airefAjuste],
        },
        PSOE: {
          what: 'Subir del 30 % al 35 % lo que pagan las rentas del ahorro por encima de 300.000 € y convertir el mínimo por hijo en una ayuda que cobren también quienes no pagan IRPF.',
          verdict: 'sinprecio',
          why: 'Ni la subida ni la ayuda llevan cifra en el programa, y no hemos encontrado ninguna estimación independiente.',
          source: [SRC.psoePrograma],
        },
        Vox: {
          what: 'Que los primeros 22.000 € no paguen nada y dejar solo dos tramos: 15 % hasta 70.000 € y 25 % por encima. Además, 4 puntos menos por hijo.',
          costText: 'Dejaría de entrar entre 40.000 y 46.000 M€ al año según Vox, y 85.000 M€ según Hacienda: el 61 % de lo que recauda hoy el IRPF.',
          verdict: 'lechera',
          why: 'Con la bajada del IVA y de Sociedades, su rebaja suma 64.000 M€ al año según sus propias cuentas. Dicen pagarla recortando gasto «superfluo» y subvenciones, pero las de los partidos son unos 53 M€ al año y todas las ayudas a asociaciones, fundaciones, partidos y sindicatos sumaron 4.771 M€ en 2025. El resto tendría que salir de las comunidades, que dedican casi dos tercios de su presupuesto a sanidad, educación y servicios sociales.',
          source: [SRC.voxPrograma, SRC.herqlesVox, SRC.hacienda85000, SRC.voxAhorros, SRC.subvenciones4771, SRC.presupuestosCCAA],
        },
        Sumar: {
          what: 'Bajar el IRPF a los sueldos de hasta 27.000 € y subir al 52 % el tipo máximo a partir de 300.000 €.',
          verdict: 'sinprecio',
          why: 'El programa no dice cuánto costaría la bajada ni cuánto recaudaría la subida.',
          source: [SRC.faPrograma],
        },
      },
    },
    {
      key: 'iva',
      emoji: '🛒',
      title: 'IVA',
      part: 'indirect',
      nowLabel: 'Hoy pagas de IVA y similares (estimado)',
      intro: 'Lo pagas en cada compra sin darte cuenta. Es el segundo impuesto que más recauda, después del IRPF.',
      offers: {
        PP: {
          what: 'IVA del 0 % para los alimentos básicos, también carne, pescado y conservas, mientras duren los precios altos.',
          costText: 'Sin cifra del PP. La rebaja de 2023, que dejaba fuera la carne y el pescado, costó 1.703 M€ en un año.',
          verdict: 'medias',
          why: 'Hay una referencia oficial de coste, pero el PP no dice cómo lo pagaría más allá de la auditoría del gasto y la lucha contra el fraude, que no tienen cifra.',
          source: [SRC.ppPrograma, SRC.ivaAlimentos2023],
        },
        Vox: {
          what: 'Bajar el IVA general del 21 % al 18 % y el reducido del 10 % al 8 %.',
          costText: 'Dejaría de entrar unos 14.000 M€ al año, según el propio Vox.',
          verdict: 'lechera',
          why: 'Forma parte de los 64.000 M€ de su rebaja total, que dicen pagar con recortes de subvenciones y de gasto «superfluo» que, sumados, no llegan ni de lejos (ver IRPF).',
          source: [SRC.voxPrograma, SRC.herqlesVox, SRC.subvenciones4771],
        },
        Sumar: {
          what: 'Bajar el IVA de peluquerías, veterinarios y pañales, y luz sin IVA para el consumo más bajo.',
          verdict: 'sinprecio',
          why: 'Ninguna de estas rebajas lleva cifra en el programa.',
          source: [SRC.faPrograma],
        },
      },
    },
    {
      key: 'vivienda',
      emoji: '🏘️',
      title: 'Vivienda',
      line: 'vivienda',
      nowLabel: 'Hoy pones en vivienda y urbanismo',
      intro: 'Es de lo que menos gasta el Estado y de lo que más prometen todos.',
      offers: {
        PP: {
          what: 'Un millón de viviendas liberando suelo e IVA del 4 % para la primera vivienda de los menores de 40.',
          verdict: 'sinprecio',
          why: 'El programa no dice cuánto costaría la rebaja del IVA ni cuánto dinero público pondría en el millón de viviendas.',
          source: [SRC.ppPrograma],
        },
        PSOE: {
          what: 'Movilizar el 1 % del PIB al año, créditos del ICO incluidos, y 100.000 viviendas del Estado.',
          cost: 17000,
          costText: 'El 1 % del PIB son unos 17.000 M€ al año, aunque una parte serían préstamos y no gasto.',
          verdict: 'medias',
          why: 'Hay una cifra, pero no dicen qué parte es gasto y qué parte crédito, ni de dónde saldría el dinero.',
          source: [SRC.psoePrograma],
        },
        Vox: {
          what: 'IVA del 0 % para la compra de vivienda nueva como primera residencia.',
          verdict: 'sinprecio',
          why: 'No lo cifran, y forma parte de una rebaja de impuestos que ya no cuadra por sí sola (ver IRPF).',
          source: [SRC.voxPrograma],
        },
        Sumar: {
          what: 'El 1 % del PIB al año para 1,5 millones de viviendas públicas en 12 años.',
          cost: 17000,
          costText: 'Unos 17.000 M€ al año, según el propio Frente Amplio.',
          verdict: 'lechera',
          why: 'Sale de la misma bolsa que la subida de pensiones (20.000 M€) y la ayuda por hijo (19.300 M€): entre las tres pasan de 56.000 M€ al año, y sus nuevos impuestos darían «más de 10.000 millones» según Colau.',
          source: [SRC.faPrograma, SRC.colau10000],
        },
      },
    },
    {
      key: 'familia',
      emoji: '👶',
      title: 'Familias e hijos',
      line: 'familia',
      nowLabel: 'Hoy pones en familias e hijos',
      intro: 'Ayudas por hijo, por nacimiento y para la crianza.',
      offers: {
        PP: {
          what: 'Juntar todas las deducciones del IRPF por hijos en una sola que se cobre cada mes, también quien no paga IRPF, y subir los mínimos por hijo con la inflación.',
          verdict: 'sinprecio',
          why: 'El programa no dice cuánto cobraría cada familia ni cuánto costaría. Se suma a su rebaja del IRPF, que tampoco cifra cómo se paga (ver IRPF).',
          source: [SRC.ppPrograma],
        },
        Vox: {
          what: 'Dar a todas las familias, desde el primer hijo, las ventajas que hoy tienen las numerosas; que el Estado pague la cotización de quien deja de trabajar para criar a sus hijos, y escuela de 0 a 3 años gratis.',
          verdict: 'sinprecio',
          why: 'No cifra ninguna de las tres medidas. Van además de los 4 puntos menos de IRPF por hijo, que forman parte de una rebaja que ya no cuadra (ver IRPF).',
          source: [SRC.voxPrograma],
        },
        PSOE: {
          what: 'Una ayuda universal por crianza para los 8 millones de menores, pagada con impuestos a las grandes fortunas y a las rentas del capital.',
          verdict: 'sinprecio',
          why: 'El programa no dice cuánto se cobraría por hijo. Como referencia, 200 € al mes por menor costarían unos 19.300 M€ al año (ISEAK). El impuesto a las grandes fortunas recaudó 623 M€ en su primer año.',
          source: [SRC.psoePrograma, SRC.crianza19276, SRC.grandesFortunas],
        },
        Sumar: {
          what: '200 € al mes por hijo, pagados con un impuesto del 3 % a los patrimonios de más de 50 M€.',
          cost: 19276,
          costText: 'Unos 19.300 M€ al año (estimación de ISEAK).',
          verdict: 'lechera',
          why: 'El Observatorio Fiscal de la UE calcula que un impuesto así daría unos 5.200 M€ en España (para patrimonios de más de 100 M€): ni un tercio de lo que cuesta la ayuda.',
          source: [SRC.faPrograma, SRC.crianza19276, SRC.zucmanEspana],
        },
      },
    },
  ],
};

// Las fuentes principales de las ofertas también van en «La letra pequeña»
SOURCES.push(
  { name: 'Programas para el 29N: PP', url: SRC.ppPrograma.url },
  { name: 'Programas para el 29N: PSOE', url: SRC.psoePrograma.url },
  { name: 'Programas para el 29N: Vox', url: SRC.voxPrograma.url },
  { name: 'Programas para el 29N: Frente Amplio (Sumar)', url: SRC.faPrograma.url },
  SRC.ipcPunto,
  SRC.funcas2027,
  { name: 'Artículo14: récord de la nómina de pensiones en octubre de 2026', url: 'https://www.articulo14.es/economia/record-gasto-pensiones-14540-millones-20261027.html' },
  SRC.airefPensiones,
  SRC.airefAjuste,
  SRC.hacienda85000,
  { name: 'Universitat de Barcelona (IREA): casos de corrupción por partido, 2000-2020', url: 'http://www.ub.edu/irea/working_papers/2022/202221.pdf' },
);
