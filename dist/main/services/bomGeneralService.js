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
exports.listarBomGeneral = listarBomGeneral;
exports.registrarBomGeneral = registrarBomGeneral;
exports.editarBomGeneral = editarBomGeneral;
exports.borrarBomGeneral = borrarBomGeneral;
// src/main/services/bomGeneralService.ts
const bomGeneralModel = __importStar(require("../database/model/bomGeneralModel.js"));
// Obtener todos los registros
async function listarBomGeneral() {
    return bomGeneralModel.obtenerBomGeneral();
}
// Crear nuevo registro
async function registrarBomGeneral(data) {
    return bomGeneralModel.crearBomGeneral(data);
}
// Actualizar
async function editarBomGeneral(data) {
    await bomGeneralModel.actualizarBomGeneral(data);
}
// Eliminar
async function borrarBomGeneral(id) {
    await bomGeneralModel.eliminarBomGeneral(id);
}
