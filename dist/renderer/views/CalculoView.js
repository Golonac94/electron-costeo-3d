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
exports.default = CalculoView;
const react_1 = __importStar(require("react"));
const useApi_1 = require("../hooks/useApi");
const money_1 = require("../lib/money");
const ProcessCostsTable_1 = __importDefault(require("../components/ProcessCostsTable"));
const CalculoView_module_css_1 = __importDefault(require("./CalculoView.module.css"));
function CalculoView({ onBack }) {
    const api = (0, useApi_1.useApi)();
    const [tecs, setTecs] = (0, react_1.useState)([]);
    const [tecId, setTecId] = (0, react_1.useState)(null);
    const [margen, setMargen] = (0, react_1.useState)("10"); // % por defecto
    const [mats, setMats] = (0, react_1.useState)([]);
    const [matId, setMatId] = (0, react_1.useState)("");
    const [procs, setProcs] = (0, react_1.useState)([]);
    const [procIds, setProcIds] = (0, react_1.useState)([]);
    const [kilos, setKilos] = (0, react_1.useState)("");
    const [horas, setHoras] = (0, react_1.useState)("");
    const [area, setArea] = (0, react_1.useState)("");
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const [result, setResult] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        (async () => {
            try {
                const [tecList, procList] = await Promise.all([api.listTecnologias(), api.listProcesos()]);
                setTecs(tecList);
                setProcs(procList);
                const imp = procList.find((p) => p.nombre.toUpperCase().includes("IMPRES"));
                if (imp)
                    setProcIds((prev) => (prev.includes(imp.id) ? prev : [...prev, imp.id]));
            }
            catch (e) {
                setError(e?.message || "No se pudieron cargar tecnologías/procesos");
            }
        })();
    }, [api]);
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
    }, [tecId, api]);
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
        return { tecnologia_impresion_id: Number(tecId), material_base_id: matId, procesos: procIds.map(Number), medidas };
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
    // === Adaptadores ===
    const costosPorProcesoNorm = (0, react_1.useMemo)(() => {
        const toCategoriaNorm = (item) => {
            if (!item || typeof item !== "object")
                return null;
            const o = item;
            const nombre = (typeof o.categoria === "string" && o.categoria) ||
                (typeof o.nombre === "string" && o.nombre) || "";
            if (!nombre)
                return null;
            const costoRaw = (typeof o.costo === "number" ? o.costo : undefined) ??
                (typeof o.monto === "number" ? o.monto : undefined) ??
                Number(o.costo ?? o.monto ?? 0);
            const costo = Number.isFinite(costoRaw) ? Number(costoRaw) : 0;
            return { categoria: nombre, costo };
        };
        const raw = Array.isArray(result?.costos_por_proceso)
            ? result.costos_por_proceso : [];
        return raw.map((pUnknown) => {
            const p = (pUnknown ?? {});
            const catRaw = Array.isArray(p.categorias)
                ? p.categorias
                : Array.isArray(p.costos)
                    ? p.costos
                    : [];
            const categorias = catRaw.map(toCategoriaNorm).filter((x) => x !== null);
            const total = typeof p.total_proceso === "number"
                ? p.total_proceso
                : categorias.reduce((acc, x) => acc + (Number(x.costo) || 0), 0);
            return {
                proceso_id: p.proceso_id ?? p.id ?? "",
                proceso_nombre: p.proceso_nombre ?? p.nombre ?? "",
                categorias,
                total_proceso: total,
            };
        });
    }, [result]);
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
    const totalProcesos = (0, react_1.useMemo)(() => costosPorProcesoNorm.reduce((s, p) => s + (Number(p.total_proceso) || 0), 0), [costosPorProcesoNorm]);
    const totalGeneral = (0, react_1.useMemo)(() => {
        if (typeof result?.total_general === "number")
            return result.total_general;
        const totalMaterial = materialBaseNorm?.costo_total ?? 0;
        const energiaMB = materialBaseNorm?.costo_energia ?? 0;
        return totalProcesos + totalMaterial + energiaMB;
    }, [result, totalProcesos, materialBaseNorm]);
    // Precio de Venta con margen sobre precio de venta (margen bruto):
    // PV = Costo / (1 - m)
    const precioVenta = (0, react_1.useMemo)(() => {
        const m = Number(margen);
        const mFrac = isFinite(m) ? m / 100 : 0;
        if (mFrac < 0 || mFrac >= 1)
            return null; // margen inválido
        return totalGeneral / (1 - mFrac);
    }, [totalGeneral, margen]);
    // ⚠️ Si quisieras "markup" (margen sobre costo):
    // return totalGeneral * (1 + mFrac);
    return (react_1.default.createElement("div", { className: CalculoView_module_css_1.default.page },
        react_1.default.createElement("button", { onClick: onBack, className: `${CalculoView_module_css_1.default.backBtn} ${CalculoView_module_css_1.default.backBtnCompact} ${CalculoView_module_css_1.default.backBtnAccent}`, title: "Volver (no guarda cambios)" }, "\u2190 Volver"),
        react_1.default.createElement("div", { className: CalculoView_module_css_1.default.rowGrid },
            react_1.default.createElement("div", { className: `${CalculoView_module_css_1.default.col} ${CalculoView_module_css_1.default.panel}` },
                react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panelHeader }, "Tecnolog\u00EDas de impresi\u00F3n"),
                react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panelBody },
                    react_1.default.createElement("div", { className: CalculoView_module_css_1.default.chips },
                        tecs.map((t) => (react_1.default.createElement("button", { key: t.id, onClick: () => setTecId(t.id), className: `${CalculoView_module_css_1.default.chip} ${tecId === t.id ? CalculoView_module_css_1.default.chipActive : ""}`, title: t.nombre }, t.nombre))),
                        tecs.length === 0 && react_1.default.createElement("div", { style: { opacity: .7, fontSize: ".9rem" } }, "Cargando tecnolog\u00EDas\u2026")))),
            react_1.default.createElement("div", { className: `${CalculoView_module_css_1.default.col} ${CalculoView_module_css_1.default.panel}` },
                react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panelHeader }, "Material"),
                react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panelBody },
                    react_1.default.createElement("select", { className: CalculoView_module_css_1.default.select, value: matId, onChange: (e) => setMatId(e.target.value), disabled: tecId == null || mats.length === 0 },
                        react_1.default.createElement("option", { value: "" }, tecId == null ? "Selecciona una tecnología primero" : "Selecciona un material"),
                        mats.map((m) => (react_1.default.createElement("option", { key: m.id, value: m.id }, m.nombre)))),
                    react_1.default.createElement("div", { className: CalculoView_module_css_1.default.helper }, tecId == null
                        ? "Elige una tecnología para ver materiales."
                        : mats.length > 0
                            ? `${mats.length} materiales disponibles`
                            : "No hay materiales para esta tecnología.")))),
        react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panel },
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panelHeader }, "Par\u00E1metros"),
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.panelBody },
                react_1.default.createElement("div", { className: CalculoView_module_css_1.default.paramGrid },
                    react_1.default.createElement("label", { className: CalculoView_module_css_1.default.field },
                        react_1.default.createElement("span", { className: CalculoView_module_css_1.default.fieldLabel }, "Peso (kg)"),
                        react_1.default.createElement("input", { className: CalculoView_module_css_1.default.input, type: "number", min: 0, step: 0.001, value: kilos, onChange: (e) => setKilos(e.target.value), placeholder: "p.ej. 0.08" })),
                    react_1.default.createElement("label", { className: CalculoView_module_css_1.default.field },
                        react_1.default.createElement("span", { className: CalculoView_module_css_1.default.fieldLabel }, "Duraci\u00F3n impresi\u00F3n (h)"),
                        react_1.default.createElement("input", { className: CalculoView_module_css_1.default.input, type: "number", min: 0, step: 0.01, value: horas, onChange: (e) => setHoras(e.target.value), placeholder: "p.ej. 3.5" })),
                    react_1.default.createElement("label", { className: CalculoView_module_css_1.default.field },
                        react_1.default.createElement("span", { className: CalculoView_module_css_1.default.fieldLabel }, "\u00C1rea post-proceso (cm\u00B2)"),
                        react_1.default.createElement("input", { className: CalculoView_module_css_1.default.input, type: "number", min: 0, step: 0.1, value: area, onChange: (e) => setArea(e.target.value), placeholder: "p.ej. 120" }))))),
        react_1.default.createElement("div", { className: CalculoView_module_css_1.default.card },
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.sectionTitle }, "Procesos (comunes)"),
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.chips },
                procs.map((p) => {
                    const checked = procIds.includes(p.id);
                    const isImpresion = p.nombre.toUpperCase().includes("IMPRES");
                    return (react_1.default.createElement("label", { key: p.id, title: isImpresion ? "Obligatorio" : "", className: `${CalculoView_module_css_1.default.procChip} ${checked ? CalculoView_module_css_1.default.procChipActive : ""} ${isImpresion ? CalculoView_module_css_1.default.procChipDisabled : ""}` },
                        react_1.default.createElement("input", { type: "checkbox", checked: checked, onChange: () => toggleProc(p.id), disabled: isImpresion }),
                        p.nombre,
                        isImpresion ? " (obligatorio)" : ""));
                }),
                procs.length === 0 && react_1.default.createElement("div", { style: { opacity: .7, fontSize: ".9rem" } }, "Cargando procesos\u2026"))),
        react_1.default.createElement("div", { className: CalculoView_module_css_1.default.marginPanel },
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.marginRow },
                react_1.default.createElement("label", { className: CalculoView_module_css_1.default.fieldInline },
                    react_1.default.createElement("span", { className: CalculoView_module_css_1.default.fieldLabel }, "Margen (%)"),
                    react_1.default.createElement("input", { className: CalculoView_module_css_1.default.percentInput, type: "number", min: 0, max: 95, step: 0.1, value: margen, onChange: (e) => setMargen(e.target.value), placeholder: "p.ej. 10" })),
                react_1.default.createElement("div", { className: CalculoView_module_css_1.default.marginHint },
                    "Se aplica como ",
                    react_1.default.createElement("strong", null, "margen sobre precio de venta"),
                    ": PV = Costo / (1 \u2212 margen)."))),
        react_1.default.createElement("div", { className: CalculoView_module_css_1.default.actions },
            react_1.default.createElement("button", { onClick: calcular, disabled: loading || !payload, className: CalculoView_module_css_1.default.primaryBtn }, loading ? "Calculando…" : "Calcular"),
            error && react_1.default.createElement("div", { className: CalculoView_module_css_1.default.error }, error)),
        result && (react_1.default.createElement("div", { className: CalculoView_module_css_1.default.resultsCard },
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.resultsTitle }, "Detalle de costos"),
            react_1.default.createElement(ProcessCostsTable_1.default, { data: costosPorProcesoNorm, totalProcesos: totalProcesos, costoMaterial: materialBaseNorm?.costo_total ?? 0, costoEnergiaMaterial: materialBaseNorm?.costo_energia ?? 0, totalGeneral: totalGeneral }))),
        precioVenta != null && (react_1.default.createElement("div", { className: CalculoView_module_css_1.default.saleBox },
            react_1.default.createElement("div", { className: CalculoView_module_css_1.default.saleLabel },
                "Precio de Venta (margen ",
                Number(margen || 0).toFixed(1),
                "%)"),
            react_1.default.createElement("div", { className: `${CalculoView_module_css_1.default.saleValue} ${CalculoView_module_css_1.default.saleValueNum}` }, (0, money_1.money)(precioVenta))))));
}
