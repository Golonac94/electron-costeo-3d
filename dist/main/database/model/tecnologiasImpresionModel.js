"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerTecnologias = obtenerTecnologias;
exports.obtenerTecnologiaPorId = obtenerTecnologiaPorId;
exports.crearTecnologia = crearTecnologia;
exports.actualizarTecnologia = actualizarTecnologia;
exports.eliminarTecnologia = eliminarTecnologia;
const db_1 = require("../db");
// Obtener todas las tecnologías de impresión
async function obtenerTecnologias() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre FROM tecnologias_impresion ORDER BY nombre`);
}
async function obtenerTecnologiaPorId(id) {
    const db = await (0, db_1.getDb)();
    const result = await db.get(`SELECT id, nombre FROM tecnologias_impresion WHERE id = ?`, [id]);
    return result || null;
}
// Crear una nueva tecnología de impresión
async function crearTecnologia(nombre) {
    const db = await (0, db_1.getDb)();
    const result = await db.run(`INSERT INTO tecnologias_impresion (nombre) VALUES (?)`, [nombre]);
    return result.lastID;
}
// Actualizar el nombre de una tecnología
async function actualizarTecnologia(id, nombre) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE tecnologias_impresion SET nombre = ? WHERE id = ?`, [nombre, id]);
}
// Eliminar una tecnología
async function eliminarTecnologia(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM tecnologias_impresion WHERE id = ?`, [id]);
}
