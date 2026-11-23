// Fechas en cada idioma, a mano: cada lengua cambia la preposición según el día
// (cat. «fins a l'1 d'abril», eus. «ekainaren 12ra arte»).
// until(d): «hasta el 12 de junio»   since(d): «desde el 13 de junio»   (en minúscula)

const es = {
  months: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  weekdays: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
  until: (d) => `hasta el ${d.getDate()} de ${es.months[d.getMonth()]}`,
  since: (d) => `desde el ${d.getDate()} de ${es.months[d.getMonth()]}`,
};

// Catalán: «l'1» y «l'11» llevan apóstrofo; «d'abril», «d'agost», «d'octubre»
const caMonth = (d) => {
  const m = ca.months[d.getMonth()];
  return /^[aeiou]/.test(m) ? `d'${m}` : `de ${m}`;
};
const caApos = (d) => d.getDate() === 1 || d.getDate() === 11;
const ca = {
  months: ['gener', 'febrer', 'març', 'abril', 'maig', 'juny', 'juliol', 'agost', 'setembre', 'octubre', 'novembre', 'desembre'],
  weekdays: ['diumenge', 'dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte'],
  until: (d) => `fins ${caApos(d) ? "a l'" : 'al '}${d.getDate()} ${caMonth(d)}`,
  since: (d) => `des ${caApos(d) ? "de l'" : 'del '}${d.getDate()} ${caMonth(d)}`,
};

// Euskera: «ekainaren 12ra arte», «ekainaren 13tik aurrera».
// Los números que se leen acabados en consonante (bat, bost, hamar) llevan -e-: 1era, 5etik, 10era.
const euCons = (n) => n === 1 || n === 21 || n % 10 === 5 || n === 10 || n === 30;
const euGen = ['urtarrilaren', 'otsailaren', 'martxoaren', 'apirilaren', 'maiatzaren', 'ekainaren', 'uztailaren', 'abuztuaren', 'irailaren', 'urriaren', 'azaroaren', 'abenduaren'];
const eu = {
  months: ['urtarrila', 'otsaila', 'martxoa', 'apirila', 'maiatza', 'ekaina', 'uztaila', 'abuztua', 'iraila', 'urria', 'azaroa', 'abendua'],
  weekdays: ['igandea', 'astelehena', 'asteartea', 'asteazkena', 'osteguna', 'ostirala', 'larunbata'],
  until: (d) => `${euGen[d.getMonth()]} ${d.getDate()}${euCons(d.getDate()) ? 'era' : 'ra'} arte`,
  since: (d) => `${euGen[d.getMonth()]} ${d.getDate()}${euCons(d.getDate()) ? 'etik' : 'tik'} aurrera`,
};

const gl = {
  months: ['xaneiro', 'febreiro', 'marzo', 'abril', 'maio', 'xuño', 'xullo', 'agosto', 'setembro', 'outubro', 'novembro', 'decembro'],
  weekdays: ['domingo', 'luns', 'martes', 'mércores', 'xoves', 'venres', 'sábado'],
  until: (d) => `ata o ${d.getDate()} de ${gl.months[d.getMonth()]}`,
  since: (d) => `desde o ${d.getDate()} de ${gl.months[d.getMonth()]}`,
};

export const DATES = { es, ca, eu, gl };
