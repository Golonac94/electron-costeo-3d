// src/renderer/types/costeo.ts
export type Tecnologia = { id: number; nombre: string };
export type Material = { id: string; nombre: string; unidad: string };
export type Proceso = { id: number; nombre: string };

export type CosteoPayload = {
  tecnologia_impresion_id: number;
  material_base_id: string;
  procesos: number[];
  medidas: {
    peso_gramos?: number;
    duracion_impresion_horas?: number;
    area_cm2?: number;
  };
};

export type CategoriaNorm = { categoria: string; costo: number };
export type ProcesoNorm = {
  proceso_id: number | string;
  proceso_nombre: string;
  categorias: CategoriaNorm[];
  total_proceso: number;
};

export type MaterialBaseNorm = {
  material_nombre: string;
  unidad?: string;
  consumo?: number;
  costo_unitario?: number;
  costo_total: number;
  energia_kwh?: number;
  costo_energia?: number;
};

export type ResultadoCosto = {
  costos_por_proceso: any[];
  material_base?: {
    nombre?: string;
    material_nombre?: string;
    unidad?: string;
    consumo?: number;
    costo_unitario?: number;
    costo_total?: number;
    costo_material?: number;
    consumo_energia_kwh?: number;
    energia_kwh?: number;
    costo_energia?: number;
  };
  total_general?: number;
};
