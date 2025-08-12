PRAGMA foreign_keys = ON;

-- ================================
-- Unidades (drivers normalizados)
-- ================================
CREATE TABLE IF NOT EXISTS unidades (
  id TEXT PRIMARY KEY,             -- gr, cm2, kwh, h, flat
  nombre TEXT NOT NULL,
  tipo TEXT NOT NULL               -- masa, superficie, energía, tiempo, flat
);

INSERT OR IGNORE INTO unidades (id, nombre, tipo) VALUES
  ('gr',   'Gramos',              'masa'),
  ('cm2',  'Centímetros cuadrados','superficie'),
  ('kwh',  'Kilowatt hora',       'energía'),
  ('h',    'Horas',               'tiempo'),
  ('flat', 'Costo fijo',          'flat');

-- (Opcional) si existía 'min' y ya no lo usarás:
-- DELETE FROM unidades WHERE id = 'min';

-- ================================
-- Categorías de material / tipo de costo
-- ================================
CREATE TABLE IF NOT EXISTS categorias_material (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE       -- Material, Energía, Suministros, Mantenimiento, Mano de Obra
);

INSERT OR IGNORE INTO categorias_material (nombre) VALUES
  ('Material'),
  ('Energía'),
  ('Suministros'),
  ('Mantenimiento'),
  ('Mano de Obra');

-- ================================
-- Catálogo general (precio del ítem)
-- ================================
CREATE TABLE IF NOT EXISTS catalogo_costos (
  id TEXT PRIMARY KEY,                 -- Ej: ENE_0001, MAN_0001, SUM_LIJA_0001
  nombre TEXT NOT NULL,
  categoria_id INTEGER NOT NULL,
  unidad_id TEXT NOT NULL,             -- unidad descriptiva del ítem (kwh, h, gr, flat)
  costo_unitario REAL NOT NULL,        -- monto global del ítem (se prorratea vía BOM)
  FOREIGN KEY (categoria_id) REFERENCES categorias_material(id),
  FOREIGN KEY (unidad_id) REFERENCES unidades(id)
);

-- Energía (kWh)
INSERT INTO catalogo_costos (id, nombre, categoria_id, unidad_id, costo_unitario)
VALUES (
  'ENE_0001', 'Electricidad (kWh)',
  (SELECT id FROM categorias_material WHERE nombre = 'Energía'),
  'kwh', 0.85
)
ON CONFLICT(id) DO UPDATE SET
  nombre=excluded.nombre, categoria_id=excluded.categoria_id,
  unidad_id=excluded.unidad_id, costo_unitario=excluded.costo_unitario;

-- Mantenimiento (monto global; se prorratea por horas en BOM)
INSERT INTO catalogo_costos (id, nombre, categoria_id, unidad_id, costo_unitario)
VALUES (
  'MAN_0001', 'Mantenimiento general (equipo)',
  (SELECT id FROM categorias_material WHERE nombre = 'Mantenimiento'),
  'h', 1000.00
)
ON CONFLICT(id) DO UPDATE SET
  nombre=excluded.nombre, categoria_id=excluded.categoria_id,
  unidad_id=excluded.unidad_id, costo_unitario=excluded.costo_unitario;

-- Lija (pieza, precio global)
INSERT INTO catalogo_costos (id, nombre, categoria_id, unidad_id, costo_unitario)
VALUES (
  'SUM_LIJA_0001', 'Lija 400 (pieza)',
  (SELECT id FROM categorias_material WHERE nombre = 'Suministros'),
  'flat', 10.00
)
ON CONFLICT(id) DO UPDATE SET
  nombre=excluded.nombre, categoria_id=excluded.categoria_id,
  unidad_id=excluded.unidad_id, costo_unitario=excluded.costo_unitario;

