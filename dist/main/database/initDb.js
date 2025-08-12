"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = initDatabase;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
const promises_1 = __importDefault(require("fs/promises"));
// Leer esquema desde archivo SQL (si prefieres tenerlo por separado)
const SCHEMA_PATH = path_1.default.join(__dirname, 'esquema.sql');
async function initDatabase() {
    const dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'costeo3d.db');
    const db = await (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
    // Ejecutar esquema solo si la base está vacía
    const result = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='unidades';`);
    if (!result) {
        const schema = await promises_1.default.readFile(SCHEMA_PATH, 'utf-8');
        await db.exec(schema);
        console.log('✅ Base de datos inicializada.');
    }
    else {
        console.log('ℹ️ Base de datos ya existe.');
    }
    return db;
}
