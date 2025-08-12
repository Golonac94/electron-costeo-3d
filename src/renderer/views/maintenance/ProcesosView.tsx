import React from "react";
import s from "../MantenimientoView.module.css";

export default function ProcesosView() {
  return (
    <div className={s.panel}>
      <div className={s.actions}>
        <button className={s.primaryBtn}>+ Nuevo proceso</button>
      </div>
      <p style={{marginTop: 10}}>
        CRUD de <strong>procesos</strong>. <em>Impresión</em> debe quedar protegido (no borrar/inactivar).
      </p>
    </div>
  );
}
