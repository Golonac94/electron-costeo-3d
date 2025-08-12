import { getDb } from '../db';

export interface TecnologiaImpresion {
  id: number;
  nombre: string;
}

// Obtener todas las tecnologías de impresión
export async function obtenerTecnologias(): Promise<TecnologiaImpresion[]> {
  const db = await getDb();
  return db.all<TecnologiaImpresion[]>(
    `SELECT id, nombre FROM tecnologias_impresion ORDER BY nombre`
  );
}

export async function obtenerTecnologiaPorId(id: number): Promise<TecnologiaImpresion | null> {
  const db = await getDb();
  const result = await db.get<TecnologiaImpresion>(
    `SELECT id, nombre FROM tecnologias_impresion WHERE id = ?`, [id]
  );
  return result || null;
}

// Crear una nueva tecnología de impresión
export async function crearTecnologia(nombre: string): Promise<number> {
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO tecnologias_impresion (nombre) VALUES (?)`,
    [nombre]
  );
  return result.lastID!;
}

// Actualizar el nombre de una tecnología
export async function actualizarTecnologia(id: number, nombre: string): Promise<void> {
  const db = await getDb();
  await db.run(
    `UPDATE tecnologias_impresion SET nombre = ? WHERE id = ?`,
    [nombre, id]
  );
}

// Eliminar una tecnología
export async function eliminarTecnologia(id: number): Promise<void> {
  const db = await getDb();
  await db.run(`DELETE FROM tecnologias_impresion WHERE id = ?`, [id]);
}
