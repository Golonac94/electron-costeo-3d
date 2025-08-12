"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUnidades = obtenerUnidades;
exports.obtenerUnidadPorId = obtenerUnidadPorId;
exports.crearUnidad = crearUnidad;
exports.actualizarUnidad = actualizarUnidad;
exports.eliminarUnidad = eliminarUnidad;
const db_1 = require("../db");
// Obtener todas las unidades
async function obtenerUnidades() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre, tipo FROM unidades ORDER BY nombre`);
}
async function obtenerUnidadPorId(id) {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre, tipo FROM unidades where id = ?`, [id]);
}
// Crear una nueva unidad
async function crearUnidad(unidad) {
    const db = await (0, db_1.getDb)();
    await db.run(`INSERT INTO unidades (id, nombre, tipo) VALUES (?, ?, ?)`, [unidad.id, unidad.nombre, unidad.tipo]);
}
// Actualizar una unidad existente (solo nombre y tipo, no el ID)
async function actualizarUnidad(unidad) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE unidades SET nombre = ?, tipo = ? WHERE id = ?`, [unidad.nombre, unidad.tipo, unidad.id]);
}
// Eliminar una unidad por ID
async function eliminarUnidad(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM unidades WHERE id = ?`, [id]);
}
