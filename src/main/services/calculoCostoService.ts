import * as materialesBaseModel from '../database/model/materialesBaseModel.js';
import * as tecnologiasImpresionModel from '../database/model/tecnologiasImpresionModel.js';
import * as procesosModel from '../database/model/procesosModel.js';
import * as bomGeneralModel from '../database/model/bomGeneralModel.js';
import * as catalogoCostosModel from '../database/model/catalogoCostosModel.js';

interface MedidasCalculo {
  peso_gramos: number;
  duracion_impresion_horas: number;
  area_cm2: number;
}

interface EntradaCalculoCosto {
  tecnologia_impresion_id: number;
  material_base_id: string;
  procesos: number[];
  medidas: MedidasCalculo;
}

interface CostoDetalle {
  categoria: string;
  monto: number;
  detalle: {
    id: string;
    nombre: string;
    unidad_id: string;       // driver aplicado: 'h' | 'gr' | 'cm2' | 'kwh' | 'flat'
    costo_unitario: number;  // precio por unidad de driver (prorrateado con normalizador)
    factor_consumo: number;
    cantidad_aplicada: number;
    subtotal: number;
  }[];
}

interface CostoPorProceso {
  proceso_id: number;
  nombre: string;
  costos: CostoDetalle[];
}

interface ResultadoCosto {
  costos_por_proceso: CostoPorProceso[];
  material_base: {
    id: string;
    nombre: string;
    costo_material: number;
    consumo_energia_kwh: number;
    costo_energia: number; // solo informativo (lo que se sumó en procesos)
  };
}

// ==== helpers (negocio puro) ====
function driverUnits(
  driver: string,
  medidas: MedidasCalculo,
  consumoEnergiaKwh: number
) {
  switch (driver) {
    case 'h':   return medidas.duracion_impresion_horas;
    case 'gr':  return medidas.peso_gramos;
    case 'cm2': return medidas.area_cm2;
    case 'kwh': return medidas.duracion_impresion_horas * consumoEnergiaKwh;
    case 'flat':
    default:    return 1;
  }
}

function divSafe(a: number, b?: number | null) {
  const d = b ?? 1;
  return d === 0 ? a : a / d;
}

export async function calcularCostoTotal(data: EntradaCalculoCosto): Promise<ResultadoCosto> {
  const { tecnologia_impresion_id, material_base_id, procesos, medidas } = data;

  // 1) Validaciones base
  const tecnologia = await tecnologiasImpresionModel.obtenerTecnologiaPorId(tecnologia_impresion_id);
  if (!tecnologia) throw new Error('Tecnología de impresión no encontrada');

  const materialBase = await materialesBaseModel.obtenerMaterialBasePorId(material_base_id);
  if (!materialBase) throw new Error('Material base no encontrado');

  const estaMatriculado = await materialesBaseModel.validarMaterialEnTecnologia(
    tecnologia_impresion_id,
    material_base_id
  );
  if (!estaMatriculado) throw new Error('Material base no está registrado en esta tecnología de impresión');

  console.log('Tecnología:', medidas.duracion_impresion_horas);
  // 2) Material base (solo por peso) + kWh informativo
  const consumoKg = medidas.peso_gramos / 1000;
  const costoMaterial = consumoKg * materialBase.costo_kg;
  const consumoKwh = medidas.duracion_impresion_horas * materialBase.consumo_energia_kwh;

  //calculo de la energia de la resina /PLA

  const energiaPrecio = await catalogoCostosModel.obtenerEnergia();
  if (!energiaPrecio || !energiaPrecio.costo_unitario) throw new Error('Energía no encontrada en la base de datos');
  const costoEnergia = energiaPrecio.costo_unitario*consumoKwh;
console.log('Costo de energía:', costoEnergia);

  // 3) Nombres de procesos (evita el bug del array)
  const procesosIds = Array.from(new Set(procesos)).map(Number).sort((a, b) => a - b);
  const procesosInfo = await procesosModel.obtenerProcesosPorIds(procesosIds); // <- usa db.all<Proceso> y devuelve []
  const nombrePorId = new Map<number, string>(procesosInfo.map(p => [p.id, p.nombre]));

  // 4) Calcular costos por proceso desde la BOM (driver + normalizador + factor)
  const costos_por_proceso: CostoPorProceso[] = [];

  for (const procesoId of procesosIds) {
    const procesoNombre = nombrePorId.get(procesoId) ?? `Proceso ${procesoId}`;

    // JOIN listo para cálculo (si no lo tienes, créalo en bomGeneralModel):
    // obtenerBomJoinPorTecYProc(tecnologiaId, procesoId) =>
    //   [{ costo_id, item_nombre, categoria_nombre, driver_id, factor_consumo, normalizador_cantidad, normalizador_unidad, costo_unitario }]
    const bom = await bomGeneralModel.obtenerBomJoinPorTecYProc(tecnologia_impresion_id, procesoId);

    const categorias = new Map<string, CostoDetalle>();

    for (const b of bom) {
      const units = driverUnits(b.driver_id, medidas, materialBase.consumo_energia_kwh);
      const cantidad = (b.factor_consumo ?? 1) * units;

      const precioUnitDriver = divSafe(b.costo_unitario, b.normalizador_cantidad ?? 1);
      const subtotal = cantidad * precioUnitDriver;


      if (!categorias.has(b.categoria_nombre)) {
        categorias.set(b.categoria_nombre, { categoria: b.categoria_nombre, monto: 0, detalle: [] });
      }
      const cat = categorias.get(b.categoria_nombre)!;
      cat.monto += subtotal;
      cat.detalle.push({
        id: b.costo_id,
        nombre: b.item_nombre,
        unidad_id: b.driver_id, // lo que aplicamos realmente
        costo_unitario: precioUnitDriver,
        factor_consumo: b.factor_consumo ?? 1,
        cantidad_aplicada: cantidad,
        subtotal
      });
    }

    costos_por_proceso.push({
      proceso_id: procesoId,
      nombre: procesoNombre,
      costos: Array.from(categorias.values())
    });
  }

  return {
    costos_por_proceso,
    material_base: {
      id: materialBase.id,
      nombre: materialBase.nombre,
      costo_material: costoMaterial,
      consumo_energia_kwh: consumoKwh,
      costo_energia: costoEnergia
    }
  };
}
