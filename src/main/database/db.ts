// src/main/database/db.ts

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { app } from 'electron';

export async function getDb(): Promise<Database> {
  const dbPath = path.join(app.getPath('userData'), 'costeo3d.db');
  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}
