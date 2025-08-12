import { calcularCostoTotal } from '../services/calculoCostoService.js';

export interface EntradaCalculo {
  tecnologia_impresion_id: number;
  material_base_id: string;
  procesos: number[];
  medidas: {
    peso_gramos: number;
    duracion_impresion_horas: number;
    area_cm2: number;
  };
}

export async function calcularCosto(input: EntradaCalculo) {
  // Validaciones rápidas de entrada
  if (!input?.tecnologia_impresion_id) throw new Error('Falta tecnologia_impresion_id');
  if (!input?.material_base_id) throw new Error('Falta material_base_id');
  if (!Array.isArray(input?.procesos) || input.procesos.length === 0) {
    throw new Error('Debes enviar al menos un proceso a calcular');
  }
  const m = input.medidas;
  if (!m || m.peso_gramos == null || m.duracion_impresion_horas == null || m.area_cm2 == null) {
    throw new Error('Faltan medidas: peso_gramos, duracion_impresion_horas y area_cm2');
  }

  // Delegar al service
  console.log('Calculando costo con input:', input);
  const result = await calcularCostoTotal(input)
  console.log('Calculando costo con input:', result);

  return result;
}
