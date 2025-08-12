import * as unidadesService from '../services/unidadService.js';
import type { Unidad } from '../database/model/unidadesModel.js';

export async function obtenerUnidades(): Promise<Unidad[]> {
  return await unidadesService.obtenerUnidades();
}

export async function crearUnidad(nombre: string, tipo: string): Promise<void> {
  return await unidadesService.crearUnidad(nombre, tipo);
}

export async function actualizarUnidad(data: Unidad): Promise<void> {
  await unidadesService.actualizarUnidad(data);
}

export async function eliminarUnidad(id: string): Promise<void> {
  await unidadesService.eliminarUnidad(id);
}
