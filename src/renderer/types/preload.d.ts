import type { Tecnologia, Material, Proceso, CosteoPayload, ResultadoCosto } from "./costeo";

export type PreloadAPI = {
  listTecnologias: () => Promise<Tecnologia[]>;
  listMaterialesByTecnologia: (tecId: number | string) => Promise<Material[]>;
  listProcesos: () => Promise<Proceso[]>;
  calcularCosteo: (payload: CosteoPayload) => Promise<ResultadoCosto>;
};

declare global {
  interface Window {
    api: PreloadAPI;
  }
}
