import * as materialService from '../services/materialesBaseService.js';

export async function listarPorTecnologia(tecId: number | string) {
  return materialService.listarMaterialesPorTecnologia(Number(tecId));
  // Devuelve: Array<{ id: string; nombre: string; unidad: string }>
}

export async function obtenerTodosMaterialesBase() {
  return materialService.obtenerMaterialesBase();
  // Devuelve: Array<{ id: string; nombre: string; unidad: string }>
} 
