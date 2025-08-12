"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularCosto = calcularCosto;
const calculoCostoService_js_1 = require("../services/calculoCostoService.js");
async function calcularCosto(input) {
    // Validaciones rápidas de entrada
    if (!input?.tecnologia_impresion_id)
        throw new Error('Falta tecnologia_impresion_id');
    if (!input?.material_base_id)
        throw new Error('Falta material_base_id');
    if (!Array.isArray(input?.procesos) || input.procesos.length === 0) {
        throw new Error('Debes enviar al menos un proceso a calcular');
    }
    const m = input.medidas;
    if (!m || m.peso_gramos == null || m.duracion_impresion_horas == null || m.area_cm2 == null) {
        throw new Error('Faltan medidas: peso_gramos, duracion_impresion_horas y area_cm2');
    }
    // Delegar al service
    console.log('Calculando costo con input:', input);
    const result = await (0, calculoCostoService_js_1.calcularCostoTotal)(input);
    console.log('Calculando costo con input:', result);
    return result;
}
