import { getDb } from '../db';

export interface Unidad {
  id: string;       // Ej: 'gr', 'min', 'cm2', etc.
  nombre: string;   // Ej: 'Gramos'
  tipo: string;     // Ej: 'masa'
}

// Obtener todas las unidades
export async function obtenerUnidades(): Promise<Unidad[]> {
  const db = await getDb();
  return db.all<Unidad[]>(`SELECT id, nombre, tipo FROM unidades ORDER BY nombre`);
}

export async function obtenerUnidadPorId(id: string): Promise<Unidad> {
  const db = await getDb();
  return db.all<Unidad>(`SELECT id, nombre, tipo FROM unidades where id = ?`, [id]);
}


// Crear una nueva unidad

export async function crearUnidad(unidad: Unidad): Promise<void> {
  const db = await getDb();
  await db.run(
    `INSERT INTO unidades (id, nombre, tipo) VALUES (?, ?, ?)`,
    [unidad.id, unidad.nombre, unidad.tipo]
  );
}

// Actualizar una unidad existente (solo nombre y tipo, no el ID)
export async function actualizarUnidad(unidad: Unidad): Promise<void> {
  const db = await getDb();
  await db.run(
    `UPDATE unidades SET nombre = ?, tipo = ? WHERE id = ?`,
    [unidad.nombre, unidad.tipo, unidad.id]
  );
}

// Eliminar una unidad por ID
export async function eliminarUnidad(id: string): Promise<void> {
  const db = await getDb();
  await db.run(`DELETE FROM unidades WHERE id = ?`, [id]);
}
