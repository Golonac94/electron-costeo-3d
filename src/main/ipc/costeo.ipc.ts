import { ipcMain } from "electron";
import * as CalculoCostoController from "../controller/calculoCostoController.js";

ipcMain.handle("costeo:calc", (_e, payload: any) =>
  CalculoCostoController.calcularCosto(payload)
);
