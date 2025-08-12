"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProcessCostsTable;
const react_1 = __importDefault(require("react"));
const ProcessCostsTable_module_css_1 = __importDefault(require("./ProcessCostsTable.module.css"));
const money_1 = require("../lib/money");
function ProcessCostsTable({ data, totalProcesos, costoMaterial, costoEnergiaMaterial, totalGeneral, }) {
    return (react_1.default.createElement("div", { className: ProcessCostsTable_module_css_1.default.wrapper },
        react_1.default.createElement("div", { className: ProcessCostsTable_module_css_1.default.scrollArea },
            react_1.default.createElement("table", { className: ProcessCostsTable_module_css_1.default.table },
                react_1.default.createElement("thead", null,
                    react_1.default.createElement("tr", null,
                        react_1.default.createElement("th", null, "Proceso"),
                        react_1.default.createElement("th", null, "Categor\u00EDa"),
                        react_1.default.createElement("th", null, "Costo"))),
                react_1.default.createElement("tbody", null, data.map((p) => (react_1.default.createElement(react_1.default.Fragment, { key: p.proceso_id },
                    react_1.default.createElement("tr", { className: ProcessCostsTable_module_css_1.default.procesoRow },
                        react_1.default.createElement("td", { colSpan: 3 }, p.proceso_nombre)),
                    p.categorias.map((c, idx) => (react_1.default.createElement("tr", { key: idx },
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null, c.categoria),
                        react_1.default.createElement("td", { className: ProcessCostsTable_module_css_1.default.numeric }, (0, money_1.money)(c.costo))))),
                    react_1.default.createElement("tr", { className: ProcessCostsTable_module_css_1.default.subtotalRow },
                        react_1.default.createElement("td", null),
                        react_1.default.createElement("td", null,
                            "Subtotal ",
                            p.proceso_nombre),
                        react_1.default.createElement("td", { className: ProcessCostsTable_module_css_1.default.numeric }, (0, money_1.money)(p.total_proceso))))))))),
        react_1.default.createElement("div", { className: ProcessCostsTable_module_css_1.default.totals },
            react_1.default.createElement("table", { className: ProcessCostsTable_module_css_1.default.totalsTable },
                react_1.default.createElement("tbody", null,
                    react_1.default.createElement("tr", { className: ProcessCostsTable_module_css_1.default.totalRow },
                        react_1.default.createElement("td", null, "Total procesos"),
                        react_1.default.createElement("td", { className: ProcessCostsTable_module_css_1.default.numeric }, (0, money_1.money)(totalProcesos))),
                    react_1.default.createElement("tr", { className: ProcessCostsTable_module_css_1.default.totalRow },
                        react_1.default.createElement("td", null, "Costo material base"),
                        react_1.default.createElement("td", { className: ProcessCostsTable_module_css_1.default.numeric }, (0, money_1.money)(costoMaterial))),
                    react_1.default.createElement("tr", { className: ProcessCostsTable_module_css_1.default.totalRow },
                        react_1.default.createElement("td", null, "Costo energ\u00EDa (material base)"),
                        react_1.default.createElement("td", { className: ProcessCostsTable_module_css_1.default.numeric }, (0, money_1.money)(costoEnergiaMaterial))),
                    react_1.default.createElement("tr", { className: ProcessCostsTable_module_css_1.default.totalGeneralRow },
                        react_1.default.createElement("td", null, "Total general"),
                        react_1.default.createElement("td", { className: ProcessCostsTable_module_css_1.default.numeric }, (0, money_1.money)(totalGeneral))))))));
}
