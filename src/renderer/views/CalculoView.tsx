import React, { useEffect, useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";
import { money } from "../lib/money";
import ProcessCostsTable from "../components/ProcessCostsTable";
import styles from "./CalculoView.module.css";
import type {
  Tecnologia, Material, Proceso, CosteoPayload,
  ProcesoNorm, CategoriaNorm, MaterialBaseNorm, ResultadoCosto
} from "../types/costeo";

export default function CalculoView({ onBack }: { onBack: () => void }) {
  const api = useApi();

  const [tecs, setTecs] = useState<Tecnologia[]>([]);
  const [tecId, setTecId] = useState<number | null>(null);
const [margen, setMargen] = useState<string>("10"); // % por defecto

  const [mats, setMats] = useState<Material[]>([]);
  const [matId, setMatId] = useState<string>("");

  const [procs, setProcs] = useState<Proceso[]>([]);
  const [procIds, setProcIds] = useState<number[]>([]);

  const [kilos, setKilos] = useState("");
  const [horas, setHoras] = useState("");
  const [area, setArea] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultadoCosto | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [tecList, procList] = await Promise.all([api.listTecnologias(), api.listProcesos()]);
        setTecs(tecList); setProcs(procList);
        const imp = procList.find((p) => p.nombre.toUpperCase().includes("IMPRES"));
        if (imp) setProcIds((prev) => (prev.includes(imp.id) ? prev : [...prev, imp.id]));
      } catch (e: any) { setError(e?.message || "No se pudieron cargar tecnologías/procesos"); }
    })();
  }, [api]);

  useEffect(() => {
    if (tecId == null) return;
    (async () => {
      try {
        setError(null); setMatId(""); setMats([]);
        const m = await api.listMaterialesByTecnologia(tecId);
        setMats(m);
      } catch (e: any) { setError(e?.message || "No se pudieron cargar materiales de la tecnología"); }
    })();
  }, [tecId, api]);

  

  const payload: CosteoPayload | null = useMemo(() => {
    if (tecId == null || !matId || procIds.length === 0) return null;
    const medidas: CosteoPayload["medidas"] = {};
    if (kilos.trim()) medidas.peso_gramos = Number(kilos) * 1000;
    if (horas.trim()) medidas.duracion_impresion_horas = Number(horas);
    if (area.trim()) medidas.area_cm2 = Number(area);
    return { tecnologia_impresion_id: Number(tecId), material_base_id: matId, procesos: procIds.map(Number), medidas };
  }, [tecId, matId, procIds, kilos, horas, area]);

  function toggleProc(id: number) {
    const p = procs.find((x) => x.id === id);
    const isImpresion = p ? p.nombre.toUpperCase().includes("IMPRES") : false;
    if (isImpresion) return;
    setProcIds((curr) => (curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]));
  }

  async function calcular() {
    if (!payload) { setError("Completa tecnología, material y procesos"); return; }
    setError(null); setLoading(true); setResult(null);
    try { const r = await api.calcularCosteo(payload); setResult(r); }
    catch (e: any) { setError(e?.message || "Error al calcular"); }
    finally { setLoading(false); }
  }

  // === Adaptadores ===
  const costosPorProcesoNorm: ProcesoNorm[] = useMemo(() => {
    const toCategoriaNorm = (item: unknown): CategoriaNorm | null => {
      if (!item || typeof item !== "object") return null;
      const o = item as Record<string, unknown>;
      const nombre =
        (typeof o.categoria === "string" && o.categoria) ||
        (typeof o.nombre === "string" && o.nombre) || "";
      if (!nombre) return null;
      const costoRaw =
        (typeof o.costo === "number" ? o.costo : undefined) ??
        (typeof o.monto === "number" ? o.monto : undefined) ??
        Number(o.costo ?? o.monto ?? 0);
      const costo = Number.isFinite(costoRaw) ? Number(costoRaw) : 0;
      return { categoria: nombre, costo };
    };

    const raw: unknown[] = Array.isArray(result?.costos_por_proceso)
      ? (result!.costos_por_proceso as unknown[]) : [];

    return raw.map((pUnknown): ProcesoNorm => {
      const p = (pUnknown ?? {}) as Record<string, unknown>;
      const catRaw: unknown[] = Array.isArray(p.categorias)
        ? (p.categorias as unknown[])
        : Array.isArray(p.costos)
        ? (p.costos as unknown[])
        : [];
      const categorias: CategoriaNorm[] = catRaw.map(toCategoriaNorm).filter((x): x is CategoriaNorm => x !== null);

      const total =
        typeof p.total_proceso === "number"
          ? (p.total_proceso as number)
          : categorias.reduce((acc, x) => acc + (Number(x.costo) || 0), 0);

      return {
        proceso_id: (p.proceso_id as number | string | undefined) ?? (p.id as number | string | undefined) ?? "",
        proceso_nombre: (p.proceso_nombre as string | undefined) ?? (p.nombre as string | undefined) ?? "",
        categorias,
        total_proceso: total,
      };
    });
  }, [result]);

  const materialBaseNorm: MaterialBaseNorm | null = useMemo(() => {
    if (!result?.material_base) return null;
    const mb = result.material_base as Record<string, unknown>;
    return {
      material_nombre: (mb.material_nombre as string) ?? (mb.nombre as string) ?? "",
      unidad: (mb.unidad as string) ?? "kg",
      consumo: (mb.consumo as number) ?? (kilos ? Number(kilos) : undefined),
      costo_unitario: mb.costo_unitario as number | undefined,
      costo_total: Number((mb.costo_total as number | undefined) ?? (mb.costo_material as number | undefined) ?? 0) || 0,
      energia_kwh: Number((mb.consumo_energia_kwh as number | undefined) ?? (mb.energia_kwh as number | undefined) ?? 0) || 0,
      costo_energia: Number((mb.costo_energia as number | undefined) ?? 0) || 0,
    };
  }, [result, kilos]);

  const totalProcesos = useMemo(
    () => costosPorProcesoNorm.reduce((s, p) => s + (Number(p.total_proceso) || 0), 0),
    [costosPorProcesoNorm]
  );

  const totalGeneral = useMemo(() => {
    if (typeof result?.total_general === "number") return result.total_general!;
    const totalMaterial = materialBaseNorm?.costo_total ?? 0;
    const energiaMB = materialBaseNorm?.costo_energia ?? 0;
    return totalProcesos + totalMaterial + energiaMB;
  }, [result, totalProcesos, materialBaseNorm]);


  // Precio de Venta con margen sobre precio de venta (margen bruto):
