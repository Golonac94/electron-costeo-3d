import { getDb } from '../db';

export type DriverId = 'h' | 'gr' | 'cm2' | 'kwh' | 'flat';

export interface BomGeneral {
  id: number;
  tecnologia_id: number;
  proceso_id: number;
  costo_id: string;
  factor_consumo: number;
  driver_id: DriverId;
  normalizador_cantidad: number | null;
  normalizador_unidad: string | null;
}

export interface BomGeneralCreate {
  tecnologia_id: number;
  proceso_id: number;
  costo_id: string;
  factor_consumo?: number;               // default 1.0
  driver_id: DriverId;                   // requerido
  normalizador_cantidad?: number | null; // vida útil/base
  normalizador_unidad?: string | null;   // informativo
}

// Obtener todos los registros de BOM general
export async function obtenerBomGeneral(): Promise<BomGeneral[]> {
  const db = await getDb();
  return db.all<BomGeneral[]>(
    `SELECT id, tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad
     FROM bom_general
     ORDER BY tecnologia_id, proceso_id, costo_id`
  );
}


export async function obtenerBomPorId(id: number): Promise<BomGeneral | null> {
  const db = await getDb();
  const row = await db.get<BomGeneral>(
    `SELECT id, tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad
     FROM bom_general
     WHERE id = ?`,
    [id]
  );
  return row ?? null;
}




export async function crearBomGeneral(data: BomGeneralCreate): Promise<number> {
  const db = await getDb();
  const res = await db.run(
    `INSERT INTO bom_general (tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.tecnologia_id,
      data.proceso_id,
      data.costo_id,
      data.factor_consumo ?? 1,
      data.driver_id,
      data.normalizador_cantidad ?? null,
      data.normalizador_unidad ?? null,
    ]
  );
  // @ts-ignore sqlite typings
  return res.lastID as number;
}

export async function actualizarBomGeneral(data: BomGeneral): Promise<void> {
  const db = await getDb();
  await db.run(
    `UPDATE bom_general
     SET tecnologia_id = ?, proceso_id = ?, costo_id = ?, factor_consumo = ?, driver_id = ?, normalizador_cantidad = ?, normalizador_unidad = ?
     WHERE id = ?`,
    [
      data.tecnologia_id,
      data.proceso_id,
      data.costo_id,
      data.factor_consumo,
      data.driver_id,
      data.normalizador_cantidad,
      data.normalizador_unidad,
      data.id,
    ]
  );
}

export async function eliminarBomGeneral(id: number): Promise<void> {
  const db = await getDb();
  await db.run(`DELETE FROM bom_general WHERE id = ?`, [id]);
}

// ===== Lectura JOIN para el servicio de cálculo =====
export interface BomJoinItem {
  proceso_id: number;
  costo_id: string;
  item_nombre: string;
  categoria_nombre: string;
  driver_id: DriverId;
  factor_consumo: number;
  normalizador_cantidad: number | null;
  normalizador_unidad: string | null;
  costo_unitario: number;  // del catálogo (monto global)
}

export async function obtenerBomJoinPorTecYProc(
  tecnologiaId: number,
  procesoId: number
): Promise<BomJoinItem[]> {
  const db = await getDb();
  return db.all<BomJoinItem[]>(
    `SELECT
       b.proceso_id,
       b.costo_id,
       c.nombre            AS item_nombre,
       cat.nombre          AS categoria_nombre,
       b.driver_id,
       b.factor_consumo,
       b.normalizador_cantidad,
       b.normalizador_unidad,
       c.costo_unitario
     FROM bom_general b
     JOIN catalogo_costos c       ON c.id = b.costo_id
     JOIN categorias_material cat ON cat.id = c.categoria_id
     WHERE b.tecnologia_id = ? AND b.proceso_id = ?
     ORDER BY c.id`,
    [tecnologiaId, procesoId]
  );
}
