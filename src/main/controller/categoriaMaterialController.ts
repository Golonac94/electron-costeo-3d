import * as CategoriaMaterial from '../services/categoriaMaterialService';

export async function obtenerCategoriasMaterial() {
  return await CategoriaMaterial.obtenerCategoriasMaterial();
  // Devuelve: Array<CategoriaMaterial>
}

export async function crearCategoriaMaterial(nombre: string) {
  return await CategoriaMaterial.crearCategoriaMaterial(nombre);
  // Devuelve: CategoriaMaterial
}

export async function actualizarCategoriaMaterial(id: number, nombre: string) {
  return await CategoriaMaterial.actualizarCategoriaMaterial(id, nombre);
  // No devuelve nada
}   

export async function eliminarCategoriaMaterial(id: number) {
  return await CategoriaMaterial.eliminarCategoriaMaterial(id);
  // No devuelve nada
}
