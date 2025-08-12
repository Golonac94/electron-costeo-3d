// src/main/services/catalogoCostosService.ts
import * as catalogoCostosModel from '../database/model/catalogoCostosModel.js';
import * as categoriasMaterialModel from '../database/model/categoriasMaterialModel.js';
import { CatalogoCosto } from '../database/model/catalogoCostosModel.js';

// Obtener todos los costos del catálogo
export async function obtenerCatalogoCostos(): Promise<CatalogoCosto[]> {
  return await catalogoCostosModel.obtenerCatalogoCostos();
}

// Crear un nuevo costo en el catálogo (prohibido si es categoría "Energía")
export async function crearCatalogoCosto(data: Omit<CatalogoCosto, 'id'>): Promise<string> {
  const categoria = await categoriasMaterialModel.obtenerCategoriaPorId(data.categoria_id);
  if (categoria?.nombre.toLowerCase() === 'energía' || categoria?.nombre.toLowerCase() === 'energia') {
    throw new Error('❌ No se pueden crear nuevos registros de tipo Energía.');
  }
  return await catalogoCostosModel.crearCatalogoCosto(data);
}

// Actualizar un costo existente (solo se puede modificar el valor si es energía)
export async function actualizarCatalogoCosto(data: CatalogoCosto): Promise<void> {
  const existente = await catalogoCostosModel.obtenerCatalogoCostoPorId(data.id);
  if (!existente) throw new Error('❌ Costo no encontrado.');

  const categoria = await categoriasMaterialModel.obtenerCategoriaPorId(existente.categoria_id);
  const esEnergia = categoria?.nombre.toLowerCase() === 'energía' || categoria?.nombre.toLowerCase() === 'energia';

  if (esEnergia) {
    // Solo permitir actualizar el costo_unitario
    await catalogoCostosModel.actualizarSoloCostoUnitario(data.id, data.costo_unitario);
  } else {
    await catalogoCostosModel.actualizarCatalogoCosto(data);
  }
}

// Eliminar un costo del catálogo (prohibido si es Energía)
export async function eliminarCatalogoCosto(id: string): Promise<void> {
  const existente = await catalogoCostosModel.obtenerCatalogoCostoPorId(id);
  if (!existente) throw new Error('❌ Costo no encontrado.');

  const categoria = await categoriasMaterialModel.obtenerCategoriaPorId(existente.categoria_id);
  if (categoria?.nombre.toLowerCase() === 'energía' || categoria?.nombre.toLowerCase() === 'energia') {
    throw new Error('❌ No se puede eliminar un costo de tipo Energía.');
  }

  await catalogoCostosModel.eliminarCatalogoCosto(id);
}
