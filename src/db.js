import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database opened successfully');
  }
});

export function run(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}

export function all(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
