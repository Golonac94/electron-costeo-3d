import { getDb } from '../db';

/**
 * Genera un nuevo ID secuencial del tipo: PREFIJO_0001
 * contando registros existentes en el campo deseado de una tabla.
 */
export async function generarIdSecuencial(
  tabla: string,
  campo: string,
  prefijo: string
): Promise<string> {
  const db = await getDb();

  const result = await db.get<{ count: number }>(
    `SELECT COUNT(${campo}) as count FROM ${tabla} where ${campo} LIKE ?`,
    [`${prefijo}_%`]
  );

  const count = result?.count ?? 0;
  const nuevoNumero = count + 1;

  return `${prefijo}_${nuevoNumero.toString().padStart(4, '0')}`;
}
