
import React from "react";
import s from "../MantenimientoView.module.css";

export default function MaterialesBaseView() {
  return (
    <div className={s.panel}>
      <div className={s.actions}>
        <button className={s.primaryBtn}>+ Nuevo material base</button>
      </div>
      <p style={{marginTop: 10}}>
        CRUD de <strong>materiales_base</strong> (id, tecnología, nombre, costo_kg, consumo_energia_kwh).
      </p>
    </div>
  );
}
