const { app, BrowserWindow, Menu } = require('electron');
const http = require('http');
const fs = require('fs');
const path = require('path');

const WEB_DIR = path.join(__dirname, 'web');
const PORT = 49234;

// Servidor HTTP local para servir el export estático de Next.js
// (necesario porque los paths absolutos /_next/... no funcionan con file://)
function startLocalServer() {
  const MIME = {
    '.html': 'text/html',
    '.js':   'application/javascript',
    '.css':  'text/css',
    '.json': 'application/json',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff':  'font/woff',
    '.ttf':   'font/ttf',
  };

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];

    // Intenta el path exacto, luego /index.html para rutas de Next.js
    const candidates = [
      path.join(WEB_DIR, urlPath),
      path.join(WEB_DIR, urlPath, 'index.html'),
      path.join(WEB_DIR, '404.html'),
    ];

    for (const filePath of candidates) {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        fs.createReadStream(filePath).pipe(res);
        return;
      }
    }

    res.writeHead(404);
    res.end('Not found');
  });

  server.listen(PORT, '127.0.0.1');
  return server;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0d1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    title: 'GoldTrader',
  });

  win.loadURL(`http://127.0.0.1:${PORT}/`);

  const menu = Menu.buildFromTemplate([
    {
      label: 'GoldTrader',
      submenu: [
        { role: 'about', label: 'About GoldTrader' },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'File',
      submenu: [{ role: 'close' }],
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
}

let localServer;

app.whenReady().then(() => {
  localServer = startLocalServer();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  localServer?.close();
  if (process.platform !== 'darwin') app.quit();
});
