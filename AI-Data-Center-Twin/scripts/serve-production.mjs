import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { pipeline } from 'node:stream/promises';
import { constants, createBrotliCompress, createGzip } from 'node:zlib';

const host = '127.0.0.1';
const port = Number(process.env.PORT || 5173);
const distRoot = resolve(process.cwd(), 'dist');

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
};

const compressible = new Set(['.css', '.html', '.js', '.json', '.svg']);

async function resolveFile(pathname) {
  const normalizedPath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(distRoot, normalizedPath === '/' ? 'index.html' : normalizedPath);

  if (!filePath.startsWith(distRoot)) return null;

  try {
    const fileStats = await stat(filePath);
    if (fileStats.isDirectory()) filePath = join(filePath, 'index.html');
    await stat(filePath);
    return filePath;
  } catch {
    return join(distRoot, 'index.html');
  }
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || '/', `http://${host}:${port}`);
    const filePath = await resolveFile(requestUrl.pathname);

    if (!filePath) {
      response.writeHead(403).end('Forbidden');
      return;
    }

    const extension = extname(filePath).toLowerCase();
    const isAsset = filePath.includes(`${join(distRoot, 'assets')}`);
    const acceptEncoding = request.headers['accept-encoding'] || '';

    response.setHeader('Content-Type', mimeTypes[extension] || 'application/octet-stream');
    response.setHeader('Cache-Control', isAsset ? 'public, max-age=31536000, immutable' : 'no-cache');
    response.setHeader('Vary', 'Accept-Encoding');
    response.setHeader('X-Content-Type-Options', 'nosniff');

    if (request.method === 'HEAD') {
      response.writeHead(200).end();
      return;
    }

    if (compressible.has(extension) && acceptEncoding.includes('br')) {
      response.setHeader('Content-Encoding', 'br');
      response.writeHead(200);
      await pipeline(
        createReadStream(filePath),
        createBrotliCompress({
          params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
        }),
        response
      );
    } else if (compressible.has(extension) && acceptEncoding.includes('gzip')) {
      response.setHeader('Content-Encoding', 'gzip');
      response.writeHead(200);
      await pipeline(createReadStream(filePath), createGzip({ level: 6 }), response);
    } else {
      response.writeHead(200);
      await pipeline(createReadStream(filePath), response);
    }
  } catch (error) {
    if (!response.headersSent) response.writeHead(500);
    response.end('Unable to serve the production build.');
    console.error(error);
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Stop the Vite dev server, then run npm start again.`);
  } else {
    console.error(error);
  }
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Production build ready at http://localhost:${port}`);
  console.log('Run Lighthouse against this URL, not the Vite development server.');
});
