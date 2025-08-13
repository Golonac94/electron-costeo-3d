import { getDb } from '../db';
import { generarIdSecuencial } from '../helpers/idGenerator.js';

export interface CatalogoCosto {
  id: string;               // Ej: ENE_0001, MAN_0001, SUM_LIJA_0001
  nombre: string;
  categoria_id: number;
  unidad_id: string;        // semántica del ítem (kwh, h, gr, flat)
  costo_unitario: number;   // monto base del ítem (la BOM define driver/normalizador)
}

// ===== Queries =====

// Lista completa (orden por nombre)
export async function obtenerCatalogoCostos(): Promise<CatalogoCosto[]> {
  const db = await getDb();
  return db.all<CatalogoCosto[]>(
    `SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     ORDER BY nombre`
  );
}

export async function obtenerEnergia(): Promise<CatalogoCosto | null> {
  const db = await getDb();
  const result = await db.get<CatalogoCosto>(
    `SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos A WHERE  A.id = 'ENE_0001'`
  );
  return result || null;
}


// Una fila por ID (null si no existe)
export async function obtenerCatalogoCostoPorId(id: string): Promise<CatalogoCosto | null> {
  const db = await getDb();
  const row = await db.get<CatalogoCosto>(
    `SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     WHERE id = ?`,
    [id]
  );
  return row ?? null;
}

// Por categoría
export async function obtenerCostosPorCategoria(idCat: number): Promise<CatalogoCosto[]> {
  const db = await getDb();
  return db.all<CatalogoCosto[]>(
    `SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     WHERE categoria_id = ?
     ORDER BY nombre`,
    [idCat]
  );
}


// (Opcional) Por varios IDs
export async function obtenerCatalogoCostosPorIds(ids: string[]): Promise<CatalogoCosto[]> {
  if (!ids.length) return [];
  const db = await getDb();
  const placeholders = ids.map(() => '?').join(',');
  return db.all<CatalogoCosto[]>(
    `SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     WHERE id IN (${placeholders})`,
    ids
  );
}

// ===== Mutaciones =====

// Crear nuevo ítem del catálogo
export async function crearCatalogoCosto(data: Omit<CatalogoCosto, 'id'>): Promise<string> {
  const db = await getDb();

  // Validaciones mínimas
  const categoria = await db.get<{ nombre: string }>(
    `SELECT nombre FROM categorias_material WHERE id = ?`,
    [data.categoria_id]
  );
  if (!categoria) throw new Error('Categoría no encontrada');

  const unidad = await db.get<{ id: string }>(
    `SELECT id FROM unidades WHERE id = ?`,
    [data.unidad_id]
  );
  if (!unidad) throw new Error('Unidad no encontrada');

  // ID con prefijo derivado de la categoría (p.ej., 'ENE', 'MAN', 'SUM')
  const prefijo = categoria.nombre.slice(0, 3).toUpperCase();
  const idGenerado = await generarIdSecuencial('catalogo_costos', 'id', prefijo);

  await db.run(
    `INSERT INTO catalogo_costos (id, nombre, categoria_id, unidad_id, costo_unitario)
     VALUES (?, ?, ?, ?, ?)`,
    [idGenerado, data.nombre, data.categoria_id, data.unidad_id, data.costo_unitario]
  );

  return idGenerado;
}

// Actualizar ítem completo
export async function actualizarCatalogoCosto(id: string, data: Omit<CatalogoCosto, 'id'>): Promise<void> {
  const db = await getDb();

  // (Opcional) validar existencia de unidad/categoría si permites cambiarlas
  const categoria = await db.get(`SELECT 1 FROM categorias_material WHERE id = ?`, [data.categoria_id]);
  if (!categoria) throw new Error('Categoría no encontrada');

  const unidad = await db.get(`SELECT 1 FROM unidades WHERE id = ?`, [data.unidad_id]);
  if (!unidad) throw new Error('Unidad no encontrada');

  await db.run(
    `UPDATE catalogo_costos
     SET nombre = ?, categoria_id = ?, unidad_id = ?, costo_unitario = ?
     WHERE id = ?`,
    [data.nombre, data.categoria_id, data.unidad_id, data.costo_unitario, id]
  );
}

// Actualizar solo el costo
export async function actualizarSoloCostoUnitario(id: string, nuevoCosto: number): Promise<void> {
  const db = await getDb();
  await db.run(
    `UPDATE catalogo_costos
     SET costo_unitario = ?
     WHERE id = ?`,
    [nuevoCosto, id]
  );
}

// Eliminar
export async function eliminarCatalogoCosto(id: string): Promise<void> {
  const db = await getDb();
  await db.run(`DELETE FROM catalogo_costos WHERE id = ?`, [id]);
}
