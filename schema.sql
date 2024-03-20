-- Load the JSON1 extension
SELECT load_extension('libsqlite3.so'); -- for Unix-like systems
-- OR
SELECT load_extension('sqlite3.dll'); -- for Windows

CREATE TABLE IF NOT EXISTS investment (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	name TEXT NOT NULL,
	amount INTEGER DEFAULT 0,
	created_at DEFAULT CURRENT_TIMESTAMP,
	updated_at DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	entry_time DATE DEFAULT CURRENT_DATE,
	investments JSON
);
