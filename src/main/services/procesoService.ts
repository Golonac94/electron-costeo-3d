import * as ProcesoModel from '../database/model/procesosModel';

export async function obtenerProcesos() {
  return ProcesoModel.obtenerProcesos();
}

export async function crearProceso(nombre: string) {
  return ProcesoModel.crearProceso(nombre);
}

export async function actualizarProceso(id: number, nombre: string) {
  return ProcesoModel.actualizarProceso(id, nombre);
}

export async function eliminarProceso(id: number) {
  return ProcesoModel.eliminarProceso(id);
}
