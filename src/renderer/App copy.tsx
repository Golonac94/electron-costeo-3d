import React, { useEffect, useMemo, useState } from "react";

/** ================================
 * App.tsx – Orquestador (one-page)
 * Tecnologías, materiales y procesos desde preload (window.api)
 * Con adaptador de respuesta para evitar crashes en el render
 * ================================ */

// ===== Tipos =====
type Tecnologia = { id: number; nombre: string };
type Material = { id: string; nombre: string; unidad: string };
type Proceso = { id: number; nombre: string };

type CosteoPayload = {
  tecnologia_impresion_id: number;
  material_base_id: string;
  procesos: number[];
  medidas: {
    peso_gramos?: number;
    duracion_impresion_horas?: number;
    area_cm2?: number;
  };
};

// Normalizados (lo que la tabla espera)
type CategoriaNorm = { categoria: string; costo: number };
type ProcesoNorm = {
  proceso_id: number | string;
  proceso_nombre: string;
  categorias: CategoriaNorm[];
  total_proceso: number;
};

// ★ cambio: añadimos energía al bloque de Material Base
type MaterialBaseNorm = {
  material_nombre: string;
  unidad?: string;
  consumo?: number;
  costo_unitario?: number;
  costo_total: number;
  energia_kwh?: number;      // ★
  costo_energia?: number;    // ★
};

// ===== API inyectada por preload =====
type PreloadAPI = {
  listTecnologias: () => Promise<Tecnologia[]>;
  listMaterialesByTecnologia: (tecId: number | string) => Promise<Material[]>;
  listProcesos: () => Promise<Proceso[]>;
  calcularCosteo: (payload: CosteoPayload) => Promise<any>; // respuesta flexible
};

// @ts-ignore – preload inyecta window.api
const injectedApi: PreloadAPI | undefined = (window as any)?.api;

function useApi(): PreloadAPI {
  if (!injectedApi) {
    throw new Error("API no disponible: asegúrate de exponer window.api desde preload.ts");
  }
  return injectedApi;
}

// ===== Util =====
const money = (n?: number, currency = "PEN") =>
  n == null ? "-" : new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);

// =====================================================
// App – navegación simple
// =====================================================
export default function App() {
  const [view, setView] = useState<"home" | "calculo" | "mantenimiento">("home");

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 p-4">
      <div className="max-w-5xl mx-auto grid gap-4">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Costeo 3D</h1>
        </header>

        {view === "home" && (
          <HomeView onGotoCalculo={() => setView("calculo")} onGotoMantenimiento={() => setView("mantenimiento")} />
        )}
        {view === "calculo" && <CalculoView onBack={() => setView("home")} />}
        {view === "mantenimiento" && <MantenimientoView onBack={() => setView("home")} />}
      </div>
    </div>
  );
}

// =====================================================
// Vistas
// =====================================================
function HomeView({
  onGotoCalculo,
  onGotoMantenimiento,
}: {
  onGotoCalculo: () => void;
  onGotoMantenimiento: () => void;
}) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <button onClick={onGotoCalculo} className="rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-6 text-left shadow">
        <div className="text-2xl font-semibold">Cálculo</div>
        <div className="opacity-80 mt-2">Ir a la pantalla de cálculo de costos.</div>
      </button>
      <button
        onClick={onGotoMantenimiento}
        className="rounded-2xl bg-neutral-800 hover:bg-neutral-700 p-6 text-left shadow border border-neutral-700"
      >
        <div className="text-2xl font-semibold">Mantenimiento</div>
        <div className="opacity-80 mt-2">Gestión de catálogos (materiales, procesos, etc.).</div>
      </button>
    </div>
  );
}

function MantenimientoView({ onBack }: { onBack: () => void }) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700">
        ← Volver
      </button>
      <div className="text-lg font-semibold">Mantenimiento</div>
      <div className="opacity-80">Aquí más adelante cargaremos formularios para manejar tecnologías, materiales, procesos y costos.</div>
    </div>
  );
}

