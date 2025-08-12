"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeView;
const react_1 = __importDefault(require("react"));
const HomeView_module_css_1 = __importDefault(require("./HomeView.module.css"));
function HomeView({ onGotoCalculo, onGotoMantenimiento, }) {
    return (react_1.default.createElement("div", { className: HomeView_module_css_1.default.grid },
        react_1.default.createElement("button", { onClick: onGotoCalculo, className: `${HomeView_module_css_1.default.card} ${HomeView_module_css_1.default.cardPrimary}` },
            react_1.default.createElement("span", { className: HomeView_module_css_1.default.title }, "C\u00E1lculo"),
            react_1.default.createElement("span", { className: HomeView_module_css_1.default.desc }, "Ir a la pantalla de c\u00E1lculo de costos."),
            react_1.default.createElement("span", { "aria-hidden": true, className: HomeView_module_css_1.default.chevron },
                react_1.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24" },
                    react_1.default.createElement("path", { d: "M9 18l6-6-6-6", fill: "none", stroke: "currentColor", strokeWidth: "2" })))),
        react_1.default.createElement("button", { onClick: onGotoMantenimiento, className: `${HomeView_module_css_1.default.card} ${HomeView_module_css_1.default.cardSecondary}` },
            react_1.default.createElement("span", { className: HomeView_module_css_1.default.title }, "Mantenimiento"),
            react_1.default.createElement("span", { className: HomeView_module_css_1.default.desc }, "Gesti\u00F3n de cat\u00E1logos (materiales, procesos, etc.)."),
            react_1.default.createElement("span", { "aria-hidden": true, className: HomeView_module_css_1.default.chevron },
                react_1.default.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24" },
                    react_1.default.createElement("path", { d: "M9 18l6-6-6-6", fill: "none", stroke: "currentColor", strokeWidth: "2" }))))));
}
