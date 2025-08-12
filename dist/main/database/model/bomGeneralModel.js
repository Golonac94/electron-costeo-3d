"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerBomGeneral = obtenerBomGeneral;
exports.obtenerBomPorId = obtenerBomPorId;
exports.crearBomGeneral = crearBomGeneral;
exports.actualizarBomGeneral = actualizarBomGeneral;
exports.eliminarBomGeneral = eliminarBomGeneral;
exports.obtenerBomJoinPorTecYProc = obtenerBomJoinPorTecYProc;
const db_1 = require("../db");
// Obtener todos los registros de BOM general
async function obtenerBomGeneral() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad
     FROM bom_general
     ORDER BY tecnologia_id, proceso_id, costo_id`);
}
async function obtenerBomPorId(id) {
    const db = await (0, db_1.getDb)();
    const row = await db.get(`SELECT id, tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad
     FROM bom_general
     WHERE id = ?`, [id]);
    return row ?? null;
}
async function crearBomGeneral(data) {
    const db = await (0, db_1.getDb)();
    const res = await db.run(`INSERT INTO bom_general (tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad)
     VALUES (?, ?, ?, ?, ?, ?, ?)`, [
        data.tecnologia_id,
        data.proceso_id,
        data.costo_id,
        data.factor_consumo ?? 1,
        data.driver_id,
        data.normalizador_cantidad ?? null,
        data.normalizador_unidad ?? null,
    ]);
    // @ts-ignore sqlite typings
    return res.lastID;
}
async function actualizarBomGeneral(data) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE bom_general
     SET tecnologia_id = ?, proceso_id = ?, costo_id = ?, factor_consumo = ?, driver_id = ?, normalizador_cantidad = ?, normalizador_unidad = ?
     WHERE id = ?`, [
        data.tecnologia_id,
        data.proceso_id,
        data.costo_id,
        data.factor_consumo,
        data.driver_id,
        data.normalizador_cantidad,
        data.normalizador_unidad,
        data.id,
    ]);
}
async function eliminarBomGeneral(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM bom_general WHERE id = ?`, [id]);
}
async function obtenerBomJoinPorTecYProc(tecnologiaId, procesoId) {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT
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
     ORDER BY c.id`, [tecnologiaId, procesoId]);
}
