"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUnidades = obtenerUnidades;
exports.crearUnidad = crearUnidad;
exports.actualizarUnidad = actualizarUnidad;
exports.eliminarUnidad = eliminarUnidad;
// src/main/services/unidadesService.ts
const UnidadModel = __importStar(require("../database/model/unidadesModel.js"));
const idGenerator_js_1 = require("../database/helpers/idGenerator.js");
async function obtenerUnidades() {
    return UnidadModel.obtenerUnidades();
}
async function crearUnidad(nombre, tipo) {
    // 1) Validaciones básicas
    const nombreTrim = (nombre ?? '').trim();
    const tipoTrim = (tipo ?? '').trim();
    if (!nombreTrim || !tipoTrim) {
        throw new Error('El nombre y el tipo de la unidad son obligatorios.');
    }
    // 2) Validación de duplicados (nombre + tipo, case-insensitive)
    const existentes = await UnidadModel.obtenerUnidades();
    const yaExiste = existentes.some(u => u.nombre.toLowerCase() === nombreTrim.toLowerCase() &&
        u.tipo.toLowerCase() === tipoTrim.toLowerCase());
    if (yaExiste) {
        throw new Error(`Ya existe una unidad con nombre "${nombreTrim}" y tipo "${tipoTrim}".`);
    }
    // 3) Prefijo de 3 caracteres (relleno si hiciera falta)
    const prefijo = tipoTrim.substring(0, 3).toUpperCase().padEnd(3, '_');
    if (prefijo.length !== 3) {
        throw new Error('Error generando prefijo para la unidad.');
    }
    // 4) Generar ID y crear
    const idGenerado = await (0, idGenerator_js_1.generarIdSecuencial)('unidades', 'id', prefijo);
    const nuevaUnidad = {
        id: idGenerado,
        nombre: nombreTrim,
        tipo: tipoTrim,
    };
    await UnidadModel.crearUnidad(nuevaUnidad);
}
async function actualizarUnidad(data) {
    const nombreTrim = (data.nombre ?? '').trim();
    const tipoTrim = (data.tipo ?? '').trim();
    if (!nombreTrim || !tipoTrim) {
        throw new Error('El nombre y el tipo de la unidad son obligatorios.');
    }
    await UnidadModel.actualizarUnidad({ ...data, nombre: nombreTrim, tipo: tipoTrim });
}
async function eliminarUnidad(id) {
    await UnidadModel.eliminarUnidad(id);
}
