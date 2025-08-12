import type { PreloadAPI } from "../types/preload";

export function getApi(): PreloadAPI {
  if (!window.api) throw new Error("API no disponible: window.api no está expuesto por preload.");
  return window.api;
}
