import * as TecnologiaModel from '../database/model/tecnologiasImpresionModel';

export async function obtenerTecnologias() {
  return TecnologiaModel.obtenerTecnologias();
}

export async function crearTecnologia(nombre: string) {
  return TecnologiaModel.crearTecnologia(nombre);
}

export async function actualizarTecnologia(id: number, nombre: string) {
  return TecnologiaModel.actualizarTecnologia(id, nombre);
}

export async function eliminarTecnologia(id: number) {
  return TecnologiaModel.eliminarTecnologia(id);
}