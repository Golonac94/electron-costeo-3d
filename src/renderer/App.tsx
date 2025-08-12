import React, { useState } from "react";
import HomeView from "./views/HomeView";
import CalculoView from "./views/CalculoView";
import MantenimientoView from "./views/MantenimientoView";

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
