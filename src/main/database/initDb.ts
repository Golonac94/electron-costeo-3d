import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { app } from 'electron';
import fs from 'fs/promises';

// Leer esquema desde archivo SQL (si prefieres tenerlo por separado)
const SCHEMA_PATH = path.join(__dirname, 'esquema.sql');

export async function initDatabase() {
  const dbPath = path.join(app.getPath('userData'), 'costeo3d.db');

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  // Ejecutar esquema solo si la base está vacía
  const result = await db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='unidades';`);
  if (!result) {
    const schema = await fs.readFile(SCHEMA_PATH, 'utf-8');
    await db.exec(schema);
    console.log('✅ Base de datos inicializada.');
  } else { 
    console.log('ℹ️ Base de datos ya existe.');
  }

  return db;
}
