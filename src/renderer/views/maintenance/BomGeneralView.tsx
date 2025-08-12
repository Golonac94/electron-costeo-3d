import React from "react";
import s from "../MantenimientoView.module.css";

export default function BomGeneralView() {
  return (
    <div className={s.panel}>
      <div className={s.actions} style={{marginBottom: 10}}>
        <select><option>Tecnología…</option></select>
        <select><option>Proceso…</option></select>
        <button className={s.primaryBtn}>+ Agregar ítem de costo</button>
      </div>
      <p>
        CRUD de <strong>bom_general</strong> (tec, proceso, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad).
      </p>
      <ul style={{marginTop: 6, color:"#475569"}}>
        <li>• Validar clave única (tec+proc+item)</li>
        <li>• driver_id ∈ unidades</li>
        <li>• Preview de subtotal con inputs de prueba</li>
      </ul>
    </div>
  );
}
