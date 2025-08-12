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
exports.obtenerMaterialesBase = obtenerMaterialesBase;
exports.listarMaterialesPorTecnologia = listarMaterialesPorTecnologia;
exports.crearMaterialBase = crearMaterialBase;
exports.actualizarMaterialBase = actualizarMaterialBase;
exports.eliminarMaterialBase = eliminarMaterialBase;
// src/main/services/materialesBaseService.ts
const materialesBaseModel = __importStar(require("../database/model/materialesBaseModel.js"));
// Obtener todos los materiales base
async function obtenerMaterialesBase() {
    return materialesBaseModel.obtenerMaterialesBase();
}
// Obtener todos los materiales base
async function listarMaterialesPorTecnologia(id) {
    return materialesBaseModel.obtenerMaterialesBaseporTecnologia(id);
}
// Crear nuevo material base
async function crearMaterialBase(data) {
    return materialesBaseModel.crearMaterialBase(data);
}
// Actualizar un material base
async function actualizarMaterialBase(data) {
    return materialesBaseModel.actualizarMaterialBase(data);
}
// Eliminar un material base
async function eliminarMaterialBase(id) {
    return materialesBaseModel.eliminarMaterialBase(id);
}
