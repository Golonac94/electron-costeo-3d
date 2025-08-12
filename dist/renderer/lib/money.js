"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.money = void 0;
const money = (n, currency = "PEN") => n == null ? "-" : new Intl.NumberFormat("es-PE", { style: "currency", currency }).format(n);
exports.money = money;
