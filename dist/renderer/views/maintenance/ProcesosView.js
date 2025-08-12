"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProcesosView;
const react_1 = __importDefault(require("react"));
const MantenimientoView_module_css_1 = __importDefault(require("../MantenimientoView.module.css"));
function ProcesosView() {
    return (react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.panel },
        react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.actions },
            react_1.default.createElement("button", { className: MantenimientoView_module_css_1.default.primaryBtn }, "+ Nuevo proceso")),
        react_1.default.createElement("p", { style: { marginTop: 10 } },
            "CRUD de ",
            react_1.default.createElement("strong", null, "procesos"),
            ". ",
            react_1.default.createElement("em", null, "Impresi\u00F3n"),
            " debe quedar protegido (no borrar/inactivar).")));
}
