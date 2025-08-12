// src/main/main.ts
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { initDatabase } from './main/database/initDb';

// Controllers (como ya los tienes)
import * as MaterialesController from './main/controller/materialesController.js';
import * as TecnologiasController from './main/controller/tecnologiasController.js';
import * as ProcesosController from './main/controller/procesosController.js';
import * as CalculoCostoController from './main/controller/calculoCostoController.js';
import * as UnidadesController from './main/controller/unidadesController.js';

function registrarIpc() {
  // Tecnologías
  ipcMain.handle('tec:list', () => TecnologiasController.listar());

  // Materiales por tecnología
  ipcMain.handle('mat:listByTec', (_e, tecId: number | string) =>
    MaterialesController.listarPorTecnologia(tecId)
  );

  // Procesos (sin filtro por tecnología)
  ipcMain.handle('proc:list', () => ProcesosController.listarProcesos());

  // Unidades CRUD
  ipcMain.handle('unid:list', () => UnidadesController.obtenerUnidades());
  ipcMain.handle('unid:create', (_e, nombre: string, tipo: string) =>
    UnidadesController.crearUnidad(nombre, tipo)
  );
  ipcMain.handle('unid:update', (_e, data) => UnidadesController.actualizarUnidad(data));
  ipcMain.handle('unid:delete', (_e, id: string) => UnidadesController.eliminarUnidad(id));

  // Cálculo costeo
  ipcMain.handle('costeo:calc', (_e, payload) => CalculoCostoController.calcularCosto(payload));
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  return win;
}

app.whenReady().then(async () => {
  await initDatabase();     // 👈 crea tablas + seed
  registrarIpc();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
