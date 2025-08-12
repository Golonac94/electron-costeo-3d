"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerCatalogoCostos = obtenerCatalogoCostos;
exports.obtenerEnergia = obtenerEnergia;
exports.obtenerCatalogoCostoPorId = obtenerCatalogoCostoPorId;
exports.obtenerCostosPorCategoria = obtenerCostosPorCategoria;
exports.obtenerCatalogoCostosPorIds = obtenerCatalogoCostosPorIds;
exports.crearCatalogoCosto = crearCatalogoCosto;
exports.actualizarCatalogoCosto = actualizarCatalogoCosto;
exports.actualizarSoloCostoUnitario = actualizarSoloCostoUnitario;
exports.eliminarCatalogoCosto = eliminarCatalogoCosto;
const db_1 = require("../db");
const idGenerator_js_1 = require("../helpers/idGenerator.js");
// ===== Queries =====
// Lista completa (orden por nombre)
async function obtenerCatalogoCostos() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     ORDER BY nombre`);
}
async function obtenerEnergia() {
    const db = await (0, db_1.getDb)();
    const result = await db.get(`SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos A WHERE  A.id = 'ENE_0001'`);
    return result || null;
}
// Una fila por ID (null si no existe)
async function obtenerCatalogoCostoPorId(id) {
    const db = await (0, db_1.getDb)();
    const row = await db.get(`SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     WHERE id = ?`, [id]);
    return row ?? null;
}
// Por categoría
async function obtenerCostosPorCategoria(idCat) {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     WHERE categoria_id = ?
     ORDER BY nombre`, [idCat]);
}
// (Opcional) Por varios IDs
async function obtenerCatalogoCostosPorIds(ids) {
    if (!ids.length)
        return [];
    const db = await (0, db_1.getDb)();
    const placeholders = ids.map(() => '?').join(',');
    return db.all(`SELECT id, nombre, categoria_id, unidad_id, costo_unitario
     FROM catalogo_costos
     WHERE id IN (${placeholders})`, ids);
}
// ===== Mutaciones =====
// Crear nuevo ítem del catálogo
async function crearCatalogoCosto(data) {
    const db = await (0, db_1.getDb)();
    // Validaciones mínimas
    const categoria = await db.get(`SELECT nombre FROM categorias_material WHERE id = ?`, [data.categoria_id]);
    if (!categoria)
        throw new Error('Categoría no encontrada');
    const unidad = await db.get(`SELECT id FROM unidades WHERE id = ?`, [data.unidad_id]);
    if (!unidad)
        throw new Error('Unidad no encontrada');
    // ID con prefijo derivado de la categoría (p.ej., 'ENE', 'MAN', 'SUM')
    const prefijo = categoria.nombre.slice(0, 3).toUpperCase();
    const idGenerado = await (0, idGenerator_js_1.generarIdSecuencial)('catalogo_costos', 'id', prefijo);
    await db.run(`INSERT INTO catalogo_costos (id, nombre, categoria_id, unidad_id, costo_unitario)
     VALUES (?, ?, ?, ?, ?)`, [idGenerado, data.nombre, data.categoria_id, data.unidad_id, data.costo_unitario]);
    return idGenerado;
}
// Actualizar ítem completo
async function actualizarCatalogoCosto(data) {
    const db = await (0, db_1.getDb)();
    // (Opcional) validar existencia de unidad/categoría si permites cambiarlas
    const categoria = await db.get(`SELECT 1 FROM categorias_material WHERE id = ?`, [data.categoria_id]);
    if (!categoria)
        throw new Error('Categoría no encontrada');
    const unidad = await db.get(`SELECT 1 FROM unidades WHERE id = ?`, [data.unidad_id]);
    if (!unidad)
        throw new Error('Unidad no encontrada');
    await db.run(`UPDATE catalogo_costos
     SET nombre = ?, categoria_id = ?, unidad_id = ?, costo_unitario = ?
     WHERE id = ?`, [data.nombre, data.categoria_id, data.unidad_id, data.costo_unitario, data.id]);
}
// Actualizar solo el costo
async function actualizarSoloCostoUnitario(id, nuevoCosto) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE catalogo_costos
     SET costo_unitario = ?
     WHERE id = ?`, [nuevoCosto, id]);
}
// Eliminar
async function eliminarCatalogoCosto(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM catalogo_costos WHERE id = ?`, [id]);
}
