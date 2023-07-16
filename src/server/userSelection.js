const express = require('express');
const app = express();
const path = require('path');

// Définir le dossier de fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint pour la page de connexion admin
app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// Endpoint pour la page de connexion client
app.get('/client/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'client-login.html'));
});

// Démarrer le serveur
const port = 3000;
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});