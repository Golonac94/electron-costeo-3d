import * as CategoriaModel from '../database/model/categoriasMaterialModel';

export async function obtenerCategoriasMaterial() {
  return CategoriaModel.obtenerCategoriasMaterial();
}


export async function crearCategoriaMaterial(nombre: string) {
  return CategoriaModel.crearCategoriaMaterial(nombre);
}

export async function actualizarCategoriaMaterial(id: number, nombre: string) {
  return CategoriaModel.actualizarCategoriaMaterial(id, nombre);
}

export async function eliminarCategoriaMaterial(id: number) {
  return CategoriaModel.eliminarCategoriaMaterial(id);
}
