export const money = (n?: number, currency = "PEN") =>
  n == null ? "-" : new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);