function CalculoView({ onBack }: { onBack: () => void }) {
  const api = useApi();

  // Estado maestro
  const [tecs, setTecs] = useState<Tecnologia[]>([]);
  const [tecId, setTecId] = useState<number | null>(null);

  const [mats, setMats] = useState<Material[]>([]);
  const [matId, setMatId] = useState<string>("");

  const [procs, setProcs] = useState<Proceso[]>([]);
  const [procIds, setProcIds] = useState<number[]>([]); // numeric ids

  // Parámetros (UI en kg → backend en gramos)
  const [kilos, setKilos] = useState("");
  const [horas, setHoras] = useState("");
  const [area, setArea] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any | null>(null); // respuesta flexible

  // Cargar tecnologías y procesos (procesos comunes)
  useEffect(() => {
    (async () => {
      try {
        const [tecList, procList] = await Promise.all([api.listTecnologias(), api.listProcesos()]);
        setTecs(tecList);
        setProcs(procList);

        // Agregar "Impresión" por defecto (bloqueado)
        const imp = procList.find((p) => p.nombre.toUpperCase().includes("IMPRES"));
        if (imp) setProcIds((prev) => (prev.includes(imp.id) ? prev : [...prev, imp.id]));
      } catch (e: any) {
        setError(e?.message || "No se pudieron cargar tecnologías/procesos");
      }
    })();
  }, []);

  // Al elegir tecnología, cargar materiales
  useEffect(() => {
    if (tecId == null) return;
    (async () => {
      try {
        setError(null);
        setMatId("");
        setMats([]);
        const m = await api.listMaterialesByTecnologia(tecId);
        setMats(m);
      } catch (e: any) {
        setError(e?.message || "No se pudieron cargar materiales de la tecnología");
      }
    })();
  }, [tecId]);

  const payload: CosteoPayload | null = useMemo(() => {
    if (tecId == null || !matId || procIds.length === 0) return null;
    const medidas: CosteoPayload["medidas"] = {};
    if (kilos.trim()) medidas.peso_gramos = Number(kilos) * 1000;
    if (horas.trim()) medidas.duracion_impresion_horas = Number(horas);
    if (area.trim()) medidas.area_cm2 = Number(area);
    return {
      tecnologia_impresion_id: Number(tecId),
      material_base_id: matId,
      procesos: procIds.map(Number),
      medidas,
    };
  }, [tecId, matId, procIds, kilos, horas, area]);

  function toggleProc(id: number) {
    const p = procs.find((x) => x.id === id);
    const isImpresion = p ? p.nombre.toUpperCase().includes("IMPRES") : false;
    if (isImpresion) return;
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
    } catch (e: any) {
      setError(e?.message || "Error al calcular");
    } finally {
      setLoading(false);
    }
  }

  // ========= ADAPTADORES para render robusto =========

  // Proceso + categorías normalizados a lo que la tabla espera
