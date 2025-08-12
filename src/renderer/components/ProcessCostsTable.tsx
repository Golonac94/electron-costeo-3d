import React from "react";
import styles from "./ProcessCostsTable.module.css";
import { ProcesoNorm } from "../types/costeo";
import { money } from "../lib/money";

export default function ProcessCostsTable({
  data,
  totalProcesos,
  costoMaterial,
  costoEnergiaMaterial,
  totalGeneral,
}: {
  data: ProcesoNorm[];
  totalProcesos: number;
  costoMaterial: number;
  costoEnergiaMaterial: number;
  totalGeneral: number;
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.scrollArea}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Proceso</th>
              <th>Categoría</th>
              <th>Costo</th>
            </tr>
          </thead>
          <tbody>
            {data.map((p) => (
              <React.Fragment key={p.proceso_id}>
                <tr className={styles.procesoRow}>
                  <td colSpan={3}>{p.proceso_nombre}</td>
                </tr>
                {p.categorias.map((c, idx) => (
                  <tr key={idx}>
                    <td></td>
                    <td>{c.categoria}</td>
                    <td className={styles.numeric}>{money(c.costo)}</td>
                  </tr>
                ))}
                <tr className={styles.subtotalRow}>
                  <td></td>
                  <td>Subtotal {p.proceso_nombre}</td>
                  <td className={styles.numeric}>{money(p.total_proceso)}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

<div className={styles.totals}>
  <table className={styles.totalsTable}>
    <tbody>
      <tr className={styles.totalRow}>
        <td>Total procesos</td>
        <td className={styles.numeric}>{money(totalProcesos)}</td>
      </tr>
      <tr className={styles.totalRow}>
        <td>Costo material base</td>
        <td className={styles.numeric}>{money(costoMaterial)}</td>
      </tr>
      <tr className={styles.totalRow}>
        <td>Costo energía (material base)</td>
        <td className={styles.numeric}>{money(costoEnergiaMaterial)}</td>
      </tr>
      <tr className={styles.totalGeneralRow}>
        <td>Total general</td>
        <td className={styles.numeric}>{money(totalGeneral)}</td>
      </tr>
    </tbody>
  </table>
</div>

    </div>
  );
}
