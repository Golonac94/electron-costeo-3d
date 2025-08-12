"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useApi = useApi;
const react_1 = require("react");
const api_1 = require("../lib/api");
function useApi() {
    return (0, react_1.useMemo)(() => (0, api_1.getApi)(), []);
}
