import { ipcMain } from "electron";
import * as CategoriaMaterialController from "../controller/categoriaMaterialController.js";

ipcMain.handle("categoriaMateriales:list", () =>
  CategoriaMaterialController.obtenerCategoriasMaterial()
);

ipcMain.handle("categoriaMateriales:create", (_e, nombre: string) =>
  CategoriaMaterialController.crearCategoriaMaterial(nombre)
);
ipcMain.handle("categoriaMateriales:update", (_e, id: number, nombre: string) =>
  CategoriaMaterialController.actualizarCategoriaMaterial(id, nombre)
);
ipcMain.handle("categoriaMateriales:delete", (_e, id: number) =>
  CategoriaMaterialController.eliminarCategoriaMaterial(id)
);
