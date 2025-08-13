import * as materialService from '../services/catalogoCostosService'   ;
import type { CatalogoCosto } from '../database/model/catalogoCostosModel';

export async function obtenerCatalogoCostos() {
  return await materialService.obtenerCatalogoCostos();
  // Devuelve: Array<CatalogoCosto>
}

export async function crearCatalogoCosto(data: Omit<CatalogoCosto, 'id'>) {
  return await materialService.crearCatalogoCosto(data);
  // Devuelve: CatalogoCosto
}
export async function actualizarCatalogoCosto(id: string, data: Omit<CatalogoCosto, 'id'>) {
  await materialService.actualizarCatalogoCosto(id, data);
  // No devuelve nada
}

export async function eliminarCatalogoCosto(id: string) {
  await materialService.eliminarCatalogoCosto(id);
  // No devuelve nada
}
export async function obtenerCatalogoCostoPorId(id: string) {
  return await materialService.obtenerCatalogoCostos().then(costos => costos.find(c => c.id === id));
  // Devuelve: CatalogoCosto | undefined
}

export async function obtenerCategoriasMateriales() {
  return await materialService.obtenerCatalogoCostos().then(costos => {
    const categorias = new Set(costos.map(c => c.categoria_id));
    return Array.from(categorias);
  });
  // Devuelve: Array<string> con los IDs de las categorías
}

