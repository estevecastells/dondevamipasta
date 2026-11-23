# Servidor local sin caché: python3 tools/serve.py [puerto]
# (python3 -m http.server deja que el navegador guarde app.js y los cambios no se ven al recargar)
# Sirve /ca, /eu, /gl y /es como Cloudflare (ca.html…) y las regenera si cambia index.html o una traducción.
import http.server, functools, sys, os, re, subprocess

TOOLS = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(TOOLS, '..', 'public')
LANG_PAGE = re.compile(r'^/(es|ca|eu|gl)/?$')

def mtime(p):
    try: return os.path.getmtime(p)
    except OSError: return 0

def build_if_stale(lang):
    page = os.path.join(ROOT, lang + '.html')
    sources = [os.path.join(ROOT, 'index.html'), os.path.join(ROOT, 'i18n', lang + '.js'), os.path.join(ROOT, 'i18n', 'es.js')]
    if mtime(page) < max(mtime(s) for s in sources):
        subprocess.run(['node', os.path.join(TOOLS, 'build-langs.mjs')], check=False)

class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        path, _, query = self.path.partition('?')
        m = LANG_PAGE.match(path)
        if m:
            build_if_stale(m.group(1))
            self.path = '/' + m.group(1) + '.html' + ('?' + query if query else '')
        super().do_GET()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5178
http.server.ThreadingHTTPServer(('127.0.0.1', port), functools.partial(Handler, directory=ROOT)).serve_forever()
