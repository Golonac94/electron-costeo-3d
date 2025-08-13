import { app, BrowserWindow } from "electron";
import path from "path";
import { initDatabase } from "./main/database/initDb";

// 👇 importa TODOS los handlers (side effect)

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
  return win;
}

app.whenReady().then(async () => {
  console.log("App is ready");
  await initDatabase();  // crea tablas + seed
  console.log("Database initialized");
await import("./main/ipc");  // <-- este es src/main/ipc/index.ts
console.log("IPC handlers registered");
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
