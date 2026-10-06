const { app, BrowserWindow, nativeImage } = require("electron");
const path = require("path");
const fs = require("fs");

const root = app.isPackaged ? path.join(process.resourcesPath, "app") : path.join(__dirname, "..");
const icon = path.join(root, "icon", "icon.png");

function createWindow() {
  const win = new BrowserWindow({
    width: 1180,
    height: 820,
    title: "Mis Gastos 💖",
    backgroundColor: "#fff0f6",
    titleBarStyle: "hiddenInset",
    icon,
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  win.loadFile(path.join(root, "index.html"));
}

app.whenReady().then(() => {
  if (process.platform === "darwin" && fs.existsSync(icon)) app.dock.setIcon(nativeImage.createFromPath(icon));
  createWindow();
  app.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow());
});
app.on("window-all-closed", () => process.platform !== "darwin" && app.quit());
