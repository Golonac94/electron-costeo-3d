"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CatalogoCostosView;
const react_1 = __importDefault(require("react"));
const MantenimientoView_module_css_1 = __importDefault(require("../MantenimientoView.module.css"));
function CatalogoCostosView() {
    return (react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.panel },
        react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.actions },
            react_1.default.createElement("button", { className: MantenimientoView_module_css_1.default.primaryBtn }, "+ Agregar \u00EDtem")),
        react_1.default.createElement("p", { style: { marginTop: 10 } },
            "Aqu\u00ED va el CRUD de ",
            react_1.default.createElement("strong", null, "catalogo_costos"),
            " (id, nombre, categor\u00EDa, unidad, costo_unitario)."),
        react_1.default.createElement("ul", { style: { marginTop: 6, color: "#475569" } },
            react_1.default.createElement("li", null, "\u2022 Filtro por categor\u00EDa"),
            react_1.default.createElement("li", null, "\u2022 Edici\u00F3n inline de precio"),
            react_1.default.createElement("li", null, "\u2022 Inactivar en vez de borrar"))));
}
