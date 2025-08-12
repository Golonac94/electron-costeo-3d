"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MaterialesBaseView;
const react_1 = __importDefault(require("react"));
const MantenimientoView_module_css_1 = __importDefault(require("../MantenimientoView.module.css"));
function MaterialesBaseView() {
    return (react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.panel },
        react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.actions },
            react_1.default.createElement("button", { className: MantenimientoView_module_css_1.default.primaryBtn }, "+ Nuevo material base")),
        react_1.default.createElement("p", { style: { marginTop: 10 } },
            "CRUD de ",
            react_1.default.createElement("strong", null, "materiales_base"),
            " (id, tecnolog\u00EDa, nombre, costo_kg, consumo_energia_kwh).")));
}
