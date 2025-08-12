import { getDb } from '../db';
import { generarIdSecuencial  } from '../helpers/idGenerator.js';

export interface MaterialBase {
  id: string;                   // Ej: RES_0001, PLA_0002
  tecnologia_id: number;
  nombre: string;
  costo_kg: number;
  consumo_energia_kwh: number;
}

// Obtener todos los materiales base
export async function obtenerMaterialesBase(): Promise<MaterialBase[]> {
  const db = await getDb();
  return db.all<MaterialBase[]>(
    `SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base
     ORDER BY nombre`
  );
}

export async function obtenerMaterialBasePorId(id: string): Promise<MaterialBase | null> {
  const db = await getDb();
  const result = await db.get<MaterialBase>(
    `SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base WHERE id = ?`, [id]
  );
  return result || null;
}



export async function obtenerMaterialesBaseporTecnologia(idTecImpresion: number): Promise<MaterialBase[]> {
  const db = await getDb();   
  return db.all<MaterialBase[]>(
    `SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base WHERE tecnologia_id = ? ORDER BY tecnologia_id`, [idTecImpresion]
  );  
}



export async function validarMaterialEnTecnologia
(idTecImpresion: number ,idMaterialBase: string ): Promise<MaterialBase | null> {
  const db = await getDb();
  const result = await db.get<MaterialBase>(
    `SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base WHERE id = ? and tecnologia_id= ?  `, [idMaterialBase, idTecImpresion]
  );
  return result || null;
}



// Crear un nuevo material base
export async function crearMaterialBase(data: Omit<MaterialBase, 'id'>): Promise<string> {
  const db = await getDb();

  // Obtener el nombre de la tecnología para usar como prefijo
  const tecnologia = await db.get<{ nombre: string }>(
    `SELECT nombre FROM tecnologias_impresion WHERE id = ?`,
    [data.tecnologia_id]
  );

  if (!tecnologia) throw new Error('Tecnología no encontrada');

  const prefijo = tecnologia.nombre.slice(0, 3).toUpperCase();
  const idBase = await generarIdSecuencial('materiales_base', 'id', prefijo);

  await db.run(
    `INSERT INTO materiales_base (id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh)
     VALUES (?, ?, ?, ?, ?)`,
    [idBase, data.tecnologia_id, data.nombre, data.costo_kg, data.consumo_energia_kwh]
  );

  return idBase;
}

// Actualizar un material base existente
export async function actualizarMaterialBase(data: MaterialBase): Promise<void> {
  const db = await getDb();
  await db.run(
    `UPDATE materiales_base
     SET tecnologia_id = ?, nombre = ?, costo_kg = ?, consumo_energia_kwh = ?
     WHERE id = ?`,
    [data.tecnologia_id, data.nombre, data.costo_kg, data.consumo_energia_kwh, data.id]
  );
}

// Eliminar un material base
export async function eliminarMaterialBase(id: string): Promise<void> {
  const db = await getDb();
  await db.run(`DELETE FROM materiales_base WHERE id = ?`, [id]);
}
