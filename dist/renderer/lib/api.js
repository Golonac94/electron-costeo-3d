"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getApi = getApi;
function getApi() {
    if (!window.api)
        throw new Error("API no disponible: window.api no está expuesto por preload.");
    return window.api;
}
