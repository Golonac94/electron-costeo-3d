"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerProcesos = obtenerProcesos;
exports.obtenerProcesoPorId = obtenerProcesoPorId;
exports.obtenerProcesosPorIds = obtenerProcesosPorIds;
exports.crearProceso = crearProceso;
exports.actualizarProceso = actualizarProceso;
exports.eliminarProceso = eliminarProceso;
const db_1 = require("../db");
// Obtener todos los procesos
async function obtenerProcesos() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre FROM procesos ORDER BY id`);
}
async function obtenerProcesoPorId(id) {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre FROM procesos where id = ?`, [id]);
}
async function obtenerProcesosPorIds(ids) {
    if (!ids.length)
        return [];
    const db = await (0, db_1.getDb)();
    const placeholders = ids.map(() => '?').join(',');
    return db.all(`SELECT id, nombre FROM procesos WHERE id IN (${placeholders})`, ids);
}
// Crear un nuevo proceso
async function crearProceso(nombre) {
    const db = await (0, db_1.getDb)();
    const result = await db.run(`INSERT INTO procesos (nombre) VALUES (?)`, [nombre]);
    return result.lastID;
}
// Actualizar el nombre de un proceso
async function actualizarProceso(id, nombre) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE procesos SET nombre = ? WHERE id = ?`, [nombre, id]);
}
// Eliminar un proceso
async function eliminarProceso(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM procesos WHERE id = ?`, [id]);
}
