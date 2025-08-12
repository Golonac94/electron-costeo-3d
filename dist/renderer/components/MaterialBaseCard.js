"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MaterialBaseCard;
const react_1 = __importDefault(require("react"));
const money_1 = require("../lib/money");
function MaterialBaseCard({ mb }) {
    return (react_1.default.createElement("div", { className: "rounded-xl bg-neutral-800 p-3" },
        react_1.default.createElement("div", { className: "font-medium mb-2" }, "Material base"),
        react_1.default.createElement("div", { className: "text-sm grid md:grid-cols-5 gap-2" },
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "opacity-70" }, "Nombre:"),
                " ",
                mb.material_nombre || "-"),
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "opacity-70" }, "Consumo:"),
                " ",
                mb.consumo ?? "-",
                " ",
                mb.unidad ?? "kg"),
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "opacity-70" }, "Costo unitario:"),
                " ",
                (0, money_1.money)(mb.costo_unitario)),
            react_1.default.createElement("div", { className: "md:col-span-2" },
                react_1.default.createElement("span", { className: "opacity-70" }, "Costo material:"),
                " ",
                (0, money_1.money)(mb.costo_total)),
            react_1.default.createElement("div", null,
                react_1.default.createElement("span", { className: "opacity-70" }, "Energ\u00EDa (kWh):"),
                " ",
                mb.energia_kwh?.toFixed(4) ?? "-"),
            react_1.default.createElement("div", { className: "md:col-span-2" },
                react_1.default.createElement("span", { className: "opacity-70" }, "Costo energ\u00EDa (material base):"),
                " ",
                (0, money_1.money)(mb.costo_energia)))));
}
