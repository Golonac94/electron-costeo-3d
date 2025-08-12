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
exports.default = App;
const react_1 = __importStar(require("react"));
const HomeView_1 = __importDefault(require("./views/HomeView"));
const CalculoView_1 = __importDefault(require("./views/CalculoView"));
const MantenimientoView_1 = __importDefault(require("./views/MantenimientoView"));
function App() {
    const [view, setView] = (0, react_1.useState)("home");
    return (react_1.default.createElement("div", { className: "min-h-screen w-full bg-neutral-950 text-neutral-200 p-4" },
        react_1.default.createElement("div", { className: "max-w-5xl mx-auto grid gap-4" },
            react_1.default.createElement("header", { className: "flex items-center justify-between" },
                react_1.default.createElement("h1", { className: "text-2xl font-bold" }, "Costeo 3D")),
            view === "home" && (react_1.default.createElement(HomeView_1.default, { onGotoCalculo: () => setView("calculo"), onGotoMantenimiento: () => setView("mantenimiento") })),
            view === "calculo" && react_1.default.createElement(CalculoView_1.default, { onBack: () => setView("home") }),
            view === "mantenimiento" && react_1.default.createElement(MantenimientoView_1.default, { onBack: () => setView("home") }))));
}