const costosPorProcesoNorm: ProcesoNorm[] = useMemo(() => {
  // Helper seguro para normalizar una categoría
  const toCategoriaNorm = (item: unknown): CategoriaNorm | null => {
    if (!item || typeof item !== "object") return null;
    const o = item as Record<string, unknown>;

    const nombre =
      (typeof o.categoria === "string" && o.categoria) ||
      (typeof o.nombre === "string" && o.nombre) ||
      "";

    if (!nombre) return null;

    const costoRaw =
      (typeof o.costo === "number" ? o.costo : undefined) ??
      (typeof o.monto === "number" ? o.monto : undefined) ??
      Number(o.costo ?? o.monto ?? 0);

    const costo = Number.isFinite(costoRaw) ? Number(costoRaw) : 0;

    return { categoria: nombre, costo };
  };

  const raw: unknown[] = Array.isArray(result?.costos_por_proceso)
    ? (result!.costos_por_proceso as unknown[])
    : [];

  return raw.map((pUnknown): ProcesoNorm => {
    const p = (pUnknown ?? {}) as Record<string, unknown>;

    const categoriasRaw: unknown[] = Array.isArray(p.categorias)
      ? (p.categorias as unknown[])
      : Array.isArray(p.costos)
      ? (p.costos as unknown[])
      : [];

    const categorias: CategoriaNorm[] = categoriasRaw
      .map(toCategoriaNorm)
      .filter((x): x is CategoriaNorm => x !== null);

    const total =
      typeof p.total_proceso === "number"
        ? (p.total_proceso as number)
        : categorias.reduce((acc, x) => acc + (Number(x.costo) || 0), 0);

    return {
      proceso_id:
        (p.proceso_id as number | string | undefined) ??
        (p.id as number | string | undefined) ??
        "",
      proceso_nombre:
        (p.proceso_nombre as string | undefined) ??
        (p.nombre as string | undefined) ??
        "",
      categorias,
      total_proceso: total,
    };
  });
}, [result]);



  // ★ cambio: normalizamos energía del material base para mostrarla aparte
  const materialBaseNorm: MaterialBaseNorm | null = useMemo(() => {
    if (!result?.material_base) return null;
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
  const totalProcesos = useMemo(
    () => costosPorProcesoNorm.reduce((s, p) => s + (Number(p.total_proceso) || 0), 0),
    [costosPorProcesoNorm]
  );

  // ★ cambio: Total general = procesos + material + energía del material base
  const totalGeneral = useMemo(() => {
    const backend = result?.total_general;
    if (typeof backend === "number") return backend;
    const totalMaterial = materialBaseNorm?.costo_total ?? 0;
    const energiaMB = materialBaseNorm?.costo_energia ?? 0;
    return totalProcesos + totalMaterial + energiaMB;
  }, [result, totalProcesos, materialBaseNorm]);

  return (
    <div className="space-y-4">
      <button onClick={onBack} className="px-3 py-1 rounded-lg bg-neutral-800 border border-neutral-700">
        ← Volver
      </button>

      {/* Tecnologías */}
      <details open className="bg-neutral-900 rounded-2xl shadow border border-neutral-800">
        <summary className="cursor-pointer select-none p-4 text-lg font-semibold">Tecnologías de impresión</summary>
        <div className="p-4 pt-0">
          <div className="flex flex-wrap gap-2">
            {tecs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTecId(t.id)}
                className={`px-3 py-1 rounded-full border text-sm ${
                  tecId === t.id ? "bg-emerald-600 border-emerald-500" : "bg-neutral-800 border-neutral-700"
                }`}
                title={t.nombre}
              >
                {t.nombre}
              </button>
            ))}
            {tecs.length === 0 && <div className="text-sm opacity-70">Cargando tecnologías…</div>}
          </div>
        </div>
      </details>

      {/* Materiales */}
      <div className="bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4">
        <div className="text-lg font-semibold mb-2">Material</div>
        <div className="flex flex-wrap gap-2">
          {mats.map((m) => (
            <button
              key={m.id}
              onClick={() => setMatId(m.id)}
              disabled={tecId == null}
              className={`px-3 py-1 rounded-full border text-sm ${
                matId === m.id ? "bg-emerald-600 border-emerald-500" : "bg-neutral-800 border-neutral-700"
              }`}
            >
              {m.nombre}
            </button>
          ))}
          {tecId != null && mats.length === 0 && (
            <div className="text-sm opacity-70">No hay materiales para esta tecnología.</div>
          )}
          {tecId == null && <div className="text-sm opacity-70">Selecciona una tecnología primero.</div>}
        </div>
      </div>

      {/* Parámetros */}
      <div className="bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4">
        <div className="text-lg font-semibold mb-3">Parámetros</div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-sm">
            <div className="opacity-80">Peso (kg)</div>
            <input
              type="number"
              min={0}
              step={0.001}
              value={kilos}
              onChange={(e) => setKilos(e.target.value)}
              className="w-full rounded-xl bg-neutral-800 p-2 mt-1"
              placeholder="p.ej. 0.08"
            />
          </label>
          <label className="text-sm">
            <div className="opacity-80">Duración impresión (h)</div>
            <input
              type="number"
              min={0}
              step={0.01}
              value={horas}
              onChange={(e) => setHoras(e.target.value)}
              className="w-full rounded-xl bg-neutral-800 p-2 mt-1"
              placeholder="p.ej. 3.5"
            />
          </label>
          <label className="text-sm">
            <div className="opacity-80">Área post-proceso (cm²)</div>
            <input
              type="number"
              min={0}
              step={0.1}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl bg-neutral-800 p-2 mt-1"
              placeholder="p.ej. 120"
            />
          </label>
        </div>
      </div>

      {/* Procesos */}
      <div className="bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4">
        <div className="text-lg font-semibold mb-2">Procesos (comunes)</div>
        <div className="flex flex-wrap gap-3">
          {procs.map((p) => {
            const checked = procIds.includes(p.id);
            const isImpresion = p.nombre.toUpperCase().includes("IMPRES");
            return (
              <label
                key={p.id}
                className={`px-3 py-1 rounded-full border text-sm flex items-center gap-2 ${
                  checked ? "bg-emerald-600 border-emerald-500" : "bg-neutral-800 border-neutral-700"
                } ${isImpresion ? "opacity-90" : ""}`}
                title={isImpresion ? "Obligatorio" : ""}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleProc(p.id)} disabled={isImpresion} />
                {p.nombre}
                {isImpresion ? " (obligatorio)" : ""}
              </label>
            );
          })}
          {procs.length === 0 && <div className="text-sm opacity-70">Cargando procesos…</div>}
        </div>
      </div>

      {/* Acción */}
      <div className="flex items-center gap-3">
        <button
          onClick={calcular}
          disabled={loading || !payload}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Calculando…" : "Calcular"}
        </button>
        {error && <div className="text-red-400 text-sm">{error}</div>}
      </div>

      {/* Resultados */}
      {result && (
        <div className="bg-neutral-900 rounded-2xl shadow border border-neutral-800 p-4 space-y-4">
          <div className="text-lg font-semibold">Detalle de costos</div>

          {/* ★ Material base + energía propia del material */}
          {materialBaseNorm && (
            <div className="rounded-xl bg-neutral-800 p-3">
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr>
                  <th className="text-left px-2">Proceso</th>
                  <th className="text-left px-2">Categoría</th>
                  <th className="text-right px-2">Costo</th>
                </tr>
              </thead>
              <tbody>
                {costosPorProcesoNorm.map((p) => (
                  <React.Fragment key={String(p.proceso_id)}>
                    {p.categorias.map((c, idx) => (
                      <tr key={String(p.proceso_id) + "-" + idx} className="bg-neutral-800">
                        <td className="px-2 py-1">{idx === 0 ? p.proceso_nombre : ""}</td>
                        <td className="px-2 py-1">{c.categoria}</td>
                        <td className="px-2 py-1 text-right">{money(c.costo)}</td>
                      </tr>
                    ))}
                    <tr>
                      <td></td>
                      <td className="text-right font-medium pr-2">Subtotal {p.proceso_nombre}</td>
                      <td className="px-2 py-1 text-right font-semibold">{money(p.total_proceso)}</td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
              <tfoot>
                {/* ★ Resumen claro antes del total general */}
                <tr>
                  <td></td>
                  <td className="text-right font-medium pr-2">Total procesos</td>
                  <td className="px-2 py-1 text-right font-semibold">{money(totalProcesos)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-right font-medium pr-2">Costo material base</td>
                  <td className="px-2 py-1 text-right font-semibold">{money(materialBaseNorm?.costo_total ?? 0)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-right font-medium pr-2">Costo energía (material base)</td>
                  <td className="px-2 py-1 text-right font-semibold">{money(materialBaseNorm?.costo_energia ?? 0)}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="text-right font-bold pr-2">Total general</td>
                  <td className="px-2 py-1 text-right font-bold">{money(totalGeneral)}</td>
                </tr>
              </tfoot>
            </table>

            {costosPorProcesoNorm.length === 0 && (
              <div className="text-sm opacity-70 mt-2">Sin costos por proceso.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
