// src/main/services/materialesBaseService.ts
import * as materialesBaseModel from '../database/model/materialesBaseModel.js';
import { MaterialBase } from '../database/model/materialesBaseModel.js';

// Obtener todos los materiales base
export async function obtenerMaterialesBase(): Promise<MaterialBase[]> {
  return materialesBaseModel.obtenerMaterialesBase();
}

// Obtener todos los materiales base
export async function listarMaterialesPorTecnologia(id: number): Promise<MaterialBase[]> {
  return materialesBaseModel.obtenerMaterialesBaseporTecnologia(id);
}


// Crear nuevo material base
export async function crearMaterialBase(data: Omit<MaterialBase, 'id'>): Promise<string> {
  return materialesBaseModel.crearMaterialBase(data);
}

// Actualizar un material base
export async function actualizarMaterialBase(data: MaterialBase): Promise<void> {
  return materialesBaseModel.actualizarMaterialBase(data);
}

// Eliminar un material base
export async function eliminarMaterialBase(id: string): Promise<void> {
  return materialesBaseModel.eliminarMaterialBase(id);
}
