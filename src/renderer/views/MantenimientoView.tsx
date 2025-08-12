import React, { useMemo, useState } from "react";
import styles from "./MantenimientoView.module.css";

// Sub-vistas (placeholders por ahora)
import CatalogoCostosView from "./maintenance/CatalogoCostosView";
import TecnologiasView from "./maintenance/TecnologiasView";
import MaterialesBaseView from "./maintenance/MaterialesBaseView";
import ProcesosView from "./maintenance/ProcesosView";
import BomGeneralView from "./maintenance/BomGeneralView";

type Section = "catalogo" | "tecnologias" | "materiales" | "procesos" | "bom";

export default function MantenimientoView({ onBack }: { onBack: () => void }) {
  const [section, setSection] = useState<Section>("catalogo");

  const title = useMemo(() => {
    switch (section) {
      case "catalogo": return "Catálogo de costos";
      case "tecnologias": return "Tecnologías de impresión";
      case "materiales": return "Materiales base";
      case "procesos": return "Procesos";
      case "bom": return "BOM General";
      default: return "Mantenimiento";
    }
  }, [section]);

  return (
    <div className={styles.page}>
      <button
        onClick={onBack}
        className={`${styles.backBtn} ${styles.backBtnCompact} ${styles.backBtnAccent}`}
        title="Volver (no guarda cambios)"
      >
        ← Volver
      </button>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>Mantenimiento</div>
          <nav className={styles.nav}>
            <button
              className={`${styles.navItem} ${section === "catalogo" ? styles.navItemActive : ""}`}
              onClick={() => setSection("catalogo")}
            >
              Catálogo de costos
            </button>
            <button
              className={`${styles.navItem} ${section === "tecnologias" ? styles.navItemActive : ""}`}
              onClick={() => setSection("tecnologias")}
            >
              Tecnologías
            </button>
            <button
              className={`${styles.navItem} ${section === "materiales" ? styles.navItemActive : ""}`}
              onClick={() => setSection("materiales")}
            >
              Materiales base
            </button>
            <button
              className={`${styles.navItem} ${section === "procesos" ? styles.navItemActive : ""}`}
              onClick={() => setSection("procesos")}
            >
              Procesos
            </button>
            <button
              className={`${styles.navItem} ${section === "bom" ? styles.navItemActive : ""}`}
              onClick={() => setSection("bom")}
            >
              BOM General
            </button>
          </nav>
        </aside>

        {/* Contenido */}
        <section className={styles.content}>
          <header className={styles.contentHeader}>{title}</header>
          <div className={styles.contentBody}>
            {section === "catalogo" && <CatalogoCostosView />}
            {section === "tecnologias" && <TecnologiasView />}
            {section === "materiales" && <MaterialesBaseView />}
            {section === "procesos" && <ProcesosView />}
            {section === "bom" && <BomGeneralView />}
          </div>
        </section>
      </div>
    </div>
  );
}
