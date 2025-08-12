"use strict";
// src/main/database/db.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = getDb;
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const electron_1 = require("electron");
async function getDb() {
    const dbPath = path_1.default.join(electron_1.app.getPath('userData'), 'costeo3d.db');
    return (0, sqlite_1.open)({
        filename: dbPath,
        driver: sqlite3_1.default.Database,
    });
}
