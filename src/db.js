const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, '..', 'db', 'client-health.sqlite');
const db = new sqlite3.Database(DB_PATH);

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, (error) => (error ? reject(error) : resolve({changes: this.changes, lastID: this.lastID })));
    });
}

module.exports = { all, get, run };