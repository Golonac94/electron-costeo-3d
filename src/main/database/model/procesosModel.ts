import { getDb } from '../db';

export interface Proceso {
  id: number;
  nombre: string;
}

// Obtener todos los procesos
export async function obtenerProcesos(): Promise<Proceso[]> {
  const db = await getDb();
  return db.all<Proceso[]>(
    `SELECT id, nombre FROM procesos ORDER BY id`
  );
}

export async function obtenerProcesoPorId(id: number): Promise<Proceso> {
  const db = await getDb();
  return db.all<Proceso>(
    `SELECT id, nombre FROM procesos where id = ?`, [id]
  );
}
 
export async function obtenerProcesosPorIds(ids: number[]): Promise<Proceso[]> {
  if (!ids.length) return [];
  const db = await getDb();
  const placeholders = ids.map(() => '?').join(',');
  return db.all<Proceso[]>(
    `SELECT id, nombre FROM procesos WHERE id IN (${placeholders})`,
    ids
  );
}

// Crear un nuevo proceso
export async function crearProceso(nombre: string): Promise<number> {
  const db = await getDb();

  const result = await db.run(
    `INSERT INTO procesos (nombre) VALUES (?)`,
    [nombre]
  );

  return result.lastID as number;
}

// Actualizar el nombre de un proceso
export async function actualizarProceso(id: number, nombre: string): Promise<void> {
  const db = await getDb();
  await db.run(
    `UPDATE procesos SET nombre = ? WHERE id = ?`,
    [nombre, id]
  );
}

// Eliminar un proceso
export async function eliminarProceso(id: number): Promise<void> {
  const db = await getDb();
  await db.run(
    `DELETE FROM procesos WHERE id = ?`,
    [id]
  );
}
