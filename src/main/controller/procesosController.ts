import * as procesoService from '../services/procesoService.js';

export async function listarProcesos() {
  return procesoService.obtenerProcesos();
  // Devuelve: Array<{ id: number; nombre: string }>
}