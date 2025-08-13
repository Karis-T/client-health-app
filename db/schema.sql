PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS funding_sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    main_language TEXT NOT NULL,
    secondary_language TEXT,
    funding_source_id INTEGER NOT NULL,
    FOREIGN KEY (funding_source_id) REFERENCES funding_sources(id)
);

INSERT OR IGNORE INTO funding_sources 
    (code) 
VALUES
    ('NDIS'), ('HCP'), ('CHSP'), ('DVA'), ('HACC');

INSERT OR IGNORE INTO clients 
    (client_name, date_of_birth, main_language, secondary_language, funding_source_id)
VALUES
    ('Mildred Simmons', '1949-06-11', 'English', NULL, 1), 
    ('Oswald Baxter-Jones', '1955-02-24', 'English', 'French', 3), 
    ('Chinatsu Kanno', '1950-08-02', 'Japanese', 'English', 1), 
    ('George Gunnarson', '1947-09-11', 'Swedish', 'English', 2), 
    ('Susan Delroy', '1951-10-12', 'English', NULL, 5);