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
exports.obtenerCatalogoCostos = obtenerCatalogoCostos;
exports.crearCatalogoCosto = crearCatalogoCosto;
exports.actualizarCatalogoCosto = actualizarCatalogoCosto;
exports.eliminarCatalogoCosto = eliminarCatalogoCosto;
// src/main/services/catalogoCostosService.ts
const catalogoCostosModel = __importStar(require("../database/model/catalogoCostosModel.js"));
const categoriasMaterialModel = __importStar(require("../database/model/categoriasMaterialModel.js"));
// Obtener todos los costos del catálogo
async function obtenerCatalogoCostos() {
    return await catalogoCostosModel.obtenerCatalogoCostos();
}
// Crear un nuevo costo en el catálogo (prohibido si es categoría "Energía")
async function crearCatalogoCosto(data) {
    const categoria = await categoriasMaterialModel.obtenerCategoriaPorId(data.categoria_id);
    if (categoria?.nombre.toLowerCase() === 'energía' || categoria?.nombre.toLowerCase() === 'energia') {
        throw new Error('❌ No se pueden crear nuevos registros de tipo Energía.');
    }
    return await catalogoCostosModel.crearCatalogoCosto(data);
}
// Actualizar un costo existente (solo se puede modificar el valor si es energía)
async function actualizarCatalogoCosto(data) {
    const existente = await catalogoCostosModel.obtenerCatalogoCostoPorId(data.id);
    if (!existente)
        throw new Error('❌ Costo no encontrado.');
    const categoria = await categoriasMaterialModel.obtenerCategoriaPorId(existente.categoria_id);
    const esEnergia = categoria?.nombre.toLowerCase() === 'energía' || categoria?.nombre.toLowerCase() === 'energia';
    if (esEnergia) {
        // Solo permitir actualizar el costo_unitario
        await catalogoCostosModel.actualizarSoloCostoUnitario(data.id, data.costo_unitario);
    }
    else {
        await catalogoCostosModel.actualizarCatalogoCosto(data);
    }
}
// Eliminar un costo del catálogo (prohibido si es Energía)
async function eliminarCatalogoCosto(id) {
    const existente = await catalogoCostosModel.obtenerCatalogoCostoPorId(id);
    if (!existente)
        throw new Error('❌ Costo no encontrado.');
    const categoria = await categoriasMaterialModel.obtenerCategoriaPorId(existente.categoria_id);
    if (categoria?.nombre.toLowerCase() === 'energía' || categoria?.nombre.toLowerCase() === 'energia') {
        throw new Error('❌ No se puede eliminar un costo de tipo Energía.');
    }
    await catalogoCostosModel.eliminarCatalogoCosto(id);
}
