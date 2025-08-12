import * as tecnologiaService from '../services/tecnologiaImpresionService.js';

export async function listar() {
  // Devuelve: Array<{ id: number; nombre: string }>
  return tecnologiaService.obtenerTecnologias();
}
