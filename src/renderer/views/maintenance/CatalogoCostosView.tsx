import React from "react";
import s from "../MantenimientoView.module.css";

export default function CatalogoCostosView() {
  return (
    <div className={s.panel}>
      <div className={s.actions}>
        <button className={s.primaryBtn}>+ Agregar ítem</button>
      </div>
      <p style={{marginTop: 10}}>
        Aquí va el CRUD de <strong>catalogo_costos</strong> (id, nombre, categoría, unidad, costo_unitario).
      </p>
      <ul style={{marginTop: 6, color:"#475569"}}>
        <li>• Filtro por categoría</li>
        <li>• Edición inline de precio</li>
        <li>• Inactivar en vez de borrar</li>
      </ul>
    </div>
  );
}