-- ================================
-- Tecnologías
-- ================================
CREATE TABLE IF NOT EXISTS tecnologias_impresion (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

INSERT OR IGNORE INTO tecnologias_impresion (nombre) VALUES ('Resina'), ('PLA');

-- ================================
-- Materiales base (por tecnología)
-- ================================
CREATE TABLE IF NOT EXISTS materiales_base (
  id TEXT PRIMARY KEY,                  -- RES_0001, PLA_0001...
  tecnologia_id INTEGER NOT NULL,
  nombre TEXT NOT NULL,
  costo_kg REAL NOT NULL,               -- costo por kg del material base
  consumo_energia_kwh REAL NOT NULL,    -- kWh por hora en impresión
  FOREIGN KEY (tecnologia_id) REFERENCES tecnologias_impresion(id)
);

INSERT OR IGNORE INTO materiales_base (id, tecnologia_id, nombre, costo_kg, consumo_energia_kwh) VALUES
  ('RES_0001',(SELECT id FROM tecnologias_impresion WHERE nombre='Resina'),'Resina prueba 1',150.00,0.08),
  ('RES_0002',(SELECT id FROM tecnologias_impresion WHERE nombre='Resina'),'Resina prueba 2',170.00,0.08),
  ('PLA_0001',(SELECT id FROM tecnologias_impresion WHERE nombre='PLA'),'PLA prueba 1',50.00,0.12),
  ('PLA_0002',(SELECT id FROM tecnologias_impresion WHERE nombre='PLA'),'PLA prueba 2',55.00,0.12);

-- ================================
-- Procesos
-- ================================
CREATE TABLE IF NOT EXISTS procesos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT NOT NULL UNIQUE
);

INSERT OR IGNORE INTO procesos (nombre) VALUES
  ('Impresión'),
  ('Curado'),
  ('Lijado'),
  ('Pintado');

-- ================================
-- BOM (driver + normalizador por tecnología/proceso)
-- ================================
CREATE TABLE IF NOT EXISTS bom_general (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tecnologia_id INTEGER NOT NULL,
  proceso_id INTEGER NOT NULL,
  costo_id TEXT NOT NULL,
  factor_consumo REAL NOT NULL,           -- multiplicador sobre el driver
  driver_id TEXT NOT NULL DEFAULT 'flat', -- 'h' | 'gr' | 'cm2' | 'kwh' | 'flat'
  normalizador_cantidad REAL,             -- vida útil / base de prorrateo (p.ej. 200 cm2, 2000 h, 1 kWh)
  normalizador_unidad TEXT,               -- informativo: 'cm2' | 'h' | 'kwh' | 'flat'
  FOREIGN KEY (tecnologia_id) REFERENCES tecnologias_impresion(id),
  FOREIGN KEY (proceso_id) REFERENCES procesos(id),
  FOREIGN KEY (costo_id) REFERENCES catalogo_costos(id)
);

-- Evitar duplicados (una línea por tec+proc+item)
CREATE UNIQUE INDEX IF NOT EXISTS idx_bom_unique
ON bom_general (tecnologia_id, proceso_id, costo_id);

-- ================================
-- Seeds de BOM
-- ================================


-- Lijado: misma lija con vida útil distinta por tecnología
-- Resina: 200 cm2 por pieza de lija
INSERT OR IGNORE INTO bom_general (tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad)
VALUES (
  (SELECT id FROM tecnologias_impresion WHERE nombre='Resina'),
  (SELECT id FROM procesos WHERE nombre='Lijado'),
  'SUM_LIJA_0001', 1.0, 'cm2', 200, 'cm2'
);

-- PLA: 100 cm2 por pieza de lija
INSERT OR IGNORE INTO bom_general (tecnologia_id, proceso_id, costo_id, factor_consumo, driver_id, normalizador_cantidad, normalizador_unidad)
VALUES (
  (SELECT id FROM tecnologias_impresion WHERE nombre='PLA'),
  (SELECT id FROM procesos WHERE nombre='Lijado'),
  'SUM_LIJA_0001', 1.0, 'cm2', 100, 'cm2'
);
