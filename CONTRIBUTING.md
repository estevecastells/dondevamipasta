# Cómo contribuir

Si ves una cifra mal, una fuente caída o una traducción rara, arreglarlo cuesta poco y hace que la web sea más fiable para todos. No hace falta saber programar.

## Sin programar: avisa de un dato

Abre un [aviso nuevo](https://github.com/estevecastells/dondevamipasta/issues/new/choose) con la plantilla «Un dato está mal». Te pide qué pone la web, qué debería poner y el enlace a la fuente que lo dice. Sin fuente no podemos cambiar una cifra.

Si la web se ve mal o no calcula, usa la plantilla «Algo no funciona» y di en qué navegador y dispositivo te pasa.

## Programando: propón el cambio

Nadie puede subir cambios directamente a este repositorio salvo quien lo mantiene, pero cualquiera puede proponerlos:

1. Haz un *fork* (botón **Fork**, arriba a la derecha) y clónalo.
2. Crea una rama: `git switch -c corrige-casa-real`.
3. Haz el cambio y mira cómo queda: `npm run dev` y abre http://localhost:5178.
4. Pasa los tests: `npm test`.
5. Sube tu rama y abre un *pull request* contra `main`. GitHub pasará los tests solo. Si salen en verde y el cambio está bien explicado, se fusiona.

Solo necesitas Node 22 o posterior y Python 3. No hay `npm install`: el proyecto no tiene dependencias.

## Las reglas de los datos

- **Cada cifra lleva su fuente, con enlace.** Mejor la oficial (BOE, Eurostat, INE, IGAE, AIReF, Hacienda, ministerios) que una noticia. La prensa vale cuando recoge un dato oficial que no está publicado de otra forma.
- **Si cambias una cifra, cambia también los textos que la mencionan, en los cuatro idiomas.** Los tests comprueban que la cifra de `data.js` y la del texto coinciden.
- **Las estimaciones se marcan como estimaciones** (`estimate: true`) y se dice quién las hace.
- **El mismo criterio para todos los partidos.** Los sellos (`cuadra`, `medias`, `sinprecio`, `lechera`) se ponen con las reglas de `PROMISES.verdicts`. Si propones cambiar un sello, explica qué regla se cumple o no y con qué dato.
- **Sin opiniones ni adjetivos.** La web cuenta lo que dicen los datos y cada uno saca sus conclusiones.
- **Si llega un año nuevo de Eurostat**, cambia `SPENDING_YEAR`, `SPENDING_TOTAL` y todas las líneas a la vez. Los tests comprueban que las líneas suman el total.

## Las reglas del código

- Sin dependencias, sin *frameworks* y sin compilar: HTML, CSS y JavaScript que el navegador entiende tal cual.
- Sin rastreo, cookies ni analítica de terceros. El sueldo nunca sale del navegador.
- La política de seguridad (`public/_headers`) no deja poner scripts ni estilos dentro del HTML: van en `app.js` y `styles.css`.
- Los textos en castellano están en `index.html`, `data.js` e `i18n/es.js`, y las traducciones en `i18n/ca.js`, `eu.js` y `gl.js`, con las mismas claves. Si añades un texto y no sabes traducirlo, dilo en el *pull request* y lo completamos.
- Las páginas `/es`, `/ca`, `/eu` y `/gl` se generan solas a partir de `index.html` y no están en el repositorio. No hace falta crearlas.
- Si cambias el diseño, regenera las capturas del README: `node tools/make-screenshots.mjs` (necesita Chrome).

## Qué comprueban los tests

`npm test` tarda menos de un segundo y no necesita conexión. Comprueba:

- que las líneas del ticket suman el gasto total y ningún código COFOG se cuenta dos veces;
- que cada partida y cada oferta tiene una fuente con un enlace válido;
- que las cifras de los textos coinciden con las de los datos, en los cuatro idiomas;
- que los sellos y los partidos de cada oferta existen;
- que el IRPF y las cotizaciones dan los valores oficiales: 590,89 € de cuota con el SMI de 2026 y 4.495 € de IRPF foral con 30.000 € brutos;
- que las traducciones tienen todos los textos y las páginas de cada idioma se generan.

`npm run links` comprueba además que los enlaces a las fuentes siguen vivos. Necesita conexión y tarda un poco. GitHub lo pasa solo cada lunes.

## Por dónde empezar

- La escala autonómica del IRPF de cada comunidad. Ahora se usa la supletoria, igual a la estatal.
- El IRPF foral de Navarra.
- La subida de las pensiones de 2027 (`IPC_2027` en `data.js`), en cuanto el INE publique el IPC de noviembre, el 15 de diciembre.

## Convivencia

Aquí se discute de datos y de fuentes, no de partidos. Trata a los demás con respeto, también cuando no estés de acuerdo. Los comentarios ofensivos se borran.

## Publicar

La web se publica a mano desde `main` con `npx wrangler deploy`. Fusionar un *pull request* no la publica.
