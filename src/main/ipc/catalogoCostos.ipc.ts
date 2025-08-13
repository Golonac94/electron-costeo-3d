import { ipcMain } from "electron";
import * as CatalogoCostosController from "../controller/catalogoCostosController.js";
import type { CatalogoCosto } from '../database/model/catalogoCostosModel';

ipcMain.handle("catalogoCostos:list", () =>
  CatalogoCostosController.obtenerCatalogoCostos()
);
ipcMain.handle("catalogoCostos:create", (_e, data: Omit<CatalogoCosto, 'id'>) =>
  CatalogoCostosController.crearCatalogoCosto(data)
);
ipcMain.handle("catalogoCostos:update", (_e, id: string, data: Omit<CatalogoCosto, 'id'>) =>
  CatalogoCostosController.actualizarCatalogoCosto(id, data)
);
ipcMain.handle("catalogoCostos:delete", (_e, id: string) =>
  CatalogoCostosController.eliminarCatalogoCosto(id)
);
