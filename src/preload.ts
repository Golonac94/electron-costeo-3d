// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron';

console.log('[preload] exposing api');

contextBridge.exposeInMainWorld('api', {
  // Tecnologías
  listTecnologias: () => ipcRenderer.invoke('tec:list'),

  // Materiales
  listMaterialesByTecnologia: (tecId: number | string) =>
    ipcRenderer.invoke('mat:listByTec', tecId),

  // Procesos (NO por tecnología)
  listProcesos: () => ipcRenderer.invoke('proc:list'),

  // Unidades
  listUnidades: () => ipcRenderer.invoke('unid:list'),
  crearUnidad: (nombre: string, tipo: string) => ipcRenderer.invoke('unid:create', nombre, tipo),
  actualizarUnidad: (data: any) => ipcRenderer.invoke('unid:update', data),
  eliminarUnidad: (id: string) => ipcRenderer.invoke('unid:delete', id),

  // Costeo
  calcularCosteo: (payload: any) => ipcRenderer.invoke('costeo:calc', payload),

  
});
