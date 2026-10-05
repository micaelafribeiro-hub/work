// Run: node portfolio/previews/venus-depth/server.mjs
// Standalone preview only; does not replace any portfolio artwork.
import http from 'node:http';
import { createReadStream } from 'node:fs';

const routes = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/layers/background.webp', ['layers/background.webp', 'image/webp']],
  ['/layers/side-figures.webp', ['layers/side-figures.webp', 'image/webp']],
  ['/layers/venus-shell.webp', ['layers/venus-shell.webp', 'image/webp']]
]);

const server = http.createServer((request, response) => {
  const route = routes.get(new URL(request.url, 'http://127.0.0.1').pathname);
  if (!route) { response.writeHead(404).end(); return; }
  response.setHeader('Content-Type', route[1]);
  response.setHeader('Cache-Control', 'no-cache');
  const stream = createReadStream(new URL(route[0], import.meta.url));
  stream.on('error', () => { response.writeHead(500).end(); });
  stream.pipe(response);
});

const port = Number(process.env.PORT) || 5188;
server.listen(port, '127.0.0.1', () => console.log(`Venus depth preview: http://127.0.0.1:${port}/`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
