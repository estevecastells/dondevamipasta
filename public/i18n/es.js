// Textos de la interfaz en castellano (app.js y share.js).
// Los textos fijos de la página están en index.html y los de los datos en data.js.
// Lo que va entre llaves ({total}, {until}…) lo rellena el código.
// {until} y {since} son frases con fecha: «hasta el 12 de junio», «desde el 13 de junio»
// ({Until} y {Since}, con mayúscula inicial). Ver i18n/dates.js.

export default {
  meta: {
    title: '¿Y mi pasta? El ticket de tus impuestos',
    description: 'Pon tu sueldo y te imprimimos el ticket: cuánto pagas en impuestos y en qué se gasta cada euro, con datos oficiales. Y si les cuadran las cuentas a PP, PSOE, Vox y Sumar en las elecciones del 29N.',
  },
  ui: {
    // Frase de arriba
    kindNet: 'netos',
    kindGross: 'brutos',
    perMonth: 'al mes',
    perYear: 'al año',
    pagas: '{n} pagas',
    hintYearNet: 'Parece un sueldo anual neto.',
    hintYearGross: 'Parece un sueldo anual bruto.',
    hintMonthNet: 'Parece un sueldo mensual neto.',
    hintMonthGross: 'Parece un sueldo mensual bruto.',
    warnYear: '¿Seguro que es al año? Parece un sueldo mensual. <button type="button" data-fix="mes">Cambiar a al mes</button>',
    warnMonth: '¿Seguro que es al mes? Parece un sueldo anual. <button type="button" data-fix="ano">Cambiar a al año</button>',
    emptyAmount: 'Escribe cuánto cobras, por ejemplo 1.800 al mes o 30.000 al año.',

    // Resumen
    totalUnit: 'al año. Son {month} al mes.',
    partIrpf: 'IRPF',
    partIrpfNote: 'Te lo retienen en la nómina. Va a medias para el Estado y tu comunidad autónoma.',
    partSsWorker: 'Tu cotización a la Seguridad Social',
    partSsWorkerNote: 'También sale de tu nómina. Paga pensiones, bajas y paro.',
    partSsEmployer: 'Lo que paga tu empresa por ti',
    partSsEmployerNote: 'No lo ves en la nómina, pero es parte de lo que cuestas.',
    partIndirect: 'IVA y otros impuestos al comprar',
    partIndirectNote: 'Estimado a partir de lo que gastas en el día a día.',
    infoAbout: 'Qué es: {name}',
    calText: '<strong>{Until}</strong>, todo lo que ganas es para pagar impuestos. {Since}, para ti.',
    calShareCost: 'De cada 100 € que cuestas, <strong>{per100} €</strong> van a lo público.',
    calShareEarn: 'De cada 100 € que ganas, <strong>{per100} €</strong> van a lo público.',

    // Ticket
    tCaja: 'Caja común de lo público',
    tTicket: 'Ticket {n}',
    tYouPut: 'Lo que pones',
    tIrpf: 'IRPF',
    tSsWorker: 'Tu cotización SS',
    tSsEmployer: 'Cotización empresa',
    tIndirect: 'IVA y especiales*',
    tTotal: 'TOTAL',
    tSpentOn: 'En qué se gasta',
    tNoRefunds: 'No se admiten devoluciones',
    tComeBack: 'Vuelva el año que viene.<br>No tiene opción.',
    tVatNote: '*IVA estimado.',
    tFoot: 'Reparto según el gasto de todas las administraciones en {year} (Eurostat). Cálculo aproximado.',
    penNote: '¡más que todo el paro!',

    // Folleto
    unitDefault: 'lo que pones tú al año',
    unitEstimate: 'hasta esto, de lo que pones tú al año',
    unitPerResident: 'por cada residente',
    sticker: 'Estimación',
    source: 'Fuente:',
    sources: 'Fuentes:',
    moreInfo: 'Más información',
    bpParty: 'Partido',
    bpNoData: 'Sin datos',
    bpMore: 'Cómo se cuenta y fuentes',
    pct: '{n} %',

    // Ofertas de campaña
    nowLine: '{label} <b>{amount}</b> al año',
    hlLine: '{text} <b>{amount}</b> más al año.',
    mineLabel: 'tu parte del coste al año',
    why: 'Por qué',
    legendTitle: 'Qué significa cada sello',

    // Ventana de información
    close: 'Cerrar',

    // Compartir
    shareFirst: 'Este año pongo {total} en impuestos:',
    shareLast: 'Trabajo para Hacienda {until}. ¿Y tu pasta?',
    shareInterest: '💸 {v} a intereses de la deuda',
    shareIgualdad: '♀️ {v} al Ministerio de Igualdad',
    shareMarruecos: '🛂 {v} a la policía de Marruecos',
    shareCasaReal: '👑 {v} a la Casa Real',
    sharePensions: '🧓 {v} a pensiones',
    imgPreparing: 'Preparando la imagen…',
    imgSaved: 'Imagen guardada. Súbela a tu post junto al texto.',
    imgError: 'No se ha podido crear la imagen. Prueba con otro navegador.',
    copied: 'Texto copiado.',
    copyError: 'No se ha podido copiar. Selecciona el texto a mano.',
    imgFile: 'mi-ticket-de-impuestos',

    // Imagen para compartir (share.js)
    imgYouPut: 'Este año pongo',
    imgInTaxes: 'en impuestos. Este es mi ticket:',
    imgWorkUntil: 'Trabajo para Hacienda {until}.',
    imgRowIgualdad: 'Ministerio de Igualdad',
    imgRowCorrupcion: 'Amaños en contratos públicos',
    imgUpTo: 'hasta',
    imgRowMarruecos: 'Policía de Marruecos',
    imgRowLgtbi: 'LGTBI+ en otros países',
    imgRowCasaReal: 'Casa Real',
    imgSpentOn: 'EN QUÉ SE GASTA',
    imgMore: '…y {n} cosas más',
    imgCta: 'Calcula el tuyo en {url}',
    imgCtaNoUrl: 'Calcula el tuyo en ¿Y mi pasta?',
    imgData: 'Datos: Eurostat, BOE y Hacienda. Cálculo aproximado para un asalariado.',
  },
};
