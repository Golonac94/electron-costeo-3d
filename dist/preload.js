"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/preload/index.ts
const electron_1 = require("electron");
console.log('[preload] exposing api');
electron_1.contextBridge.exposeInMainWorld('api', {
    // Tecnologías
    listTecnologias: () => electron_1.ipcRenderer.invoke('tec:list'),
    // Materiales
    listMaterialesByTecnologia: (tecId) => electron_1.ipcRenderer.invoke('mat:listByTec', tecId),
    // Procesos (NO por tecnología)
    listProcesos: () => electron_1.ipcRenderer.invoke('proc:list'),
    // Unidades
    listUnidades: () => electron_1.ipcRenderer.invoke('unid:list'),
    crearUnidad: (nombre, tipo) => electron_1.ipcRenderer.invoke('unid:create', nombre, tipo),
    actualizarUnidad: (data) => electron_1.ipcRenderer.invoke('unid:update', data),
    eliminarUnidad: (id) => electron_1.ipcRenderer.invoke('unid:delete', id),
    // Costeo
    calcularCosteo: (payload) => electron_1.ipcRenderer.invoke('costeo:calc', payload),
});
