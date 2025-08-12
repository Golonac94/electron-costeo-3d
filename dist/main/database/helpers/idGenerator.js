"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarIdSecuencial = generarIdSecuencial;
const db_1 = require("../db");
/**
 * Genera un nuevo ID secuencial del tipo: PREFIJO_0001
 * contando registros existentes en el campo deseado de una tabla.
 */
async function generarIdSecuencial(tabla, campo, prefijo) {
    const db = await (0, db_1.getDb)();
    const result = await db.get(`SELECT COUNT(${campo}) as count FROM ${tabla} where ${campo} LIKE ?`, [`${prefijo}_%`]);
    const count = result?.count ?? 0;
    const nuevoNumero = count + 1;
    return `${prefijo}_${nuevoNumero.toString().padStart(4, '0')}`;
}
