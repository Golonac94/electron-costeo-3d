"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/main/main.ts
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const initDb_1 = require("./main/database/initDb");
// Controllers (como ya los tienes)
const MaterialesController = __importStar(require("./main/controller/materialesController.js"));
const TecnologiasController = __importStar(require("./main/controller/tecnologiasController.js"));
const ProcesosController = __importStar(require("./main/controller/procesosController.js"));
const CalculoCostoController = __importStar(require("./main/controller/calculoCostoController.js"));
const UnidadesController = __importStar(require("./main/controller/unidadesController.js"));
function registrarIpc() {
    // Tecnologías
    electron_1.ipcMain.handle('tec:list', () => TecnologiasController.listar());
    // Materiales por tecnología
    electron_1.ipcMain.handle('mat:listByTec', (_e, tecId) => MaterialesController.listarPorTecnologia(tecId));
    // Procesos (sin filtro por tecnología)
    electron_1.ipcMain.handle('proc:list', () => ProcesosController.listarProcesos());
    // Unidades CRUD
    electron_1.ipcMain.handle('unid:list', () => UnidadesController.obtenerUnidades());
    electron_1.ipcMain.handle('unid:create', (_e, nombre, tipo) => UnidadesController.crearUnidad(nombre, tipo));
    electron_1.ipcMain.handle('unid:update', (_e, data) => UnidadesController.actualizarUnidad(data));
    electron_1.ipcMain.handle('unid:delete', (_e, id) => UnidadesController.eliminarUnidad(id));
    // Cálculo costeo
    electron_1.ipcMain.handle('costeo:calc', (_e, payload) => CalculoCostoController.calcularCosto(payload));
}
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    }
    else {
        win.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    return win;
}
electron_1.app.whenReady().then(async () => {
    await (0, initDb_1.initDatabase)(); // 👈 crea tablas + seed
    registrarIpc();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        electron_1.app.quit();
});
