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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = App;
const react_1 = __importStar(require("react"));
// @ts-ignore – preload inyecta window.api
const injectedApi = window?.api;
function useApi() {
    if (!injectedApi) {
        throw new Error("API no disponible: asegúrate de exponer window.api desde preload.ts");
    }
    return injectedApi;
}
// ===== Util =====
const money = (n, currency = "PEN") => n == null ? "-" : new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);
// =====================================================
// App – navegación simple
// =====================================================
function App() {
    const [view, setView] = (0, react_1.useState)("home");
    return (react_1.default.createElement("div", { className: "min-h-screen w-full bg-neutral-950 text-neutral-200 p-4" },
        react_1.default.createElement("div", { className: "max-w-5xl mx-auto grid gap-4" },
            react_1.default.createElement("header", { className: "flex items-center justify-between" },
                react_1.default.createElement("h1", { className: "text-2xl font-bold" }, "Costeo 3D")),
            view === "home" && (react_1.default.createElement(HomeView, { onGotoCalculo: () => setView("calculo"), onGotoMantenimiento: () => setView("mantenimiento") })),
            view === "calculo" && react_1.default.createElement(CalculoView, { onBack: () => setView("home") }),
            view === "mantenimiento" && react_1.default.createElement(MantenimientoView, { onBack: () => setView("home") }))));
}
// =====================================================
// Vistas
// =====================================================
function HomeView({ onGotoCalculo, onGotoMantenimiento, }) {
    return (react_1.default.createElement("div", { className: "grid md:grid-cols-2 gap-4" },
        react_1.default.createElement("button", { onClick: onGotoCalculo, className: "rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-6 text-left shadow" },
            react_1.default.createElement("div", { className: "text-2xl font-semibold" }, "C\u00E1lculo"),
            react_1.default.createElement("div", { className: "opacity-80 mt-2" }, "Ir a la pantalla de c\u00E1lculo de costos.")),
        react_1.default.createElement("button", { onClick: onGotoMantenimiento, className: "rounded-2xl bg-neutral-800 hover:bg-neutral-700 p-6 text-left shadow border border-neutral-700" },
            react_1.default.createElement("div", { className: "text-2xl font-semibold" }, "Mantenimiento"),
            react_1.default.createElement("div", { className: "opacity-80 mt-2" }, "Gesti\u00F3n de cat\u00E1logos (materiales, procesos, etc.)."))));
}
function MantenimientoView({ onBack }) {
    return (react_1.default.createElement("div", { className: "space-y-4" },
        react_1.default.createElement("button", { onClick: onBack, className: "px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700" }, "\u2190 Volver"),
        react_1.default.createElement("div", { className: "text-lg font-semibold" }, "Mantenimiento"),
        react_1.default.createElement("div", { className: "opacity-80" }, "Aqu\u00ED m\u00E1s adelante cargaremos formularios para manejar tecnolog\u00EDas, materiales, procesos y costos.")));
}
function CalculoView({ onBack }) {
    const api = useApi();
    // Estado maestro
    const [tecs, setTecs] = (0, react_1.useState)([]);
    const [tecId, setTecId] = (0, react_1.useState)(null);
    const [mats, setMats] = (0, react_1.useState)([]);
    const [matId, setMatId] = (0, react_1.useState)("");
    const [procs, setProcs] = (0, react_1.useState)([]);
    const [procIds, setProcIds] = (0, react_1.useState)([]); // numeric ids
    // Parámetros (UI en kg → backend en gramos)
    const [kilos, setKilos] = (0, react_1.useState)("");
    const [horas, setHoras] = (0, react_1.useState)("");
    const [area, setArea] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [result, setResult] = (0, react_1.useState)(null); // respuesta flexible
    // Cargar tecnologías y procesos (procesos comunes)
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const [tecList, procList] = await Promise.all([api.listTecnologias(), api.listProcesos()]);
                setTecs(tecList);
                setProcs(procList);
                // Agregar "Impresión" por defecto (bloqueado)
                const imp = procList.find((p) => p.nombre.toUpperCase().includes("IMPRES"));
                if (imp)
                    setProcIds((prev) => (prev.includes(imp.id) ? prev : [...prev, imp.id]));
            }
            catch (e) {
                setError(e?.message || "No se pudieron cargar tecnologías/procesos");
            }
        })();
    }, []);
    // Al elegir tecnología, cargar materiales
    (0, react_1.useEffect)(() => {
        if (tecId == null)
            return;
        (async () => {
            try {
                setError(null);
                setMatId("");
                setMats([]);
                const m = await api.listMaterialesByTecnologia(tecId);
                setMats(m);
            }
            catch (e) {
                setError(e?.message || "No se pudieron cargar materiales de la tecnología");
            }
        })();
    }, [tecId]);
    const payload = (0, react_1.useMemo)(() => {
        if (tecId == null || !matId || procIds.length === 0)
            return null;
        const medidas = {};
        if (kilos.trim())
            medidas.peso_gramos = Number(kilos) * 1000;
        if (horas.trim())
            medidas.duracion_impresion_horas = Number(horas);
        if (area.trim())
            medidas.area_cm2 = Number(area);
        return {
            tecnologia_impresion_id: Number(tecId),
            material_base_id: matId,
            procesos: procIds.map(Number),
            medidas,
        };
    }, [tecId, matId, procIds, kilos, horas, area]);
    function toggleProc(id) {
        const p = procs.find((x) => x.id === id);
        const isImpresion = p ? p.nombre.toUpperCase().includes("IMPRES") : false;
        if (isImpresion)
            return;
        setProcIds((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]));
    }
    async function calcular() {
        if (!payload) {
            setError("Completa tecnología, material y procesos");
            return;
        }
        setError(null);
        setLoading(true);
        setResult(null);
        try {
            const r = await api.calcularCosteo(payload);
            setResult(r);
        }
        catch (e) {
            setError(e?.message || "Error al calcular");
        }
        finally {
            setLoading(false);
        }
    }
    // ========= ADAPTADORES para render robusto =========
    // Proceso + categorías normalizados a lo que la tabla espera
    const costosPorProcesoNorm = (0, react_1.useMemo)(() => {
        // Helper seguro para normalizar una categoría
        const toCategoriaNorm = (item) => {
            if (!item || typeof item !== "object")
                return null;
            const o = item;
            const nombre = (typeof o.categoria === "string" && o.categoria) ||
                (typeof o.nombre === "string" && o.nombre) ||
                "";
            if (!nombre)
                return null;
            const costoRaw = (typeof o.costo === "number" ? o.costo : undefined) ??
                (typeof o.monto === "number" ? o.monto : undefined) ??
                Number(o.costo ?? o.monto ?? 0);
            const costo = Number.isFinite(costoRaw) ? Number(costoRaw) : 0;
            return { categoria: nombre, costo };
        };
        const raw = Array.isArray(result?.costos_por_proceso)
            ? result.costos_por_proceso
            : [];
        return raw.map((pUnknown) => {
            const p = (pUnknown ?? {});
            const categoriasRaw = Array.isArray(p.categorias)
                ? p.categorias
                : Array.isArray(p.costos)
                    ? p.costos
                    : [];
            const categorias = categoriasRaw
                .map(toCategoriaNorm)
                .filter((x) => x !== null);
            const total = typeof p.total_proceso === "number"
                ? p.total_proceso
                : categorias.reduce((acc, x) => acc + (Number(x.costo) || 0), 0);
            return {
                proceso_id: p.proceso_id ??
                    p.id ??
                    "",
                proceso_nombre: p.proceso_nombre ??
                    p.nombre ??
                    "",
                categorias,
                total_proceso: total,
            };
        });
    }, [result]);
    // ★ cambio: normalizamos energía del material base para mostrarla aparte
    const materialBaseNorm = (0, react_1.useMemo)(() => {
        if (!result?.material_base)
            return null;
        const mb = result.material_base;
        return {
            material_nombre: mb.material_nombre ?? mb.nombre ?? "",
            unidad: mb.unidad ?? "kg",
            consumo: mb.consumo ?? (kilos ? Number(kilos) : undefined),
            costo_unitario: mb.costo_unitario,
            costo_total: Number(mb.costo_total ?? mb.costo_material ?? 0) || 0,
            energia_kwh: Number(mb.consumo_energia_kwh ?? mb.energia_kwh ?? 0) || 0,
            costo_energia: Number(mb.costo_energia ?? 0) || 0,
        };
    }, [result, kilos]);
    // ★ cambio: total de procesos para resumen y total general incluyendo energía
    const totalProcesos = (0, react_1.useMemo)(() => costosPorProcesoNorm.reduce((s, p) => s + (Number(p.total_proceso) || 0), 0), [costosPorProcesoNorm]);
    // ★ cambio: Total general = procesos + material + energía del material base
    const totalGeneral = (0, react_1.useMemo)(() => {
        const backend = result?.total_general;
        if (typeof backend === "number")
            return backend;
        const totalMaterial = materialBaseNorm?.costo_total ?? 0;
        const energiaMB = materialBaseNorm?.costo_energia ?? 0;
        return totalProcesos + totalMaterial + energiaMB;
    }, [result, totalProcesos, materialBaseNorm]);
    return (react_1.default.createElement("div", { className: "space-y-4" },
        react_1.default.createElement("button", { onClick: onBack, className: "px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700" }, "\u2190 Volver"),
        react_1.default.createElement("details", { open: true, className: "bg-neutral-900 rounded-2xl shadow border border-neutral-800" },
            react_1.default.createElement("summary", { className: "cursor-pointer select-none p-4 text-lg font-semibold" }, "Tecnolog\u00EDas de impresi\u00F3n"),
            react_1.default.createElement("div", { className: "p-4 pt-0" },
                react_1.default.createElement("div", { className: "flex flex-wrap gap-2" },
                    tecs.map((t) => (react_1.default.createElement("button", { key: t.id, onClick: () => setTecId(t.id), className: `px-3 py-1 rounded-full border text-sm ${tecId === t.id ? "bg-emerald-600 border-emerald-500" : "bg-neutral-800 border-neutral-700"}`, title: t.nombre }, t.nombre))),
                    tecs.length === 0 && react_1.default.createElement("div", { className: "text-sm opacity-70" }, "Cargando tecnolog\u00EDas\u2026")))),
        react_1.default.createElement("div", { className: "bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4" },
            react_1.default.createElement("div", { className: "text-lg font-semibold mb-2" }, "Material"),
            react_1.default.createElement("div", { className: "flex flex-wrap gap-2" },
                mats.map((m) => (react_1.default.createElement("button", { key: m.id, onClick: () => setMatId(m.id), disabled: tecId == null, className: `px-3 py-1 rounded-full border text-sm ${matId === m.id ? "bg-emerald-600 border-emerald-500" : "bg-neutral-800 border-neutral-700"}` }, m.nombre))),
                tecId != null && mats.length === 0 && (react_1.default.createElement("div", { className: "text-sm opacity-70" }, "No hay materiales para esta tecnolog\u00EDa.")),
                tecId == null && react_1.default.createElement("div", { className: "text-sm opacity-70" }, "Selecciona una tecnolog\u00EDa primero."))),
        react_1.default.createElement("div", { className: "bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4" },
            react_1.default.createElement("div", { className: "text-lg font-semibold mb-3" }, "Par\u00E1metros"),
            react_1.default.createElement("div", { className: "grid md:grid-cols-3 gap-3" },
                react_1.default.createElement("label", { className: "text-sm" },
                    react_1.default.createElement("div", { className: "opacity-80" }, "Peso (kg)"),
                    react_1.default.createElement("input", { type: "number", min: 0, step: 0.001, value: kilos, onChange: (e) => setKilos(e.target.value), className: "w-full rounded-xl bg-neutral-800 p-2 mt-1", placeholder: "p.ej. 0.08" })),
                react_1.default.createElement("label", { className: "text-sm" },
                    react_1.default.createElement("div", { className: "opacity-80" }, "Duraci\u00F3n impresi\u00F3n (h)"),
                    react_1.default.createElement("input", { type: "number", min: 0, step: 0.01, value: horas, onChange: (e) => setHoras(e.target.value), className: "w-full rounded-xl bg-neutral-800 p-2 mt-1", placeholder: "p.ej. 3.5" })),
                react_1.default.createElement("label", { className: "text-sm" },
                    react_1.default.createElement("div", { className: "opacity-80" }, "\u00C1rea post-proceso (cm\u00B2)"),
                    react_1.default.createElement("input", { type: "number", min: 0, step: 0.1, value: area, onChange: (e) => setArea(e.target.value), className: "w-full rounded-xl bg-neutral-800 p-2 mt-1", placeholder: "p.ej. 120" })))),
        react_1.default.createElement("div", { className: "bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4" },
            react_1.default.createElement("div", { className: "text-lg font-semibold mb-2" }, "Procesos (comunes)"),
            react_1.default.createElement("div", { className: "flex flex-wrap gap-3" },
                procs.map((p) => {
                    const checked = procIds.includes(p.id);
                    const isImpresion = p.nombre.toUpperCase().includes("IMPRES");
                    return (react_1.default.createElement("label", { key: p.id, className: `px-3 py-1 rounded-full border text-sm flex items-center gap-2 ${checked ? "bg-emerald-600 border-emerald-500" : "bg-neutral-800 border-neutral-700"} ${isImpresion ? "opacity-90" : ""}`, title: isImpresion ? "Obligatorio" : "" },
                        react_1.default.createElement("input", { type: "checkbox", checked: checked, onChange: () => toggleProc(p.id), disabled: isImpresion }),
                        p.nombre,
                        isImpresion ? " (obligatorio)" : ""));
                }),
                procs.length === 0 && react_1.default.createElement("div", { className: "text-sm opacity-70" }, "Cargando procesos\u2026"))),
        react_1.default.createElement("div", { className: "flex items-center gap-3" },
            react_1.default.createElement("button", { onClick: calcular, disabled: loading || !payload, className: "px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60" }, loading ? "Calculando…" : "Calcular"),
            error && react_1.default.createElement("div", { className: "text-red-400 text-sm" }, error)),
        result && (react_1.default.createElement("div", { className: "bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4 space-y-4" },
            react_1.default.createElement("div", { className: "text-lg font-semibold" }, "Detalle de costos"),
            materialBaseNorm && (react_1.default.createElement("div", { className: "rounded-xl bg-neutral-800 p-3" })),
            react_1.default.createElement("div", { className: "overflow-x-auto" },
                react_1.default.createElement("table", { className: "w-full text-sm border-separate border-spacing-y-2" },
                    react_1.default.createElement("thead", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("th", { className: "text-left px-2" }, "Proceso"),
                            react_1.default.createElement("th", { className: "text-left px-2" }, "Categor\u00EDa"),
                            react_1.default.createElement("th", { className: "text-right px-2" }, "Costo"))),
                    react_1.default.createElement("tbody", null, costosPorProcesoNorm.map((p) => (react_1.default.createElement(react_1.default.Fragment, { key: String(p.proceso_id) },
                        p.categorias.map((c, idx) => (react_1.default.createElement("tr", { key: String(p.proceso_id) + "-" + idx, className: "bg-neutral-800" },
                            react_1.default.createElement("td", { className: "px-2 py-1" }, idx === 0 ? p.proceso_nombre : ""),
                            react_1.default.createElement("td", { className: "px-2 py-1" }, c.categoria),
                            react_1.default.createElement("td", { className: "px-2 py-1 text-right" }, money(c.costo))))),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null),
                            react_1.default.createElement("td", { className: "text-right font-medium pr-2" },
                                "Subtotal ",
                                p.proceso_nombre),
                            react_1.default.createElement("td", { className: "px-2 py-1 text-right font-semibold" }, money(p.total_proceso))))))),
                    react_1.default.createElement("tfoot", null,
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null),
                            react_1.default.createElement("td", { className: "text-right font-medium pr-2" }, "Total procesos"),
                            react_1.default.createElement("td", { className: "px-2 py-1 text-right font-semibold" }, money(totalProcesos))),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null),
                            react_1.default.createElement("td", { className: "text-right font-medium pr-2" }, "Costo material base"),
                            react_1.default.createElement("td", { className: "px-2 py-1 text-right font-semibold" }, money(materialBaseNorm?.costo_total ?? 0))),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null),
                            react_1.default.createElement("td", { className: "text-right font-medium pr-2" }, "Costo energ\u00EDa (material base)"),
                            react_1.default.createElement("td", { className: "px-2 py-1 text-right font-semibold" }, money(materialBaseNorm?.costo_energia ?? 0))),
                        react_1.default.createElement("tr", null,
                            react_1.default.createElement("td", null),
                            react_1.default.createElement("td", { className: "text-right font-bold pr-2" }, "Total general"),
                            react_1.default.createElement("td", { className: "px-2 py-1 text-right font-bold" }, money(totalGeneral))))),
                costosPorProcesoNorm.length === 0 && (react_1.default.createElement("div", { className: "text-sm opacity-70 mt-2" }, "Sin costos por proceso.")))))));
}
