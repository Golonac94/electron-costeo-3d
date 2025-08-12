import { getDb } from '../db';

export interface CategoriaMaterial {
  id: number;
  nombre: string;
}

// Obtener todas las categorías
export async function obtenerCategoriasMaterial(): Promise<CategoriaMaterial[]> {
  const db = await getDb();
  return db.all<CategoriaMaterial[]>(`SELECT id, nombre FROM categorias_material ORDER BY nombre`);
}

// Obtener todas las categorías
export async function obtenerCategoriaPorId(id: number): Promise<CategoriaMaterial> {
  const db = await getDb();
  return db.all<CategoriaMaterial>(`SELECT id, nombre FROM categorias_material WHERE ID = ?`, [id]);
}

export async function obtenerCategoriaPorNombre(
  nombre: string
): Promise<CategoriaMaterial | null> {
  const db = await getDb();
  const row = await db.get<CategoriaMaterial>(
    `SELECT id, nombre
     FROM categorias_material
     WHERE TRIM(nombre) = TRIM(?) COLLATE NOCASE
     LIMIT 1`,
    [nombre]
  );
  return row ?? null;
}


// Crear una nueva categoría
export async function crearCategoriaMaterial(nombre: string): Promise<void> {
  const db = await getDb();
  await db.run(`INSERT INTO categorias_material (nombre) VALUES (?)`, [nombre]);
}

// Actualizar una categoría por ID
export async function actualizarCategoriaMaterial(id: number, nuevoNombre: string): Promise<void> {
  const db = await getDb();
  await db.run(`UPDATE categorias_material SET nombre = ? WHERE id = ?`, [nuevoNombre, id]);
}

// Eliminar una categoría por ID
export async function eliminarCategoriaMaterial(id: number): Promise<void> {
  const db = await getDb();
  await db.run(`DELETE FROM categorias_material WHERE id = ?`, [id]);
}
