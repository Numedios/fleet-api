import express, { json } from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import employeeRoutes from './routes/employees.js';

import deviceRoutes from './routes/devices.js';

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Création et ouverture de la base de données
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Database opened successfully');
  }
});

// Utilisation de db.serialize pour s'assurer que les requêtes sont exécutées séquentiellement
db.serialize(() => {
  // Créer la table employees si elle n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `, (err) => {
    if (err) {
      console.error('Error creating employees table', err);
    } else {
      console.log('Employees table created or already exists');
    }
  });

  // Créer la table devices si elle n'existe pas
  db.run(`
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_name TEXT NOT NULL,
      type TEXT NOT NULL,
      owner_id INTEGER,
      FOREIGN KEY (owner_id) REFERENCES employees(id)
    );
  `, (err) => {
    if (err) {
      console.error('Error creating devices table', err);
    } else {
      console.log('Devices table created or already exists');
    }
  });
});

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/devices', deviceRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export { db };
