const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Créer une application Express
const app = express();

// Configuration du middleware CORS
app.use(cors());

// Configuration du middleware pour la gestion des données au format JSON
app.use(express.json());

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: 3306,
  password: 'Yoyo5555badia()',
  database: 'fs7',
});

// Vérifier la connexion à la base de données
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données :', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Définir les routes de l'API

// Exemple de route GET
app.get('/admin/logi', (req, res) => {
  // Code pour la gestion de la connexion admin
  res.json({ message: 'Admin login' });
});

// Exemple de route GET
app.get('/client/logi', (req, res) => {
  // Code pour la gestion de la connexion client
  res.json({ message: 'Client login' });
});

// Démarre le serveur sur le port 3000
app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
