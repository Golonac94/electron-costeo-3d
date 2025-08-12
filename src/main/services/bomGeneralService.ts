// src/main/services/bomGeneralService.ts
import * as bomGeneralModel from '../database/model/bomGeneralModel.js';
import { BomGeneral } from '../database/model/bomGeneralModel.js';

// Obtener todos los registros
export async function listarBomGeneral(): Promise<BomGeneral[]> {
  return bomGeneralModel.obtenerBomGeneral();
}

// Crear nuevo registro
export async function registrarBomGeneral(data: Omit<BomGeneral, 'id'>): Promise<number> {
  return bomGeneralModel.crearBomGeneral(data);
}

// Actualizar
export async function editarBomGeneral(data: BomGeneral): Promise<void> {
  await bomGeneralModel.actualizarBomGeneral(data);
}

// Eliminar
export async function borrarBomGeneral(id: number): Promise<void> {
  await bomGeneralModel.eliminarBomGeneral(id);
}
