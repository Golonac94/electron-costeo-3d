"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BomGeneralView;
const react_1 = __importDefault(require("react"));
const MantenimientoView_module_css_1 = __importDefault(require("../MantenimientoView.module.css"));
function BomGeneralView() {
    return (react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.panel },
        react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.actions, style: { marginBottom: 10 } },
            react_1.default.createElement("select", null,
                react_1.default.createElement("option", null, "Tecnolog\u00EDa\u2026")),
            react_1.default.createElement("select", null,
                react_1.default.createElement("option", null, "Proceso\u2026")),
            react_1.default.createElement("button", { className: MantenimientoView_module_css_1.default.primaryBtn }, "+ Agregar \u00EDtem de costo")),
        react_1.default.createElement("p", null,
            "CRUD de ",
            react_1.default.createElement("strong", null, "bom_general"),
            " (tec, proceso, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad)."),
        react_1.default.createElement("ul", { style: { marginTop: 6, color: "#475569" } },
            react_1.default.createElement("li", null, "\u2022 Validar clave \u00FAnica (tec+proc+item)"),
            react_1.default.createElement("li", null, "\u2022 driver_id \u2208 unidades"),
            react_1.default.createElement("li", null, "\u2022 Preview de subtotal con inputs de prueba"))));
}
