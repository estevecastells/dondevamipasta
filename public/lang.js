// Elige el idioma antes de pintar la página (script normal en el <head>, no módulo).
// Orden: la dirección (/ca, /eu, /gl, /es), lo que la persona eligió en el selector
// (se guarda en su navegador) y el idioma del navegador. Si no hay ninguno, castellano.
//
// /ca, /eu, /gl y /es ya vienen traducidas (tools/build-langs.mjs). En la portada (/),
// si toca otro idioma, se traduce aquí mismo y la dirección pasa a /ca, /eu o /gl.
(function () {
  var SUPPORTED = ['es', 'ca', 'eu', 'gl'];
  var ok = function (l) { return SUPPORTED.indexOf(l) >= 0; };
  var root = document.documentElement;
  var pageLang = root.lang; // idioma en que viene escrita esta página
  var lang = null;

  var path = location.pathname.match(/^\/(es|ca|eu|gl)\/?$/);
  if (path) lang = path[1];

  // Enlaces antiguos con ?lang=ca
  var query = null;
  try {
    query = new URLSearchParams(location.search).get('lang');
    if (!lang && ok(query)) lang = query;
  } catch (e) {}

  if (!lang) {
    try {
      var saved = localStorage.getItem('lang');
      if (ok(saved)) lang = saved;
    } catch (e) {}
  }

  if (!lang) {
    // El primero de la lista del navegador que tengamos: «ca-ES», «ca-ES-valencia», «eu», «gl-ES»…
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'es'];
    for (var i = 0; i < list.length && !lang; i++) {
      var base = String(list[i]).toLowerCase().split('-')[0];
      if (ok(base)) lang = base;
    }
  }

  lang = lang || 'es';
  root.lang = lang;

  // La dirección refleja el idioma: / → /ca (el castellano se queda en /, salvo que venga de ?lang=es)
  if (!path && (lang !== 'es' || query === 'es') && window.history && history.replaceState) {
    try { history.replaceState(null, '', '/' + lang + location.hash); } catch (e) {}
  }

  if (lang !== pageLang) {
    // La página viene en otro idioma: se oculta hasta que app.js la traduce (máximo 3 segundos)
    root.classList.add('i18n-wait');
    setTimeout(function () { root.classList.remove('i18n-wait'); }, 3000);
  }
  if (lang !== 'es') {
    // Que el archivo del idioma empiece a bajar ya, en paralelo con app.js
    var link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = '/i18n/' + lang + '.js';
    document.head.appendChild(link);
  }
})();
