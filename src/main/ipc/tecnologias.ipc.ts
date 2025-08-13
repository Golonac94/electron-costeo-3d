import { ipcMain } from "electron";
import * as TecnologiasController from "../controller/tecnologiasController.js";

ipcMain.handle("tec:list", () => TecnologiasController.listar());
