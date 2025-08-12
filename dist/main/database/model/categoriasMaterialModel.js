"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerCategoriasMaterial = obtenerCategoriasMaterial;
exports.obtenerCategoriaPorId = obtenerCategoriaPorId;
exports.obtenerCategoriaPorNombre = obtenerCategoriaPorNombre;
exports.crearCategoriaMaterial = crearCategoriaMaterial;
exports.actualizarCategoriaMaterial = actualizarCategoriaMaterial;
exports.eliminarCategoriaMaterial = eliminarCategoriaMaterial;
const db_1 = require("../db");
// Obtener todas las categorías
async function obtenerCategoriasMaterial() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre FROM categorias_material ORDER BY nombre`);
}
// Obtener todas las categorías
async function obtenerCategoriaPorId(id) {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre FROM categorias_material WHERE ID = ?`, [id]);
}
async function obtenerCategoriaPorNombre(nombre) {
    const db = await (0, db_1.getDb)();
    const row = await db.get(`SELECT id, nombre
     FROM categorias_material
     WHERE TRIM(nombre) = TRIM(?) COLLATE NOCASE
     LIMIT 1`, [nombre]);
    return row ?? null;
}
// Crear una nueva categoría
async function crearCategoriaMaterial(nombre) {
    const db = await (0, db_1.getDb)();
    await db.run(`INSERT INTO categorias_material (nombre) VALUES (?)`, [nombre]);
}
// Actualizar una categoría por ID
async function actualizarCategoriaMaterial(id, nuevoNombre) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE categorias_material SET nombre = ? WHERE id = ?`, [nuevoNombre, id]);
}
// Eliminar una categoría por ID
async function eliminarCategoriaMaterial(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM categorias_material WHERE id = ?`, [id]);
}
