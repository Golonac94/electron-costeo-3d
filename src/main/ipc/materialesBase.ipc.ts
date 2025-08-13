import { ipcMain } from "electron";
import * as MaterialesController from "../controller/materialesBaseController.js";

ipcMain.handle("mat:listByTec", (_e, tecId: number | string) =>
  MaterialesController.listarPorTecnologia(tecId)
);

ipcMain.handle("mat:list", (_e, ) =>
  MaterialesController.obtenerTodosMaterialesBase()
);

