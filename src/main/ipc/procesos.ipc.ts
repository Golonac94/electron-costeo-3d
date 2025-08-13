import { ipcMain } from "electron";
import * as ProcesosController from "../controller/procesosController.js";

ipcMain.handle("proc:list", () => ProcesosController.listarProcesos());

