// src/main/services/unidadesService.ts
import * as UnidadModel from '../database/model/unidadesModel.js';
import type { Unidad } from '../database/model/unidadesModel.js';
import { generarIdSecuencial } from '../database/helpers/idGenerator.js';

export async function obtenerUnidades() {
  return UnidadModel.obtenerUnidades();
}

export async function crearUnidad(nombre: string, tipo: string): Promise<void> {
  // 1) Validaciones básicas
  const nombreTrim = (nombre ?? '').trim();
  const tipoTrim = (tipo ?? '').trim();

  if (!nombreTrim || !tipoTrim) {
    throw new Error('El nombre y el tipo de la unidad son obligatorios.');
  }

  // 2) Validación de duplicados (nombre + tipo, case-insensitive)
  const existentes = await UnidadModel.obtenerUnidades();
  const yaExiste = existentes.some(
    u =>
      u.nombre.toLowerCase() === nombreTrim.toLowerCase() &&
      u.tipo.toLowerCase() === tipoTrim.toLowerCase()
  );
  if (yaExiste) {
    throw new Error(`Ya existe una unidad con nombre "${nombreTrim}" y tipo "${tipoTrim}".`);
  }

  // 3) Prefijo de 3 caracteres (relleno si hiciera falta)
  const prefijo = tipoTrim.substring(0, 3).toUpperCase().padEnd(3, '_');
  if (prefijo.length !== 3) {
    throw new Error('Error generando prefijo para la unidad.');
  }

  // 4) Generar ID y crear
  const idGenerado = await generarIdSecuencial('unidades', 'id', prefijo);

  const nuevaUnidad: Unidad = {
    id: idGenerado,
    nombre: nombreTrim,
    tipo: tipoTrim,
  };

  await UnidadModel.crearUnidad(nuevaUnidad);
}

export async function actualizarUnidad(data: Unidad): Promise<void> {
  const nombreTrim = (data.nombre ?? '').trim();
  const tipoTrim = (data.tipo ?? '').trim();
  if (!nombreTrim || !tipoTrim) {
    throw new Error('El nombre y el tipo de la unidad son obligatorios.');
  }
  await UnidadModel.actualizarUnidad({ ...data, nombre: nombreTrim, tipo: tipoTrim });
}

export async function eliminarUnidad(id: string): Promise<void> {
  await UnidadModel.eliminarUnidad(id);
}
