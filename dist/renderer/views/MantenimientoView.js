"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MantenimientoView;
const react_1 = __importStar(require("react"));
const MantenimientoView_module_css_1 = __importDefault(require("./MantenimientoView.module.css"));
// Sub-vistas (placeholders por ahora)
const CatalogoCostosView_1 = __importDefault(require("./maintenance/CatalogoCostosView"));
const TecnologiasView_1 = __importDefault(require("./maintenance/TecnologiasView"));
const MaterialesBaseView_1 = __importDefault(require("./maintenance/MaterialesBaseView"));
const ProcesosView_1 = __importDefault(require("./maintenance/ProcesosView"));
const BomGeneralView_1 = __importDefault(require("./maintenance/BomGeneralView"));
function MantenimientoView({ onBack }) {
    const [section, setSection] = (0, react_1.useState)("catalogo");
    const title = (0, react_1.useMemo)(() => {
        switch (section) {
            case "catalogo": return "Catálogo de costos";
            case "tecnologias": return "Tecnologías de impresión";
            case "materiales": return "Materiales base";
            case "procesos": return "Procesos";
            case "bom": return "BOM General";
            default: return "Mantenimiento";
        }
    }, [section]);
    return (react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.page },
        react_1.default.createElement("button", { onClick: onBack, className: `${MantenimientoView_module_css_1.default.backBtn} ${MantenimientoView_module_css_1.default.backBtnCompact} ${MantenimientoView_module_css_1.default.backBtnAccent}`, title: "Volver (no guarda cambios)" }, "\u2190 Volver"),
        react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.layout },
            react_1.default.createElement("aside", { className: MantenimientoView_module_css_1.default.sidebar },
                react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.sidebarHeader }, "Mantenimiento"),
                react_1.default.createElement("nav", { className: MantenimientoView_module_css_1.default.nav },
                    react_1.default.createElement("button", { className: `${MantenimientoView_module_css_1.default.navItem} ${section === "catalogo" ? MantenimientoView_module_css_1.default.navItemActive : ""}`, onClick: () => setSection("catalogo") }, "Cat\u00E1logo de costos"),
                    react_1.default.createElement("button", { className: `${MantenimientoView_module_css_1.default.navItem} ${section === "tecnologias" ? MantenimientoView_module_css_1.default.navItemActive : ""}`, onClick: () => setSection("tecnologias") }, "Tecnolog\u00EDas"),
                    react_1.default.createElement("button", { className: `${MantenimientoView_module_css_1.default.navItem} ${section === "materiales" ? MantenimientoView_module_css_1.default.navItemActive : ""}`, onClick: () => setSection("materiales") }, "Materiales base"),
                    react_1.default.createElement("button", { className: `${MantenimientoView_module_css_1.default.navItem} ${section === "procesos" ? MantenimientoView_module_css_1.default.navItemActive : ""}`, onClick: () => setSection("procesos") }, "Procesos"),
                    react_1.default.createElement("button", { className: `${MantenimientoView_module_css_1.default.navItem} ${section === "bom" ? MantenimientoView_module_css_1.default.navItemActive : ""}`, onClick: () => setSection("bom") }, "BOM General"))),
            react_1.default.createElement("section", { className: MantenimientoView_module_css_1.default.content },
                react_1.default.createElement("header", { className: MantenimientoView_module_css_1.default.contentHeader }, title),
                react_1.default.createElement("div", { className: MantenimientoView_module_css_1.default.contentBody },
                    section === "catalogo" && react_1.default.createElement(CatalogoCostosView_1.default, null),
                    section === "tecnologias" && react_1.default.createElement(TecnologiasView_1.default, null),
                    section === "materiales" && react_1.default.createElement(MaterialesBaseView_1.default, null),
                    section === "procesos" && react_1.default.createElement(ProcesosView_1.default, null),
                    section === "bom" && react_1.default.createElement(BomGeneralView_1.default, null))))));
}