// PV = Costo / (1 - m)
const precioVenta = useMemo(() => {
  const m = Number(margen);
  const mFrac = isFinite(m) ? m / 100 : 0;
  if (mFrac < 0 || mFrac >= 1) return null;  // margen inválido
  return totalGeneral / (1 - mFrac);
}, [totalGeneral, margen]);

// ⚠️ Si quisieras "markup" (margen sobre costo):
// return totalGeneral * (1 + mFrac);


  return (
    <div className={styles.page}>
      
      <button
  onClick={onBack}
  className={`${styles.backBtn} ${styles.backBtnCompact} ${styles.backBtnAccent}`}
  title="Volver (no guarda cambios)"
>
  ← Volver
</button>


{/* Tecnologías + Material (misma fila y estilo) */}
<div className={styles.rowGrid}>
  {/* Tecnologías */}
  <div className={`${styles.col} ${styles.panel}`}>
    <div className={styles.panelHeader}>Tecnologías de impresión</div>
    <div className={styles.panelBody}>
      <div className={styles.chips}>
        {tecs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTecId(t.id)}
            className={`${styles.chip} ${tecId === t.id ? styles.chipActive : ""}`}
            title={t.nombre}
          >
            {t.nombre}
          </button>
        ))}
        {tecs.length === 0 && <div style={{ opacity: .7, fontSize: ".9rem" }}>Cargando tecnologías…</div>}
      </div>
    </div>
  </div>

  {/* Material (desplegable) */}
  <div className={`${styles.col} ${styles.panel}`}>
    <div className={styles.panelHeader}>Material</div>
    <div className={styles.panelBody}>
      <select
        className={styles.select}
        value={matId}
        onChange={(e) => setMatId(e.target.value)}
        disabled={tecId == null || mats.length === 0}
      >
        <option value="">{tecId == null ? "Selecciona una tecnología primero" : "Selecciona un material"}</option>
        {mats.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>
      <div className={styles.helper}>
        {tecId == null
          ? "Elige una tecnología para ver materiales."
          : mats.length > 0
          ? `${mats.length} materiales disponibles`
          : "No hay materiales para esta tecnología."}
      </div>
    </div>
  </div>
</div>

{/* Parámetros */}
<div className={styles.panel}>
  <div className={styles.panelHeader}>Parámetros</div>
  <div className={styles.panelBody}>
    <div className={styles.paramGrid}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Peso (kg)</span>
        <input
          className={styles.input}
          type="number" min={0} step={0.001}
          value={kilos} onChange={(e) => setKilos(e.target.value)}
          placeholder="p.ej. 0.08"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Duración impresión (h)</span>
        <input
          className={styles.input}
          type="number" min={0} step={0.01}
          value={horas} onChange={(e) => setHoras(e.target.value)}
          placeholder="p.ej. 3.5"
        />
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Área post-proceso (cm²)</span>
        <input
          className={styles.input}
          type="number" min={0} step={0.1}
          value={area} onChange={(e) => setArea(e.target.value)}
          placeholder="p.ej. 120"
        />
      </label>
    </div>
  </div>
</div>

      {/* Procesos */}
      <div className={styles.card}>
        <div className={styles.sectionTitle}>Procesos (comunes)</div>
        <div className={styles.chips}>
          {procs.map((p) => {
            const checked = procIds.includes(p.id);
            const isImpresion = p.nombre.toUpperCase().includes("IMPRES");
            return (
              <label
                key={p.id}
                title={isImpresion ? "Obligatorio" : ""}
                className={`${styles.procChip} ${checked ? styles.procChipActive : ""} ${isImpresion ? styles.procChipDisabled : ""}`}
              >
                <input type="checkbox" checked={checked} onChange={() => toggleProc(p.id)} disabled={isImpresion} />
                {p.nombre}{isImpresion ? " (obligatorio)" : ""}
              </label>
            );
          })}
          {procs.length === 0 && <div style={{ opacity: .7, fontSize: ".9rem" }}>Cargando procesos…</div>}
        </div>
      </div>

      {/* Margen */}
<div className={styles.marginPanel}>
  <div className={styles.marginRow}>
    <label className={styles.fieldInline}>
      <span className={styles.fieldLabel}>Margen (%)</span>
      <input
        className={styles.percentInput}
        type="number"
        min={0}
        max={95}
        step={0.1}
        value={margen}
        onChange={(e) => setMargen(e.target.value)}
        placeholder="p.ej. 10"
      />
    </label>
    <div className={styles.marginHint}>
      Se aplica como <strong>margen sobre precio de venta</strong>: PV = Costo / (1 − margen).
    </div>
  </div>
</div>


      {/* Acción */}
      <div className={styles.actions}>
        <button onClick={calcular} disabled={loading || !payload} className={styles.primaryBtn}>
          {loading ? "Calculando…" : "Calcular"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </div>

      {/* Resultados */}
      {result && (
        <div className={styles.resultsCard}>
          <div className={styles.resultsTitle}>Detalle de costos</div>
          <ProcessCostsTable
            data={costosPorProcesoNorm}
            totalProcesos={totalProcesos}
            costoMaterial={materialBaseNorm?.costo_total ?? 0}
            costoEnergiaMaterial={materialBaseNorm?.costo_energia ?? 0}
            totalGeneral={totalGeneral}
          />
        </div>
      )}

    {precioVenta != null && (
  <div className={styles.saleBox}>
    <div className={styles.saleLabel}>
      Precio de Venta (margen {Number(margen || 0).toFixed(1)}%)
    </div>
    <div className={`${styles.saleValue} ${styles.saleValueNum}`}>
      {money(precioVenta)}
    </div>
  </div>
)}


    </div>

  );
}
