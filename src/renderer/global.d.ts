// src/renderer/global.d.ts
export {};

declare global {
  interface Window {
    api: {
      listTecnologias: () => Promise<Array<{ id: number; nombre: string }>>;
      listMaterialesByTecnologia: (tecId: number | string) =>
        Promise<Array<{ id: string; nombre: string; unidad: string }>>;
      listProcesos: () => Promise<Array<{ id: number; nombre: string }>>;
      listUnidades: () => Promise<any[]>;
      crearUnidad: (nombre: string, tipo: string) => Promise<void>;
      actualizarUnidad: (data: any) => Promise<void>;
      eliminarUnidad: (id: string) => Promise<void>;
      calcularCosteo: (payload: any) => Promise<any>;
    };
  }
}
