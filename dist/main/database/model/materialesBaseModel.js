"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerMaterialesBase = obtenerMaterialesBase;
exports.obtenerMaterialBasePorId = obtenerMaterialBasePorId;
exports.obtenerMaterialesBaseporTecnologia = obtenerMaterialesBaseporTecnologia;
exports.validarMaterialEnTecnologia = validarMaterialEnTecnologia;
exports.crearMaterialBase = crearMaterialBase;
exports.actualizarMaterialBase = actualizarMaterialBase;
exports.eliminarMaterialBase = eliminarMaterialBase;
const db_1 = require("../db");
const idGenerator_js_1 = require("../helpers/idGenerator.js");
// Obtener todos los materiales base
async function obtenerMaterialesBase() {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base
     ORDER BY nombre`);
}
async function obtenerMaterialBasePorId(id) {
    const db = await (0, db_1.getDb)();
    const result = await db.get(`SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base WHERE id = ?`, [id]);
    return result || null;
}
async function obtenerMaterialesBaseporTecnologia(idTecImpresion) {
    const db = await (0, db_1.getDb)();
    return db.all(`SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base WHERE tecnologia_id = ? ORDER BY tecnologia_id`, [idTecImpresion]);
}
async function validarMaterialEnTecnologia(idTecImpresion, idMaterialBase) {
    const db = await (0, db_1.getDb)();
    const result = await db.get(`SELECT id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh
     FROM materiales_base WHERE id = ? and tecnologia_id= ?  `, [idMaterialBase, idTecImpresion]);
    return result || null;
}
// Crear un nuevo material base
async function crearMaterialBase(data) {
    const db = await (0, db_1.getDb)();
    // Obtener el nombre de la tecnología para usar como prefijo
    const tecnologia = await db.get(`SELECT nombre FROM tecnologias_impresion WHERE id = ?`, [data.tecnologia_id]);
    if (!tecnologia)
        throw new Error('Tecnología no encontrada');
    const prefijo = tecnologia.nombre.slice(0, 3).toUpperCase();
    const idBase = await (0, idGenerator_js_1.generarIdSecuencial)('materiales_base', 'id', prefijo);
    await db.run(`INSERT INTO materiales_base (id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh)
     VALUES (?, ?, ?, ?, ?)`, [idBase, data.tecnologia_id, data.nombre, data.costo_kg, data.consumo_energia_kwh]);
    return idBase;
}
// Actualizar un material base existente
async function actualizarMaterialBase(data) {
    const db = await (0, db_1.getDb)();
    await db.run(`UPDATE materiales_base
     SET tecnologia_id = ?, nombre = ?, costo_kg = ?, consumo_energia_kwh = ?
     WHERE id = ?`, [data.tecnologia_id, data.nombre, data.costo_kg, data.consumo_energia_kwh, data.id]);
}
// Eliminar un material base
async function eliminarMaterialBase(id) {
    const db = await (0, db_1.getDb)();
    await db.run(`DELETE FROM materiales_base WHERE id = ?`, [id]);
}
