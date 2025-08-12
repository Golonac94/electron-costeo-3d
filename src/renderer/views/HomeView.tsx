import React from "react";
import styles from "./HomeView.module.css";

export default function HomeView({
  onGotoCalculo,
  onGotoMantenimiento,
}: {
  onGotoCalculo: () => void;
  onGotoMantenimiento: () => void;
}) {
  return (
    <div className={styles.grid}>
      <button
        onClick={onGotoCalculo}
        className={`${styles.card} ${styles.cardPrimary}`}
      >
        <span className={styles.title}>Cálculo</span>
        <span className={styles.desc}>Ir a la pantalla de cálculo de costos.</span>
        <span aria-hidden className={styles.chevron}>
          {/* flecha → */}
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </button>

      <button
        onClick={onGotoMantenimiento}
        className={`${styles.card} ${styles.cardSecondary}`}
      >
        <span className={styles.title}>Mantenimiento</span>
        <span className={styles.desc}>Gestión de catálogos (materiales, procesos, etc.).</span>
        <span aria-hidden className={styles.chevron}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path d="M9 18l6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </span>
      </button>
    </div>
  );
}
