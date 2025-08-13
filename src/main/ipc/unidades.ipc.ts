import { ipcMain } from "electron";
import * as UnidadesController from "../controller/unidadesController.js";

ipcMain.handle("unid:list", () => UnidadesController.obtenerUnidades());
ipcMain.handle("unid:create", (_e, nombre: string, tipo: string) =>
  UnidadesController.crearUnidad(nombre, tipo)
);
ipcMain.handle("unid:update", (_e, data: any) =>
  UnidadesController.actualizarUnidad(data)
);
ipcMain.handle("unid:delete", (_e, id: string) =>
  UnidadesController.eliminarUnidad(id)
);
